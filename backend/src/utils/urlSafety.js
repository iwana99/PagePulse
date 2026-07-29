import dns from "node:dns/promises";
import ipaddr from "ipaddr.js";

const blockedHostnames = new Set([
  "localhost",
  "localhost.localdomain",
]);

function isPublicIp(address) {
  let parsed;

  try {
    parsed = ipaddr.parse(address);
  } catch {
    return false;
  }

  // Adresa poput ::ffff:127.0.0.1 predstavlja IPv4 unutar IPv6 zapisa.
  // Pretvaramo je u IPv4, pa zatim proveravamo pravi opseg.
  if (
    parsed.kind() === "ipv6" &&
    parsed.isIPv4MappedAddress()
  ) {
    parsed = parsed.toIPv4Address();
  }

  /*
    Dozvoljavamo samo normalne javno rutabilne adrese.

    Blokiraju se, između ostalog:
    - private
    - loopback
    - linkLocal
    - uniqueLocal
    - multicast
    - reserved
    - unspecified
  */
  return parsed.range() === "unicast";
}

export async function assertSafePublicUrl(rawUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error("URL nije validan.");
  }

  // Dozvoljeni su samo sajtovi preko HTTP-a ili HTTPS-a.
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(
      "Dozvoljeni su samo http i https URL-ovi."
    );
  }

  // Blokira URL poput:
  // https://username:password@example.com
  if (parsedUrl.username || parsedUrl.password) {
    throw new Error(
      "Korisničko ime i lozinka nisu dozvoljeni unutar URL-a."
    );
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Direktna blokada lokalnih imena.
  if (
    blockedHostnames.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Lokalne adrese nisu dozvoljene.");
  }

  //  dozvoli samo standardne web portove.
  if (
    parsedUrl.port &&
    !["80", "443"].includes(parsedUrl.port)
  ) {
    throw new Error(
      "Dozvoljeni su samo portovi 80 i 443."
    );
  }

  /*
    Ako je korisnik direktno uneo IP:
    http://127.0.0.1
    http://192.168.1.20
  */
  if (ipaddr.isValid(hostname)) {
    if (!isPublicIp(hostname)) {
      throw new Error(
        "Privatne, lokalne i rezervisane IP adrese nisu dozvoljene."
      );
    }

    return parsedUrl;
  }

  /*
    Ako je unet domen:
    https://example.com

    DNS pretvara domen u jednu ili više IP adresa.
  */
  let addresses;

  try {
    addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });
  } catch {
    throw new Error(
      "Nije moguće pronaći IP adresu za dati domen."
    );
  }

  if (!addresses.length) {
    throw new Error(
      "Domen nije vratio nijednu IP adresu."
    );
  }

  /*
    Dovoljna je jedna privatna adresa među rezultatima
    da odbijemo URL.
  */
  const hasUnsafeAddress = addresses.some(
    ({ address }) => !isPublicIp(address)
  );

  if (hasUnsafeAddress) {
    throw new Error(
      "Domen vodi ka privatnoj, lokalnoj ili rezervisanoj mrežnoj adresi."
    );
  }

  return parsedUrl;
}
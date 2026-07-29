import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMonitorStore } from "../hooks/monitorHook";

const MonitorPage = () => {
  const { id } = useParams();

  const {
    snapShots,
    getAllSnapShots,
    loading,
    error,
  } = useMonitorStore();

  useEffect(() => {
    getAllSnapShots(id);
  }, [id, getAllSnapShots]);

  if (loading) {
    return <p>Učitavanje snapshot-a...</p>;
  }

  if (error) {
    return <p>Greška: {error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Snapshot istorija
      </h1>

      {snapShots.length === 0 ? (
        <p>Nema snapshot-a.</p>
      ) : (
        snapShots.map((snapshot) => (
          <div
            key={snapshot._id}
            className="mt-4 rounded-lg border p-4"
          >
            <p>
              Promena: {snapshot.percentChange}%
            </p>

            <p>
              Dodate reči: {snapshot.addedWords}
            </p>

            <p>
              Uklonjene reči:{" "}
              {snapshot.removedWords}
            </p>

            <p>
              Provereno:{" "}
              {new Date(
                snapshot.checkedAt
              ).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MonitorPage;
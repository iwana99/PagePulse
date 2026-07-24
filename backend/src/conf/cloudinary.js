import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

export const cloudinaryConnect=()=>{
const cloudinary_name=process.env.CLOUDINARY_NAME
const cloudinary_key= process.env.CLOUDINARY_KEY
const cloudinary_secret=process.env.CLOUDINARY_SECRET

if (!cloudinary_name|| !cloudinary_key|| !cloudinary_secret) {
  throw new Error("Cloudinary env variables are missing");
}

    cloudinary.config({ 
  cloud_name: cloudinary_name, 
  api_key:cloudinary_key, 
  api_secret:cloudinary_secret
});

console.log("Cloudinary connected 😎");
}
export {cloudinary}  //omogucava da se koristi u drugim fajlovima njegove metode
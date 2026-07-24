import {cloudinary} from '../conf/cloudinary.js'
import dotenv from 'dotenv'

dotenv.config()
export const CreateSignature =(req,res,next)=>{

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder= `pagePulse/${req.userId}/baseLine`
    const signature = cloudinary.utils.api_sign_request({ timestamp,folder,overwrite:false },
        process.env.CLOUDINARY_SECRET);
    res.status(200).json({
        signature,
        timestamp,folder,
        cloudName:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY})
}
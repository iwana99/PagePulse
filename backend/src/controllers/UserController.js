import User from '../models/User.js'

export const createUser=async(req,res,next)=>{
    try {
        
        const userId=req.userId;
        const email=req.body.email

        if(!userId || !email){return res.status(401).json({message:"User missing"})}
       const user= await User.findOneAndUpdate({
        clerkId:userId}, //koga trazim 
          {  $set:{  //sta menjam 
                 fullName:req.body.name,
        email:email
            }
        
       
    },{
        upsert:true,
        new:true,
        runValidators:true  //proveravaju se sva pravila iz scheme
    })

       res.status(201).json(user)
    } catch (error) {
        return next(error)
    }
}
import Monitor from "../models/Monitor.js"
export const CreateMonitor = async (req, res, next) => {
  try {
    const {
      title,
      url,
      intervalMinutes = 15,  //proveravaj monitor svakih 15 minuta
    } = req.body;

  const ownerId = req.userId;
    const monitor = await Monitor.create({
      title,
      url,
      intervalMinutes,
      ownerId,
      status: "new",
      nextRunAt:new Date(), //prvu proveru uradi odmah
      active:true
    });

    return res.status(201).json(monitor);
  } catch (error) {
    return next(error);
  }
};

export const UpdateMonitor=async(req,res,next)=>{
    try{

        

        const monitor= await Monitor.findByIdAndUpdate(
           { _id:req.body.id},
            {title:req.body.title}
        
        
        )
        if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found.",
      });
    }

        res.status(200).json(monitor)

    }
    catch(error){
        return next(error)
    }
}

export const DeleteMonitor=async(req,res,next)=>{
     try{
        const monitor= await Monitor.findByIdAndDelete({
        _id:req.body.id,
       
        })
         res.status(200).json({message:"delete success"})
     }
    
    catch(error){
        return next(error)
    }
}

export const GetAllMonitors=async(req,res,next)=>{
    try{
        const monitors= await Monitor.find()
        if(!monitors){return res.status(404).json({message:"No monitors found"})}
        res.status(200).json(monitors)
    }
    catch(error){
        return next(error)
    }
}
export const GetOneMonitor=async(req,res,next)=>{
  try {
    const monitorId=req.params.id
    if(!monitorId){return res.status(404).json({message:"No monitor found"})
    }
  const monitor=await Monitor.findOne({_id:monitorId})
  if(!monitor){return res.status(404).json({message:"No monitor found"})}
  res.status(200).json(monitor)
  } catch (error) {
    return next(error)
  }
}
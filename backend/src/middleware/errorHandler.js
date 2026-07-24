export const notFound=(re,res)=>{
    return res.status(404).json({message:"Page not Found"})
}

export const errorHandler=(error,req,res,next)=>{
    const statusCode=error.statusCode ||500;
    return res.status(statusCode).json({message:error.message||"invalid server error"})
}
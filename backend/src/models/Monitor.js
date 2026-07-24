import mongoose from 'mongoose'

 const notificationSchema= new mongoose.Schema(
    {emailEnabled:{
        type:Boolean,
        default:false
    },email:{type:String,lowercase:true},},
    {_id:false}
 )

 const baseLineSchema= new mongoose.Schema({
    url:String,
    publicId:String

 },{_id:false})
const monitorSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   
    url:{
        type:String,
        required:true
    },
    notifications:{
        type:notificationSchema,
        default:{}
    },
    baseline:{
        type:baseLineSchema,
        
    },
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false},
     intervalMinutes: {
      type: Number,
      required: true,
      default: 15,
      min: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["new", "queued", "checking", "ok", "error", "paused"],
      default: "new",
    },

    nextRunAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
},{timestamps:true})

 const Monitor= mongoose.models.Monitor || mongoose.model("Monitor",monitorSchema);

 export default Monitor
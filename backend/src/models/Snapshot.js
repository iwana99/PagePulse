import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },

    finalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    textContent: {
      type: String,
      default: "",
    },
    addedWords:{
     type:Number,
      default:0,
      min:"0"
    },
    removedWords:{
      type:Number,
      default:0,
      min:"0"
    },
    stableWords:{
      type:Number,
      default:0,
      min:"0"
    },
    percentChange:{
      type:Number,
      default:0,
      min:0,
      max:100

    },

    
  },
  {
    timestamps: true,
  }
);

const Snapshot =
  mongoose.models.Snapshot ||
  mongoose.model("Snapshot", snapshotSchema);

export default Snapshot;
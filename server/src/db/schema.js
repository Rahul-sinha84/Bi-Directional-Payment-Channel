import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema(
  {
    contractAddress: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    acc1bal: {
      type: String,
      required: true,
    },
    acc2bal: {
      type: String,
      required: true,
    },
    acc1signature: {
      type: String,
      default: "",
    },
    acc2signature: {
      type: String,
      default: "",
    },
    declined: {
      type: Boolean,
      default: false,
    },
    contractSuccess: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("signatures", signatureSchema);

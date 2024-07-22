import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const uploadSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  compressedName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,  // Cloudinary URL
    required: true,
  }
},{timestamps: true});

uploadSchema.plugin(mongooseAggregatePaginate);
 
export const Upload = mongoose.model('Upload', uploadSchema);
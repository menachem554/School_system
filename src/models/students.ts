/* eslint-disable prettier/prettier */

import mongoose  from "mongoose";

const tacherSchema = new mongoose.Schema(
  {
    sName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [12,`Must be at least 12, got {age}`],
      max: [20,`Must be less then 20, got {age}`],
    },
    professionType: {
    type: String,
    enum: {
      values: ['Math','History','English','geography','Physics'],
      message: '{VALUE} is not supported' 
    },
    },
    idNum: {
        type: Number,
        require: true,
        unique: true
      }
  },
  { versionKey: false }
);

export default mongoose.model('studens', tacherSchema);
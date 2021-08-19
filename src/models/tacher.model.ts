/* eslint-disable prettier/prettier */
import mongoose  from "mongoose";
// eslint-disable-next-line import/no-unresolved
import {ProfessionEnum} from '../interface/tacher.interface';

const tacherSchema = new mongoose.Schema(
  {
    tName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [25,`Must be at least 25, got {age}`],
      max: [60,`Must be less then 60, got {age}`],
    },
    professionType: {
    type: ProfessionEnum
   
    },
    idNum: {
        type: Number,
        require: true,
        unique: true
      }
  },
  { versionKey: false }
);

export default mongoose.model('tachers', tacherSchema);

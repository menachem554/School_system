import mongoose from 'mongoose';
import { ProfessionEnum } from '../interface/tacher.interface';

const TacherSchema = new mongoose.Schema(
  {
    tName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: [25, `Must be at least 25, got {age}`],
      max: [60, `Must be less then 60, got {age}`],
    },
    professionType: {
      type: String,
      enum: ProfessionEnum,
    },
    studentList: [
      {
        type: Number,
        ref: 'students',
      },
    ],
    tacherID: {
      type: Number,
      require: true,
      unique: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model('tachers', TacherSchema);

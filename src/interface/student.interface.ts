/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  name: String; 
  age: number; 
  averageGrade: number;
  tacherID: number;  
  studentNum: number; 
}



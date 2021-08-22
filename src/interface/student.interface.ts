/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  sName: String; 
  age: number; 
  tacherID: number; 
  averageGrade: number;
  studentID: number; 
}



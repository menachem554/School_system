import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  sName: String; 
  age: number;  
  averageGrade: number;
  studentID: number; 
}
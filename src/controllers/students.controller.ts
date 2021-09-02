import { Request, Response } from 'express';
import { IStudent } from '../interfaces/student.interface';
import * as studentManager from '../managers/student.manager';
import * as tacherManager from '../managers/tacher.manager';

// Add Student
export const postStudent = async (req: Request, res: Response) => {
  try {
    const student = {
      // get all body Parameters
      sName: req.body.sName,
      age: req.body.age,
      averageGrade: req.body.averageGrade,
      studentID: req.body.studentID,
    };

    // Save the new student
    const newTacher = await studentManager.postStudent(student);
    res.status(201).send(newTacher);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Print one students by ID
export const getStudent = async (req: Request, res: Response) => {
  try {
    const studentID: number = parseInt(req.query.studentID as string, 10);
    const student: IStudent = await studentManager.getStudent(studentID);

    res.send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Edit student
export const editStudent = async (req: Request, res: Response) => {
  try {
    const studentID: number = parseInt(req.query.studentID as string, 10);
    const student = {
      sName: req.body.sName,
      age: req.body.age,
      averageGrade: req.body.averageGrade,
      studentID,
    };

    const printEdit = await studentManager.editStudent(
      student.studentID,
      student
    );

    res.status(201).json(printEdit);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete student
export const delStudent = async (req: Request, res: Response) => {
  const sID: number = parseInt(req.query.studentID as string, 10);

  try {
    tacherManager.delStudentFromTacher(sID);
    const student: IStudent = await studentManager.delStudent(sID);
    res.status(200).send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get student profession (no Query Params here)
export const getStudentProfession = async (req: Request, res: Response) => {
  try {
    const studentID: number = parseInt(req.params.studentID as string, 10);
    const student: IStudent[] = await studentManager.getStudentProfession(
      studentID
    );

    res.send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tacherles students
export const getTacherlesStudent = async (_req: Request, res: Response) => {
  try {
    const tacherls: String[] = await studentManager.getTacherlesStudent();

    res.status(200).send(tacherls);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

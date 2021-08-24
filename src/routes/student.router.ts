/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */

import express from 'express';
import * as studentController from '../controller/students.controller';

const router = express.Router();

router.post('/newstudent', studentController.postStudent);
router.get('/SID', studentController.getStudent);
router.put('/editStudent', studentController.editStudent);
router.delete('/del', studentController.delStudent);
router.get('/profession/:studentID', studentController.getStudentProfession);
router.get('/tacherles', studentController.getTacherlesStudent);

export default router;

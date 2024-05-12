import express from "express";
import { createStudent } from "../controllers/students.create";
import { getStudents } from "../controllers/students.get";
import { removeStudent } from "../controllers/students.remove";

const router = express.Router();

// Ruta de estudiantes
router.post('/create', createStudent);
router.post('/remove', removeStudent);
router.get('/', getStudents);
console.log('Students Route');

module.exports = router;
import express from "express";
import { createRecord } from "../controllers/records.create";
import { getLogs } from "../controllers/records.get";

const router = express.Router();

// Ruta de registro
router.get('/', getLogs);
router.post('/', createRecord);
console.log('Register Route');

module.exports = router;
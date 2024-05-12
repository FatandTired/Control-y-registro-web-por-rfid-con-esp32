import * as mongoose from 'mongoose';
// Definir el modelo de estudiante
export interface Student {
    uuid: string,
	code: string,
    name: string,
}
const Schema = new mongoose.Schema({
    uuid: String,
    code: String,
    name: String,
})
export const Model = mongoose.model<Student>("Students", Schema)
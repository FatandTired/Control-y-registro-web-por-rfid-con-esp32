import * as mongoose from 'mongoose';
// Definir el modelo de registro
export interface Logs {
	code: string,
    name: string,
    action: string,
    date: string
}
const Schema = new mongoose.Schema({
    code: String,
    name: String,
    action: String,
    date: String
})
export const Model = mongoose.model<Logs>("Logs", Schema)
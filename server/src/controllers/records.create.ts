import { Model as Students } from "../schemas/Students";
import { Model } from "../schemas/Logs";
import { socket } from "../index";
export async function createRecord(req: any, res: any) {
  try {
    const { uuid } = req.body;
    const codeName = await Students.findOne({ uuid }).exec();
    if (codeName) { // Verificar si el estudiante es valido
      // Encontrar la ultima accion del estudiante
      const model = await Model.findOne({ code: codeName.code })
        .sort({ _id: -1 })
        .exec();
      // Crear un nuevo registro
      const result = await Model.create({
        code: codeName.code,
        name: codeName.name,
        action: model ? (model.action == "entry" ? "left" : "entry") : "entry",
        date: new Date().toLocaleString(),
      });
      if (result) {
        socket.emit("Record_Added");
        res.status(200).json({ message: "Log saved" });
      } else {
        throw new Error("Error saving log");
      }
    } else {
      res.status(500).json({ error: "Student Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
}

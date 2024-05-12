import { Model } from "../schemas/Students";
export async function createStudent(req: any, res: any) {
  try {
    const { uuid, code, name } = req.body;
    // Crear un nuevo estudiante
    const result = await Model.create({
      uuid,
      code,
      name,
    });
    if (result) {
      res.status(200).json({ message: "Student Saved" });
    } else {
      throw new Error("Error saving student");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
}

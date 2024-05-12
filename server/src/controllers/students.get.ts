import { Model } from "../schemas/Students";
export async function getStudents(req: any, res: any) {
  try {
    const result = await Model.find();
    // Devolver la lista de estudiantes
    res.status(200).json({
      message: "Students retrieved",
      students: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

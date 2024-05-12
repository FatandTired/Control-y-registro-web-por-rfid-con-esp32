import { Model } from "../schemas/Students";
export async function removeStudent(req: any, res: any) {
  try {
    const { code } = req.body;
    // Eliminar el estudiante segun el codigo
    await Model.findOneAndDelete({ code });
    res.status(200).json({
      message: "Student removed",
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

import { Model } from "../schemas/Logs";
export async function getLogs(req: any, res: any) {
  try {
    const result = (await Model.find()).reverse();
    // Devolver la lista de registro
    res.status(200).json({
      message: "Logs retrieved",
      logs: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

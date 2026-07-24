import { Router, Request, Response } from "express";
import { getRecommendations } from "../services/recommendationEngine";

const router = Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const n = req.query.n ? Number(req.query.n) : 5;

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    if (Number.isNaN(n) || n <= 0) {
      return res.status(400).json({
        error: "Invalid value for 'n'",
      });
    }

    const courses = await getRecommendations(userId, n);

    return res.json(courses);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { getRecommendations } from "../services/recommendationEngine.js";

const router = Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const courses = await getRecommendations(userId);

    return res.json(courses);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;

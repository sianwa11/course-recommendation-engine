import { Router, Request, Response } from "express";
import { getAllUsers } from "../models/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    return res.json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;

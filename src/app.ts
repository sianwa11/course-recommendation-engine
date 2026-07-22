import express from "express";
import recommendationRoutes from "./routes/recommendations";

const app = express();

app.use(express.json());

app.use("/recommendations", recommendationRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

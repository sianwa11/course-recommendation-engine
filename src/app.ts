import express from "express";
import recommendationRoutes from "./routes/recommendations";
import userRoutes from "./routes/users";

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/recommendations", recommendationRoutes);
app.use("/users", userRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

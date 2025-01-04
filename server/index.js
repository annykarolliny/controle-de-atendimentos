import express from "express";
import userRoutes from "./routes/router.js"
import cors from "cors";

const app = express();

app.use(cors("*"));
app.use(express.json());

app.use("/", userRoutes);

app.listen(8800, () => {console.log("Rodando")});
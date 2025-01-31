import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middlewares/handleError";

import authRoutes from "../src/routes/authRoutes";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/auth", authRoutes);

app.use(errorHandler); // Global error handler

app.listen(PORT, () => {
  console.log(`Server running on http::/localhost:${PORT}`);
});

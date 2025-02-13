import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import errorMiddlware from "./middlewares/errorMiddleware";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use(errorMiddlware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

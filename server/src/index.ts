import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Custom Middlewares
import errorHandler from "./middlewares/handleError";

// Routes
import authRoutes from "../src/routes/authRoutes";
import userRoutes from "../src/routes/userRoutes";
import postRoutes from "../src/routes/postRoutes";
import commentRoutes from "../src/routes/commentRoutes";
import replyRoutes from "../src/routes/replyRoutes";
import messageRoutes from "../src/routes/messageRoutes";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true, // Allows cookies to be sent
  })
); // Allow cors origin requests
app.use(cookieParser()); // Parses cookies
app.use(express.json()); // Parses JSON
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(morgan("dev")); // Logs HTTP requests
app.use(helmet()); // Adds security headers

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/message", messageRoutes);

app.use(errorHandler); // Global error handler

app.listen(PORT, () => {
  console.log(`Server running on http::/localhost:${PORT}`);
});

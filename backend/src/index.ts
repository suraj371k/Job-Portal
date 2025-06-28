import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/connectDb";
import passport from "./config/passportGoogle";
import session from "express-session";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import employerRoutes from "./routes/employer.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";

const app = express();
const port = process.env.PORT || 4000;



// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/employer", employerRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

connectDb();


app.listen(port, () => {
  console.log(` Server listening on port ${port}`);
});

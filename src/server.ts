import express, { Request, Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { initDB } from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
const app = express();
app.use(express.json());

initDB();

// http://localhost:5000/users   =>  http://localhost:5000/api/v1/users
// http://localhost:5000/auth   =>  http://localhost:5000/api/v1/auth/login
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route",
    path: req.path,
  });
});

app.listen(5000, () => {
  console.log("Server is running on post 5000");
});

import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(bodyParser.json());

//  Routes
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import signatureRoute from "./routes/signature.route.js";
import "./db/db.config.js";

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

signatureRoute(app);

app.listen(port, () => console.log(`Server started on port: ${port}`));

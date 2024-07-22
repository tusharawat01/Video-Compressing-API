import express from "express";
import cors from "cors";

const app = express();

app.use(cors());


app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.get("/",(req,res) => {
    res.json({message: "You are in home page"})
})

import uploadRouter from "./routes/upload.route.js"

app.use("/api/v1/files", uploadRouter);


export {app};
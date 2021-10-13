import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube-2021");

const db=mongoose.connection;


const handleOpen =() => console.log("✅ Connected to DB");
const handleError = (error)=>console.log("Error Message:",error);

db.on("error", handleError);
db.once("open", handleOpen);


import mongoose from "mongoose";

mongoose.connect(process.env.API_KEY);

const db=mongoose.connection;


const handleOpen =() => console.log("✅ Connected to DB");
const handleError = (error)=>console.log("Error Message:",error);

db.on("error", handleError);
db.once("open", handleOpen);


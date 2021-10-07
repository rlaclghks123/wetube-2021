import express from "express";



const PORT = 4000;
const app = express();

const hadleListen = () =>console.log(`Listing on https://localhost:${PORT}`);

const handleGet = (req, res) => {
res.send("Hi from server");
}

app.get("/", handleGet)
app.listen(PORT, hadleListen)
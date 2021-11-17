import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";


const PORT = 7010;


const handleListen = () => console.log(`✅ Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);
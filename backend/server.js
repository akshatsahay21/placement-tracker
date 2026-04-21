
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {});
});

app.set("io", io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/drives", require("./routes/drive.routes"));
app.use("/api/applications", require("./routes/application.routes"));
app.use("/api/match", require("./routes/match.routes"));

app.get("/", (req, res) => res.send("Placement Tracker API running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
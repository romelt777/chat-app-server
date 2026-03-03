//imports 
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

//middleware 
app.use(express.json());
app.use(cors());

//socketIO
//open connection
//object to hold clients
const clients: unknown = {};

//socket is object of IO client
io.on("connection", (socket) => {
    console.log("Connected");
    console.log(socket.id, " has joined");
    socket.on("signin", (id) => {
        console.log(id);
        clients[id] = socket;
    })

    //"message" is the event name
    socket.on("message", (msg) => {
        console.log(msg);
        //finding message destination
        const targetId = msg.targetId;
        if (clients[targetId]) {
            clients[targetId].emit("message", msg);
        }
    });
});

//initialize server, 0000 will launch on server on current IP address, (ipconfig)
server.listen(port, "0.0.0.0", () => {
    console.log("server started...");
})
//imports 
import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import router from "./route.js";

const app = express();
const port = Number(process.env.PORT) || 5000; // port must always be number for server.listen
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*" //allow all origins
    }
});

//middleware 
app.use(express.json());
app.use(cors());
app.use("/route", router);
app.use("/uploads", express.static("uploads"));

//object to hold clients
//key: string, value: Socket instance , for each specific client
const clients: Record<string, Socket> = {};

//when new client connects:
io.on("connection", (socket: Socket) => {
    console.log("Connected");
    console.log(socket.id, " has joined");

    //client registers with an ID
    socket.on("signin", (id: string) => {
        console.log(id);
        clients[id] = socket;
    })

    //"message" is the event name
    socket.on("message", (msg: { targetId: string;[key: string]: unknown }) => {
        console.log(msg);
        //finding message destination
        const targetId = msg.targetId;
        if (clients[targetId]) {
            clients[targetId].emit("message", msg);
        }
    });
});

//0000 binds to all local interfaces, server is reachable on current IP address, (ipconfig)
server.listen(port, "0.0.0.0", () => {
    console.log("server started...");
})
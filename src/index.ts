//imports 
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
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
var clients: unknown = {};

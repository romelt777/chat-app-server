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
})
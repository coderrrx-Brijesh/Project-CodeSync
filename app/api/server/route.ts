import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const PORT = 3001;

const server = http.createServer(app);

const io = new Server(server)

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

io.on("connection", (socket)=>{
  console.log(`User Connected: ${socket.id}`);

  socket.on("join-room", ({roomId,userId})=>{
    socket.join(roomId);
    console.log(`${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected",userId);
  })

  socket.on("chat-message", ({roomId,userId,message,timestamp})=>{
    io.in(roomId).emit("new-message", {chat:{userId:userId,message:message,timestamp:timestamp}});
  })

  socket.on("code-changed[FRONTEND]", ({code,roomId})=>{
    socket.to(roomId).emit("code-changed[SERVER]", {code:code});
  })
})

server.listen(PORT,'192.168.67.2', () => {
  console.log(`Server is running on port ${PORT}`);
});
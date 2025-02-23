const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

let boardState = []; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.emit('boardState', boardState);

    socket.on('draw', (data) => {
        boardState.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clearBoard', () => {
        boardState = [];
        io.emit('clearBoard');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

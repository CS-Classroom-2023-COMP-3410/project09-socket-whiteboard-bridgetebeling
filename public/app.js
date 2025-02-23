const socket = io();

// Select elements
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 100;
ctx.lineCap = 'round';
ctx.lineWidth = 5;
let drawing = false;
let color = "#000000";

// Function to draw on the canvas
const draw = (x, y, color, isRemote = false) => {
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (!isRemote) {
        socket.emit('draw', { x, y, color });
    }
};

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    draw(e.clientX, e.clientY, color);
});

// Continue drawing while moving the mouse
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    draw(e.clientX, e.clientY, color);
});

// Stop drawing when mouse is released
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath(); // Reset the path
});

// Receive draw events from the server
socket.on('draw', ({ x, y, color }) => {
    draw(x, y, color, true);
});

// Clear board when button is clicked
clearBtn.addEventListener('click', () => socket.emit('clearBoard'));

// Listen for clear event from server
socket.on('clearBoard', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Change color selection
colorPicker.addEventListener('input', (e) => color = e.target.value);

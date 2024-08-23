const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gridSize = 80;
const dialogueBox = document.getElementById('dialogueBox');
const dialogueText = document.getElementById('dialogueText');

const player = {
    x: 0,
    y: 0,
    width: gridSize,
    height: gridSize,
    color: 'blue',
    speed: gridSize,
    image: new Image()  // Placeholder for sprite image
};
player.image.src = 'stickerL.png';  // Replace with your player sprite

const characters = [
    { x: 3 * gridSize, y: 3 * gridSize, width: gridSize, height: gridSize, color: 'a', message: 'Hello!', image: new Image() },
    { x: 5 * gridSize, y: 5 * gridSize, width: gridSize, height: gridSize, color: 'red', message: 'Hi there!', image: new Image() }
];
characters[0].image.src = 'stickerL.png';  // Replace with your sprite image
characters[1].image.src = 'stickerL.png';  // Replace with your sprite image

function drawSprite(sprite) {
    ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
}

function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSprite(player);
    characters.forEach(drawSprite);
}

function movePlayer(dx, dy) {
    player.x += dx;
    player.y += dy;

    // Prevent movement outside the canvas
    player.x = Math.max(0, Math.min(canvasWidth - player.width, player.x));
    player.y = Math.max(0, Math.min(canvasHeight - player.height, player.y));
}

function checkCollisions() {
    for (const char of characters) {
        if (
            player.x < char.x + char.width &&
            player.x + player.width > char.x &&
            player.y < char.y + char.height &&
            player.y + player.height > char.y
        ) {
            dialogueText.textContent = char.message;
            dialogueBox.style.display = 'block';
            return;
        }
    }
}

function closeDialogue() {
    dialogueBox.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -player.speed);
            break;
        case 'ArrowDown':
            movePlayer(0, player.speed);
            break;
        case 'ArrowLeft':
            movePlayer(-player.speed, 0);
            break;
        case 'ArrowRight':
            movePlayer(player.speed, 0);
            break;
        case 'z':
            if (dialogueBox.style.display === 'block') {
                closeDialogue();
            } else {
                checkCollisions();
            }
            break;
    }
    drawGame();
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    drawGame();
});

drawGame();

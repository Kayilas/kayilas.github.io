const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 30;
const paddleSpeed = 5;
const ballSpeed = 4;
const aiSpeed = 3;

// Load sprite images
const ballSprite = new Image();
ballSprite.src = 'stickerL.png'; // Replace with the path to your ball sprite image
const paddleSprite = new Image();
paddleSprite.src = 'line.jpg'; // Replace with the path to your paddle sprite image

const keys = {};

// Paddle class
class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.sprite = paddleSprite;
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }

    move(up) {
        if (up) {
            this.y -= paddleSpeed;
            if (this.y < 0) this.y = 0;
        } else {
            this.y += paddleSpeed;
            if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
        }
    }
}

// Ball class
class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = ballSize;
        this.speedX = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
        this.speedY = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.speedX < 0 ? -1 : 1, 1);
        ctx.drawImage(ballSprite, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wall collision
        if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > canvas.height) {
            this.speedY = -this.speedY;
        }

        // Paddle collision
        if (this.x - this.size / 2 < leftPaddle.x + leftPaddle.width &&
            this.x + this.size / 2 > leftPaddle.x &&
            this.y > leftPaddle.y &&
            this.y < leftPaddle.y + leftPaddle.height) {
            this.speedX = -this.speedX;
            this.x = leftPaddle.x + leftPaddle.width + this.size / 2; // Move ball to avoid sticking
        }

        if (this.x - this.size / 2 < rightPaddle.x + rightPaddle.width &&
            this.x + this.size / 2 > rightPaddle.x &&
            this.y > rightPaddle.y &&
            this.y < rightPaddle.y + rightPaddle.height) {
            this.speedX = -this.speedX;
            this.x = rightPaddle.x - this.size / 2; // Move ball to avoid sticking
        }

        // Scoring
        if (this.x - this.size / 2 < 0) {
            rightScore++;
            this.reset();
        } else if (this.x + this.size / 2 > canvas.width) {
            leftScore++;
            this.reset();
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
        this.speedY = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
    }
}

const leftPaddle = new Paddle(0, canvas.height / 2 - paddleHeight / 2);
const rightPaddle = new Paddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2);
const ball = new Ball();

let leftScore = 0;
let rightScore = 0;

// Key event listeners
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Simple AI for the left paddle
function aiControl() {
    const paddleCenter = leftPaddle.y + leftPaddle.height / 2;
    const ballCenter = ball.y;

    if (ball.speedX < 0) { // Only control AI when ball is moving towards the left paddle
        if (ballCenter < paddleCenter - aiSpeed) {
            leftPaddle.y -= aiSpeed;
        } else if (ballCenter > paddleCenter + aiSpeed) {
            leftPaddle.y += aiSpeed;
        }

        if (leftPaddle.y < 0) leftPaddle.y = 0;
        if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    leftPaddle.draw();
    rightPaddle.draw();

    // Move paddles
    if (keys['KeyW']) rightPaddle.move(true); // Right paddle controlled by keys
    if (keys['KeyS']) rightPaddle.move(false);

    // Update and draw ball
    ball.update();
    ball.draw();

    // Control AI
    aiControl();

    // Draw scores
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${leftScore}`, canvas.width / 4, 30);
    ctx.fillText(`Score: ${rightScore}`, canvas.width * 3 / 4, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();

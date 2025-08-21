const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballRadius = 10;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 5;
let mouseY = leftPaddleY + paddleHeight / 2;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

function drawPaddle(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Move left paddle with mouse
    // Smoothly interpolate for a better feel
    leftPaddleY += ((mouseY - paddleHeight / 2) - leftPaddleY) * 0.2;

    // Move right paddle (simple AI)
    let target = ball.y - paddleHeight / 2;
    if (rightPaddleY + paddleHeight / 2 < ball.y - 10) {
        rightPaddleY += paddleSpeed;
    } else if (rightPaddleY + paddleHeight / 2 > ball.y + 10) {
        rightPaddleY -= paddleSpeed;
    }
    // Clamp right paddle
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top and bottom
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Ball collision with left paddle
    if (
        ball.x - ballRadius < paddleWidth &&
        ball.y > leftPaddleY &&
        ball.y < leftPaddleY + paddleHeight
    ) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        // Add angle based on where it hit the paddle
        let hitPos = (ball.y - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += hitPos * 2;
    }

    // Ball collision with right paddle (AI)
    if (
        ball.x + ballRadius > canvas.width - paddleWidth &&
        ball.y > rightPaddleY &&
        ball.y < rightPaddleY + paddleHeight
    ) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        let hitPos = (ball.y - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += hitPos * 2;
    }

    // Ball out of bounds (score)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw paddles
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    // Draw ball
    drawBall();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Touch control for mobile
canvas.addEventListener('touchmove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.touches[0].clientY - rect.top;
    e.preventDefault();
}, { passive: false });

gameLoop();
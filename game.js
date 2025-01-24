// 贪吃蛇游戏主程序

// 获取游戏画布和相关DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// 游戏配置
const gridSize = 20;  // 网格大小111
 
// 设置画布大小为窗口大小
canvas.width = window.innerWidth - 100;  // 减去一些边距
canvas.height = window.innerHeight - 100;

const tileCount = Math.min(
    Math.floor(canvas.width / gridSize),
    Math.floor(canvas.height / gridSize)
);  // 保持网格比例

// 游戏状态变量
let snake = [
    { x: 10, y: 10 },  // 蛇的初始位置
];
let food = { x: 15, y: 15 };  // 食物的初始位置
let dx = 1;  // 蛇的水平移动方向
let dy = 0;  // 蛇的垂直移动方向
let score = 0;  // 游戏得分
let gameLoop;  // 游戏循环计时器

document.addEventListener('keydown', changeDirection);

// 处理键盘输入，改变蛇的移动方向
function changeDirection(event) {
    const LEFT_KEY = 65;  // A键
    const RIGHT_KEY = 68; // D键
    const UP_KEY = 87;    // W键
    const DOWN_KEY = 83;  // S键

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// 游戏主循环函数，负责更新游戏状态和绘制画面
function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
}

// 清空画布，准备绘制新的一帧
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 更新蛇的位置，处理碰撞检测和食物收集
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (hasCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `分数: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

// 检查是否发生碰撞（撞墙或撞到自己）
function hasCollision(position) {
    return (
        position.x < 0 ||
        position.x >= tileCount ||
        position.y < 0 ||
        position.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === position.x && segment.y === position.y)
    );
}

// 绘制蛇的身体
function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 生成新的食物，确保不会出现在蛇的身体上
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // 确保食物不会生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }
}

// 游戏结束处理
function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
}

// 重置游戏状态，开始新游戏
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = `分数: ${score}`;
    gameOverElement.style.display = 'none';
    startGame();
}

// 启动游戏循环
function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, 200);  // 降低游戏速度，使蛇移动更慢
}

startGame();
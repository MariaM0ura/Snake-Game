class Snake {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y: this.y}];
        this.rotationX = 0;
        this.rotationY = 0;
    }

    move() {
        let newRect;
        if (this.rotationX === 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            };
        } else if (this.rotationX === -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            };
        } else if (this.rotationY === 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            };
        } else if (this.rotationY === -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            };
        }
        if (newRect) {
            this.tail.shift();
            this.tail.push(newRect);
        }
    }
}

class Apple {
    constructor() {
        this.place();
        this.color = 'red';
        this.size = snake.size;
    }

    place() {
        let isTouching;
        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
                    isTouching = true;
                    break;
                }
            }
            if (!isTouching) {
                break;
            }
        }
    }
}

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const snake = new Snake(20, 20, 20);
let apple = new Apple();

window.onload = () => {
    gameLoop();
};

function gameLoop() {
    setInterval(show, 1000 / 15);
}

function show() {
    update();
    draw();
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    eatApple();
}

function eatApple() {
    if (snake.tail[snake.tail.length - 1].x === apple.x && snake.tail[snake.tail.length - 1].y === apple.y) {
        snake.tail.unshift({x: snake.tail[0].x, y: snake.tail[0].y});
        apple = new Apple();
    }
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, 'black');
    createRect(0, 0, canvas.width, canvas.height, 'black'); // Corrigido para canvas.height

    for (let i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size - 5, 'white'); // Corrigido vírgula errada
    }

    canvasContext.font = '30px Arial';
    canvasContext.fillStyle = apple.color;
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 18); // Corrigido de canvas.window para canvas.width
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

window.addEventListener('keydown', (event) => {
    setTimeout(() => {
        if (event.key === 'ArrowUp' && snake.rotationY !== 1) {
            snake.rotationX = 0;
            snake.rotationY = -1;
        } else if (event.key === 'ArrowDown' && snake.rotationY !== -1) {
            snake.rotationX = 0;
            snake.rotationY = 1;
        } else if (event.key === 'ArrowLeft' && snake.rotationX !== 1) {
            snake.rotationX = -1;
            snake.rotationY = 0;
        } else if (event.key === 'ArrowRight' && snake.rotationX !== -1) {
            snake.rotationX = 1;
            snake.rotationY = 0;
        }
    }, 1);
});

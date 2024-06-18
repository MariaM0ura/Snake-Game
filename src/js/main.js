(function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

	//confing canvas
    const canvasSize = 680;
    const h = (canvas.height = canvasSize);
    const w = (canvas.width = canvasSize);
    const canvasFillColour = '#000d36';
    const canvasStrokeColour = 'rgba(211, 211, 211, 0.19)';


    // Constants
    const scoreEl = document.getElementById('score');
    const resetEl = document.getElementById('reset');
    const showGridEl = document.getElementById('show-grid');
    const hightScoreEl = document.getElementById('high-score');
    const playEl = document.getElementById('play');
    const pauseEl = document.getElementById('pause');

    let score = 0;

    // Function for high score
    const setScore = () => {
        scoreEl.innerHTML = `score emoji: ${score}`;
        let highScore = localStorage.getItem('highScore') || 0;
        if (score > highScore) {
            localStorage.setItem('highScore', score);
            hightScoreEl.innerHTML = `HIGH SCORE : ${score}`;
        } else {
            hightScoreEl.innerHTML = `HIGH SCORE : ${highScore}`;
        }
    };

    const frameReset = 9.5;
	const pGrind = 4;
	const grid_line_len = canvasSize - 2 * pGrind;
	const cellCount = 44;
	const cellSize = grid_line_len / cellCount;

	//game status

	let gameActive;

	const randomColor = () => {
		let color;
		let colorArr = ['#426ff5', '#42f5e3'];
		color = colorArr[Math.floor(Math.random() * colorArr.length)];
		return color;
	}
	//draw grid
	const setCanvas = () => {
		ctx.fillStyle = canvasFillColour;
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = canvasStrokeColour;
		ctx.strokeRect(0, 0, w, h);
	}

	const drawGrid = () => {
		ctx.beginPath();

		//vertical lines
		for (let i = 0; i < grid_line_len; i+=cellSize) {
			ctx.moveTo(pGrind + i , pGrind);
			ctx.lineTo(pGrind + i , grid_line_len + pGrind);
		}
		//horizontal lines
		for(let i = 0; i < grid_line_len; i+=cellSize) {
			ctx.moveTo(pGrind, pGrind + i);
			ctx.lineTo(grid_line_len + pGrind, pGrind + i);
		}
		ctx.closePath();
		ctx.strokeStyle = canvasStrokeColour;
		ctx.stroke();
	}

	const head = {
		x: 2,
		y: 1,
		color: randomColor(),
		vx:0,
		vy: 0,
		draw: () => {
			ctx.fillStyle = head.color;
			ctx.shadowColor = head.color;
			ctx.shadowBlur = 2.5;
			ctx.fillRect(
				head.x * cellSize + pGrind, 
				head.y * cellSize + pGrind,
				cellSize,
				 cellSize);
		},
	};

	let tailLength = 4;
	let snakeParts = [];

	//the snake
	class Tail {
		color = "#42f5e3";
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		draw() {
			ctx.fillStyle = this.color;
			ctx.shadowColor = this.color;
			ctx.shadowBlur = 2.5;
			ctx.fillRect(
				this.x * cellSize + pGrind,
				this.y * cellSize + pGrind,
				cellSize,
				cellSize
			);
		}
	}

	//the food
	const food = {
		x: 5,
		y: 5,
		color: "#ff3131",
		draw: () => {
			ctx.fillStyle = food.color;
			ctx.shadowColor = food.color;
			ctx.shadowBlur = 2.5;
			ctx.fillRect(
				food.x * cellSize + pGrind,
				food.y * cellSize + pGrind,
				cellSize,
				cellSize
			);
		},
	};

	const drawSnake = () => {
		snakeParts.forEach((part) => {
			part.draw();
		});

		snakeParts.push(new Tail(head.x, head.y));
		if(snakeParts.length > tailLength) {
			snakeParts.shift();
		}

		head.color = randomColor;
		head.draw();
	}

	const updareSnakePosition = () => {
		head.x += head.vx;
		head.y += head.vy;
	
	}

	let showGrid = false;

	const togglegrid = () => {
		if(!showGrid) {
			showGrid = true;
			showGridEl.innerHTML = 'Hide Grid';
			return;
		}
		showGrid = false;
		showGridEl.innerHTML = 'Show Grid';
	}

	const resetGame = () => {
		location.reload();
	}

	const animate = () => {
		setCanvas();
		if(!showGrid)drawGrid();
		drawSnake();
		if(gameActive){
			updareSnakePosition();
			if(isGameOver()) {
				showGameOver();
				gameActive = false;
			}
		}
			food.draw();
		setScore();
		setTimeout(animate, 1000 / frameReset);

	}

	const foodPosition = () => {
		let foodCollision = false;
		snakeParts.forEach((part) => {
			if(part.x === food.x && part.y === food.y) {
				foodCollision = true;
			}
		})

		if(foodCollision) {
			food.x = Math.floor(Math.random() * cellCount);
			food.y = Math.floor(Math.random() * cellCount);
			score++;
			tailLength++;
		}
	}

	const gameOver = () => {
		let gameOver = false;

		snakeParts.forEach((part) => {
			if(part.x === head.x && part.y === head.y) {
				gameOver = true;
			}
		});

		if( head.x < 0 || 
			head.y < 0 ||
			head.x > cellCount - 1 || 
			head.y > cellCount - 1) 
			{
			gameOver = true;
			}
		return gameOver;
	}

	const showGameOver = () => {
		const text = document.getElementById('div');
		text.setAttribute('id', 'game_over');
		text.innerHTML = 'Game Over';
		const body = document.querySelector('body');
		body.appendChild(text);
 	}

	const changeDir = (e) => {
		let key = e.keyCode;
	
		// Set directions based on WASD or arrow keys
		if (key === 68 || key === 39) { // D or right arrow
			if (head.vx === -1) return; // Prevent reversing
			head.vx = 1;
			head.vy = 0;
		}
	
		if (key === 65 || key === 37) { // A or left arrow
			if (head.vx === 1) return;
			head.vx = -1;
			head.vy = 0;
		}
	
		if (key === 87 || key === 38) { // W or up arrow
			if (head.vy === 1) return;
			head.vy = -1;
			head.vx = 0;
		}
	
		if (key === 83 || key === 40) { // S or down arrow
			if (head.vy === -1) return;
			head.vy = 1;
			head.vx = 0;
		}
	}
	

	showGridEl.addEventListener('click', togglegrid);
	resetEl.addEventListener('click', resetGame);
	addEventListener('keydown', changeDir);

	animate();
})();

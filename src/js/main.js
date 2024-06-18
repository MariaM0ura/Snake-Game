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
		drawGrid();
		setScore();
		setTimeout(animate, 1000 / frameReset);

	}

	showGridEl.addEventListener('click', togglegrid);
	resetEl.addEventListener('click', resetGame);

	animate();
})();

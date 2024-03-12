// jshint esversion: 9

/* THIS SCRIPT IS FOR RUNNING THE GAME AND ALL OF ITS COMPONENTS. 

DEFAULT WEBSITE BEHAVIOR FOR MY GAMES
IS PROVIDED FOR IN INDEX.JS.

		  .888. 688888888888888888889
		 .88888. 88888888888888888888
		.8888888. 88888888888
	   .8888 8888. 8888888888
	  .888     888. 888888888888888888
	 .88888   88888. 88888888888888888
	.888888888888888. 8888888
   .88888       88888. 888888
  .888888       888888. 88888888888888
 .8888889       6888888. 6888888888889

*/

const lib = {
	rectGravity2d: function(object, touchingTop, touchingBottom) {
		object.pullY += object.gravity;
		object.y += object.pullY;
		if (object.dead == false || object.dead == undefined) {
			if (object.groundY != undefined && object.y + (game.height / object.size) > object.groundY && game.gameOver != true) {
				touchingBottom();
			}
			if (object.ceilingY != undefined && object.y < object.ceilingY) {
				touchingTop();
			}
		}
	}
};

//////////////////////////////////////////////////////////////////////////////

if (typeof localStorage.getItem("highScore") == null) {
	localStorage.setItem("highScore", 0);
}

let game = {
	width: 800,
	height: 600,
	gameOver: false,
	gameStopped: false,
	gameActive: false,
	tunnelHeight: 0.85,
	groundColor: "#210008",
	skyColor: "#E7FBFC",
	frameRate: 15,
	distanceTraveled: 0,
	scrollSpeed: 2,
	gameDarkness: 0,
	gameDarknessEndPoint: 0.4,
	gameDarknessStartPoint: 0,
	darknessIncrement: 0.01,
	acceptableKeyCodes: [32, 38, undefined], //ACCEPTED KEYS ARE SPACE AND UP ARROW. MOUSE CLICKS ARE ACCEPTED TOO
	tubeYgaps: []
};

game.originalWidth = game.width;
game.originalHeight = game.height;

let widthRatio = game.width / game.height; //RESIZES THE CANVAS TO BE AS LARGE AS POSSIBLE WHILE RETAINING CANVAS WIDTH TO HEIGHT RATIO
let heightRatio = game.height / game.width;

game.width = window.innerWidth;
game.height = game.width * heightRatio;

if (game.height > window.innerHeight) {
	game.height = window.innerHeight;
	game.width = game.height * widthRatio;
}

game.floppiness = game.originalHeight / game.width;
game.scrollSpeed = game.width / 400; //SETS THE SCROLLSPEED TO BE PROPORTIONAL TO THE SIZE OF THE CANVAS

//////////////////////////////////////////////////////////////////////////////

let images = {
	groundScrollSpeed: game.scrollSpeed / 2,
	firstGround: true,
	grounds: [],
	createGround: true,
	mountainsScrollSpeed: game.scrollSpeed / 4,
	firstMountain: true,
	mountains: [],
	createMountain: true,
	buttons: []
};

let obstacleObject = {
	spawnWait: game.width / 12,
	retractSpeed: 1,
	distanceIncrement: game.width / 4,
	obstacleWidth: 0.2,
	obstacleHeight: game.height,
	gapHeight: (game.tunnelHeight * game.height) * (2 / 5),
	obstacles: []
};

let score = {
	content: 0,
	preContent: "SCORE: ",
	font: "Monospace",
	size: (game.width / 16) + "px",
	x: (game.width / 8) * 7,
	y: game.height / 8,
	gameoverX: game.width * (1 / 2),
	gameoverY: game.height * (6 / 8)
};

let highScore = {
	content: 0,
	preContent: "HIGH SCORE: ",
	font: "Monospace",
	size: (game.width / 24) + "px",
	gameoverX: game.width * (1 / 2),
	gameoverY: game.height * (7 / 8)
};

let player = {
	size: 10,
	x: 0,
	y: 0,
	jumpReady: true,
	rotationSpeed: 0.12, //SPEED AND STANDARD AMOUNT OF ROTATION
	rotationAmount: 0, //THE OVERALL DIRECTION OF THE PLAYER
	pullY: 0,
	dead: false,
	jumpForce: (game.height * game.tunnelHeight) / 60,
	deathJump: (game.height * game.tunnelHeight) / 60,
	gravity: game.height / 1200,
	bounce: 0,
	groundY: game.height * game.tunnelHeight,
	ceilingY: 0,
	currentImageI: 0,
	timeForConstantJump: 510
};

player.x = game.width / 2 - ((game.width / player.size) / 2);
player.y = game.height / 2 - ((game.height / player.size) / 2);

//////////////////////////////////////////////////////////////////////////////

function Obstacle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.passedByPlayer = false;
}

function Ground(x) {
	this.x = x;
	this.madeNew = false;
}

function Mountains(x) {
	this.x = x;
	this.madeNew = false;
}

function MenuButton(image, x, y, width, height, runFunction, canRunFunction) {
	this.image = image;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.runFunction = runFunction;
	this.canRunFunction = canRunFunction;
	this.transparency = 1;
	this.startTransparency = 1;
	this.endTransparency = 0.6;
	this.transparencyChangeSpeed = 0.025;
	this.hoveredOn = false;
	images.buttons.push(this);
}

//////////////////////////////////////////////////////////////////////////////

var playerImage = new Image();
playerImage.src = "images/FB_Player.png";
var playerImage2 = new Image();
playerImage2.src = "images/FB_Player2.png";
var playerImages = [playerImage, playerImage2];

var ground = new Image();
ground.src = "images/FB_Ground.png";

var tube = new Image();
tube.src = "images/FB_Tubes.png";

var mountains = new Image();
mountains.src = "images/FB_Mountains.png";

var background = new Image();
background.src = "images/FB_Background.png";

var start = new Image();
start.src = "images/FB_Start.png";

//////////////////////////////////////////////////////////////////////////////

let jump = new Audio("sounds/FB_Jump.wav");
jump.volume = 0.75;

let crash = new Audio("sounds/FB_Crash.wav");
crash.volume = 1;

let theme = new Audio("sounds/FB_Theme.mp3");
theme.volume = 0.3;
theme.loop = true;

//////////////////////////////////////////////////////////////////////////////

let startButton = new MenuButton(start, game.width / 2, game.height * (2 / 5), game.width / 4, game.height / 3, restartGame, gameReady);

//////////////////////////////////////////////////////////////////////////////

let canvas = document.createElement("CANVAS");
canvas.width = game.width;
canvas.height = game.height;
document.body.appendChild(canvas);
let c = canvas.getContext("2d");

//////////////////////////////////////////////////////////////////////////////

function displayBackground() {
	c.fillStyle = game.skyColor;
	c.fillRect(0, 0, game.width, game.height); //FALLBACK BACKGROUND

	c.drawImage(background, 0, 0, game.width, game.height);

	for (let i = 0; i < images.mountains.length; i++) {
		c.drawImage(mountains, images.mountains[i].x, player.groundY / 2, game.width, player.groundY / 2);
	}

	for (let i = 0; i < images.grounds.length; i++) {
		c.drawImage(ground, images.grounds[i].x, player.groundY, game.width, game.height - player.groundY);
	}
}

function moveBackground() {
	if (game.gameStopped != true) {
		if (images.createGround == true) {
			let x;
			if (images.firstGround == true) {
				x = 0;
				images.firstGround = false;
			} else {
				x = game.width - images.groundScrollSpeed;
			}
			images.createGround = false;
			let ground = new Ground(x);
			images.grounds.push(ground);
		}

		for (let i = 0; i < images.grounds.length; i++) {
			images.grounds[i].x -= images.groundScrollSpeed;
			if (images.grounds[i].x <= 0 && images.grounds[i].madeNew == false) {
				images.createGround = true;
				images.grounds[i].madeNew = true;
			}
			if (images.grounds[i].x + game.width <= 0) {
				images.grounds.splice(i, 1);
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////////////

	if (game.gameStopped != true) {
		if (images.createMountain == true) {
			let x;
			if (images.firstMountain == true) {
				x = 0;
				images.firstMountain = false;
			} else {
				x = game.width - images.groundScrollSpeed;
			}
			images.createMountain = false;
			let mountain = new Mountains(x);
			images.mountains.push(mountain);
		}

		for (let i = 0; i < images.mountains.length; i++) {
			images.mountains[i].x -= images.mountainsScrollSpeed;
			if (images.mountains[i].x <= 0 && images.mountains[i].madeNew == false) {
				images.createMountain = true;
				images.mountains[i].madeNew = true;
			}
			if (images.mountains[i].x + game.width <= 0) {
				images.mountains.splice(i, 1);
			}
		}
	}
}

function displayForeground() {
	for (let i = 0; i < obstacleObject.obstacles.length; i++) {
		c.drawImage(tube, obstacleObject.obstacles[i].x, obstacleObject.obstacles[i].y, obstacleObject.obstacles[i].width, obstacleObject.obstacles[i].height);
	}


	c.fillStyle = "#000000";
	c.globalAlpha = game.gameDarkness;
	gameDarkenToggle();
	c.fillRect(0, 0, game.width, game.height);
	c.globalAlpha = 1;

	if (game.gameOver == false) {
		c.save();
		c.translate(player.x + ((game.width / player.size) / 2), player.y + ((game.height / player.size) / 2));

		if (player.rotationAmount - player.pullY < player.rotationSpeed * player.pullY || player.pullY - player.rotationAmount < player.rotationSpeed * player.pullY) {
			player.rotationAmount = (player.rotationSpeed * (player.pullY * game.floppiness));
		}

		c.rotate(player.rotationAmount);
		c.drawImage(playerImages[player.currentImageI], 0 - ((game.width / player.size) / 2), 0 - ((game.height / player.size) / 2), game.width / player.size, game.height / player.size);
		c.restore();
		//DISPLAY THE SCORE ON THE RIGHT CORNER OF SCREEN DURING GAME
		c.fillStyle = "#FFFFFF";
		c.font = score.size + " " + score.font;
		c.textAlign = "center";
		c.fillText(score.content, score.x, score.y);
		c.strokeText(score.content, score.x, score.y);
	} else {
		//DISPLAY SCORE IN CENTER OF SCREEN WHEN GAME IS OVER
		c.fillStyle = "#FFFFFF";
		c.font = score.size + " " + score.font;
		c.textAlign = "center";
		c.fillText(score.preContent + score.content, score.gameoverX, score.gameoverY);
		c.strokeText(score.preContent + score.content, score.gameoverX, score.gameoverY);

		c.font = highScore.size + " " + highScore.font;
		c.fillText(highScore.preContent + highScore.content, highScore.gameoverX, highScore.gameoverY);
		c.strokeText(highScore.preContent + highScore.content, highScore.gameoverX, highScore.gameoverY);
	}
}

function moveForeground() {
	if (game.gameOver == false) {
		if (game.gameActive == true) {
			lib.rectGravity2d(player, ceilingBounce, die);
			if (player.y > game.height) {
				game.gameStopped = false;
				game.gameOver = true;
			}
		}
		if (game.gameStopped != true && game.gameActive == true && player.dead == false) {
			for (let i = 0; i < obstacleObject.obstacles.length; i++) {
				obstacleObject.obstacles[i].x -= game.scrollSpeed;

				if (obstacleObject.obstacles[i].x + obstacleObject.obstacles[i].width < 0) {
					obstacleObject.obstacles.splice(i, 1);
				}

				//CHECK IF THE PLAYER IS PAST THE OBSTACLE AND ADD A POINT IS IT
				if ((i + 1) % 2 == 0) {
					if (obstacleObject.obstacles[i].x < player.x && obstacleObject.obstacles[i].passedByPlayer == false) {
						score.content++;
						obstacleObject.obstacles[i].passedByPlayer = true;
						obstacleObject.obstacles[i - 1].passedByPlayer = true;
					}
				}
			}
			game.distanceTraveled += game.scrollSpeed;
		}
	}
}

function detectCollision() {
	if (game.gameOver != true) {
		for (let i = 0; i < obstacleObject.obstacles.length; i++) {
			let ob = obstacleObject.obstacles[i];
			let a = player.y < ob.y + ob.height && player.y + game.width / player.size > ob.y;
			let b = player.x + game.width / player.size > ob.x;
			let c = player.x < ob.x + ob.width;
			let d = player.x < ob.x + ob.width;
			if (a && b && c && d) {
				die();
			}
		}
	}
}

function spawn() {
	if (game.distanceTraveled > obstacleObject.spawnWait + (game.width * obstacleObject.obstacleWidth)) {
		let gapY = player.ceilingY + Math.random() * ((player.groundY - player.ceilingY) - obstacleObject.gapHeight);
		//TOP TUBE
		let obstacleTop = new Obstacle(game.width, player.ceilingY + (gapY - player.ceilingY) - obstacleObject.obstacleHeight, obstacleObject.obstacleWidth * game.width, obstacleObject.obstacleHeight);
		let obstacleBottom = new Obstacle(game.width, gapY + obstacleObject.gapHeight, obstacleObject.obstacleWidth * game.width, obstacleObject.obstacleHeight);
		obstacleObject.obstacles.push(obstacleTop, obstacleBottom);
		obstacleObject.spawnWait += obstacleObject.distanceIncrement + (game.width * obstacleObject.obstacleWidth);
		game.tubeYgaps.push(gapY);
	}
}

function displayMenu() {
	for (let i = 0; i < images.buttons.length; i++) {
		c.globalAlpha = images.buttons[i].transparency;
		c.drawImage(images.buttons[i].image, images.buttons[i].x - (images.buttons[i].width / 2), images.buttons[i].y - (images.buttons[i].height / 2), images.buttons[i].width, images.buttons[i].height);
		buttonTransparencyToggle(images.buttons[i].hoveredOn, i);
		c.globalAlpha = 1;
	}
}

//////////////////////////////////////////////////////////////////////////////

function input(e) {
	if (e.keyCode == 83) { // stop the game if "s" is pressed
		clearInterval(gameLoop);
	} else {
		theme.play();
		if (game.gameOver == true) {
			checkButtonsClick(e);
			if (gameReady() == true && e.keyCode != undefined) {
				restartGame();
			}
		} else {
			if (player.dead == false) {
				for (let i = 0; i < game.acceptableKeyCodes.length; i++) {
					if (e.keyCode == game.acceptableKeyCodes[i]) { //CHECKS FOR VALID JUMP KEYS
						if (player.jumpReady) { //JUMPS AND CANNOT JUMP AGAIN UNTIL KEY IS RELEASED
							player.currentImageI = 1;
							player.pullY = player.jumpForce * -1;
							jump.play();
							player.jumpReady = false;
						}
						if (game.gameActive != true) {
							theme.pause();
							theme.play();
							game.gameActive = true;
						}
					}
				}
			}
		}
	}
}

// setInterval(() => {
// 	function hop(amount) {
// 		player.currentImageI = 1;
// 		player.pullY = player.jumpForce * (amount == 1 ? -1 : amount == 0.5 ? -0.6 : -1.5);
// 		jump.play();
// 		player.jumpReady = false;
// 	}
// 	if (!player.dead) {
// 		let y = player.y + ((game.height / player.size) / 2);
// 		let gapY = game.tubeYgaps.length <= 1 ? game.tubeYgaps[0] : game.tubeYgaps[tubeYgaps.length - 2];
// 		let gapYtop = gapY + (obstacleObject.gapHeight / 2);
// 		let gapYbottom = gapY + obstacleObject.gapHeight;
// 		if (y > gapYbottom + (obstacleObject.gapHeight / 3)){
// 			hop(2);
// 		} else if(y > gapYtop) {
// 			hop(1);
// 		} else {
// 			hop(0.5);
// 		}
// 	}
// }, player.timeForConstantJump)

function gameReady() {
	if (obstacleObject.obstacles.length == 0) {
		return true;
	} else {
		return false;
	}
}

function getMousePos(e) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return {
		x: Math.floor(x),
		y: Math.floor(y)
	};
}

function checkButtonsHover(e) {
	for (let i = 0; i < images.buttons.length; i++) {
		let msX = getMousePos(e).x;
		let msY = getMousePos(e).y;
		let btnX = images.buttons[i].x;
		let btnY = images.buttons[i].y;
		let btnWidth = images.buttons[i].width;
		let btnHeight = images.buttons[i].height;

		const a = msX > btnX - btnWidth / 2;
		const b = msX < btnX + btnWidth / 2;
		const c = msY > btnY - btnHeight / 2;
		const d = msY < btnY + btnHeight / 2;
		if (a && b && c && d) {
			mouseOnButton(i, true);
			return { isOnButton: true, buttonId: i };
		} else {
			mouseOnButton(i, false);
			return { isOnButton: false, buttonId: i };
		}
	}
}

function checkButtonsClick(e) {
	if (checkButtonsHover().isOnButton) {
		if (images.buttons[checkButtonsHover().buttonId].canRunFunction() == true || images.buttons[checkButtonsHover().buttonId].canRunFunction() == undefined) {
			images.buttons[checkButtonsHover().buttonId].runFunction();
		}
	}
}

function readyJump(e) {
	for (let i = 0; i < game.acceptableKeyCodes.length; i++) {
		if (e.keyCode == game.acceptableKeyCodes[i]) { //CHECKS FOR VALID JUMP KEYS
			player.currentImageI = 0;
			player.jumpReady = true;
		}
	}
}

function die() {
	if (player.dead == false) {
		highScore.content = localStorage.getItem("highScore");
		if (score.content > highScore.content) {
			highScore.content = score.content;
			localStorage.setItem("highScore", highScore.content);
		}

		crash.play();
		player.pullY = player.deathJump * -1;
		game.gameStopped = true;
		game.tubeYgaps = [];
		player.dead = true;
	}
}

function retractPipes() {
	if (obstacleObject.obstacles.length != 0) {
		let dead = true;
		for (let i = 0; i < obstacleObject.obstacles.length; i++) {
			if ((i + 1) % 2 == 0) { //FOR BOTTOM PIPE
				obstacleObject.obstacles[i].y += obstacleObject.retractSpeed;
				if (obstacleObject.obstacles[i].y <= game.height) {
					dead = false;
				}
			} else { //FOR TOP PIPE
				obstacleObject.obstacles[i].y -= obstacleObject.retractSpeed;
				if (obstacleObject.obstacles[i].y + obstacleObject.obstacles[i].height >= 0) {
					dead = false;
				}
			}
		}
		if (dead == true) {
			obstacleObject.obstacles.splice(0, obstacleObject.obstacles.length);
		} else {
			setTimeout(retractPipes, game.frameRate);
		}
	}
}

function gameDarkenToggle() {
	if (game.gameOver) {
		if (game.gameDarkness < game.gameDarknessEndPoint) {
			game.gameDarkness += game.darknessIncrement;
		}
	} else {
		if (game.gameDarkness > game.gameDarknessStartPoint) {
			game.gameDarkness -= game.darknessIncrement;
		}
	}
	if (game.gameDarkness > game.gameDarknessEndPoint) {
		game.gameDarkness = game.gameDarknessEndPoint;
	}
	if (game.gameDarkness < game.gameDarknessStartPoint) {
		game.gameDarkness = game.gameDarknessStartPoint;
	}
}

function ceilingBounce() {
	player.y = player.ceilingY;
	player.pullY = (player.pullY * -1) * player.bounce;
}

function mouseOnButton(i, hoveredOn) {
	if (hoveredOn) {
		images.buttons[i].hoveredOn = true;
	} else {
		images.buttons[i].hoveredOn = false;
	}
}

function buttonTransparencyToggle(hoveredOn, i) {
	let btn = images.buttons[i];
	if (hoveredOn == true) {
		if (btn.transparency > btn.endTransparency) {
			btn.transparency -= btn.transparencyChangeSpeed;
		}
	} else {
		if (btn.transparency < btn.startTransparency) {
			btn.transparency += btn.transparencyChangeSpeed;
		}
	}
	if (btn.transparency < btn.endTransparency) {
		btn.transparency = btn.endTransparency;
	}
	if (btn.transparency > btn.startTransparency) {
		btn.transparency = btn.startTransparency;
	}
}

function restartGame() {
	game.gameOver = false;
	player.dead = false;
	game.gameActive = false;
	game.distanceTraveled = 0;
	obstacleObject.spawnWait = game.width / 4;
	player.jumpReady = true;
	player.pullY = 0;
	player.x = game.width / 2 - ((game.width / player.size) / 2);
	player.y = game.height / 2 - ((game.height / player.size) / 2);
	images.buttons.transparency = 0;
	score.content = 0;
}

//////////////////////////////////////////////////////////////////////////////

var gameLoop = setInterval(function() {
	displayBackground();
	moveBackground();
	displayForeground();
	moveForeground();
	if (game.gameOver == true) {
		displayMenu();
		retractPipes();
	} else {
		if (game.gameActive == true) {
			detectCollision();
			spawn();
		}
	}
	console.log("\nNext frame:");
	console.log("\n");
	let closestObstacle;
	for (let i = 0; i < obstacleObject.obstacles.length; i++) {
		if (!(player.x + (0.5 * (game.width / player.size)) >= obstacleObject.obstacles[i].x)) {
			closestObstacle = obstacleObject.obstacles[i];
		}
	}
	console.log("Horizontal distance to next obstacle (in terms of game width): " + ((closestObstacle.x) - (player.x + (0.5 * (game.width / player.size)))) / game.width);
	console.log("Height from minimum height limit (in terms of game height): " + ((game.height * game.tunnelHeight) - player.y) / game.height);
	console.log("Vertical velocity (in terms of game height): " + -player.pullY / game.height);
	console.log("Height of goal from minimum height limit: " + (((game.height - (closestObstacle.y - (game.height / (player.size * 2)))) - ((1 - game.tunnelHeight) * game.height)) / game.height));
}, game.frameRate);

//////////////////////////////////////////////////////////////////////////////

window.addEventListener("keydown", input, false);
window.addEventListener("keyup", readyJump, false);

//////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousedown', input, false);
canvas.addEventListener("mouseup", readyJump, false);

//////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousemove', checkButtonsHover, false);


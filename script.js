//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let toppipeImg;
let bottompipeImg;

// game physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameover = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //loading images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    toppipeImg = new Image();
    toppipeImg.src = "./toppipe.png";

    bottompipeImg = new Image();
    bottompipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    
    // Add event listeners for keyboard, mouse, and touch input
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird); // For mouse clicks
    document.addEventListener("touchstart", moveBird); // For touch events
}

function update() {
    requestAnimationFrame(update);
    if (gameover) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //for bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameover = true;
    }

    //for pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Scoring
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score += 5;
            pipe.passed = true;
        }

        // Collision detection
        if (detectCollission(bird, pipe)) {
            gameover = true;
        }
    }

    //clear pipes 
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //draw score
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if (gameover) {
        context.font = "30px sans-serif";
        context.fillText("AWW! GAME OVER!!!", 5, 90);
    }
}

function placePipes() {
    if (gameover) {
        return;
    }

    let randomPipesY = pipeY - pipeHeight / 4 - Math.random() * pipeHeight / 2;
    let openingSpace = board.height / 4;

    let topPipe = {
        img: toppipeImg,
        x: pipeX,
        y: randomPipesY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottompipeImg,
        x: pipeX,
        y: randomPipesY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    // Detect input method
    if (e.type === "keydown") {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
            velocityY = -6;
        }
    } else if (e.type === "click" || e.type === "touchstart") {
        velocityY = -6;
    }

    // Reset the game if it's over
    if (gameover) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameover = false;
        velocityY = 0; // Reset velocity to start the new game smoothly
    }
}

function detectCollission(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

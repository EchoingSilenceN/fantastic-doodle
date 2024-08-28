
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight,
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let toppipeImg;
let bottompipeImg;

// gamephysics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameover = false; 
let score = 0;



window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");


    //draw the bird 
    //context.fillStyle = "red";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //loading image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    toppipeImg = new Image();
    toppipeImg.src = "./toppipe.png";

    bottompipeImg = new Image();
    bottompipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);

}

function update() {
    requestAnimationFrame(update);
    if(gameover) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    //forbird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height){
        gameover = true;
    }



    //forpipes
    for( let i = 0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && pipe.x + pipe.width ) {
            score += 5;
            pipe.passed = true;
        }

        if (detectCollission(bird, pipe)) {
            gameover = true;
        }

    
    }

    //clear pipes 
    while (pipeArray.length> 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    //drawscore
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if (gameover) {
        context.font = "30px sans-serif";
        context.fillText("AWW!GAME OVER!!!", 5, 90);
    }

  
}

function placePipes() {
    if(gameover) {
        return;
    }
    
    let randomPipesY = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2;
    let openingspace = board.height/4;
    let topPipe = {
        img : toppipeImg,
        x : pipeX,
        y : randomPipesY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false,
    }

    pipeArray.push(topPipe);

    let bottompipe = {
        img : bottompipeImg,
        x : pipeX,
        y : randomPipesY + pipeHeight + openingspace, 
        width : pipeWidth,
        height : pipeHeight,
        passed : false,

    }
    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;
    }

    //resetthegame
    if(gameover){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameover = false;
    }
}

function detectCollission(a, b) {
    return a.x < b.x + b.width &&
           a.x+a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;  

}
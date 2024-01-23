// version du 18/10/23
// recréation d'un casse brique en JS
// utilisation de l'API Canvas
// et des concept de variables, fonctions, tests, boucles

// Déclarations des variables à l'extérieur des fonctions
// autrement dit dans le cors principale,
// afin que toutes les fonctions y aient accès.
let paddle;
let ball;
let canvas;
let ctx;
let mousePosX;

// note : vous pourriez avoir besoin d'autre variable tel que le score
// le jeu est il perdu ? le nombre de vies restantes, éventuellement de murs...
// laissez parler votre imagination mais anticipez bien la complexité.
let bricks = [];  // par exemple
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth = 63;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 50;
let brickOffsetLeft = 5;


// ignorez ceci dans un premier temps mais sachez que mousePosX contiendra
// continuellement la position de la souris par rapport au coté gauche du canvas.

let lives = 3;
let score = 0;
let loose = false;



function setupCanvas() {
  canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 720;
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
}

// fonctions d'initialisation.

function initPaddle() {
  paddle = {};
  paddle.posX = 0;
  paddle.posY = 0;
  paddle.width = 64;
  paddle.height = 16;

  paddle.posY = canvas.height - paddle.height;
}

function initBall() {
  ball = {}
  ball.posX = 0;
  ball.posY = 0;
  ball.width = 4;
  ball.height = 4;
  ball.speedX = 1;    // 1 en X pour qller vers le droite
  ball.speedY = -1;   // -1 en Y pour aller vers le haut.
  ball.posX = paddle.posX + 10;
  ball.posY = paddle.posY - ball.height - 2;
}

function initGameLoop() {
  // on lance la boucle grace à SetInterval
  // fera un appel de la fonction update 60 par secondes.
  // si on utilisait un "while", cela figerai le navigateur qui n'a pas que du js
  // a traiter, mais aussi le rendu html, les inputs clavier/souris etc.
  setInterval(update, 1000 / 60);
}

function initGame() {
  initPaddle();
  initBall();
  initBricks();
  initGameLoop();
}

// fonctions d'affichage/rendu

function drawBall() {
  // console.log('ball ', ball);
  ctx.fillStyle = 'blue';
  ctx.fillRect(ball.posX, ball.posY, ball.width, ball.height);
}

function drawPaddle() {
  ctx.fillStyle = 'black';
  ctx.fillRect(paddle.posX, paddle.posY, paddle.width, paddle.height);

}

function drawBackground() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Creer les bricks
function initBricks(){
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        } 
    }
    drawBricks();
}

// Dessiner les bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            if (bricks[c][r].status == 1) {
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'blue';
            }
        }
    }
}

function updateBricks(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                if(ball.posY <= bricks[c][r].y + brickHeight){
                    ball.speedY = -ball.speedY;
                    if(ball.posX + ball.width >= bricks[c][r].x  && ball.posX <= bricks[c][r].x + brickWidth) {
                        console.log("brick: ", bricks[c][r]);
                        console.log("ball: ", ball);
                        bricks[c][r].status = 0;
                        ctx.fillRect(bricks[c][r].y, bricks[c][r].y, brickWidth, brickHeight);
                        ctx.fillStyle = 'grey';
                        ball.speedX = -ball.speedX;
                        score += 1;
                        console.log("Score: ", score);
                    }
                }
            }
        }
    }
}

function draw() {
  drawBackground();
  drawPaddle();
  drawBall();
  drawBricks();
}

// fonctions portant sur la logique/métier : le coeur de l'algorithme/ notre application.

function updateBall() {
  ball.posX = ball.posX + ball.speedX;
  ball.posY = ball.posY + ball.speedY;

  // TODO: gérer les collisions avec les bords
  if (ball.posX >= canvas.width || ball.posX <= 0) {
    ball.speedX = -ball.speedX
  }

  if (ball.posY <= 0 ) {
    ball.speedY = -ball.speedY
  }

  //Collision avec le paddle
  if (ball.posY + ball.height >= paddle.posY && ball.posX >= paddle.posX && ball.posX <= paddle.posX + paddle.width) {
    ball.speedY = -ball.speedY
  }

  //Perdu
  if (ball.posY + ball.height >= paddle.posY && (ball.posX <= paddle.posX || ball.posX >= paddle.posX + paddle.width)) {
    loose = true;
  }

}

// TODO: gérer les position de la souris (il faudra passer par un évènement "onMouveMove", google it)
window.addEventListener('mousemove', function(mouseEvent) {
    mousePosX = mouseEvent.clientX;
    console.log('mouse x: ', mousePosX);
    console.log('offsetLeft x: ', canvas.offsetLeft);
    let relX = mousePosX - canvas.offsetLeft;
    if (relX > 0 && relX < canvas.width) {
        paddle.posX = relX - paddle.width/2;
    }
    console.log('paddle x: ', paddle.posX);
  });

function update() {
    if(loose){
        if(lives > 0){
            initGame();
            loose = false;
            lives -= 1;
            alert("PERDU!!!! Il te reste " + lives + " lives");
        }
        else{
            alert("GAME OVER!!!")
            lives = 3;
            loose = false;
            score = 0;
        }
    }
    else{
        console.log('update called');
        updateBall();
        updateBricks();
        draw();
    }
}

// code permettant de créer le jeu
function setupGame() {
    setupCanvas();
    initGame();
  
}

// lancement du jeu
// la seule fonction appelée depuis
// le corps principale de notre code.
// commentez-là est plus rien se passera !
setupGame();

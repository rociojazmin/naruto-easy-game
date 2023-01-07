const SIZE = 90;
const DELTA = SIZE / 10;
const ACCEL = DELTA * 5;
const M = 8;
const N = 6.2;
const AIR = 1.5;

let game;

function init() {
    game = {
        board: {
            width: M * SIZE,
            height: N * SIZE
        },
        player: {
            x: 0,
            y: 0,
            size: 1 * SIZE,
            div: document.getElementById("player"),
            bearing: "n"
        },
        enemy: {
            x: 0,
            y: 0,
            size: 1.2 * SIZE,
            div: document.getElementById("enemy")
        },
        score: 0,
        lives: 3,
        enemyUpdateInterval: undefined
    };
}

function doIt() {

    // Reseteo el estado por si esta no es la primera vez que juega
    document.getElementById("lives").style.color = "black";
    document.getElementById("lives").style.fontStyle = "normal";
    document.getElementById("btn-play").style.display = "none";

    init();
    const theBoard = document.getElementById("container");
    theBoard.style.width = game.board.width + "px";
    theBoard.style.height = game.board.height + "px";


    resetPlayer();
    positionEnemy();

    draw(game.player);
    draw(game.enemy);

    var gameOverDiv = document.getElementById("game-over");
    gameOverDiv.style.top = Math.round((game.board.height - gameOverDiv.clientHeight) / 2) + "px";
    gameOverDiv.classList.add("nodisp");

    var instruccionesDiv = document.getElementById("instrucciones");
    instruccionesDiv.style.top = Math.round((game.board.height - instruccionesDiv.clientHeight) / 2) + "px";
    instruccionesDiv.classList.add("nodisp");

    document.onkeydown = move;

    game.enemyUpdateInterval = setInterval(updateEnemy, 2000);

    showScore();
    showLives();

}

function resetPlayer() {
    game.player.x = Math.round((game.board.width - game.player.size) / 2);
    game.player.y = Math.round((game.board.height - game.player.size) / 2);
}

function collision(obj1, obj2, air = 0.8) {
    return obj1.x >= obj2.x - obj1.size * air &&
        obj1.x <= obj2.x + obj1.size * air &&
        obj1.y >= obj2.y - obj1.size * air &&
        obj1.y <= obj2.y + obj1.size * air;
}

//   a        b
//   .        .
// (2,3)    (2,4)
// a.x == b.x && a.y == b.y

//   obj1         obj2
// |------|     |------|
// |.     |     |.     |
// |      |     |      |
// |      |     |      |
// |------|     |------|


function updateEnemy() {
    positionEnemy();
    draw(game.enemy);
}
function resetPlayerPosition() {

}


function move(evt) {
    // if pequeno
    const realDelta = evt.shiftKey ? ACCEL : DELTA;
    switch (evt.code) {
        case "ArrowLeft":
            if ((game.player.x - realDelta) >= 0) {
                game.player.x -= realDelta;
            } else {
                die();
            }
            game.player.bearing = "w";
            break;
        case "ArrowRight":
            if ((game.player.x + realDelta) <= game.board.width - game.player.size) {
                game.player.x += realDelta;
            } else {
                die();
            }
            game.player.bearing = "e";
            break;
        case "ArrowUp":
            if ((game.player.y - realDelta) >= 0) {
                game.player.y -= realDelta;
            } else {
                die();
            }
            game.player.bearing = "n";
            break;
        case "ArrowDown":
            if ((game.player.y + realDelta) <= game.board.height - game.player.size) {
                game.player.y += realDelta;
            } else {
                die();
            }
            game.player.bearing = "s";
            break;
    }

    draw(game.player);
    if (collision(game.enemy, game.player, 0.8)) {
        score();
        setTimeout(function () { updateEnemy(); }, 20);
    }
}

function showScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.innerHTML = game.score;
}

function showLives() {
    var livesElement = document.getElementById("lives");
    livesElement.innerHTML = game.lives;
    if (game.lives == 1) {
        livesElement.style.color = "red";
        livesElement.style.fontStyle = "italic";
    }
}

function die() {
    game.lives -= 1;
    showLives();
    if (game.lives === 0) {
        gameOver();
    } else {
        resetPlayer();
    }
}


function score() {
    game.score += 100;
    showScore();
}

function positionEnemy() {
    do {
        game.enemy.x = numeroAlAzarDentroDelRango(0, game.board.width - game.enemy.size);
        game.enemy.y = numeroAlAzarDentroDelRango(0, game.board.height - game.enemy.size);
    }
    while (collision(game.enemy, game.player));

}

function draw(who) {

    who.div.style.width = who.size + "px";
    who.div.style.height = who.size + "px";

    who.div.style.left = who.x + "px";
    who.div.style.top = who.y + "px";

    if (who.bearing) {
        who.div.classList = [];
        who.div.classList.add(who.bearing);
    }

}

function gameOver() {
    clearInterval(game.enemyUpdateInterval); // Interrumpe el movimiento del enemigo
    document.onkeydown = null; // Interrumpe el movimiento del teclado
    document.getElementById("game-over").classList.remove("nodisp");
    document.getElementById("btn-play").style.display = "block";
}

function instrucciones() {
    clearInterval(game.enemyUpdateInterval); // Interrumpe el movimiento del enemigo
    document.onkeydown = null; // Interrumpe el movimiento del teclado
    document.getElementById("instrucciones").classList.remove("nodisp");
}

function CloseInstrucciones() {
    document.getElementById("instrucciones").classList.add("nodisp");
}


document.getElementById("btn-play").addEventListener(
    'click',
    doIt
);


function numeroAlAzarDentroDelRango(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
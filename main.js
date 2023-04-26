const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

// Define Gravity
const gravity = 0.8;

// Define Game State
let gameStarted = false;

/**
* Scene: Start Screen
*/
const startScreenImage = new Image();
startScreenImage.src = "./img/bg-dark.png";

// Create Start Button
const buttonWidth = 100;
const buttonHeight = 50;
const buttonX = canvas.width / 2 - buttonWidth / 2;
const buttonY = canvas.width / 2 - buttonWidth / 2;

// When start() button is pressed, make health bars visible

// // Add Event Listener to button
// canvas.addEventListener('click', function(event) {
//     const rect = canvas.getBoundingClientRect()
//     const mouseX = event.clientX - rect.left
//     const mouseY = event.clientY - rect.top

//     if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
//         startGame()
//     }
// })

// Define function to draw the start screen
function drawStartScreen() {
    // Add background image
    context.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);

    // Add a title
    context.font = "48px 'Ghost Clan'";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText("CLICK TO START!", canvas.width / 2, canvas.height / 2, 300);

    // Hide HP Bars & Timer

    // // Draw the button
    // context.fillStyle = 'blue'
    // context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

    // context.fillStyle = 'white'
    // context.font = "20px 'Ghost Clan'"
    // context.textAlign= "center"
    // context.fillText("start", buttonX + 50, buttonY + 30, 300)
    canvas.addEventListener("click", startGame);
}

// Define function to start the game
function startGame() {
    canvas.removeEventListener("click", startGame);
    gameStarted = true;
}

/**
* Main Scene
*/

// Add background Image
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/bg.png",
});

const bat = new Sprite({
    position: {
        x: 850,
        y: 100,
    },
    imageSrc: "./img/bat.png",
    scale: 2.5,
    framesMax: 4,
});

// Create Player from Fighter Class
const player = new Fighter({
    position: {
        x: 200,
        y: 100,
    },
    velocity: {
        x: 10,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/Huntress/Sprites/Idle.png",
    framesMax: 8,
    scale: 3.5,
    offset: {
        x: 215,
        y: 200,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Huntress/Sprites/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "./img/Huntress/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Huntress/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Huntress/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Huntress/Sprites/Attack1.png",
            framesMax: 5,
        },
        takeHit: {
            imageSrc: "./img/Huntress/Sprites/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/Huntress/Sprites/Death.png",
            framesMax: 8,
        },
    },
    hitBox: {
        offset: {
            x: 120,
            y: 50,
        },
        width: 100,
        height: 50,
    },
});

// Create Enemy from Fighter Class
const enemy = new Fighter({
    position: {
        x: 775,
        y: 100,
    },
    velocity: {
        x: 10,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: "./img/Samurai/Sprites/Idle.png",
    scale: 3,
    framesMax: 4,
    offset: {
        x: 215,
        y: 240,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Samurai/Sprites/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "./img/Samurai/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Samurai/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Samurai/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Samurai/Sprites/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./img/Samurai/Sprites/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/Samurai/Sprites/Death.png",
            framesMax: 7,
        },
    },
    hitBox: {
        offset: {
            x: -130,
            y: 50,
        },
        width: 100,
        height: 50,
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

if (gameStarted !== false) {
    decreaseTimer();
}

function animate() {
    window.requestAnimationFrame(animate);

    // Start screen if game not started
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    // Otherwise, continue with the game as usual
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.height, canvas.width);
    background.update();
    bat.update();
    context.fillStyle = "rgba(255, 255, 255, 0.15)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    // detect for player collision and enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 3
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to("#enemyHealth", {
            width: enemy.health + "%",
        });
        console.log("Player Attack successful!");
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 3) {
        player.isAttacking = false;
    }

    // detect for enemy collision and player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to("#playerHealth", {
            width: player.health + "%",
        });
        console.log("Enemy Attack successful!");
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 4) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener("keydown", (event) => {
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                break;
            case "w":
                player.velocity.y = -15;
                break;
            case " ":
                player.attack();
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y = -15;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    // player keys
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
    }

    // enemy keys
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
});

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/bg.png'
})


const bat = new Sprite({
    position: {
        x: 850,
        y: 100
    },
    imageSrc: './img/bat.png',
    scale: 2.5,
    framesMax: 4
})

const player = new Fighter({
    position: {
        x: 200,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Huntress/Sprites/Idle.png',
    framesMax: 8,
    scale: 3.5,
    offset: {
        x: 215,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './img/Huntress/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Huntress/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Huntress/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Huntress/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Huntress/Sprites/Attack1.png',
            framesMax: 5
        }
    }
})


const enemy = new Fighter({
    position: {
        x: 775,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Samurai/Sprites/Idle.png',
    scale: 3,
    framesMax: 4,
    offset: {
        x: 215,
        y: 250
    },
    sprites: {
        idle: {
            imageSrc: './img/Samurai/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/Samurai/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Samurai/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Samurai/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Samurai/Sprites/Attack1.png',
            framesMax: 4
        }
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.height, canvas.width)
    background.update()
    bat.update()
    player.update()
    enemy.update()

    player.velocity.x = 0 
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // jumping 
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision
    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
            player.isAttacking
        ) {
        player.isAttacking = false
        enemy.health -= 100
        document.querySelector('#enemyHealth').style.width = enemy.health + '%' 
        console.log('Player Attack successful!')
    }

    if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
            enemy.isAttacking
        ) {
        enemy.isAttacking = false
        player.health -= 100
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('Enemy Attack successful!')
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    // player keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

window.addEventListener

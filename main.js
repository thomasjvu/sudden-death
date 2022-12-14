const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

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
        x: 10,
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
        },
        takeHit: {
            imageSrc: './img/Huntress/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Huntress/Sprites/Death.png',
            framesMax: 8
        }
    },
    hitBox: {
        offset: {
            x: 120,
            y: 50
        },
        width: 100,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
        x: 775,
        y: 100
    },
    velocity: {
        x: 10,
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
        y: 240
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
        },
        takeHit: {
            imageSrc: './img/Samurai/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Samurai/Sprites/Death.png',
            framesMax: 7
        }
    },
    hitBox: {
        offset: {
            x: -130,
            y: 50
        },
        width: 100,
        height: 50
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
    context.fillStyle = 'rgba(255, 255, 255, 0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)
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

    // detect for player collision and enemy gets hit
    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
            player.isAttacking && player.framesCurrent === 3
        ) {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        console.log('Player Attack successful!')
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 3) {
        player.isAttacking = false
    }

    // detect for enemy collision and player gets hit
    if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
            enemy.isAttacking && enemy.framesCurrent === 2 
        ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        console.log('Enemy Attack successful!')
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 4) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
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
            player.velocity.y = -15
            break
        case ' ':
            player.attack()
            break
    }
}
        if(!enemy.dead) {
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -15
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
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

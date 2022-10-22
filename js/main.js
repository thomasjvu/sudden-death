const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


class Fighter {
    constructor({position, velocity, color, offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        // hit box
        if (this.isAttacking) {
            context.fillStyle = 'green'
            context.fillRect(
            this.hitBox.position.x, 
            this.hitBox.position.y, 
            this.hitBox.width, 
            this.hitBox.height
            )
        }
    }

    update() {
        this.draw()
        this.hitBox.position.x = this.position.x + this.hitBox.offset.x
        this.hitBox.position.y = this.position.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
        this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

}

class Sprite {
    constructor({position, velocity, color, offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        // hit box
        if (this.isAttacking) {
            context.fillStyle = 'green'
            context.fillRect(
            this.hitBox.position.x, 
            this.hitBox.position.y, 
            this.hitBox.width, 
            this.hitBox.height
            )
        }
    }

    update() {
        this.draw()
        this.hitBox.position.x = this.position.x + this.hitBox.offset.x
        this.hitBox.position.y = this.position.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
        this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

}


const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'red'
})


const enemy = new Sprite({
    position: {
        x: 400,
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
    color: 'blue'
})


console.log(player)

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


console.log(enemy)

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.hitBox.position.x + rectangle1.hitBox.width >= rectangle2.position.x &&
        rectangle1.hitBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.hitBox.position.y + rectangle1.hitBox.height >= rectangle2.position.y &&
        rectangle1.hitBox.position.y <= rectangle2.position.y + rectangle2.height 
    )
}


function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#score').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#score').innerHTML = 'Draw!'
    } else if (player.health > enemy.health) {
        document.querySelector('#score').innerHTML = 'Player 1 Wins!'
    } else if (player.health < enemy.health) {
        document.querySelector('#score').innerHTML = 'Player 2 Wins!'
    }
}

let timerId
let timer = 60
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#time').innerHTML = timer
    }
    
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.height, canvas.width)
    player.update()
    enemy.update()

    player.velocity.x = 0 
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
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
            player.isAttacking = true
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
            enemy.isAttacking = true
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

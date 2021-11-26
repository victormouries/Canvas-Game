const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity

    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity

    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


class Particle {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity

    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


const cx = canvas.width / 2
const cy = canvas.height / 2

const player = new Player(cx, cy, 10, 'white');

const projectiles = []
const enemies = []
const particles = []


function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (25 - 8) + 8

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(
            cy - y,
            cx - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

let animationID
function animate() {
    animationID = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
    particles.forEach(particle => {
        particle.update()
    });
    projectiles.forEach((projectile, index) => {
        projectile.update()

        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(Index, 1)
            }, 0)
        }
    })

    enemies.forEach((Enemy, index) => {
        Enemy.update()

        const dist = Math.hypot(player.x - Enemy.x, player.y - Enemy.y)

        if (dist - Enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationID)
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - Enemy.x, projectile.y - Enemy.y)

            if (dist - Enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < 8; i++) {
                    particles.push(
                        new Particle(projectile.x, projectile.y, 3, Enemy.color, {
                        x: Math.random() - 0.5, 
                        y: Math.random() - 0.5
                    }))
                }

                if (Enemy.radius - 10 > 5) {
                    gsap.to(Enemy, {
                        radius: Enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }

            }
        });
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - cy,
        event.clientX - cx
    )
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    }
    projectiles.push(
        new Projectile(cx, cy, 5, 'white', velocity))
})

animate()
spawnEnemies()
import herosList from './classesData.js'
import enemiesList from './enemiesData.js'

const actionsLog = document.getElementById('actions-log')
const actionButtonsWrapper = document.getElementById('button-wrapper')
const initialForm = document.getElementById('form-wrapper')
const mainGame = document.getElementById('game-content')
const restartGameButton = document.getElementById('restart-game-button')

class Entity {
    constructor(name, health, attack) {
        this.name = name
        this.health = health
        this.attack = attack
        this.potions = 4
    }

    takeDamage = (damage) => {
        this.health -= damage
    }

    usePotion = () => {
        if (this.potions > 0) {
            this.potions--
            this.health += 5
        }
    }
}

let isPlayerTurn = false
let hero
let enemy

document.getElementById('attack-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleAttack(hero, enemy)
        enemy.health > 0 ? handleEnemyAction() : handleGameOver(hero.name)
    }
})

document.getElementById('use-potion-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleUsePotion(hero)
        handleEnemyAction()
    }
})

document.getElementById('give-up-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        actionsLog.innerHTML += `<p>${hero.name} escolheu ser covarde.</p>`
        handleGameOver('inimigo')
    }
})

const handleAttack = (source, target) => {
    target.takeDamage(source.attack)
    actionsLog.innerHTML += `<p>${source.name} escolheu atacar</p>`
}

const handleUsePotion = (target) => {
    target.usePotion()
    actionsLog.innerHTML += `<p>${target.name} escolheu usar poção. ${target.potions} poções restantes</p>`
}

const handleEnemyAction = () => {
    if (enemy.health <= 0) {
        handleGameOver(hero.name)
    } else if (enemy.health <= 5 || Math.random() > 0.8) {
        handleUsePotion(enemy)
    } else {
        handleAttack(enemy, hero)
    }
    isPlayerTurn = true
    actionsLog.innerHTML += `<p>Vida do herói: ${hero.health}. Vida do inimigo: ${enemy.health}</p>`
}

const handleGameOver = (winner) => {
    isPlayerTurn = false
    actionButtonsWrapper.style.display = 'none'
    restartGameButton.style.display = 'block'
    actionsLog.innerHTML += `<p>${winner} venceu.</p>`
}

restartGameButton.addEventListener('click', () => {
    mainGame.style.display = 'none'
    initialForm.style.display = 'flex'
    document.getElementById('hero-img').innerHTML = `<span class="name" id="hero-name"></span>`
})

document.getElementById('player-form').addEventListener('submit', (event) => {
    event.preventDefault()
    isPlayerTurn = true
    restartGameButton.style.display = 'none'
    actionButtonsWrapper.style.display = 'block'
    initialForm.style.display = 'none'
    mainGame.style.display = 'flex'
    const heroName = document.getElementById('player-name').value

    const character = document.querySelector('input[name="character-selection"]:checked').value

    const randomEnemy = { ...enemiesList[Math.floor(Math.random() * enemiesList.length)] }
    enemy = new Entity(...Object.values(randomEnemy))
    hero = new Entity(heroName, ...Object.values(herosList[character]))

    document.getElementById('hero-name').innerText = hero.name
    document.getElementById('enemy-name').innerText = enemy.name
    const imgWrapper = document.getElementById('hero-img')
    imgWrapper.innerHTML = `<img src="../../assets/heros/${character}.png">` + imgWrapper.innerHTML
    actionsLog.innerHTML = ''
})
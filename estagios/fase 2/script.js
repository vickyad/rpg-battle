const actionsLog = document.getElementById('actions-log')
const actionButtonsWrapper = document.getElementById('button-wrapper')
const initialForm = document.getElementById('form-wrapper')
const mainGame = document.getElementById('game-content')

const herosList = {
    bard: { health: 90, attack: 8 },
    healer: { health: 90, attack: 8 },
    tank: { health: 150, attack: 5 },
    ninja: { health: 50, attack: 16 },
    warrior: { health: 100, attack: 5 },
    mage: { health: 50, attack: 20 }
}

const enemyOriginal = {
    name: 'inimigo',
    health: 65,
    attack: 7,
    potions: 2
}

let isPlayerTurn = false
let hero
let enemy

const attack_button = document.getElementById('attack-button')
attack_button.addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleAttack(hero, enemy)
        enemy.health > 0 ? handleEnemyAction() : handleGameOver(hero.name)
    }
})

const use_potion_button = document.getElementById('use-potion-button')
use_potion_button.addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleUsePotion(hero)
        handleEnemyAction()
    }
})

const give_up_button = document.getElementById('give-up-button')
give_up_button.addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        actionsLog.innerHTML += `<p>${hero.name} escolheu ser covarde.</p>`
        handleGameOver('inimigo')
    }
})

const handleAttack = (source, target) => {
    target.health -= source.attack
    actionsLog.innerHTML += `<p>${source.name} escolheu atacar</p>`
}

const handleUsePotion = (target) => {
    target.health += 10
    target.potions -= 1
    actionsLog.innerHTML += `<p>${target.name} escolheu usar poção. ${target.potions} poções restantes</p>`
}

const handleEnemyAction = () => {
    if (enemy.health <= 0) {
        handleGameOver(hero.name)
    } else if (enemy.potions > 0 && enemy.health <= 5) {
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

const restartGameButton = document.getElementById('restart-game-button')
restartGameButton.addEventListener('click', () => {
    mainGame.style.display = 'none'
    initialForm.style.display = 'flex'
    document.getElementById('hero-img').innerHTML = `<span class="name" id="hero-name"></span>`
})

const playerNameForm = document.getElementById('player-form')
playerNameForm.addEventListener('submit', (event) => {
    event.preventDefault()
    isPlayerTurn = true
    restartGameButton.style.display = 'none'
    actionButtonsWrapper.style.display = 'block'
    initialForm.style.display = 'none'
    mainGame.style.display = 'flex'
    heroName = document.getElementById('player-name').value

    const character = document.querySelector('input[name="character-selection"]:checked').value
    hero = { name: heroName, ...herosList[character] }
    enemy = JSON.parse(JSON.stringify(enemyOriginal))
    document.getElementById('hero-name').innerText = hero.name
    const imgWrapper = document.getElementById('hero-img')
    imgWrapper.innerHTML = `<img src="../../assets/heros/${character}.png">` + imgWrapper.innerHTML
    actionsLog.innerHTML = ''
})
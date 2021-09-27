const actionsLog = document.getElementById('actions-log')
const actionButtonsWrapper = document.getElementById('button-wrapper')
const initialForm = document.getElementById('form-wrapper')
const mainGame = document.getElementById('game-content')

const heroIndex = ['bard', 'healer', 'tank', 'ninja', 'warrior', 'mage']
const herosList = [
    { health: 90, attack: 8, potions: 5 },
    { health: 90, attack: 8, potions: 5 },
    { health: 150, attack: 5, potions: 2 },
    { health: 50, attack: 16, potions: 4 },
    { health: 100, attack: 5, potions: 3 },
    { health: 50, attack: 20, potions: 4 }
]

const enemiesList = [
    { name: 'Icaco, o demônio', health: 65, attack: 7, potions: 2 },
    { name: 'Luis, a caveira', health: 30, attack: 5, potions: 3 },
    { name: 'Wawel, o dragão', health: 40, attack: 15, potions: 5 },
    { name: 'Luhuu, o ogro', health: 100, attack: 4, potions: 2 }
]
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
    } else if (enemy.potions > 0 && (enemy.health <= 5 || Math.random() > 0.8)) {
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

    const character = document.querySelector('input[name="character-selection"]:checked').value;
    hero = { name: heroName, ...herosList[heroIndex.indexOf(character)] }
    enemy = { ...enemiesList[Math.floor(Math.random() * enemiesList.length)] }
    enemy = JSON.parse(JSON.stringify(enemyOriginal))
    document.getElementById('hero-name').innerText = hero.name
    document.getElementById('enemy-name').innerText = enemy.name
    const imgWrapper = document.getElementById('hero-img')
    imgWrapper.innerHTML = `<img src="../../assets/heros/${character}.png">` + imgWrapper.innerHTML
    actionsLog.innerHTML = ''
})
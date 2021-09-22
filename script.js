const actions_log = document.getElementById('actions-log')
const hero_health = document.getElementById('hero-health')
const enemy_health = document.getElementById('enemy-health')

const heroOriginal = {
    name: '',
    health: 90,
    attack: 5,
    potions: 3
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
        hero_health.style.width = `${hero.health / heroOriginal.health * 100}%`
        enemy_health.style.width = `${enemy.health / enemyOriginal.health * 100}%`
        handleAttack(hero, enemy)
        enemy.health > 0 ? handleEnemyAction() : handleGameOver(hero.name)
    }
})

const use_potion_button = document.getElementById('use-potion-button')
use_potion_button.addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        hero_health.style.width = `${hero.health / heroOriginal.health * 100}%`
        enemy_health.style.width = `${enemy.health / enemyOriginal.health * 100}%`
        handleUsePotion(hero)
        handleEnemyAction()
    }
})

const give_up_button = document.getElementById('give-up-button')
give_up_button.addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        actions_log.innerHTML += `<p>${hero.name} escolheu ser covarde.</p>`
        handleGameOver('inimigo')
    }
})

const handleAttack = (source, target) => {
    target.health -= source.attack
    actions_log.innerHTML += `<p>${source.name} escolheu atacar</p>`
}

const handleUsePotion = (target) => {
    target.health += 10
    target.potions -= 1 
    actions_log.innerHTML += `<p>${target.name} escolheu usar poção. ${target.potions} poções restantes</p>`
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
}

const handleGameOver = (winner) => {
    isPlayerTurn = false
    hero_health.style.width = `${hero.health / heroOriginal.health * 100}%`
    enemy_health.style.width = `${enemy.health / enemyOriginal.health * 100}%`
    document.getElementById('button-wrapper').style.display = 'none'
    actions_log.innerHTML += `<p>${winner} venceu.</p>`
}

const playerNameForm = document.getElementById('player-name-form')
playerNameForm.addEventListener('submit', (event) => {
    event.preventDefault()
    isPlayerTurn = true
    document.getElementById('initial-form').style.display = 'none'
    document.getElementById('game-content').style.display = 'flex'
    heroOriginal.name = document.getElementById('player-name').value
    hero = JSON.parse(JSON.stringify(heroOriginal))
    enemy = JSON.parse(JSON.stringify(enemyOriginal))
    document.getElementById('hero-name').innerText = hero.name
    actions_log.innerHTML = ''
})
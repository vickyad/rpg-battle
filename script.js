const actions_log = document.getElementById('actions-log')
const start_game_button = document.getElementById('start-game-button')
const button_wrapper = document.getElementById('button-wrapper')
const attack_button = document.getElementById('attack-button')
const use_potion_button = document.getElementById('use-potion-button')
const give_up_button = document.getElementById('give-up-button')
const hero_health = document.getElementById('hero-health')
const enemy_health = document.getElementById('enemy-health')

let isGameOn = false

const heroOriginal = {
    health: 90,
    attack: 5,
    potions: 3
}

const enemyOriginal = {
    health: 65,
    attack: 7,
    potions: 2
}

let hero
let enemy

start_game_button.addEventListener('click', () => {
    isGameOn = true
    hero = JSON.parse(JSON.stringify(heroOriginal))
    enemy = JSON.parse(JSON.stringify(enemyOriginal))
    actions_log.innerHTML = ''
    button_wrapper.style.display = 'block'
    start_game_button.style.display = 'none'
})

attack_button.addEventListener('click', () => {
    actions_log.innerHTML += '<p>Jogador escolheu atacar</p>'
    handleAttack(hero.attack, enemy)
    enemy_health.style.width = `${enemy.health / enemyOriginal.health * 100}%`
    console.log(`vida do jogador: ${hero.health} // vida do inimigo: ${enemy.health}`)
    enemy.health > 0 ? handleEnemyAction() : handleGameOver('herói')
})

use_potion_button.addEventListener('click', () => {
    actions_log.innerHTML += `<p>Jogador escolheu usar poção. ${hero.potions} poções restantes</p>`
    handleUsePotion(hero)
    hero_health.style.width = `${hero.health / heroOriginal.health * 100}%`
    console.log(`vida do jogador: ${hero.health} // poções do jogador: ${hero.potions}`)
    handleEnemyAction()
})

give_up_button.addEventListener('click', () => {
    actions_log.innerHTML += `<p>Jogador escolheu ser covarde.</p>`
    handleGameOver('inimigo')
})

const handleAttack = (damage, target) => {
    target.health -= damage
}

const handleUsePotion = (target) => {
    target.health += 10
    target.potions -= 1 
}

const handleEnemyAction = () => {
    if (enemy.health <= 0) {
        handleGameOver('heroi')
    } else if (enemy.health <= 5 && enemy.potions > 0) {
        actions_log.innerHTML += `<p>Inimigo escolheu usar poção. ${enemy.potions} poções restantes</p>`
        enemy_health.style.width = `${enemy.health / enemyOriginal.health * 100}%`
        handleUsePotion(enemy)
    } else {
        actions_log.innerHTML += '<p>Inimigo escolheu atacar</p>'
        hero_health.style.width = `${hero.health / heroOriginal.health * 100}%`
        handleAttack(enemy.attack, hero)
    }
}

const handleGameOver = (winner) => {
    isGameOn = false
    button_wrapper.style.display = 'none'
    start_game_button.style.display = 'block'
    actions_log.innerHTML += `<p>${winner} venceu.</p>`
}
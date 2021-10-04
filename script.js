import enemiesList from './enemiesData.js'

/* DOM Elements */
const restartGameButton = document.getElementById('restart-game-button')
const actionsLog = document.getElementById('actions-log')
const actionButtonsWrapperStyle = document.getElementById('button-wrapper').style
const initialFormStyle = document.getElementById('form-wrapper').style
const mainGameStyle = document.getElementById('game-content').style
const characterInfoWrapper = document.getElementById('hero-img')
const enemyInfoWrapper = document.getElementById('enemy-wrapper')
const enemyName = document.getElementById('enemy-name')

/* Randomize enemies order */
let enemyOrder

/* Control variables */
let isPlayerTurn = false
let hero
let currentEnemy

const pokemonList = ['audino', 'aromatisse', 'blissey', 'kyurem', 'carbink', 'rayquaza']
const pokemonData = []

for (let i = 0; i < pokemonList.length; i++) {
    let myRequest = new Request(`https://pokeapi.co/api/v2/pokemon/${pokemonList[i]}/`)
    let pokemonInfoObject
    await fetch(myRequest)
        .then(response => response.json())
        .then(info => {
            pokemonInfoObject = { health: info.stats[0].base_stat * 6, attack: info.stats[1].base_stat }
        })
    pokemonData.push(pokemonInfoObject)
}

const herosList = {
    bard: { ...pokemonData[0] },
    healer: { ...pokemonData[1] },
    tank: { ...pokemonData[2] },
    ninja: { ...pokemonData[3] },
    warrior: { ...pokemonData[4] },
    mage: { ...pokemonData[5] }
}

class Entity {
    constructor(name, health, attack) {
        this.name = name
        this.health = health
        this.maxHealth = health
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

    restoreHealth = () => {
        this.health = this.maxHealth
    }
}

window.onbeforeunload = () => {
    const heroSave = JSON.parse(localStorage.getItem('heroInfo'))
    heroSave.health = hero.health
    heroSave.potions = hero.potions
    localStorage.setItem('heroInfo', JSON.stringify(heroSave))

    return null
}

const handleAttack = (source, target) => {
    target.takeDamage(source.attack)
    actionsLog.innerHTML += `<p>${source.name} escolheu atacar</p>`
}

const handleUsePotion = (target) => {
    target.usePotion()
    actionsLog.innerHTML += `<p>${target.name} escolheu usar poção. ${target.potions} poções restantes</p>`
}

const handleGameOver = (winner) => {
    isPlayerTurn = false
    actionButtonsWrapperStyle.display = 'none'
    restartGameButton.style.display = 'block'
    actionsLog.innerHTML += `<p>${winner} venceu.</p>`
}

const makeEnemyMove = () => {
    if (hero.health <= 0) {
        return handleGameOver(currentEnemy.name)
    }

    if (currentEnemy.health <= 0) {
        return getNextEnemy()
    }

    if (currentEnemy.health <= 5 || Math.random() > 0.8) {
        handleUsePotion(currentEnemy)
    } else {
        handleAttack(currentEnemy, hero)
    }
    isPlayerTurn = true
    actionsLog.innerHTML += `<p>Vida do herói: ${hero.health}. Vida do inimigo: ${currentEnemy.health}</p>`
}

const getNextEnemy = () => {
    if (enemyOrder.length === 0) {
        handleGameOver(hero.name)
    } else {
        actionsLog.innerHTML += `<p>${currentEnemy.name} derrotado.</p>`
        hero.restoreHealth()
        saveEnemiesOnLocalStorage()
        const enemyObject = enemyOrder.pop(0)
        currentEnemy = new Entity(enemyObject.name, enemyObject.health, enemyObject.attack)
        enemyInfoWrapper.innerHTML = `<img src="../../assets/enemies/${enemyObject.url}"><span class="name" id="enemy-name">${currentEnemy.name}</span>`
        actionsLog.innerHTML += `<p>A vida de ${hero.name} foi restaurada</p><p>${currentEnemy.name} é o próximo.</p>`
    }
    isPlayerTurn = true
}

const saveEnemiesOnLocalStorage = () => {
    const namesArray = []
    enemyOrder.forEach((item) => {
        namesArray.push(item.name)
    })
    localStorage.setItem('enemiesPending', JSON.stringify(namesArray))
}

const getEnemiesToBattle = (enemiesName) => {
    const updatedList = []
    enemiesName.forEach((name) => {
        const found = enemiesList.find(element => element.name === name)
        if (found) {
            updatedList.push(found)
        }
    })
    return updatedList
}

const startGame = (heroName, heroClass, heroHealth, heroAttack, heroPotions, newGame) => {
    isPlayerTurn = true

    /* Set displays */
    restartGameButton.style.display = 'none'
    actionButtonsWrapperStyle.display = 'block'
    initialFormStyle.display = 'none'
    mainGameStyle.display = 'flex'

    /* Get and set enemy */
    let battleHistory = JSON.parse(localStorage.getItem('enemiesPending'))
    if (!battleHistory || newGame) {
        enemyOrder = enemiesList.sort(() => Math.random() - 0.5)
        saveEnemiesOnLocalStorage()
    } else {
        enemyOrder = getEnemiesToBattle(battleHistory)
    }
    const enemyObject = enemyOrder.pop(0)
    currentEnemy = new Entity(enemyObject.name, enemyObject.health, enemyObject.attack)
    enemyInfoWrapper.innerHTML = `<img src="../../assets/enemies/${enemyObject.url}"><span class="name" id="enemy-name">${currentEnemy.name}</span>`

    /* Set hero */
    hero = new Entity(heroName, heroHealth, heroAttack)
    if (newGame) {
        localStorage.setItem('heroInfo', JSON.stringify({ name: heroName, class: heroClass, health: heroHealth, attack: heroAttack, potions: hero.potions }))
    } else {
        hero.potions = heroPotions
    }
    characterInfoWrapper.innerHTML = `<img src="../../assets/heros/${heroClass}.png">` + characterInfoWrapper.innerHTML
    document.getElementById('hero-name').innerText = hero.name

    /* Clean log */
    actionsLog.innerHTML = ''
}

restartGameButton.addEventListener('click', () => {
    mainGameStyle.display = 'none'
    initialFormStyle.display = 'flex'
    characterInfoWrapper.innerHTML = `<span class="name" id="hero-name"></span>`
})

document.getElementById('attack-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleAttack(hero, currentEnemy)
        makeEnemyMove()
    }
})

document.getElementById('use-potion-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        handleUsePotion(hero)
        makeEnemyMove()
    }
})

document.getElementById('give-up-button').addEventListener('click', () => {
    if (isPlayerTurn) {
        isPlayerTurn = false
        actionsLog.innerHTML += `<p>${hero.name} escolheu ser covarde.</p>`
        handleGameOver(currentEnemy.name)
    }
})

document.getElementById('player-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const heroName = document.getElementById('player-name').value
    const heroClass = document.querySelector('input[name="character-selection"]:checked').value
    const heroStats = herosList[heroClass]

    startGame(heroName, heroClass, ...Object.values(heroStats), true)
})


let heroInfo = JSON.parse(localStorage.getItem('heroInfo'))
if (heroInfo) {
    if (confirm("Um jogo em andamento foi encontrado. Deseja continuar o jogo anterior?")) {
        startGame(...Object.values(heroInfo), false)
    }
}

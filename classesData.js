const pokemonList = ['audino', 'aromatisse', 'blissey', 'kyurem', 'carbink', 'rayquaza']
let herosList = {}

async function getInfo() {
    const responses = pokemonList.map((pokemon) => {
        const myRequest = new Request(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
        fetch(myRequest)
            .then(response => response.json())
            .then(info => {
                console.log(info)
                return { health: info.stats[0].base_stat * 6, attack: info.stats[1].base_stat }
            })
    })
    console.log(responses)
    /* 
    []
    0: {health: 618, attack: 60}
    1: {health: 606, attack: 72}
    2: {health: 1530, attack: 10}
    3: {health: 750, attack: 130}
    4: {health: 300, attack: 50}
    5: {health: 630, attack: 150}
    */
    return responses
}

const init = () => {
    const statsData = getInfo() // se eu ponho const statsData = await getInfo() ele dá o erro Uncaught SyntaxError: Unexpected reserved word
    herosList = {
        bard: { ...statsData[0] },
        healer: { ...statsData[1] },
        tank: { ...statsData[2] },
        ninja: { ...statsData[3] },
        warrior: { ...statsData[4] },
        mage: { ...statsData[5] }
    }
    console.log(herosList) // aqui ele imprime um objeto com objetos vazios
}
init()
export default herosList


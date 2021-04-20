document.addEventListener('DOMContentLoaded', () => {
    fetchAll()
    .then(f = ()  => {document.getElementById('main-loading').remove()})
    .then(f = async() => listSort(pokemon_list, "Numeric"))
    .then(f = async() => allTemplates(pokemon_list))
})

const POKEMON_KANTO = 151
const pokemon_list = []
const search = document.getElementById("search-input")

const listSort = (list, sortingBy) => {
    switch (sortingBy) {
        case "Alphabetic":
            list.sort((a, b) => (a.name > b.name) ? 1 : -1)
            break;
        case "ReverseAlphabetic":
            list.sort((a, b) => (a.name > b.name) ? -1 : 1)
            break;
        case "Numeric":
            list.sort((a, b) => a.id - b.id)
            break;
        case "ReverseNumeric":
            list.sort((a, b) => b.id - a.id)
    }
}

var countLoading = setInterval(() => {
    if (pokemon_list.length < 151) {
        document.getElementById('main-loading').innerHTML = `Cargando! ${pokemon_list.length}/151`
    } else (clearInterval(countLoading))
}, 25)

async function fetchAll() {
    for (let id=1; id<POKEMON_KANTO+1; id++) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            const data = await response.json()

            const pokemon = {
                name: data.name,
                id: data.id,
                type1: data.types[0].type.name,
                type2: data.types[1].type.name,                
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${data.id}.png`,
            }
            pokemon_list.push(pokemon)
        } catch (error) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            const data = await response.json()

            const pokemon = {
                name: data.name,
                id: data.id,
                type1: data.types[0].type.name,
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${data.id}.png`,
            }
            pokemon_list.push(pokemon)
        }
    }
}

const allTemplates = (list) => {
    list.forEach(pokemon => renderTemplate(pokemon))
}

const idParse = (id) => {
    switch (`${id}`.length) {
        case 1:
            return "00"+ id;
        case 2:
            return "0"+ id;
        case 3:
            return id;
    }
}

const renderTemplate = (pokemon) => {
    const flex = document.querySelector('.flex')
    const template = document.getElementById('pokemon-card').content
    const clone = template.cloneNode(true)
    const fragment = document.createDocumentFragment()

    clone.querySelector('.card-body-img').setAttribute('src', pokemon.img)
    clone.querySelector('.card-body-title').innerHTML = `${pokemon.name}`
    clone.querySelector('.card-body-number').innerHTML = `No. ${idParse(pokemon.id)}`
    clone.querySelectorAll('.card-footer h3')[0].textContent = pokemon.type1.toUpperCase()
    if(pokemon.type2) {
        clone.querySelectorAll('.card-footer h3')[1].textContent = pokemon.type2.toUpperCase()
    }
    
    fragment.appendChild(clone)
    flex.appendChild(fragment) 
}
const eraseTemplates = () => {
    const templateContainer = document.querySelector('.flex')
    templateContainer.innerHTML = "";
}
const searchValue = () => {
    const pokemon_search = []
    const searchIndex = search.value.length
    for (pokemon of pokemon_list) {
        if (pokemon.name.substr(0, searchIndex) === search.value.toLowerCase()){
            pokemon_search.push(pokemon)
        }
    }
    searchBarUnderline(searchIndex+1)
    eraseTemplates()
    allTemplates(pokemon_search)
}
const searchBarUnderline = (letters) => {
    for (i = 1; i <11; i++) {
        downSearchBarUnderline(i)
    }
    toggleSearchBarUnderline(letters)
}
const downSearchBarUnderline = (space) => {
        document.querySelector(`#search-bar-underline-${space}`).classList.remove("underline-top")
        document.querySelector(`#search-bar-underline-${space}`).classList.add("underline-down")
}
const toggleSearchBarUnderline = (space) => {
    document.querySelector(`#search-bar-underline-${space}`).classList.toggle("underline-down")
    document.querySelector(`#search-bar-underline-${space}`).classList.toggle("underline-top")
}
// const pokemonClickId = () => {

// }

document.getElementById("search-input").addEventListener("focus", () => toggleSearchBarUnderline(search.value.length+1))
document.getElementById("search-input").addEventListener("blur", () => toggleSearchBarUnderline(search.value.length+1))
document.getElementById("search-input").addEventListener("input", () => searchValue())
// document.getElementById("pokemon-click").addEventListener("click", (x) => console.log(x.path[0].innerHTML))

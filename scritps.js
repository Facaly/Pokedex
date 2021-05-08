document.addEventListener('DOMContentLoaded', () => {
	fetchAll()
	.then(f = ()  => {document.getElementById('main-loading').remove()})
	.then(f = async() => listSort(pokemon_list, "numeric"))
	.then(f = async() => allTemplates(pokemon_list))
	.then(f = async() => addEvents())
})

const POKEMON_KANTO = 151
const pokemon_list = []
var pokemon_filter = pokemon_list
const search = document.getElementById("search-input")

var countLoading = setInterval(() => {
	if (pokemon_list.length < 151) {
		document.getElementById('main-loading').innerHTML = `Cargando! ${pokemon_list.length}/151`
	} else (clearInterval(countLoading))
}, 25)

const listSort = (list, sortingBy) => {
	switch (sortingBy) {
		case "numeric":
			list.sort((a, b) => a.id - b.id)
			break;
		case "reverseNumeric":
			list.sort((a, b) => b.id - a.id)
			break;
		case "alphabetic":
			list.sort((a, b) => (a.name > b.name) ? 1 : -1)
			break;
		case "reverseAlphabetic":
			list.sort((a, b) => (a.name > b.name) ? -1 : 1)
			break;
	}
}

const listFilter = (list, filterBy) => {
	pokemon_filter = []
	if (filterBy != "none") {
		for (pokemon of list) {
			if (pokemon.type1 === filterBy || pokemon.type2 === filterBy)
			pokemon_filter.push(pokemon)
		}
		eraseTemplates()
		allTemplates(pokemon_filter)
	} else {
		pokemon_filter = pokemon_list
		listSort(pokemon_filter)
		eraseTemplates()
		allTemplates(pokemon_list)
	}
}

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

	clone.querySelector('.card').setAttribute('id', `${pokemon.name}`)
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
const searchValue = (list) => {
	const pokemon_search = []
	const searchIndex = search.value.length
	for (pokemon of list) {
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
const downSearchBarUnderline = (letterQuant) => {
		document.querySelector(`#search-bar-underline-${letterQuant}`).classList.remove("underline-top")
		document.querySelector(`#search-bar-underline-${letterQuant}`).classList.add("underline-down")
}
const toggleSearchBarUnderline = (letterQuant) => {
	document.querySelector(`#search-bar-underline-${letterQuant}`).classList.toggle("underline-down")
	document.querySelector(`#search-bar-underline-${letterQuant}`).classList.toggle("underline-top")
	closeOtherMenu('search-bar-sort-menu')
	closeOtherMenu('search-bar-filter-menu')
}
const toggleMenu = (menu, otherMenu) => {
	document.getElementById(menu).classList.toggle("hidden")
	document.getElementById(menu).classList.toggle("border-menu")
	closeOtherMenu(otherMenu)
}

const closeOtherMenu = (menu) => {
	if (!document.getElementById(menu).classList.contains('hidden')) {	
		document.getElementById(menu).classList.toggle("hidden")
		document.getElementById(menu).classList.toggle("border-menu")
	}
}

const pickOptionMenu = (button, option) => {
	document.getElementById(button).childNodes[0].textContent = option.target.innerHTML
	switch (button) {
		case 'search-bar-sort-button':
			listSort(pokemon_list, option.path[0].getAttribute('id'))
			listSort(pokemon_filter, option.path[0].getAttribute('id'))
			eraseTemplates()
			allTemplates(pokemon_filter)
			break;
		case 'search-bar-filter-button':
			listFilter(pokemon_list, option.path[0].getAttribute('id'))
			break;
	}
}

const addEvents = () => {
	document.getElementById("search-input").addEventListener("focus", () => toggleSearchBarUnderline(search.value.length+1))
	document.getElementById("search-input").addEventListener("blur", () => toggleSearchBarUnderline(search.value.length+1))
	document.getElementById("search-input").addEventListener("input", () => searchValue(pokemon_filter))
	document.getElementById('search-bar-sort-button').addEventListener("click", () => toggleMenu('search-bar-sort-menu','search-bar-filter-menu'))
	document.getElementById('search-bar-filter-button').addEventListener("click", () => toggleMenu('search-bar-filter-menu','search-bar-sort-menu'))
	document.getElementById('search-bar-sort-options').addEventListener("click", (x) => pickOptionMenu('search-bar-sort-button', x))
	document.getElementById('search-bar-filter-options').addEventListener("click", (x) => pickOptionMenu('search-bar-filter-button', x))

	document.getElementById("pokemon-click").addEventListener("click", (x) => console.log(x))

}

// Nickname dinâmico

capyNameElement = window.document.getElementById('name')
var capyName = window.prompt('Escolha um nome para a sua capivara:')
if (capyNameElement === null || capyName === null || capyName === "") {
    capyName = 'Name'
}
capyNameElement.innerHTML = `<p><strong>${capyName}</strong></p>`

// Registrar cliques

capivara = document.querySelector('#capy')
const updateScore = capivaras => {
    const title = document.querySelector('title')
    const score = document.querySelector("#score span")

    score.innerText = capivaras;
    title.innerHTML = capivaras + " cookies - Cookie"

    localStorage.setItem("capivaras", capivaras)
}

const getStorage = () => {
    const capivaras = localStorage.getItem("capivaras") || 0;
    const powerups = JSON.parse(localStorage.getItem("powerups")) || [];

    const storage = {
        "capivaras": capivaras,
        "powerups": powerups
    }

    return storage;
}

const capyClicked = capivaras => {
    const storage = getStorage()

    const score = document.querySelector("#score span")
    const scoreValue = capivaras ? capivaras : parseInt(score.innerText)

    let newScore;

    newScore = scoreValue + 1;

    updateScore(newScore);
}

capivara.addEventListener("click", () => {
    capyClicked()
})


// PAREI NO VIDEO EM 11:12 https://www.youtube.com/watch?v=yYJ7lWhW7oA&t=644s


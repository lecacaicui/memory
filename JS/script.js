const board = document.getElementById("grille_memo");
const restartBtn = document.getElementById("restart-btn");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");

let dimension = 150;
let brawlerIds2 = Array.from({ length: 111 }, (_, i) => 16000000 + i); // ids des brawleurs codés en dur

let brawlerIds = brawlerIds2.filter(element => element !== 16000033 && element !== 16000055);

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;
let seconds = 0;
let timerInterval = null;

function genererCartes() {    // la fonction generer cartes a été adapté (on va utiliser un api pour d'autres images (du jeu brawlstars ici(les ids sont codés en dur car je n'arrivais pas a faire autrement)))
    let maxStart = brawlerIds.length - 8;
    let imgStart = Math.floor(Math.random() * maxStart);

    const images = [];
    for (let i = imgStart; i < imgStart + 8; i++) {
        images.push(`https://cdn.brawlify.com/brawlers/borderless/${brawlerIds[i]}.png`);
    }
    cards = [...images, ...images];
}

async function initGame() {

    board.innerHTML = "";
    genererCartes();

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedCount = 0;

    seconds = 0;
    resultDisplay.textContent = "";
    timerDisplay.textContent = "Temps : 00:00";
    movesDisplay.textContent = "Coups : 0";

    clearInterval(timerInterval);
    startTimer();

    shuffle(cards);

    cards.forEach(url => {
        const card = document.createElement("div");

        card.classList.add("card")
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.dataset.value = url;
        board.appendChild(card);


        card.addEventListener("click", () => handleCardClick(card));


    });



}

function handleCardClick(card) {

    if (lockBoard == true || card.classList.contains("matched") || firstCard == card || card.firstChild) {
        return;
    }
    revealCard(card);

    if (firstCard == null) {
        firstCard = card;
        return;
    } else {
        secondCard = card;
        lockBoard = true;
        moves++;
        movesDisplay.textContent = `Coups : ${moves}`;
        checkMatch();

    }


}


function checkMatch() {

    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.style.borderColor = "green"; // pour valider si vrai ( visuel )
        secondCard.style.borderColor = "green";

        matchedCount += 2;
        resetTurn();
        checkVictory();
        
    } else {
        firstCard.style.borderColor = "red";
        secondCard.style.borderColor = "red";
        setTimeout(() => {
            
            firstCard.innerHTML = "";
            secondCard.innerHTML = "";
            firstCard.style.borderColor = "black";
            secondCard.style.borderColor = "black";
            resetTurn();
        }, 800);
        
    }

}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function formatTime(sec) {
    const min = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return min + ':' + s;
}

function revealCard(card) {
    const img = document.createElement("img");
    img.src = card.dataset.value;
    img.alt = "Image memory";
    card.appendChild(img);

    
}

function startTimer() {

    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Temps : ${formatTime(seconds)}`;
    }, 1000);

}

function checkVictory() {
    if (matchedCount === cards.length) {
        clearInterval(timerInterval);
        resultDisplay.textContent = `Victoire ! Coups : ${moves} | Temps : ${formatTime(seconds)}`;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function renderGrid() {
    const grille = document.getElementById("grille_memo");
    grille.innerHTML = "";

    shuffle(cards);

    cards.forEach(url => {
        const img = document.createElement("div");
        img.src = url;
        img.width = dimension;
        img.height = dimension;
        grille.appendChild(img);
    });
}

initGame();
restartBtn.addEventListener("click", initGame);
console.table(cards);

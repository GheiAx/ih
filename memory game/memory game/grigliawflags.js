let gameGrid = document.querySelector('.game-grid');
let gameActive = true;
let images = ['immagini/1.jpg', 'immagini/2.jpg', 'immagini/3.jpg', 'immagini/4.jpg', 'immagini/5.jpg', 'immagini/6.jpg', 'immagini/7.jpg', 'immagini/8.jpg', 'immagini/9.jpg', 'immagini/10.jpg', 'immagini/11.jpg', 'immagini/12.jpg', 'immagini/13.jpg', 'immagini/14.jpg', 'immagini/15.jpg', 'immagini/16.jpg', 'immagini/17.jpg', 'immagini/0.jpg'];
let imagePairs = images.concat(images);
for (let i = imagePairs.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [imagePairs[i], imagePairs[j]] = [imagePairs[j], imagePairs[i]];
}
let countdown = 3;

function updateCountdown() {
    let countdownDisplay = document.querySelector('.countdown-display');
    countdownDisplay.textContent = countdown;
    countdown--;
    if (countdown < 0) {
        clearInterval(intervalId);
        countdownDisplay.classList.add('hidden');
        startGame();
    }
}

function startGame() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.addEventListener('click', cardClickHandler);
    });
    let images = document.querySelectorAll('.symbol');
    images.forEach(function(image) {
        image.style.visibility = 'hidden';
    });
}

function cardClickHandler() {
    if (!gameActive) return;
    document.getElementById('audio-card').play();
    let index = parseInt(this.dataset.index);
    let image = imagePairs[index];
    let imageElement = this.querySelector('.symbol');

    if (this.classList.contains('matched')) {
        return;
    }

    imageElement.style.visibility = 'visible';

    if (previousClickedCard) {
        if (image === previousImage) {
            playerScore++;
            document.getElementById('player-score').textContent = playerScore;
            this.classList.add('matched');
            previousClickedCard.classList.add('matched');

            document.getElementById('audio-correct').play();

            previousClickedCard = null;
            previousImage = null;
        } else {
            let currentCard = this;
            let prevCard = previousClickedCard;
            gameActive = false;

            setTimeout(function() {
                imageElement.style.visibility = 'hidden';
                let prevImageElement = prevCard.querySelector('.symbol');
                prevImageElement.style.visibility = 'hidden';
                currentCard.classList.remove('selected');
                prevCard.classList.remove('selected');
                previousClickedCard = null;
                previousImage = null;
                gameActive = true;
            }, 1000);

            document.getElementById('audio-wrong').play();

            setTimeout(cpuChooseCards, 1000);
        }
    } else {
        previousClickedCard = this;
        previousImage = image;
        this.classList.add('selected');
    }
}

function disableCardClicks() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.removeEventListener('click', cardClickHandler);
    });
}

function enableCardClicks() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.addEventListener('click', cardClickHandler);
    });
}

function cpuChooseCards() {
    disableCardClicks();

    let unmatchedCards = document.querySelectorAll('.card:not(.matched)');
    let randomIndexes = [];

    while (randomIndexes.length < 2) {
        let randomIndex = Math.floor(Math.random() * unmatchedCards.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    let card1 = unmatchedCards[randomIndexes[0]];
    let card2 = unmatchedCards[randomIndexes[1]];

    let image1 = imagePairs[parseInt(card1.dataset.index)];
    let image2 = imagePairs[parseInt(card2.dataset.index)];

    card1.querySelector('.symbol').style.visibility = 'visible';
    card2.querySelector('.symbol').style.visibility = 'visible';

    if (image1 === image2) {
        cpuScore++;
        document.getElementById('cpu-score').textContent = cpuScore;

        card1.classList.add('matched');
        card2.classList.add('matched');

        let allMatched = document.querySelectorAll('.card:not(.matched)').length === 0;
        if (allMatched) {
            checkGameResult();
        } else {
            setTimeout(cpuChooseCards, 1000); 
        }
    } else {
        setTimeout(function() {
            card1.querySelector('.symbol').style.visibility = 'hidden';
            card2.querySelector('.symbol').style.visibility = 'hidden';
            enableCardClicks();
        }, 3000);
    }
}

for (let i = 0; i < 6; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < 6; j++) {
        let card = document.createElement('div');
        card.classList.add('card');
        let index = i * 6 + j;
        let image = document.createElement('img');
        image.classList.add('symbol');
        image.src = imagePairs[index];
        card.appendChild(image);
        card.dataset.index = index;
        row.appendChild(card);
    }
    gameGrid.appendChild(row);
}

let intervalId = setInterval(function() {
    updateCountdown();
    document.getElementById('audio-base').play();
}, 1000);

let playerScore = 0;
let cpuScore = 0;
let lastClickedImage = null;

let previousClickedCard = null;
let previousImage = null;
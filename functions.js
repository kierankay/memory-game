var suits = ['<span class="red">&hearts;</span>', '<span class="red">&diams;</span>', '<span class="black">&clubs;</span>', '<span class="black">&spades;</span>'];
var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
var cardBackURL = 'card-back.png'
var deck = [];
var playingCards = [];
var difficulty; 
var matchedCards = [];
var cardCount;
var correctCount = 0;
var score = 0;
var cardsArea = document.getElementById('cards-area');
var startButton = document.getElementById('start');
var scoreArea = document.getElementById('score');
var highScoreArea = document.getElementById('highscore');
document.addEventListener('DOMContentLoaded', function () {
    if (window.localStorage.getItem('difficulty') === null) {
        difficulty = 6;
    } else {
        difficulty = window.localStorage.getItem('difficulty');
    }
    highScoreArea.innerHTML = window.localStorage.getItem('highscore');
    document.getElementById('diffselector').value = difficulty;
    initializeGame();
});

function createCard(playingCards) {
    var cardHead = document.createElement('h2');
    var cardBody = document.createElement('div');
    var cardContainer = document.createElement('div');
    var cardArea = document.createElement('div');
    var cardTopNum = document.createElement('span');
    var cardBotNum = document.createElement('span');
    var cardGraphic = document.createElement('span');
    var backGraphic = document.createElement('img');
    cardTopNum.innerHTML = playingCards[0][0][0];
    cardBotNum.innerHTML = playingCards[0][0][0];
    cardGraphic.innerHTML = playingCards[0][0][1];
    backGraphic.setAttribute('src',cardBackURL);
    if (cardGraphic.firstChild.classList.contains('red')) {
        cardTopNum.classList.add('red');
        cardBotNum.classList.add('red');
    } else {
        cardTopNum.classList.add('black');
        cardBotNum.classList.add('black');
    }
    cardHead.appendChild(cardTopNum);
    cardHead.appendChild(cardGraphic);
    cardHead.appendChild(cardBotNum);
    cardTopNum.classList.add('cardtopnum');
    cardBotNum.classList.add('cardbotnum');
    cardGraphic.classList.add('frontgraphic');
    backGraphic.classList.add('backgraphic');
    cardHead.classList.add('card-head', 'hide');
    cardBody.classList.add('card-body');
    cardBody.appendChild(cardHead);
    cardBody.appendChild(backGraphic);
    cardContainer.appendChild(cardBody);
    cardContainer.classList.add('card', 'text-center', 'hide');
    cardContainer.addEventListener('click', function () {
        if (matchedCards.length === 0) {
            revealCard(cardContainer);
            addToPair(cardContainer);
        } else if (matchedCards.length === 1) {
            revealCard(cardContainer);
            addToPair(cardContainer);
            checkPair();
        }
    });
    cardArea.appendChild(cardContainer);
    cardArea.classList.add('col-lg-2', 'col-md-3', 'col-sm-4', 'col-5');

    return cardArea;
}

function revealCard(card) {
    card.firstChild.firstChild.classList.remove('hide');
    card.classList.remove('hide');
}

function hideCard(card) {
    card.firstChild.firstChild.classList.add('hide');
    card.classList.add('hide');
}

function addToPair(card) {
    matchedCards.push(card);
}

function checkPair() {
    if (matchedCards[0].firstChild.firstChild.innerHTML === matchedCards[1].firstChild.firstChild.innerHTML) {
        matchedCards.length = 0;
        correctCount += 2;
        if (correctCount === cardCount) {
            cacheScore();
            alertWon();
        }
    } else {
        setTimeout(function () {
            hideCard(matchedCards[0]);
            hideCard(matchedCards[1]);
            matchedCards.length = 0;
            score++;
            scoreArea.innerHTML = score;
        }, 1000);
    }
}

function cacheScore() {
    if (window.localStorage.getItem('highscore') > score || window.localStorage.getItem('highscore') === null) {
        window.localStorage.setItem('highscore', score);
        highScoreArea.innerHTML = score;
    }
}

function alertWon() {
    alert('YOU WON IN ' + score + ' GUESSES!')
}

function initializeGame() {
        // reset score to 0 and add highest score to local storage
        correctCount = 0;
        score = 0;
        scoreArea.innerHTML = score;
        highScoreArea.innerHTML = window.localStorage.getItem('highscore');
    
        // clear card area
        for (var i = 0, len = cardsArea.childNodes.length; i < len; i++) {
            cardsArea.removeChild(cardsArea.childNodes[0]);
        }
    
        // populate deck
        for (var i = 0; i < suits.length; i++) {
            for (var j = 0; j < values.length; j++) {
                deck.push([values[j], suits[i]]);
            }
        }

        // get difficulty
        window.localStorage.setItem('difficulty', document.getElementById('diffselector').value);
        difficulty = window.localStorage.getItem('difficulty');

        // draw cards based on selected difficulty
        for (var i = 0 ; i < difficulty; i++) {
            playingCards.push(deck.splice(Math.floor(Math.random() * deck.length), 1))
        }
        playingCards = playingCards.concat(playingCards);
        cardCount = playingCards.length;
    
        // randomly place cards
        while (playingCards.length > 0) {
            var card = playingCards.splice(Math.floor(Math.random() * playingCards.length), 1)
            cardsArea.appendChild(createCard(card));
        }
}

startButton.addEventListener('click', function () {
    initializeGame();
});
var suits = ['<span class="red">&hearts;</span>', '<span class="red">&diams;</span>', '<span class="black">&clubs;</span>', '<span class="black">&spades;</span>'];
var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var cardBackURL = 'card-back.png'
var deck = [];
var cardsInPlay = [];
var flippedPair = [];
var cardsInPlayCount;
var difficulty; 
var guessedCorrect = 0;
var score = 0;
var highScores; 
var cardsArea = document.getElementById('cards-area');
var startButton = document.getElementById('start');
var scoreArea = document.getElementById('score');
var highScoreArea = document.getElementById('highscore');

document.addEventListener('DOMContentLoaded', function () {

    // get initial difficulty
    if (window.localStorage.getItem('difficulty') === null) {
        difficulty = 6;
    } else {
        difficulty = window.localStorage.getItem('difficulty');
    }

    // get initial high scores object
    if (window.localStorage.getItem('highscores') === null) {
        highScores = {
            '3': null,
            '6': null,
            '9': null,
            '12': null,
            '15': null,
            '27': null
        }
    } else {
        highScores = JSON.parse(window.localStorage.getItem('highscores'));
    }

    // set displayed high score based on high score and difficulty
    highScoreArea.innerHTML = highScores['' + difficulty];

    // set displayed difficulty selector value basd on difficulty
    document.getElementById('diffselector').value = difficulty;
    initializeGame();
});

function setHighScore() {
    if (highScores['' + difficulty] === null || highScores['' + difficulty] > score) {
        highScores['' + difficulty] = score;
        window.localStorage.setItem('highscores', JSON.stringify(highScores));
        highScoreArea.innerHTML = score;
    }
}

function createCard(cardsInPlay) {
    var cardHead = document.createElement('h2');
    var cardBody = document.createElement('div');
    var cardContainer = document.createElement('div');
    var cardArea = document.createElement('div');
    var cardTopNum = document.createElement('span');
    var cardBotNum = document.createElement('span');
    var cardGraphic = document.createElement('span');
    var backGraphic = document.createElement('img');
    cardTopNum.innerHTML = cardsInPlay[0][0];
    cardBotNum.innerHTML = cardsInPlay[0][0];
    cardGraphic.innerHTML = cardsInPlay[0][1];
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
        if (flippedPair.length === 0) {
            revealCard(cardContainer);
            addToPair(cardContainer);
        } else if (flippedPair.length === 1) {
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
    flippedPair.push(card);
}

function checkPair() {
    if (flippedPair[0].firstChild.firstChild.innerHTML === flippedPair[1].firstChild.firstChild.innerHTML) {
        flippedPair.length = 0;
        guessedCorrect += 2;
        console.log('found pair!')
        if (guessedCorrect === cardCount) {
            setHighScore();
            alertWon();
        }
    } else {
        setTimeout(function () {
            hideCard(flippedPair[0]);
            hideCard(flippedPair[1]);
            flippedPair.length = 0;
            score++;
            scoreArea.innerHTML = score;
        }, 1000);
    }
}

function alertWon() {
    alert('YOU WON IN ' + score + ' GUESSES!')
}

function initializeGame() {
        // get difficulty
        window.localStorage.setItem('difficulty', document.getElementById('diffselector').value);
        difficulty = window.localStorage.getItem('difficulty');

        // reset deck, score, and highest score
        deck = [];
        guessedCorrect = 0;
        score = 0;
        scoreArea.innerHTML = score;
        highScoreArea.innerHTML = highScores['' + difficulty];
    
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

        // draw cards based on selected difficulty
        for (var i = 0 ; i < difficulty; i++) {
            cardsInPlay.push(...deck.splice(Math.floor(Math.random() * deck.length), 1))
        }
        cardsInPlay = cardsInPlay.concat(cardsInPlay);
        cardCount = cardsInPlay.length;
    
        // randomly place cards on board
        while (cardsInPlay.length > 0) {
            var card = cardsInPlay.splice(Math.floor(Math.random() * cardsInPlay.length), 1)
            cardsArea.appendChild(createCard(card));
        }
}

startButton.addEventListener('click', function () {
    initializeGame();
});
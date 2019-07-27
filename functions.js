var suits = ['<span class="red">&hearts;</span>', '<span class="red">&diams;</span>', '<span class="black">&clubs;</span>', '<span class="black">&spades;</span>'];
var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var cardBackURL = 'card-back.png'
var deck = [];
var playingCards = [];
var difficulty; 
var matchedCards = [];
var cardCount;
var correctCount = 0;
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

function createCard(playingCards) {
    var cardHead = document.createElement('h2');
    var cardBody = document.createElement('div');
    var cardContainer = document.createElement('div');
    var cardArea = document.createElement('div');
    var cardTopNum = document.createElement('span');
    var cardBotNum = document.createElement('span');
    var cardGraphic = document.createElement('span');
    var backGraphic = document.createElement('img');
    cardTopNum.innerHTML = playingCards[0][0];
    cardBotNum.innerHTML = playingCards[0][0];
    cardGraphic.innerHTML = playingCards[0][1];
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
        console.log('found pair!')
        if (correctCount === cardCount) {
            setHighScore();
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

function alertWon() {
    alert('YOU WON IN ' + score + ' GUESSES!')
}

function initializeGame() {
        // get difficulty
        window.localStorage.setItem('difficulty', document.getElementById('diffselector').value);
        difficulty = window.localStorage.getItem('difficulty');

        // reset score to 0 and add highest score to local storage
        correctCount = 0;
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
            playingCards.push(...deck.splice(Math.floor(Math.random() * deck.length), 1))
        }
        playingCards = playingCards.concat(playingCards);
        cardCount = playingCards.length;
        console.log(playingCards)
    
        // randomly place cards on board
        while (playingCards.length > 0) {
            var card = playingCards.splice(Math.floor(Math.random() * playingCards.length), 1)
            cardsArea.appendChild(createCard(card));
        }
}

startButton.addEventListener('click', function () {
    initializeGame();
});
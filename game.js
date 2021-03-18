initGame();
let moves = 0;


function initGame() {
    getRandomPictures();
    shuffleCards();
    initLeftClick();
}


function startTimer(){
    let sec = 0, min = 0;
    window.interval = setInterval(function(){
        let timer = document.querySelector(".timer");
        timer.innerHTML = min + " Minutes " + sec + " Seconds";
        sec++;

        if(sec == 60){
            min++;
            sec=0;
        }
        window.secSave = sec - 1;
        window.minSave = min;
    },1000);
}


function getRandomPictures() {
    let randomNumbers = []
    for (let i = 0; randomNumbers.length < 8; i++) {
        let randomNumber = Math.floor((Math.random() * 40) + 1);
        if (randomNumbers.includes(randomNumber)) {
        } else {
            randomNumbers.push(randomNumber);
        }
    }
    let cards = document.querySelectorAll(".card");
    let counter = 1;
    for (let card of cards) {
        if (counter % 2 == 1) {
            window.randomNumber = randomNumbers.pop();
        }
        card.children[0].setAttribute("src", "static/images/" + randomNumber + ".png");
        counter++;
    }
}


function moveCounter() {
    let move_count = document.querySelector(".move_count")
    moves++;
    move_count.innerHTML = moves + " Moves";
    window.movesSave = moves;
}


function shuffleCards() {
    let board = document.querySelector(".main-board");
    for (let i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);};
}


function initLeftClick() {
    let cards = document.querySelectorAll(".card");
    let counter = 0;
    for (let card of cards) {
        card.onclick = function(event) {
            let openCards = 0;
            let matchedCards = 0;
            for (let card of cards) {
                if ((card.children[0].classList.contains('matched'))) {matchedCards++};
                if (!(card.children[0].classList.contains('hidden'))) {openCards++};
            };
            if (openCards - matchedCards !== 2 && !(event.currentTarget.children[0].classList.contains('matched')) &&
                !(event.currentTarget.classList.contains('opened'))) {
                event.currentTarget.children[0].classList.remove('hidden');
                counter++;
                if (counter === 1) {startTimer();};
                if (counter % 2 === 1) {
                    window.firstPick = event.currentTarget;
                    firstPick.classList.add('opened');
                }
                if (counter % 2 === 0) {
                    window.secondPick = event.currentTarget;
                    secondPick.classList.add('opened');
                    moveCounter();

                    if (firstPick.children[0].attributes[1].value === secondPick.children[0].attributes[1].value) {
                        firstPick.children[0].classList.add('matched');
                        secondPick.children[0].classList.add('matched');
                        firstPick.classList.remove('opened');
                        secondPick.classList.remove('opened');
                        firstPick.classList.add('matchedCard');
                        secondPick.classList.add('matchedCard');
                        matchedCards += 2;
                    }
                    else {
                        setTimeout(function() {
                            firstPick.classList.add('unmatchedCard');
                            secondPick.classList.add('unmatchedCard');
                        }, 750);
                        setTimeout(function() {
                            secondPick.children[0].classList.add('hidden');
                            firstPick.children[0].classList.add('hidden');
                            firstPick.classList.remove('opened');
                            secondPick.classList.remove('opened');
                            firstPick.classList.remove('unmatchedCard');
                            secondPick.classList.remove('unmatchedCard');
                        }, 2000);
                    }
                    openCards = 0;
                }
            }
            if (matchedCards === 16) {gameWin();};
        }
    }
}


function gameWin() {
    setTimeout(function() {
        window.popup = document.getElementById("popup1");
        let finalTime = document.querySelector('.timer').innerHTML;
        let finalMoves = document.querySelector('.move_count').innerHTML;
        popup.classList.add('show');
        highscore();
        document.getElementById("finalMove").innerHTML = finalMoves;
        document.getElementById("totalTime").innerHTML = finalTime;
        document.getElementById("highscore").innerHTML = localStorage.min + " Minutes " + localStorage.sec + " Seconds<br>" + localStorage.moves + " Moves";
        closePopup();
    }, 2000);

}


function closePopup() {
    let closeIcon = document.querySelector(".close");
    closeIcon.addEventListener("click", function(e){
    popup.classList.remove("show");
    restartGame();
    });
}


function playAgain() {
    popup.classList.remove("show");
    restartGame();

}


function restartGame() {
    let cards = document.querySelectorAll(".card");
    for (let card of cards) {
        card.classList.remove('matchedCard');
        card.children[0].classList.add('hidden');
        card.children[0].classList.remove('matched');
    };
    let timer = document.querySelector(".timer");
    timer.innerHTML = 0 + " Minutes " + 0 + " Seconds";
    let move_count = document.querySelector(".move_count")
    moves = 0;
    move_count.innerHTML = moves + " Moves";
    clearInterval(interval);
    initGame();
}


function highscore() {
    let currentMin = minSave;
    let currentSec = secSave;
    let currentMoves = movesSave;

    if (localStorage.sec) {
        let highscoreMin = localStorage.getItem("min");
        let highscoreSec = localStorage.getItem("sec");
        let HighscoreMoves = localStorage.getItem("moves");

        if (highscoreMin > currentMin) {
            localStorage.min = currentMin;
            localStorage.sec = currentSec;
            localStorage.moves = currentMoves;
        }
        else if (highscoreMin == currentMin && highscoreSec > currentSec) {
            localStorage.min = currentMin;
            localStorage.sec = currentSec;
            localStorage.moves = currentMoves;
        }
        else if (highscoreMin == currentMin && highscoreSec == currentSec){
            if (HighscoreMoves > currentMoves) {
                localStorage.min = currentMin;
                localStorage.sec = currentSec;
                localStorage.moves = currentMoves;
            }
        }
    }
    else{
        localStorage.min = currentMin;
        localStorage.sec = currentSec;
        localStorage.moves = currentMoves;
    }
}
'use strict';

var gBoard = [];
var gRowNum;
var gBombsNum;
var gTimer;
var gFlagLimit;
var gSafeCells;
var gGameTime;
var gLevel;

var gAudioGameOver = new Audio('sound/explosion.mp3');
var gAudioClick = new Audio('sound/click.mp3');
var gAudioFlag = new Audio('sound/flag.mp3');
var gAudioWin = new Audio('sound/win.mp3');

function initTimer() {
    var seconds = 0;
    var el = document.querySelector('.time');
    var elFlags = document.querySelector('.flags');

    function incrementSeconds() {
        seconds += 1;
        el.innerText = 'Timer: ' + seconds + '.';
        elFlags.innerText = 'Flags used: ' + gFlagLimit;

        gGameTime = seconds;
    }

    gTimer = setInterval(incrementSeconds, 1500);
}

function showBoardToConsole() {
    //debugger
    var board = [];
    for (var i = 0; i < gBoard.length; i++) {
        board.push([]);
        for (var j = 0; j < gBoard[0].length; j++) {
            board[i].push(gBoard[i][j].type);

        }
    }
    console.log(board);
}

function init(rowNum, bombs, level) {

    gLevel = level;

    var elButtons = document.querySelector('.btn');
    elButtons.remove();

    gRowNum = rowNum;
    gBombsNum = bombs;
    gFlagLimit = gBombsNum;

    //console.log('showing gBoard: ', gBoard);
    //console.log('checking bombs around 2, 2:  ' + checkBombsAround(2, 2));

    buildBoard(gRowNum);
    showBoardToConsole();
    render1stBoard();
}

function afterFirstClick() {
    spreadBombs();
    spreadGameObjects();
}

function buildBoard(rowNum) {
    //debugger
    for (var i = 0; i < rowNum; i++) {
        gBoard.push([]);
        for (var j = 0; j < rowNum; j++) {
            gBoard[i].push({
                type: null,
                isMarked: false,
            });
        }
    }
    return gBoard;
}

function spreadBombs(el) {
    //debugger
    var clickedI = el.classList.value.substring(16, 17);
    var clickedJ = el.classList.value.substring(18);
    clickedI = parseInt(clickedI);
    clickedJ = parseInt(clickedJ);
    var bombsNum = 0;
    while (bombsNum < gBombsNum) {
        var i = Math.floor((Math.random() * gRowNum));
        var j = Math.floor((Math.random() * gRowNum));
        if (gBoard[i][j].type === null && i !== clickedI && j !== clickedJ) {
            gBoard[i][j].type = 'bomb';
            bombsNum++;
        }
    }
    spreadGameObjects();
    render2ndBoard();
    console.log(showBoardToConsole());
}

function spreadGameObjects() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].type !== null) continue;
            gBoard[i][j].type = checkBombsAround(i, j);
        }
    }
}

function checkBombsAround(i, j) {
    //debugger
    var currI = i;
    var currJ = j;
    var bombsAround = 0;
    i--;
    j = j - 2;
    for (var a = 0; a < 3; a++) {
        for (var b = 0; b < 3; b++) {
            j++;
            //console.log('checking: ' + i + ', ' + j);
            if (i < 0 || i > gRowNum - 1 || j < 0 || j > gRowNum - 1 || (i === currI && j === currJ)) continue;

            if (gBoard[i][j].type === 'bomb') bombsAround++;
        }
        j -= 3;
        i++;
    }
    return bombsAround;
}

function render1stBoard() {
    var elSmily = document.querySelector('.panel-smily');
    elSmily.innerHTML = '<img onclick="playAgain()" src="img/smily.png" width="50" height="50">';
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            strHTML += '<td class="board cell cell-' + i + '-' + j + '"';
            strHTML += 'onclick="spreadBombs(this)">';
            strHTML += '<img class="covered" src="img/covered.png" width="42" height="42"></td>';
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}

function render2ndBoard() {
    //debugger
    initTimer();
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            strHTML += '<td class="board cell cell-' + i + '-' + j + '"';
            strHTML += 'onclick="cellClicked(this)" onmousedown="rightClicked(event, this)">';
            strHTML += '<img class="covered" src="img/covered.png" width="42" height="42"></td>';
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    //debugger

    gAudioClick.play();

    var elSmily = document.querySelector('.panel-smily');
    elSmily.innerHTML = '<img onclick="playAgain()" src="img/open-cell-smily.png" width="50" height="50">'

    var i = elCell.classList.value.substring(16, 17);
    var j = elCell.classList.value.substring(18);
    if (gBoard[i][j].type !== 'bomb') {
        setTimeout(function () {
            elSmily.innerHTML = '<img onclick="playAgain()" src="img/smily.png" width="50" height="50">';
        }, 200);
    }
    //console.log(i + ', ' + j + ' was clicked');
    if (gBoard[i][j].type === 'bomb') gameOver(i, j);

    if (gBoard[i][j].type === 1) {
        elCell.innerHTML = '<img src="img/one.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;
    }
    if (gBoard[i][j].type === 2) {
        elCell.innerHTML = '<img src="img/two.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
    }
    if (gBoard[i][j].type === 3) {
        elCell.innerHTML = '<img src="img/three.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
    }
    if (gBoard[i][j].type === 4) {
        elCell.innerHTML = '<img src="img/four.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
    }
    if (gBoard[i][j].type === 5) {
        elCell.innerHTML = '<img src="img/five.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
    }
    if (gBoard[i][j].type === 6) {
        elCell.innerHTML = '<img src="img/six.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
    }
    if (gBoard[i][j].type === 0) {
        elCell.innerHTML = '<img src="img/empty.png" width="42" height="42">';
        gBoard[i][j].isMarked = true;;
        uncoverAllAround(i, j, elCell)
    }

    checkWin();
}

function uncoverAllAround(i, j, currCellElement) {
    //debugger
    // recursion killer


    var currI = i;
    var currJ = j;
    i--;
    j = j - 2;
    for (var a = 0; a < 3; a++) {
        for (var b = 0; b < 3; b++) {
            j++;
            if (i < 0 || i > gRowNum - 1 || j < 0 || j > gRowNum - 1 || (i === currI && j === currJ) ||
                gBoard[i][j].isMarked === true) continue;

            var elTreated = document.querySelector('.cell-' + i + '-' + j);

            if (gBoard[i][j].type === 1) {
                elTreated.innerHTML = '<img src="img/one.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;

            }
            if (gBoard[i][j].type === 2) {
                elTreated.innerHTML = '<img src="img/two.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
            }
            if (gBoard[i][j].type === 3) {
                elTreated.innerHTML = '<img src="img/three.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
            }
            if (gBoard[i][j].type === 4) {
                elTreated.innerHTML = '<img src="img/four.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
            }
            if (gBoard[i][j].type === 5) {
                elTreated.innerHTML = '<img src="img/five.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
            }
            if (gBoard[i][j].type === 6) {
                elTreated.innerHTML = '<img src="img/six.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
            }
            if (gBoard[i][j].type === 0) {
                elTreated.innerHTML = '<img src="img/empty.png" width="42" height="42">';
                gBoard[i][j].isMarked = true;
                uncoverAllAround(i, j, elTreated);
            }

        }
        j -= 3;
        i++;
    }
}

function rightClicked(ev, elClickedCell) {
    var i = elClickedCell.classList.value.substring(16, 17);
    var j = elClickedCell.classList.value.substring(18);
    //console.log(i + ', ' + j);

    if (ev.which === 3) {

        //console.log(elCell);
        // Put flag
        if (elClickedCell.lastElementChild.classList.contains('covered')) {
            gAudioFlag.play();
            elClickedCell.innerHTML = '<img class="flag" src="img/flag.jpg" width="42" height="42">';
            gBoard[i][j].isMarked = true;
            gFlagLimit--;

        } else if (ev.which === 3) {
            // Remove flag
            if (elClickedCell.lastElementChild.classList.contains('flag')) {
                gAudioFlag.play();
                elClickedCell.innerHTML = '<img class="covered" src="img/covered.png" width="42" height="42">';
                gBoard[i][j].isMarked = false;
                gFlagLimit++;
            }
        }

    }
    checkWin();
}

function gameOver(myI, myJ) {
    //debugger
    clearInterval(gTimer);
    gAudioGameOver.play();
    var elSmily = document.querySelector('.panel-smily');
    elSmily.innerHTML = '<img onclick="playAgain()" src="img/game-over-smily.png" width="50" height="50">';
    var elExplosion = document.querySelector('.cell-' + myI + '-' + myJ);
    //console.log(elExplosion);    
    elExplosion.innerHTML = '<img src="img/exploded.jpg" width="42" height="42">';

    setTimeout(function () {
        elExplosion.innerHTML = '<img src="img/broken-bomb.jpg" width="42" height="42">';
    }, 1000);

    var elGameStatus = document.querySelector('.game-status');
    elGameStatus.innerText = 'Game Over!';

    var elCells = document.querySelectorAll('.cell');
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].removeAttribute('onclick');
        elCells[i].removeAttribute('onmousedown');
    }


}

function gameWin() {
    gAudioWin.play();
    clearInterval(gTimer);
    var elSmily = document.querySelector('.panel-smily');
    elSmily.innerHTML = '<img onclick="playAgain()" src="img/win-smily.jpg" width="50" height="50">';
    var elGameStatus = document.querySelector('.game-status');
    elGameStatus.innerHTML = 'VICTORIOUS!!';

    switch (gLevel) {
        case 1:
            gameScoreBeginner();
            break;
        case 2:
            gameScoreMedium();
            break;
        case 3:
            gameScoreExpert();
            break;
    }


}




function playAgain() {
    location.reload();
}




function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked === false) return;

        }
    }
    if (gFlagLimit === 0) gameWin();
}

function gameScoreBeginner() {
    var elScore = document.querySelector('.score-beginner');

    if (localStorage.getItem("beginnerScore") === null) localStorage.setItem("beginnerScore", gGameTime);

    if (gGameTime < localStorage.getItem("beginnerScore")) {
        localStorage.setItem("beginnerScore", gGameTime);
    }
    elScore.innerText = 'Your score is: ' + gGameTime + '.   The best score for beginner: ' +
        localStorage.getItem("beginnerScore");

}

function gameScoreMedium() {

    var elScore = document.querySelector('.score-medium');

    if (localStorage.getItem("mediumScore") === null) localStorage.setItem("mediumScore", gGameTime);

    if (gGameTime < localStorage.getItem("mediumScore")) {
        localStorage.setItem("mediumScore", gGameTime);
    }
    elScore.innerText = 'Your score is: ' + gGameTime + '.   The best score for medium: ' +
        localStorage.getItem("mediumScore");

}

function gameScoreExpert() {

    var elScore = document.querySelector('.score-expert');

    if (localStorage.getItem("expertScore") === null) localStorage.setItem("expertScore", gGameTime);

    if (gGameTime < localStorage.getItem("expertScore")) {
        localStorage.setItem("expertScore", gGameTime);
    }
    elScore.innerText = 'Your score is: ' + gGameTime + '.   The best score for expert: ' +
        localStorage.getItem("expertScore");
}


















































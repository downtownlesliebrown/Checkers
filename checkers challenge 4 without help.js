var turnCount = 0;
var _boardArray = [];
var _redPiecePrisonArray = [];
var _blackPiecePrisonArray = [];
var _pieceClicked = {};
var _availableSquares = [];
var _potentiallyJumpedSquares = [];
var _newDiagonal = false;
var _jumpedRedPieces = [];
var _jumpedBlackPieces = [];
var _resetPotentiallyJumpedFlags = false;


setupRedPiecePrison ();
function setupRedPiecePrison () {
    var redPiecePrison = document.getElementById('red-piece-prison');
    for (var k = 0; k < 4; k++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + k);
        row.setAttribute('class', 'prisonRow');
        var rRowArray = []; //subArray of the board array
        for (var l = 0; l < 3; l++) { //for cell
            var rCellObject = {
                id: k + '' + l,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', 'r' + k + '' + l);
            cell.setAttribute('class', 'prisonCell');
            row.appendChild(cell);
            rRowArray.push(rCellObject);
        }
        redPiecePrison.appendChild(row);
        _jumpedRedPieces.push(rRowArray);
    }
}

setupBlackPiecePrison ();
function setupBlackPiecePrison () {
    var blackPiecePrison = document.getElementById('black-piece-prison');
    for (var k = 0; k < 4; k++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + k);
        row.setAttribute('class', 'prisonRow');
        var bRowArray = []; //subArray of the board array
        for (var l = 0; l < 3; l++) { //for cell
            var bCellObject = {
                id: k + '' + l,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', 'b' + k + '' + l);
            cell.setAttribute('class', 'prisonCell');
            row.appendChild(cell);
            bRowArray.push(bCellObject);
        }
        blackPiecePrison.appendChild(row);
        _jumpedBlackPieces.push(bRowArray);
    }
}





setupBoard();
function setupBoard () {
    var gameBoardDiv = document.getElementById('game-board');
    for (var i = 0; i < 8; i++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + i);
        row.setAttribute('class', 'row');
        var rowArray = []; //subArray of the board array
        for (var j = 0; j < 8; j++) { //for cell
            var cellObject = {
                id: i + '' + j,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', i + '' + j);
            cell.innerHTML = i + '' + j;
            if(isEven(i) && isEven(j)) {
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }else if(isEven(i) && !isEven(j)) {
                cellObject.color = 'white';
                cell.addEventListener("click", function (event) {
                    console.log(event);
                    movePiece(event.target.id);
                });
                if(i < 3) {
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if(i > 4) {
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                } else {
                    cell.setAttribute('class', 'white-cell');
                }
            }else if(!isEven(i) && isEven(j)) {
                cellObject.color = 'white';
                cell.addEventListener("click", function (event) {
                console.log(event);
                movePiece(event.target.id);
                });
                if(i < 3) {
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if(i > 4) {
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                } else {
                    cell.setAttribute('class', 'white-cell');
                }
            }else {
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }
            row.appendChild(cell);
            rowArray.push(cellObject);
        }
        gameBoardDiv.appendChild(row);
        _boardArray.push(rowArray);
    }
    console.log(_boardArray);
}

function isEven (number) {
    return number % 2 === 0;
}

function checkOtherDiagonal(row, cell, direction, pieceColor) {
    switch(direction) {
        case 'upLeft':
            checkAvailable(row, cell, 'upRight', pieceColor);
            break;
        case 'upRight':
            checkAvailable(row, cell, 'upLeft', pieceColor);
            break;
        case 'downLeft':
            checkAvailable(row, cell, 'downRight', pieceColor);
            break;
        case 'downRight':
            checkAvailable(row, cell, 'downLeft', pieceColor);
            break;
    }
}

function checkAvailable (row, cell, direction, pieceColor) {
    var fails = 0;
    var cellsHighlighted = 0;
    var justPainted = false;
    var jumpedPieces = 0;
    while (fails < 2) {
        switch (direction) {
            case 'upLeft':
                row--;
                cell--;
                break;
            case 'upRight':
                row--;
                cell++;
                break;
            case 'downLeft':
                row++;
                cell--;
                break;
            case 'downRight':
                row++;
                cell++;
                break;
        }
        if(row < 0 || cell < 0 || row > 7 || cell > 7) {
            break;
        }
        if(_boardArray[row][cell].status === 'none') {
            if(_newDiagonal && fails === 0) {
                break
            }
            if(justPainted) {
                break;
            }
            var upLeftCell = (row) + '' + (cell);
            _availableSquares.push(upLeftCell);
            if (fails > 0) {
                jumpedPieces++;
                _boardArray[row][cell].potentiallyJumpedTo = true;
                checkIfPotJumped(row, cell, direction);
                _newDiagonal = true;
                checkOtherDiagonal(row, cell, direction, pieceColor);
                _newDiagonal = false;
            }
            fails = 0
            cellsHighlighted++;
            justPainted = true;
        } else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece === pieceColor) {
            break;
        } else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece !== pieceColor) {
            fails++;
            if(justPainted && fails === 0) { //does this need to be here? we won't get here ever because fails was just set ++
                break;
            }
            if (fails > 0 && jumpedPieces > 0) {
                justPainted = false;
            }
        }
    }
    console.log(_potentiallyJumpedSquares)
}

function checkIfPotJumped (row, cell, direction) {
    switch (direction) {
        case 'upLeft':
            row++;
            cell++;
            break;
        case 'upRight':
            row++;
            cell--;
            break;
        case 'downLeft':
            row--;
            cell++;
            break;
        case 'downRight':
            row--;
            cell--;
            break;
    }
    _potentiallyJumpedSquares.push(_boardArray[row][cell]);
}

function movePiece(id) {
    var row = parseInt(id[0]);
    var cell = parseInt(id[1]);
    var cellObject = _boardArray[row][cell];
    if (cellObject.piece) {
        if (cellObject.status === 'clicked') {
            for(var i = 0; i < _availableSquares.length; i++) {
                var availableRow = parseInt(_availableSquares[i][0]);
                var availableCell = parseInt(_availableSquares[i][1]);
                _boardArray[availableRow][availableCell].status = 'none';
            }
            availableSquares = [];
            cellObject.status = 'piece';
            _resetPotentiallyJumpedFlags = true;
            updateBoard('pieceClicked');
            return;
        }
        cellObject.status = 'clicked';
        if(cellObject.piece === 'black') {
            checkAvailable(row, cell, 'upLeft', cellObject.piece);
            checkAvailable(row, cell, 'upRight', cellObject.piece);
            _pieceClicked.class = 'black-piece';
            _pieceClicked.piece = 'black';
        } else if(cellObject.piece === 'red') {
            checkAvailable(row, cell, 'downLeft', cellObject.piece);
            checkAvailable(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-piece';
            _pieceClicked.piece = 'red';
        }
        for(var i = 0; i < _availableSquares.length; i++) { //will have to mirror this for jumped over squares array
            var availableRow = parseInt(_availableSquares[i][0]);
            var availableCell = parseInt(_availableSquares[i][1]);
            _boardArray[availableRow][availableCell].status = 'available';
        }
        for(var i = 0; i < _potentiallyJumpedSquares.length; i++) {
            var potentiallyJumpedRow = parseInt(_potentiallyJumpedSquares[i].id[0]);
            var potentiallyJumpedCell = parseInt(_potentiallyJumpedSquares[i].id[1]);
            _boardArray[potentiallyJumpedRow][potentiallyJumpedCell].potentiallyJumped = true;
        }
        updateBoard('piece clicked');
    } else if(cellObject.status === 'available') {
        cellObject.status = 'moved';
        cellObject.piece = _pieceClicked.piece;
        updateBoard('piece moved', cellObject.potentiallyJumpedTo);
    }
}

function updateBoard (typeOfEvent, jumped) {
    for(var i = 0; i < _boardArray.length; i++) {
        for(var j = 0; j < _boardArray[i].length; j++) {
            var cellClassArray = document.getElementById(_boardArray[i][j].id).className.split(' ');
            if(typeOfEvent === 'piece moved') {
                if (jumped) {
                    if(_boardArray[i][j].potentiallyJumped === true) {
                        if(_boardArray[i][j].piece === 'black') {
                            _jumpedBlackPieces.push(_boardArray[i][j]);
                            if(cellClassArray.indexOf('black-piece') !== -1) {
                                cellClassArray.splice(cellClassArray.indexOf('black-piece'), 1);
                            }
                        } else {
                            _jumpedRedPieces.push(_boardArray[i][j]);
                            if (cellClassArray.indexOf('red=piece') !== -1) {
                                cellClassArray.splice(cellClassArray.indexOf('red-piece'), 1);
                            }
                        }
                        _boardArray[i][j].status = 'none';
                        _boardArray[i][j].potentiallyJumped = false;
                        delete _boardArray[i][j].piece;
                    }
                }
                if(_boardArray[i][j].status === 'clicked') {
                    if(cellClassArray.indexOf(_pieceClicked.class) !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf(_pieceClicked.class), 1);
                    }
                    if(cellClassArray.indexOf('clicked-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                    delete _boardArray[i][j].piece;
                    _boardArray[i][j].status = 'none';
                }
                if(_boardArray[i][j].status ==='moved') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1, _pieceClicked.class);
                    } else {
                        cellClassArray.push(_pieceClicked.class);
                    }
                    _boardArray[i][j].status = 'piece';
                }
                if (_boardArray[i][j].status === 'available') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    _boardArray[i][j].status = 'none';
                }
                _availableSquares = [];
                _boardArray[i][j].potentiallyJumped = false;
                _boardArray[i][j].potentiallyJumpedTo = false;
            } else {
                if(_boardArray[i][j].status === 'available') {
                    cellClassArray.push('available-cell');
                } else if(_boardArray[i][j].status === 'none') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    if(cellClassArray.indexOf('clicked-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                } else if (_boardArray[i][j].status === 'clicked') {
                    cellClassArray.push('clicked-cell');
                } else if(_boardArray[i][j].status === 'piece' && cellClassArray.indexOf('clicked-cell') !== -1) {
                    cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    _availableSquares = [];
                }
                if (_resetPotentiallyJumpedFlags) {
                    _boardArray[i][j].potentiallyJumpedOver = false;
                    _boardArray[i][j].potentiallyJumpedTo = false;
                }
            }
            document.getElementById(_boardArray[i][j].id).className = cellClassArray.join(' ');
            _potentiallyJumpedSquares = [];
        }
    }
    _resetPotentiallyJumpedFlags = false;
    updatePrisons();
    console.log(_boardArray);
}

function updatePrisons () {
    var blackPiecesToAdd = _jumpedBlackPieces.length - document.getElementById('black-piece-prison').children.length;
    var redPiecesToAdd = _jumpedRedPieces.length - document.getElementById('red-piece-prison').children.length;
    if (redPiecesToAdd !== 0) {
        for (var i = 0; i < redPiecesToAdd; i++) {
            var divElementRedPiece = document.createElement('div');
            divElementRedPiece.setAttribute('class', 'prisonCell red-piece');
            document.getElementById('red-piece-prison').appendChild(divElementRedPiece);
        }
    }
    if (blackPiecesToAdd !== 0) {
        for (var j = 0; j < blackPiecesToAdd.length; j++) {
            var divElementBlackPiece = document.createElement('div');
            divElementBlackPiece.setAttribute('class', 'prisonCell black-piece');
            document.getElementById('black-piece-prison').appendChild(divElementBlackPiece);
        }
    }
}

// function whoseTurn(turnCount) {
//     if (isEven(turnCount)) {
//         console.log("Turn: team red");
//     } else {
//         console.log("Turn: team black");
//     }
// }
//

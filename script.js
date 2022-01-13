var origBoard;
const huPlayer = 'O'
const aiPlayer = 'X'
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

startGame();


function startGame(){
    document.querySelector('.endgame').style.display = "none";
    origBoard = Array.from( Array(9).keys() );
    console.log(origBoard)
    for (var i = 0; i <cells.length; i++){
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}
function turnClick(square){
    if (typeof origBoard[square.target.id] == 'number'){
        // console.log(square.target.id)
        turn(square.target.id, huPlayer);
        if(!checkTie()) turn(bestSpot(), aiPlayer)
    }
}
function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}
function checkWin(board, player){
    let plays = board.reduce( (a, e, i) =>
        (e === player) ? a.concat(i): a, [] );
    let gameWon = null;
    for ( let [index, win] of winCombos.entries() ) {
        if (win.every( elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player};
            break;
        }
    }
    return gameWon;
}
function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "rgba(105, 198, 241, 0.6)" : "rgba(241, 105, 105, 0.6)";
    }
    for (var i = 0; i<cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? 'You Win!': 'You Lose!');
}
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
function emptySquares(){
    return origBoard.filter(s => typeof s =='number');
}
function bestSpot() {
    return minmax(origBoard, aiPlayer).index;
}
function checkTie() {

    if (emptySquares().length ==0){
        for(var i = 0; i <cells.length; i++){
            cells[i].style.backgroundColor = "rgba(95, 95, 95, 0.3)"
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}
function minmax(newBoard, player) {
    //run over only the empty spots
    var availspots = emptySquares(newBoard);
    // check any player is already won - important to use in recursion
    // and if the 
    if (checkWin(newBoard, huPlayer)){
        return {score: -10};
    // and if the ai won then return 20 points
    }else if(checkWin(newBoard, aiPlayer)) {
        return {score: 20};
    }else if(availspots.length === 0){
        return {score: 0};
    }
    // creat new variable to store moves in and see which moves are the best
    var moves = [];
    for (var i = 0; i<availspots.length; i++){
        // using the empty square : hold the best moves with their score and the place of the square and the player
        var move = {};
        move.index = newBoard[availspots[i]];
        newBoard[availspots[i]] = player;

        // now switch players and evaluate their moves and save them
        if(player == aiPlayer) {
            var result = minmax(newBoard, huPlayer);
            move.score = result.score;
        }else {
            var result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }
        // push the best move in
        newBoard[availspots[i]] = move.index;
        moves.push(move)
    }

    var bestMove;
    if (player === aiPlayer){
        var bestScore = -10000;
        for (var i = 0; i<moves.length; i++){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        var bestScore = 10000;
        for (var i = 0; i<moves.length; i++){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove]
}
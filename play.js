////////////////////////////////////////////////////////
////global variables
var treeLevel = 3;	//must be an odd number
var treeNodes = new Array();
var winMoves = new Array();
//board = 1 for player 1; 2 for player 2
var board = new Array();

var firstPlayerColor = "rgb(255, 165, 0)";  //orange
var secondPlayerColor = "rgb(0, 0, 0)";	    //black
var backgroundColor = "rgb(173, 216, 230)"; //lightblue
var playerTurn = 2;
var firstPlayer = "human";
var secondPlayer = "ai";
var gameNotOver = true;
var gameOver = false;
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////Define the classes
function WinMove() {
	this.row = new Array();
	this.col = new Array();
	this.count = new Array();
}

function TreeNode(key, value) {
	this.key = key;
	this.value = value;
}

function TreeValue(parent, index) {
	this.parent = parent;
	this.index = index;
	this.column = 0;
	this.firstChild = -1;
}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
//get the table (board) elements
var tdSelector = $("td");
var tdLength = tdSelector.length;
var n = Math.sqrt(tdLength);
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////events
$("#play").click(NewGame);
////////////////////////////////////////////////////////

BuildTree(n, treeLevel);
InitBoard();
BuildMoves();
NewGame();

////////////////////////////////////////////////////////
////game behavior
function InitBoard() {
	var k = 0;
	var line;
	for (var i = 0; i < n; i++) {
		line = new Array();
		for (var j = 0; j < n; j++) {
			line[j] = 0;
			k++;
		}
		board[i] = line;
	}
}

function BuildMoves() {
	var row = 0,
		col = 0,
		k = 0,
		l = 0;

	//horizontal winning lines
	for (row = 0; row < n; row++) {
		for (col = 0; col < n - 3; col++) {
			winMoves[k] = new WinMove();
			for (var l = 0; l < 4; l++) {
				winMoves[k].row[l] = row;
				winMoves[k].col[l] = col + l;
			}
			k++;
		}
	}

	//vertical winning lines
	for (row = 0; row < n - 3; row++) {
		for (col = 0; col < n; col++) {
			winMoves[k] = new WinMove();
			for (var l = 0; l < 4; l++) {
				winMoves[k].row[l] = row + l;
				winMoves[k].col[l] = col;
			}
			k++;
		}
	}

	//diagonal winning lines (topleft-bottomright)
	for (row = 0; row < n - 3; row++) {
		for (col = 0; col < n - 3; col++) {
			winMoves[k] = new WinMove();
			for (var l = 0; l < 4; l++) {
				winMoves[k].row[l] = row + l;
				winMoves[k].col[l] = col + l;
			}
			k++;
		}
	}

	//diagonal winning lines (bottomleft-topright)
	for (row = 3; row < n; row++) {
		for (col = 0; col < n - 3; col++) {
			winMoves[k] = new WinMove();
			for (var l = 0; l < 4; l++) {
				winMoves[k].row[l] = row - l;
				winMoves[k].col[l] = col + l;
			}
			k++;
		}
	}
}

function NewGame() {
	InitBoard();
	playerTurn = 2;
	$(".player1").css("background-color", backgroundColor);
	$(".player2").css("background-color", "grey");
	move = 0;
	gameOver = false;
	$("td").unbind('click');
	ClearBoard();
	NextMove();
}

function ClearBoard() {
	for (var i = 0; i < tdLength; i++)  {
		$(tdSelector[i]).css("background-color", backgroundColor);
 	}
}

function NextMove() {
	console.log("next move")
	if(gameOver)
	{
		console.log("Game Over");
		return;
	}

	move++;
	console.log(move);
	SwitchPlayers();

	if(playerTurn == 2)
	{
		$(".player1").css("background-color", "grey");
		$(".player2").css("background-color", backgroundColor);
		MakeMove(secondPlayer);
	}
	else
	{
		$(".player1").css("background-color", backgroundColor);
		$(".player2").css("background-color", "grey");
		MakeMove(firstPlayer);
	}
}

function MakeMove(player) {
	if(player == "human")
	{
		$("td").click(tdFunc);
	}
	else
	{
		AIMove();
	}
}

function AIMove() {
	var alpha = alphabeta(treeNodes[0], 2, -99999, 99999, "max");
	var col = FindCol(alpha);
	var row, color;
	row = parseInt(FindWhereItLands(col) / n);

	if(board[0][col] != 0) {
		var i = 0;
		while(i < n) {
			if(board[0][i] == 0) {
				col = i;
			}
			i++;
		}
	}

	if(playerTurn == 1) {
		color = firstPlayerColor;
	}
	else {
		color = secondPlayerColor;
	}

	$(tdSelector[col]).css("background-color", "rgb(255, 0, 0)");

	Animate(color);
}

function tdFunc() {
	var color = $(this).css("background-color");
	if(color == backgroundColor)
	{
		if(playerTurn == 1)
		{
			$(".player2").css("background-color", backgroundColor);
			$(".player1").css("background-color", "grey");
			$(this).css("background-color", "red");
			Animate(firstPlayerColor);
		}
		else
		{
			$(".player1").css("background-color", backgroundColor);
			$(".player2").css("background-color", "grey");
			$(this).css("background-color", "red");
			Animate(secondPlayerColor);
		}
		$("td").unbind('click');
	}
	//else
	//{
	//	$(this).css("background-color", backgroundColor);
	//}
	//fix the else part
}

function Animate(color) {
	var color1, nextColor;
	var index = 0;
	var row, col;

	for (var i = 0; i < tdLength; i++) {
		color1 = $(tdSelector[i]).css("background-color");
		if(color1 == "rgb(255, 0, 0)") {
			index = i;
			break;
		}
	}

	row = parseInt(FindWhereItLands(index) / n);
	col = index % n;

	RefreshBoard(row, col);

	$(tdSelector[index]).css("background-color", color);
	setTimeout(AnimateColumn, 100, index);
	
	setTimeout(GameOverCheck, 2300, row, col, true);

	setTimeout(NextMove, 1200);
}

function GameOverCheck(animate) {
	if(animate) {console.log("true");	console.log("game over check");}
	for(var i = 0; i < n; i++) {
		for(var j = 0; j < n; j++) {
			if(board[i][j] != 0) {
				GameOver(i, j, animate);
			}
		}
	}

	if(gameOver && animate) {
		alert("Player " + playerTurn + " wins!");
	}
}

function GameOver(row, col, animate) {
	var tRow = row,
		tCol = col;
	var player = board[row][col],
		counter = 1;
	var x1, x2, y1, y2;

	//check horizontal, first to the right
	tCol = col + 1;
	while(tCol < n) {
		if(board[row][tCol] != player) {
			break;
		}

		tCol++;
		counter++;
	}
	x2 = tCol;

	//and to the left
	tCol = col - 1;
	while(tCol > 0) {
		if(board[row][tCol] != player) {
			break;
		}

		tCol--;
		counter++;
	}

	x1 = tCol;
	y1 = row;
	y2 = row;

	if(counter >= 4) {
		if(animate) {
			AnimateGameOver(x1+1, y1, x2, y2, 1, 0);
		}
		gameOver = true;
	}

	//check vertical, top first
	counter = 1;
	tRow = row - 1;
	while(tRow > 0) {
		if(board[tRow][col] != player) {
			break;
		}

		tRow--;
		counter++;
	}

	y1 = tRow;
	x1 = col;

	//and bottom
	tRow = row + 1;
	while(tRow < n) {
		if(board[tRow][col] != player) {
			break;
		}

		tRow++;
		counter++;
	}

	y2 = tRow;
	x2 = col;

	if(counter >= 4) {
		if(animate) {
			AnimateGameOver(x1, y1+1, x2, y2, 0, -1);
		}
		gameOver = true;
	}

	//check topleft-bottomright diagonal, topleft first
	counter = 1;
	tRow = row - 1;
	tCol = col - 1;
	while(tRow > 0 && tCol > 0) {
		if(board[tRow][tCol] != player) {
			break;
		}

		tRow--;
		tCol--;
		counter++;
	}

	x1 = tCol;
	y1 = tRow;

	//and bottomright
	tRow = row + 1;
	tCol = col + 1;
	while(tRow < n && tCol < n) {
		if(board[tRow][tCol] != player) {
			break;
		}

		tRow++;
		tCol++;
		counter++;
	}

	x2 = tCol;
	y2 = tRow;

	if(counter >= 4) {
		if(animate) {
			AnimateGameOver(x1+1, y1+1, x2, y2, 1, -1);
		}
		gameOver = true;
	}

	//diagonal topright-bottomleft, topright first
	counter = 1;
	tRow = row - 1;
	tCol = col + 1;
	while(tRow > 0 && tCol > 0) {
		if(board[tRow][tCol] != player) {
			break;
		}

		tRow--;
		tCol++;
		counter++;
	}

	x2 = tCol;
	y2 = tRow;

	//and bottomleft
	tRow = row + 1;
	tCol = col - 1;
	while(tRow < n && tCol < n) {
		if(board[tRow][tCol] != player) {
			break;
		}

		tRow++;
		tCol--;
		counter++;
	}

	x1 = tCol;
	y1 = tRow;

	if(counter >= 4) {
		if(animate) {
			AnimateGameOver(x1+1, y1-1, x2, y2, 1, 1);
		}
		gameOver = true;
	}
}

function AnimateGameOver(x1, y1, x2, y2, horizontal, vertical) {
	//horizontal
	if(horizontal == 1 && vertical == 0) {
		while(x1 < x2) {
			var index = (n * y1) + x1;
			$(tdSelector[index]).css("background-color", "red");
			x1++;
		}
	}

	//vertical
	if(horizontal == 0 && vertical == -1) {
		while(y1 < y2) {
			var index = (n * y1) + x1;
			$(tdSelector[index]).css("background-color", "red");
			y1++;
		}
	}

	//topleft-bottomright diagonal
	if(horizontal == 1 && vertical == -1) {
		while(x1 < x2 && y1 < y2) {
			var index = (n * y1) + x1;
			$(tdSelector[index]).css("background-color", "red");
			x1++;
			y1++;
		}
	}

	//bottomleft-topright diagonal
	if(horizontal == 1 && vertical == 1) {
		while(x1 < x2 && y1 > y2) {
			var index = (n * y1) + x1;
			$(tdSelector[index]).css("background-color", "red");
			x1++;
			y1--;
		}
	}
}

function FindWhereItLands(index) {
	var color = $(tdSelector[index + n]).css("background-color");
	while(index < tdLength && color == backgroundColor)
	{
		index = index + n;
		color = $(tdSelector[index + n]).css("background-color");
	}

	return index;
}

function FindWhereItLands1(index) {
	var row, col;
	row = parseInt(index / n);
	col = index % n;
	row++;
	while(row < n && board[row][col] == 0) {
		index = index + n;
		row++;
	}

	return index;
}

function AnimateColumn(cellNumber) {
	if(cellNumber > tdLength)
	{
		return;
	}
	//var currentTd = $(tdSelector[cellNumber]);
	//var nextTd = $(tdSelector[cellNumber + n]);
	var color = $(tdSelector[cellNumber + n]).css("background-color");

	if(color == backgroundColor)
	{
		if(playerTurn == 1)
		{
			$(tdSelector[cellNumber + n]).css("background-color", firstPlayerColor);
		}
		else
		{
			$(tdSelector[cellNumber + n]).css("background-color", secondPlayerColor);
		}

		$(tdSelector[cellNumber]).css("background-color", backgroundColor);
	}
	
	setTimeout(AnimateColumn, 50, cellNumber + n);
}

function RefreshBoard(row, col) {
	board[row][col] = playerTurn;
}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////AI related functions
function GetBestColumn() {
	var bestColumnScore = -99999999999,
		column = 0,
		currentColumnScore = 0;

	for (var i = 0; i < n; i++) {
		currentColumnScore = ColumnScore(i);
		if(currentColumnScore > bestColumnScore) {
			bestColumnScore = currentColumnScore;
			column = i;
		}
	}

	return column;
}

function ColumnScore(column) {
	if(board[0][column] != 0) {
		return -99999999999;
	}
	var fraction = 0.1;
	var columnScore = ColumnMovesNumber(column) - fraction * OpponentScore(column);
	//var columnScore = ColumnMovesNumber(column);
	//console.log("opponent score: " + OpponentScore(column));
	//console.log("column score: " + columnScore);
	return columnScore;
}

function OpponentScore(column) {
	if(board[0][column] != 0) {
		return 9999999999;
	}
	var row, col;
	col = column;
	row = parseInt(FindWhereItLands1(column) / n);
	board[row][col] = playerTurn;

	//console.log("opponentScore");

	SwitchPlayers();
	//PrintBoard();
	//console.log("player" + playerTurn);
	//PrintColumnsMovesNumber();
	var score = 0;

	for (var i = 0; i < n; i++) {
		score += ColumnMovesNumber(i);
	}

	board[row][col] = 0;
	SwitchPlayers();

	return score;
}

//The number of winning lines for given column
function ColumnMovesNumber(column) {
	var row, col;
	col = column;
	row = parseInt(FindWhereItLands1(column) / n);

	var movesNumber = 0;

	for (var i = 0; i < winMoves.length; i++) {
		if(CheckMove((winMoves[i]), row, col)) {
			movesNumber++;
			var winMove = winMoves[i];
			var count = 0;
			for (var j = 0; j < 4; j++) {
				if(board[winMove.row[j]][winMove.col[j]] == playerTurn) {
					count++;
				}
			}

			if (count == 3) {
				return 99999;
			}
		}
	}

	return movesNumber;
}

//checks if the move is playable for the given position
function CheckMove(winMove, row, col) {
	var isValid = true;
	var cross = false;
	var opponent;
	if(playerTurn == 1) {
		opponent = 2;
	}
	else {
		opponent = 1;
	}

	for (var i = 0; i < 4; i++) {
		if(board[winMove.row[i]][winMove.col[i]] == opponent) {
			isValid = false;
			break;
		}

		if(winMove.row[i] == row) {
			if (winMove.col[i] == col) {
				cross = true;
			}
		}
	}

	return (isValid && cross);
}

function SwitchPlayers() {
	if(playerTurn == 1) {
		playerTurn = 2;
	}
	else {
		playerTurn = 1;
	}
}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////tree part


function BuildTree(width, height) {
	var currentHeight = 1,
		currentWidth;

	var parent = 0, index = 0;
	var level = 0,
		levelWidth = 0;

	var treeValue = new TreeValue(-1, 0);
	treeNodes[index++] = new TreeNode(0, treeValue);
	treeNodes[0].value.index = 0;

	while(currentHeight < height) {
		var k = width;

		levelWidth = Math.pow(width, currentHeight);
		currentWidth = 0;
		while (currentWidth < levelWidth) {
			treeValue = new TreeValue(parent, 0);
			treeValue.column = width - k;
			treeNodes[index] = new TreeNode(0, treeValue);
			treeNodes[index].value.index = index;

			if(k == width) {
				treeNodes[parent].value.firstChild = index;
			}
			k--;
			if(k == 0) {
				parent++;
				k = width;
			}

			index++;
			currentWidth++;
		}

		currentHeight++;
	}
}

function GetLevelIndex(level) {
	level -= 2;
	var index = 0;
	while(level >= 0) {
		index += Math.pow(n, level);
		level--;
	}

	return index;
}

function GetPath(index) {
	var path = new Array();
	var i = 0;

	while(treeNodes[index].value.parent != -1) {
		path[i++] = treeNodes[index].value.column;
		index = treeNodes[index].value.parent;
	}

	return path;
}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////Alpha beta algorithm

function alphabeta(treeNode, depth, alpha, beta, Player) {
	var realIndex = treeNode.value.index;

	//if dropping piece is possible
	if(realIndex > 0 && !DropPiece(treeNode.value.column)) {
		if(Player == "max") {
			treeNodes[realIndex].key = 99999;
			return 99999;
		}
		else {
			treeNodes[realIndex].key = -99999;
			return -99999;
		}
	}

	//if game is over?
	GameOverCheck(false);
	if(gameOver) {
		gameOver = false;
		if(Player == "max") {
			treeNodes[realIndex].key = -99999;
			TakePiece(treeNode.value.column);
			return -99999;
		}
		else {
			treeNodes[realIndex].key = 99999;
			TakePiece(treeNode.value.column);
			return 99999;
		}
	}

	if(depth == 0) {
		var bestScore = GetBestColumnScore(realIndex);
		TakePiece(treeNode.value.column);
		return bestScore;
	}

	var childIndex = treeNode.value.firstChild;

	if(Player == "max") {
		if(childIndex != -1) {
			var i = 0;
			while(i < n) {
				alpha = max(alpha, alphabeta(treeNodes[childIndex], depth - 1, alpha, beta, not(Player)));
				treeNode.key = alpha;
				if(beta <= alpha) {
					break;
				}
				childIndex++;
				i++;
			}

			if(realIndex > 0) {
				TakePiece(treeNode.value.column);
			}
			return alpha;
		}
		else {
			console.log("No childs!");
		}
	}
	else {
		if(childIndex != -1) {
			var i = 0;
			while(i < n) {
				beta = min(beta, alphabeta(treeNodes[childIndex], depth - 1, alpha, beta, not(Player)));
				treeNode.key = beta;
				if(beta <= alpha) {
					break;
				}
				childIndex++;
				i++;
			}

			if(realIndex > 0) {
				TakePiece(treeNode.value.column);
			}
			return beta;
		}
		else {
			console.log("No childs!");
		}
	}
}

function not(Player) {
	if(Player == "max") {
		return "min";
	}
	else {
		return "max";
	}
}

function min(a, b) {
	if(a <= b) {
		return a;
	}
	else {
		return b;
	}
}

function max(a, b) {
	if(a >= b) {
		return a;
	}
	else {
		return b;
	}
}

function FindCol(alpha) {
	var i = 1;
	while(i < n + 1) {
		if(treeNodes[i].key == alpha) {
			return treeNodes[i].value.column;
		}
		i++;
	}

	return -1;
}

function DropPiece(column) {
	if(board[0][column] != 0) {
		return false;
	}

	var row = parseInt(FindWhereItLands1(column) / n);
	board[row][column] = playerTurn;
	SwitchPlayers();
	return true;
}

function TakePiece(column) {
	var row = 0;
	if(board[row][column] == 0) {
		row = parseInt(FindWhereItLands1(column) / n);
		row++;
	}
	board[row][column] = 0;
	SwitchPlayers();
}

function GetBestColumnScore() {
	var col = GetBestColumn();
	var score = ColumnScore(col);
	return score;
}
////////////////////////////////////////////////////////

function PrintBoard() {
	var line = "";
	for (var i = 0; i < n; i++) {
		line = "";
		for (var j = 0; j < n; j++) {
			line += board[i][j];
		}
		console.log(line);
	}
}

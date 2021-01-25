// board variables

var brd_side = COLOURS.WHITE;
var brd_pieces = new Array(BRD_SQ_NUM);
var brd_enPas = SQUARES.NO_SQ; // om en bonde går 2 steg framåt
var brd_fiftyMove;	// om man gör 50 (100 totalt)drag utan att röra bönderna eller att någon bonde är tagen så kan man begära oavgjort
var brd_hisPly;	// Denna håller reda på hur många drag som har gjorts; om 40 så har varje spelare gjort 20 drag var
var brd_ply; // alla halvdrag gjorda i sökträdet, om ply är 6 så har 46 drag gjorts
var brd_castlePerm;	//WKCA:WhiteKingSideCastle(4rutor rokad vit),WQCA:WhiteQueenSideCastle(5rutor rokad vit) osv
var brd_posKey;	
var brd_pceNum = new Array(13);  // hur många av varje pjäs (indexerad som PIECES: tom, vit bonde... svart kung)
var brd_material = new Array(2);	// white, black totala värdet av pjäser per färg
var brd_pList = new Array(14 * 10);	
/* vilken ruta befinner sig varje pjäs på 0-9 (vi har max 10 av varje pjäs, bonde blir drottning max 8 ggr=9drottningar)
, 10-19:vita bönder , 20-29... vita hästar osv
(t.ex 3vita bönder, positionerna finns då i, array index... 10, 11, 12)
pceNum[PIECES.wP] = 3 (3vita bönder)
for (pceNum = 0 ; pceNum < brd_pceNum; ++i){
	sq[pceNum] = brd_pList[PIECES.wP * 10 + pceNum];
}
vilket ger att
sq[1] = brd_pList[PIECES.wP * 10 + 0];
sq[2] = brd_pList[PIECES.wP * 10 + 1];
sq[3] = brd_pList[PIECES.wP * 10 + 2];

En funktion för att ta fram var en pjäs befinner sig är 
PCEINDEX(pce, pceNum)
och finns under defs.js
*/
var brd_history = [];

var brd_bookLines = [];

var brd_moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
var brd_moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
var brd_moveListStart = new Array(MAXDEPTH);

var brd_PvTable = [];	
var brd_PvArray = new Array(MAXDEPTH);
var brd_searchHistory = new Array(14 * BRD_SQ_NUM);
var brd_searchKillers = new Array(3 * MAXDEPTH);

// board functions

function BoardToFen() {
	var fenStr = '';
	var row,col,sq,piece;
	var emptyCount = 0;
	
	for(row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) {
		emptyCount = 0; 
		for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
			sq = fromRCMxToNumArrSq(col,row);
			piece = brd_pieces[sq];
			if(piece == PIECES.EMPTY) {
				emptyCount++;
			} else {
				if(emptyCount!=0) {
					fenStr += String.fromCharCode('0'.charCodeAt() + emptyCount);
				}
				emptyCount = 0;
				fenStr += PceChar[piece];
			}
		}
		if(emptyCount!=0) {
			fenStr += String.fromCharCode('0'.charCodeAt() + emptyCount);
		}
		
		if(row!=ROWS.ROW_1) {
			fenStr += '/'
		} else {
			fenStr += ' ';
		}
	}
	
	fenStr += SideChar[brd_side] + ' ';
	if(brd_enPas == SQUARES.NO_SQ) {
		fenStr += '- '
	} else {
		fenStr += PrSq(brd_enPas) + ' ';
	}
	
	if(brd_castlePerm == 0) {
		fenStr += '- '
	} else {
		if(brd_castlePerm & CASTLEBIT.WKCA) fenStr += 'K';
		if(brd_castlePerm & CASTLEBIT.WQCA) fenStr += 'Q';
		if(brd_castlePerm & CASTLEBIT.BKCA) fenStr += 'k';
		if(brd_castlePerm & CASTLEBIT.BQCA) fenStr += 'q';
	}
	fenStr += ' ';
	fenStr += brd_fiftyMove;
	fenStr += ' ';
	var tempHalfMove = brd_hisPly;
	if(brd_side == COLOURS.BLACK) {
		tempHalfMove--;
	}
	fenStr += tempHalfMove/2;	
	
	return fenStr;
}

function CheckBoard() {   
 
	var t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [ 0, 0];
	
	var sq64,t_piece,t_pce_num,sq120,colour,pcount;
	
	// check piece lists
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for(t_pce_num = 0; t_pce_num < brd_pceNum[t_piece]; ++t_pce_num) {
			sq120 = brd_pList[PCEINDEX(t_piece,t_pce_num)];
			if(brd_pieces[sq120]!=t_piece) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}	
	}
	
	// check piece count and other counters	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = brd_pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if(t_pceNum[t_piece]!=brd_pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return BOOL.FALSE;
			}	
	}
	
	if(t_material[COLOURS.WHITE]!=brd_material[COLOURS.WHITE] || t_material[COLOURS.BLACK]!=brd_material[COLOURS.BLACK]) {
				console.log('Error t_material');
				return BOOL.FALSE;
			}		
	if(brd_side!=COLOURS.WHITE && brd_side!=COLOURS.BLACK) {
				console.log('Error brd_side');
				return BOOL.FALSE;
			}
	if(GeneratePosKey()!=brd_posKey) {
				console.log('Error brd_posKey');
				return BOOL.FALSE;
			}
	
	 
	return BOOL.TRUE;	
}

function printGameLine() {

	var moveNum = 0;
	var gameLine = "";
	for(moveNum = 0; moveNum < brd_hisPly; ++moveNum) {
		gameLine += PrMove(brd_history[moveNum].move) + " ";
	}
	//console.log('Game Line: ' + gameLine);
	return $.trim(gameLine);
	
}

function LineMatch(BookLine,gameline) {
	//console.log("Matching " + gameline + " with " + BookLine + " len = " + gameline.length);
	for(var len = 0; len < gameline.length; ++len) {
		//console.log("Char Matching " + gameline[len] + " with " + BookLine[len]);
		if(len>=BookLine.length) { /*console.log('no match');*/ return BOOL.FALSE;	}	
		if(gameline[len] != BookLine[len]) { /*console.log('no match'); */return BOOL.FALSE;	}	
	}
	//console.log('Match');
	return BOOL.TRUE;
}

function BookMove() {

	var gameLine = printGameLine();
	var bookMoves = [];
	
	var lengthOfLineHack = gameLine.length;
	
	if(gameLine.length == 0) lengthOfLineHack--;
	
	for(var bookLineNum = 0; bookLineNum <brd_bookLines.length; ++bookLineNum) {
		
		if(LineMatch(brd_bookLines[bookLineNum],gameLine) == BOOL.TRUE) {
			var move = brd_bookLines[bookLineNum].substr(lengthOfLineHack + 1, 4);
			//console.log("Parsing book move:" + move);
			if(move.length==4) {
				var from = SqFromAlg(move.substr(0,2));
				var to = SqFromAlg(move.substr(2,2));
				//console.log('from:'+from+' to:'+to);
				varInternalMove = ParseMove(from,to);
				//console.log("varInternalMove:" + PrMove(varInternalMove));
				bookMoves.push(varInternalMove);
			} 
		}
		  
	}
	
	console.log("Total + " + bookMoves.length + " moves in array");
	
	if(bookMoves.length==0) return NOMOVE;
	
	var num = Math.floor(Math.random()*bookMoves.length);
	
	return bookMoves[num];
}

function PrintPceLists() { // Här skriver vi ut Pjäslistan
// t.ex svart bonde på 33 ger Piece P on D4... vi använder PceChar (defs.js PceChar = ".PNBRQKpnbrqk";) och PrSq (PrSq från io.js)
	var piece,pceNum;
	
	for(piece=PIECES.wP; piece <= PIECES.bK; ++piece) {
		for(pceNum = 0; pceNum < brd_pceNum[piece]; ++pceNum) {
			console.log("Piece " + PceChar[piece] + " on " + PrSq(brd_pList[PCEINDEX(piece,pceNum)]));
		}
	}

}

function UpdateListsMaterial() {	// Fyller brd_pList,brd_material[colour]


	
	var piece,sq,index,colour;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {  // kör igenom alla rutor, även de utanför
		sq = index;
		piece = brd_pieces[index]; // piece får värdet som rutan har t.ex piece = PIECES.bQ -> piece = 11
		if(piece != PIECES.OFFBOARD && piece != PIECES.EMPTY) { //om pjäs inte är offboard och om pjäs inte är tom
			
			/* PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];*/
			colour = PieceCol[piece];		// färg på pjäs på rutan, t.ex PIECES.bQ som är värd = 11 -> PieceCol[11] =COLOURS.BLACK
			
			// pjäs värde vit : 100 bonde, 325 löpare och häst, 550 torn, 1000 drottning 50000 kung, svarta pjäser: ...
			brd_material[colour] += PieceVal[piece]; 
			/* värde på pjäs på ruta, .ex PIECES.bQ som är värd = 11 -> PieceVal[11]=1000
			värdena adderas beroende på vilken färg pjäsen har. T.ex om vi först påträffar bQ och efter bR så kommer 
			brd_material[COLOURS.BLACK] vara värt 1550
			om sedan nästa pjäs är wQ så kommer 
			brd_material[COLOURS.BLACK] vara värt 1550
			och 
			brd_material[COLOURS.WHITE] vara värt 1000
			*/
			
			brd_pList[PCEINDEX(piece,brd_pceNum[piece])] = sq; 
			/* brd_pceNum[piece] är VILKEN pjäs om det finns fler av en sort. 
			t. ex om vi hittar en svart drottning så är brd_pceNum[PIECES.bQ] = 0 för denna 
			eftersom vi vid resetBoard() har nollställt varje pjäsAntal (brd_pceNum[index] = 0;)
			och 
			PCEINDEX(piece,brd_pceNum[piece]) = PCEINDEX(11,0) = 110 + 0 = 110 
			
			function PCEINDEX(pce, pceNum) {
				return (pce * 10 + pceNum);
			}
			
			och 
			brd_pList[110] = 1; (första svarta drottningen får index 110 och hittas på ruta 1 alltså andra rutan om vi börjar på 0)
			
			
			*/
			brd_pceNum[piece]++;	
			/*
			nu ökas brd_pceNum med 1 och om vi har en svart drottning till så kommer den i forloopen att ge
			t. ex brd_pList[111] = 42; 
			(andra svarta drottningen får index 111 och hittas på ruta 42)
			
			Vill vi nu få tag i den andra drottningens position så skriver vi brd_pList[PCEINDEX(piece,brd_pceNum[piece])]
			vilket då är brd_pList[PCEINDEX(11, 1)] = 42 alltså hittas den andra svarta drottningen på ruta 42
			*/
		}
	}
}

function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;
	
	// pieces
	for(sq = 0; sq < BRD_SQ_NUM; ++sq) { // gå igenom alla rutor
		piece = brd_pieces[sq]; // pjäs på en ruta
		if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {	// om rutan inte är tom och inte utanför brädan, alltså pjäs existerar
			finalKey ^= PieceKeys[(piece * 120) + sq]; // "hasha in" denna nyckel i finalKey
		}		
	}
	
	if(brd_side == COLOURS.WHITE) { //om vit
		finalKey ^= SideKey;
	}
		
	if(brd_enPas != SQUARES.NO_SQ) {		// om  enPas inte är en icke sq?
		finalKey ^= PieceKeys[brd_enPas];
	}
	
	finalKey ^= CastleKeys[brd_castlePerm];
	
	return finalKey;
}

function PrintBoard() {
	
	var sq,col,row,piece;

	console.log("\nGame Board:\n");
	
	for(row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) { // för varje rad
		var line =((row+1) + "| "); // initiera line och sätt denna till rad nummer och ett streck
		for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) { // kolumner
			sq = fromRCMxToNumArrSq(col,row);   // ta reda på NumArrSq för rutan
			piece = brd_pieces[sq]; // sätt piece till vad rutan innehåller
			line += (" " + PceChar[piece] + " "); // addera pjäs till raden som skrivs ut
		}
		console.log(line); // skriv ut raden
	} 
	
	console.log("--------------------------------"); // efter rad loopen skriv streck
	var line = "   ";  // sätt ny line till "   "
	for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
		line += (' ' + String.fromCharCode('a'.charCodeAt() + col) + ' ');	
		/* addera bokstav och space till line 
		col representerar en siffra så 
		String.fromCharCode('a'.charCodeAt() + 0) blir "a"
		String.fromCharCode('a'.charCodeAt() + 1) blir "b"
		*/
	}
	console.log(line);
	console.log("side:" + SideChar[brd_side] ); 
	// SideChar är definierad i defs.js som SideChar = "wb-"; brd_side sätts i ParseFen funktionen
	console.log("enPas:" + brd_enPas);
	line = "";	
	if(brd_castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(brd_castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(brd_castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(brd_castlePerm & CASTLEBIT.BQCA) line += 'q';
	
	console.log("castle:" + line);
	console.log("key:" + brd_posKey.toString(16));
	//PrintPceLists();
}

function ResetBoard() {

	var index = 0;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		brd_pieces[index] = SQUARES.OFFBOARD;
	}
	
	for(index = 0; index < 64; ++index) {
		brd_pieces[SQ120(index)] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 14 * 120; ++index) {
		brd_pList[index] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 2; ++index) {		
		brd_material[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		brd_pceNum[index] = 0;
	}
	
	brd_side = COLOURS.BOTH;
	brd_enPas = SQUARES.NO_SQ;
	brd_fiftyMove = 0;	
	brd_ply = 0;
	brd_hisPly = 0;	
	brd_castlePerm = 0;	
	brd_posKey = 0;
	brd_moveListStart[brd_ply] = 0;
	
}

function ParseFen(fen) { // läser Fen strängen och ger värden till brd_pieces[] = piece, t.ex brd_pieces[26] = piece = PIECES.bQ = 11
	
	var row = ROWS.ROW_8;
    var col = COLUMNS.COL_A;
    var piece = 0; // piece varierar i varje loop, sätt till piece eller till empty, om brädet är nollställt så är brädets rutor EMPTY
    var count = 0;
    var i = 0; 
	var sq64 = 0; 
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt] peka på en viss char i fen stringen
	
	ResetBoard(); // Funktionen finns precis över denna funktion
	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	
	while ((row >= ROWS.ROW_1) && fenCnt < fen.length) { // while som går igenom raderna nerifrån och upp och fen strängen tills de är slut
	    count = 1;
		switch (fen[fenCnt]) { // switch fensträngen
            case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break; // PIECES.bQ som är värd = 11
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt(); 
				/* count sätts till 1 om bokstav eller symbol, men för tomma rutor så kan count bli större
				 Exempel om fen är 6 så kommer count att bli 6. Den kör då en for
				 http://www.w3schools.com/js/tryit.asp?filename=tryjs_math_random
				 <script>
var fen = "345623";
var fenCnt=3;
var count = fen[fenCnt].charCodeAt() - '0'.charCodeAt(); 
document.write(count);
</script>
				 */
                break;

            case '/': // ny rad uppåt
            case ' ': // ny rad uppåt
                row--;
                col = COLUMNS.COL_A; // col sätts till vänster för det blir ny rad
                fenCnt++; // vi går till nästa symbol direkt
                continue; // vi struntar i att sätta pjäs till något och hoppar vidare i while loopen  

            default:
                printf("FEN error \n");
                return; // om något annat t.ex w eller b så hoppar vi ur whileloopen...
        }
		
		for (i = 0; i < count; i++) {// körs bara en gång om bokstav eller symbol... körs fler gånger bara om tomma rutor
            sq64 = row * 8 + col;  // vi tittar på 64 brädets NumArrSq
			sq120 = SQ120(sq64);    // vi gör om till 120 brädets position
            if (piece != PIECES.EMPTY) { // om EJ tom sätt brd_pieces på 120 brädet till den pjäs som finns där
                brd_pieces[sq120] = piece; // t.ex PIECES.bQ som är värd = 11
            }
			col++;
			/* Om bokstav så ökar vi col med 1 men är det fler tomma rutor så kan col hoppa längre
			om tomma rutor så sätter vi inte brd_pieces till något eftersom dessa då redan är satta till EMPTY
			*/
        }
		fenCnt++; // vi går till nästa symbol
	}	
	// eftersom fen har nått till w eller b så har den hoppat ur whileloopen. Tittar vi på värdet så har vi antingen w eller b
	brd_side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK; // sätt till vit om w annars så sätt till svart
	fenCnt += 2; // hoppa fram 2 steg i Fen strängen och titta på om vi har rokad villkor
	
	for (i = 0; i < 4; i++) { 
	/*loopen betraktar KQkq som en symbol... efterom fenCnt ökar inuti forloopen
	om vi har KQk så kommer fenCnt att öka tre steg i loopen. 
	*/
        if (fen[fenCnt] == ' ') { // om tom hoppa till nästa, sker efter rokad symboler t.ex efter KQk 
            break;
        }		
		switch(fen[fenCnt]) { 
			case 'K': brd_castlePerm |= CASTLEBIT.WKCA; break; // hasha in WKCA
			case 'Q': brd_castlePerm |= CASTLEBIT.WQCA; break; // hasha in WQCA
			case 'k': brd_castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': brd_castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCnt++; // vi ökar fenCnt efter varje bokstav
	}
	fenCnt++;	// nu går den till nästa char i Fen som kan vara - eller 0 eller 1
	
	if (fen[fenCnt] != '-') {        // om ej - , alltså om 0 eller 1
		col = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		row = fen[fenCnt+1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " col:" + col + " row:" + row);	
		brd_enPas = fromRCMxToNumArrSq(col,row);		
    }
    
    brd_posKey = GeneratePosKey();
    UpdateListsMaterial();
}

function SqAttacked(sq, side) { // Tittar på om rutan hotas av någon pjäs, vi behöver aktuell ruta och vi behöver färg
	var pce;
	var t_sq;
	var index;
	
	// Hotar bonde?
	if(side == COLOURS.WHITE) {
		if(brd_pieces[sq-11] == PIECES.wP || brd_pieces[sq-9] == PIECES.wP) {
			return BOOL.TRUE;
		}
	} else {
		if(brd_pieces[sq+11] == PIECES.bP || brd_pieces[sq+9] == PIECES.bP) {
			return BOOL.TRUE;
		}	
	}
	
	// Hotar häst?
	for(index = 0; index < 8; ++index) {		
		pce = brd_pieces[sq + KnDir[index]];
		if(pce != SQUARES.OFFBOARD && PieceKnight[pce] == BOOL.TRUE && PieceCol[pce] == side) {
			return BOOL.TRUE;
		}
	}
	
	// Hotar torn ELLER DROTTNING?
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = brd_pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = brd_pieces[t_sq];
		}
	}
	
	// Hotar löpare ELLER DROTTNING?
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = brd_pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = brd_pieces[t_sq];
		}
	}
	
	// Hotar kung?
	for(index = 0; index < 8; ++index) {		
		pce = brd_pieces[sq + KiDir[index]];
		if(pce != SQUARES.OFFBOARD && PieceKing[pce] == BOOL.TRUE && PieceCol[pce] == side) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
}

function PrintSqAttacked() { // Skriv ut om rutan är hotad
	
	var sq,col,row,piece;

	console.log("\nAttacked:\n");
	
	for(row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) {
		var line =((row+1) + "  ");
		for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
			sq = fromRCMxToNumArrSq(col,row);
			if(SqAttacked(sq, COLOURS.BLACK) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
}













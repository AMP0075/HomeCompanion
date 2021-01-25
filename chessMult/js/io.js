function SqFromAlg(moveAlg) {

	//console.log('SqFromAlg' + moveAlg);
	if(moveAlg.length != 2) return SQUARES.NO_SQ;
	
	if(moveAlg[0] > 'h' || moveAlg[0] < 'a' ) return SQUARES.NO_SQ;
	if(moveAlg[1] > '8' || moveAlg[1] < '1' ) return SQUARES.NO_SQ;
	
	col = moveAlg[0].charCodeAt() - 'a'.charCodeAt();
	row = moveAlg[1].charCodeAt() - '1'.charCodeAt();	
	
	return fromRCMxToNumArrSq(col,row);		
}

function PrintMoveList() {
	var index;
	var move;
	console.log("MoveList:");
	
	for(index = brd_moveListStart[brd_ply]; index < brd_moveListStart[brd_ply + 1]; ++index) {
	
		move = brd_moveList[index];	
		console.log("Move:" + (index+1) + " > " + PrMove(move));
		
	}
}

function PrSq(sq) { // Ta fram t.ex A1 från 00, sqStr returnerar då A1
	var col = ColBrd[sq];
	var row = RowBrd[sq];
	
	var sqStr = String.fromCharCode('a'.charCodeAt() + col) + String.fromCharCode('1'.charCodeAt() + row);
	return sqStr;
}

function PrMove(move) {

	var MvStr;
	
	var ff = ColBrd[FROMSQ(move)];
	var rf = RowBrd[FROMSQ(move)];
	var ft = ColBrd[TOSQ(move)];
	var rt = RowBrd[TOSQ(move)];
	
	MvStr = String.fromCharCode('a'.charCodeAt() + ff) + String.fromCharCode('1'.charCodeAt() + rf) + 
				String.fromCharCode('a'.charCodeAt() + ft) + String.fromCharCode('1'.charCodeAt() + rt)
				
	var promoted = PROMOTED(move);
	
	if(promoted != PIECES.EMPTY) {
		var pchar = 'q';
		if(PieceKnight[promoted] == BOOL.TRUE) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == BOOL.TRUE && PieceBishopQueen[promoted] == BOOL.FALSE)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == BOOL.FALSE && PieceBishopQueen[promoted] == BOOL.TRUE)   {
			pchar = 'b';
		}
		 MvStr += pchar;		
	} 	
	return MvStr;
}

function ParseMove(from, to) {
	
    GenerateMoves();     
   
	var Move = NOMOVE;
	var PromPce = PIECES.EMPTY;
	var found = BOOL.FALSE;
	for(index = brd_moveListStart[brd_ply]; index < brd_moveListStart[brd_ply + 1]; ++index) {	
		Move = brd_moveList[index];	
		if(FROMSQ(Move)==from && TOSQ(Move)==to) {
			PromPce = PROMOTED(Move);
			if(PromPce!=PIECES.EMPTY) {
				if( (PromPce==PIECES.wQ && brd_side==COLOURS.WHITE) || (PromPce==PIECES.bQ && brd_side==COLOURS.BLACK) ) {
					found = BOOL.TRUE;
					break;
				}
				continue;
			}
			found = BOOL.TRUE;
			break;
		}
    }
	
	if(found != BOOL.FALSE) {
		if(MakeMove(Move) == BOOL.FALSE) {
			return NOMOVE;
		}
		TakeMove();
		return Move;
	}
	
    return NOMOVE;	
}
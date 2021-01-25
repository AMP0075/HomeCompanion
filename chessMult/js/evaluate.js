var RookOpenCol = 10;
var RookSemiOpenCol = 5;
var QueenOpenCol = 5;
var QueenSemiOpenCol = 3;
var BishopPair = 30;

var PawnRowsWhite = new Array(10);
var PawnRowsBlack = new Array(10);

var PawnIsolated = -10;
var PawnPassed = [ 0, 5, 10, 20, 35, 60, 100, 200 ]; 

var PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var BishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var KingE = [	
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	,
	-10,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	0	,	10	,	20	,	20	,	20	,	20	,	10	,	0	,
	0	,	10	,	20	,	40	,	40	,	20	,	10	,	0	,
	0	,	10	,	20	,	40	,	40	,	20	,	10	,	0	,
	0	,	10	,	20	,	20	,	20	,	20	,	10	,	0	,
	-10,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	
];

var KingO = [	
	0	,	5	,	5	,	-10	,	-10	,	0	,	10	,	5	,
	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,
	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70		
];

function MaterialDraw() {
    if (0 == brd_pceNum[PIECES.wR] && 0 == brd_pceNum[PIECES.bR] && 0 == brd_pceNum[PIECES.wQ] && 0 == brd_pceNum[PIECES.bQ]) {
	  if (0 == brd_pceNum[PIECES.bB] && 0 == brd_pceNum[PIECES.wB]) {
	      if (brd_pceNum[PIECES.wN] < 3 && brd_pceNum[PIECES.bN] < 3) {  return BOOL.TRUE; }
	  } else if (0 == brd_pceNum[PIECES.wN] && 0 == brd_pceNum[PIECES.bN]) {
	     if (Math.abs(brd_pceNum[PIECES.wB] - brd_pceNum[PIECES.bB]) < 2) { return BOOL.TRUE; }
	  } else if ((brd_pceNum[PIECES.wN] < 3 && 0 == brd_pceNum[PIECES.wB]) || (brd_pceNum[PIECES.wB] == 1 && 0 == brd_pceNum[PIECES.wN])) {
	    if ((brd_pceNum[PIECES.bN] < 3 && 0 == brd_pceNum[PIECES.bB]) || (brd_pceNum[PIECES.bB] == 1 && 0 == brd_pceNum[PIECES.bN]))  { return BOOL.TRUE; }
	  }
	} else if (0 == brd_pceNum[PIECES.wQ] && 0 == brd_pceNum[PIECES.bQ]) {
        if (brd_pceNum[PIECES.wR] == 1 && brd_pceNum[PIECES.bR] == 1) {
            if ((brd_pceNum[PIECES.wN] + brd_pceNum[PIECES.wB]) < 2 && (brd_pceNum[PIECES.bN] + brd_pceNum[PIECES.bB]) < 2)	{ return BOOL.TRUE; }
        } else if (brd_pceNum[PIECES.wR] == 1 && 0 == brd_pceNum[PIECES.bR]) {
            if ((brd_pceNum[PIECES.wN] + brd_pceNum[PIECES.wB] == 0) && (((brd_pceNum[PIECES.bN] + brd_pceNum[PIECES.bB]) == 1) || ((brd_pceNum[PIECES.bN] + brd_pceNum[PIECES.bB]) == 2))) { return BOOL.TRUE; }
        } else if (brd_pceNum[PIECES.bR] == 1 && 0 == brd_pceNum[PIECES.wR]) {
            if ((brd_pceNum[PIECES.bN] + brd_pceNum[PIECES.bB] == 0) && (((brd_pceNum[PIECES.wN] + brd_pceNum[PIECES.wB]) == 1) || ((brd_pceNum[PIECES.wN] + brd_pceNum[PIECES.wB]) == 2))) { return BOOL.TRUE; }
        }
    }
  return BOOL.FALSE;
}

var ENDGAME_MAT = 1 * PieceVal[PIECES.wR] + 2 * PieceVal[PIECES.wN] + 2 * PieceVal[PIECES.wP] + PieceVal[PIECES.wK];

function PawnsInit() {
	var index = 0;
	
	for(index = 0; index < 10; ++index) {				
		PawnRowsWhite[index] = ROWS.ROW_8;			
		PawnRowsBlack[index] = ROWS.ROW_1;
	}
	
	pce = PIECES.wP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(RowBrd[sq] < PawnRowsWhite[ColBrd[sq]+1]) {
			PawnRowsWhite[ColBrd[sq]+1] = RowBrd[sq];
		}
	}	

	pce = PIECES.bP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(RowBrd[sq] > PawnRowsBlack[ColBrd[sq]+1]) {
			PawnRowsBlack[ColBrd[sq]+1] = RowBrd[sq];
		}			
	}	
}

function EvalPosition() {

	var pce;
	var pceNum;
	var sq;
	var score = brd_material[COLOURS.WHITE] - brd_material[COLOURS.BLACK];
	var col;
	var row;
	if(0 == brd_pceNum[PIECES.wP] && 0 == brd_pceNum[PIECES.bP] && MaterialDraw() == BOOL.TRUE) {
		return 0;
	}
	
	PawnsInit();
	
	pce = PIECES.wP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += PawnTable[SQ64(sq)];	
		col = ColBrd[sq]+1;
		row = RowBrd[sq];
		if(PawnRowsWhite[col-1]==ROWS.ROW_8 && PawnRowsWhite[col+1]==ROWS.ROW_8) {
			score += PawnIsolated;
		}
		
		if(PawnRowsBlack[col-1]<=row && PawnRowsBlack[col]<=row && PawnRowsBlack[col+1]<=row) {
			score += PawnPassed[row];
		}
	}	

	pce = PIECES.bP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];	
		col = ColBrd[sq]+1;
		row = RowBrd[sq];
		if(PawnRowsBlack[col-1]==ROWS.ROW_1 && PawnRowsBlack[col+1]==ROWS.ROW_1) {
			score -= PawnIsolated;
		}	
		
		if(PawnRowsWhite[col-1]>=row && PawnRowsWhite[col]>=row && PawnRowsWhite[col+1]>=row) {
			score -= PawnPassed[7-row];
		}	
	}	
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
	}	

	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}			
	
	pce = PIECES.wB;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += BishopTable[SQ64(sq)];
	}	

	pce = PIECES.bB;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
	}	

	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];	
		col = ColBrd[sq]+1;
		if(PawnRowsWhite[col]==ROWS.ROW_8) {
			if(PawnRowsBlack[col]==ROWS.ROW_1) {
				score += RookOpenCol;
			} else  {
				score += RookSemiOpenCol;
			}
		}
	}	

	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];	
		col = ColBrd[sq]+1;
		if(PawnRowsBlack[col]==ROWS.ROW_1) {
			if(PawnRowsWhite[col]==ROWS.ROW_8) {
				score -= RookOpenCol;
			} else  {
				score -= RookSemiOpenCol;
			}
		}
	}
	
	pce = PIECES.wQ;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];	
		col = ColBrd[sq]+1;
		if(PawnRowsWhite[col]==ROWS.ROW_8) {
			if(PawnRowsBlack[col]==ROWS.ROW_1) {
				score += QueenOpenCol;
			} else  {
				score += QueenSemiOpenCol;
			}
		}
	}	

	pce = PIECES.bQ;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];	
		col = ColBrd[sq]+1;
		if(PawnRowsBlack[col]==ROWS.ROW_1) {
			if(PawnRowsWhite[col]==ROWS.ROW_8) {
				score -= QueenOpenCol;
			} else  {
				score -= QueenSemiOpenCol;
			}
		}
	}	
	
	pce = PIECES.wK;
	sq = brd_pList[PCEINDEX(pce,0)];
	
	if( (brd_material[COLOURS.BLACK] <= ENDGAME_MAT) ) {
		score += KingE[SQ64(sq)];
	} else {
		score += KingO[SQ64(sq)];
	}
	
	pce = PIECES.bK;
	sq = brd_pList[PCEINDEX(pce,0)];
	
	if( (brd_material[COLOURS.WHITE] <= ENDGAME_MAT) ) {
		score -= KingE[MIRROR64(SQ64(sq))];
	} else {
		score -= KingO[MIRROR64(SQ64(sq))];
	}
	
	if(brd_pceNum[PIECES.wB] >= 2) score += BishopPair;
	if(brd_pceNum[PIECES.bB] >= 2) score -= BishopPair;
	
	if(brd_side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}	
}
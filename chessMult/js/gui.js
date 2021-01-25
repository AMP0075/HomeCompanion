var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

var MirrorCols = [ COLUMNS.COL_H, COLUMNS.COL_G, COLUMNS.COL_F, COLUMNS.COL_E, COLUMNS.COL_D, COLUMNS.COL_C, COLUMNS.COL_B, COLUMNS.COL_A ];
var MirrorRows = [ ROWS.ROW_8, ROWS.ROW_7, ROWS.ROW_6, ROWS.ROW_5, ROWS.ROW_4, ROWS.ROW_3, ROWS.ROW_2, ROWS.ROW_1 ];

function MIRROR120(sq) {
	var col = MirrorCols[ColBrd[sq]];
	var row = MirrorRows[RowBrd[sq]];
	return fromRCMxToNumArrSq(col,row);
}
// I index.html hittar vi SetFen och fenIn, #SetFen används här för att peka på  <button type="button" id="SetFen">Set Position</button>	 
$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();	// .val() för att få värdet som vi har i <input type="text" id="fenIn"/>				
	ParseFen(fenStr);
	PrintBoard();		
	SetInitialBoardPieces();	
	GameController.PlayerSide = brd_side;	
	CheckAndSet();	
	EvalPosition();	
	//PerftTest(5);
	newGameAjax();	 
});

function CheckResult() {

    if (brd_fiftyMove > 100) {
     $("#GameStatus").text("GAME DRAWN {fifty move rule}"); 
     return BOOL.TRUE;
    }

    if (ThreeFoldRep() >= 2) {
     $("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
     return BOOL.TRUE;
    }
	
	if (DrawMaterial() == BOOL.TRUE) {
     $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
     return BOOL.TRUE;
    }
	
	console.log('Checking end of game');
	GenerateMoves();
      
    var MoveNum = 0;
	var found = 0;
	for(MoveNum = brd_moveListStart[brd_ply]; MoveNum < brd_moveListStart[brd_ply + 1]; ++MoveNum)  {	
       
        if ( MakeMove(brd_moveList[MoveNum]) == BOOL.FALSE)  {
            continue;
        }
        found++;
		TakeMove();
		break;
    }
    
    $("#currentFenSpan").text(BoardToFen()); 
	
	if(found != 0) return BOOL.FALSE;
	var InCheck = SqAttacked(brd_pList[PCEINDEX(Kings[brd_side],0)], brd_side^1);
	console.log('No Move Found, incheck:' + InCheck);
	
	if(InCheck == BOOL.TRUE)	{
	    if(brd_side == COLOURS.WHITE) {
	      $("#GameStatus").text("GAME OVER {black mates}");return BOOL.TRUE;
        } else {
	      $("#GameStatus").text("GAME OVER {white mates}");return BOOL.TRUE;
        }
    } else {
      $("#GameStatus").text("GAME DRAWN {stalemate}");return BOOL.TRUE;
    }	
    console.log('Returning False');
	return BOOL.FALSE;	
}

function ClickedSquare(pageX, pageY) {
	var position = $("#Board").position();
	console.log("Piece clicked at " + pageX + "," + pageY + " board top:" + position.top + " board left:" + position.left);
	
	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);
	var pageX = Math.floor(pageX);
	var pageY = Math.floor(pageY);
	
	var col = Math.floor((pageX-workedX) / 60);
	var row = 7 - Math.floor((pageY-workedY) / 60);
	
	var sq = fromRCMxToNumArrSq(col,row);
	
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	
	console.log("WorkedX: " + workedX + " WorkedY:" + workedY + " col:" + col + " row:" + row);
	console.log("clicked:" + PrSq(sq));	
	
	SetSqSelected(sq); // must go here before mirror
	
	return sq;

}

function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE; // save the game here
	}
	//var fenStr = BoardToFen();
	 $("#currentFenSpan").text(BoardToFen());
}

function PreSearch() {
		
		if(GameController.GameOver != BOOL.TRUE) {				
			srch_thinking = BOOL.TRUE;
			$('#ThinkingImageDiv').append('<image src="images/think3.png" id="ThinkingPng"/>')
			setTimeout( function() {StartSearch(); }, 200);
		}
}

function MakeUserMove() {
	if(UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
		console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));
		
		var parsed = ParseMove(UserMove.from,UserMove.to);
		
		DeselectSq(UserMove.from);
		DeselectSq(UserMove.to);
		
		console.log("Parsed:" + parsed);
		
		if(parsed != NOMOVE) {
			MakeMove(parsed);
			MoveGUIPiece(parsed);
			CheckAndSet();
			PreSearch();
		}
		
		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ; 	
		
	}
}

$(document).on('click','.Piece', function (e) {	
	console.log("Piece Click");
	if(srch_thinking == BOOL.FALSE && GameController.PlayerSide == brd_side) {
		if(UserMove.from == SQUARES.NO_SQ) 
			UserMove.from = ClickedSquare(e.pageX, e.pageY);
		else 
			UserMove.to = ClickedSquare(e.pageX, e.pageY);	
		
		MakeUserMove();	
	}	
});

$(document).on('click','.Square', function (e) {	
	console.log("Square Click");
	if(srch_thinking == BOOL.FALSE && GameController.PlayerSide == brd_side && UserMove.from != SQUARES.NO_SQ) {
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove();
	}
});

function RemoveGUIPiece(sq) {
	//console.log("remove on:" + PrSq(sq));
	$( ".Piece" ).each(function( index ) {
		 //console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );
		 if( (RowBrd[sq] == 7 - Math.round($(this).position().top/60)) && (ColBrd[sq] == Math.round($(this).position().left/60)) ){		
		 	//console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );	
			$(this).remove();			
		 }
		});
}

function AddGUIPiece(sq,pce) {	
	var row = RowBrd[sq];
	var col = ColBrd[sq];
	var rowName = "row" + (row + 1);	
	var colName = "col" + (col + 1);	
	pieceColName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	imageString = "<image src=\"" + pieceColName + "\" class=\"Piece clickElement " + rowName + " " + colName + "\"/>";
	//console.log("add on " + imageString);
	$("#Board").append(imageString);
}

function MoveGUIPiece(move) {
	var from = FROMSQ(move);
	var to = TOSQ(move);
	
	var flippedFrom = from;
	var flippedTo = to;
	var epWhite = -10;
	var epBlack = 10;
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		flippedFrom = MIRROR120(from);
		flippedTo = MIRROR120(to);
		epWhite = 10;
		epBlack = -10;
	}
	
	if(move & MFLAGEP) {	
		var epRemove;			
		if(brd_side == COLOURS.BLACK) {
			epRemove = flippedTo + epWhite;
		} else {
			epRemove = flippedTo + epBlack;
		}
		console.log("en pas removing from " + PrSq(epRemove));
		RemoveGUIPiece(epRemove);
	} else if(CAPTURED(move)) {
		RemoveGUIPiece(flippedTo);
	}
	
	var row = RowBrd[flippedTo];
	var col = ColBrd[flippedTo];
	var rowName = "row" + (row + 1);	
	var colName = "col" + (col + 1);
	
	/*if(GameController.BoardFlipped == BOOL.TRUE) {
		rowName += "flip";
		colName += "flip";
	}*/
	
	$( ".Piece" ).each(function( index ) {
     //console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );
     if( (RowBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && (ColBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     	//console.log("Setting pic ff:" + ColBrd[from] + " rf:" + RowBrd[from] + " tf:" + ColBrd[to] + " rt:" + RowBrd[to]);
     	$(this).removeClass();
     	$(this).addClass("Piece clickElement " + rowName + " " + colName);     
     }
    });
    
    if(move & MFLAGCA) {  
    	if(GameController.BoardFlipped == BOOL.TRUE) {  	
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(MIRROR120(SQUARES.H1));AddGUIPiece(MIRROR120(SQUARES.F1),PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(MIRROR120(SQUARES.A1));AddGUIPiece(MIRROR120(SQUARES.D1),PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(MIRROR120(SQUARES.H8));AddGUIPiece(MIRROR120(SQUARES.F8),PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(MIRROR120(SQUARES.A8));AddGUIPiece(MIRROR120(SQUARES.D8),PIECES.bR); break;    			
			}  
		} else {
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(SQUARES.H1);AddGUIPiece(SQUARES.F1,PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(SQUARES.A1);AddGUIPiece(SQUARES.D1,PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(SQUARES.H8);AddGUIPiece(SQUARES.F8,PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(SQUARES.A8);AddGUIPiece(SQUARES.D8,PIECES.bR); break;    			
			}  
		}  	
    }
    var prom = PROMOTED(move);
    console.log("PromPce:" + prom);
    if(prom != PIECES.EMPTY) {
		console.log("prom removing from " + PrSq(flippedTo));
    	RemoveGUIPiece(flippedTo);
    	AddGUIPiece(flippedTo,prom);
    }
    
    printGameLine();
}

function DeselectSq(sq) {

	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	
	$( ".Square" ).each(function( index ) {     
     if( (RowBrd[sq] == 7 - Math.round($(this).position().top/60)) && (ColBrd[sq] == Math.round($(this).position().left/60)) ){     	
     	$(this).removeClass('SqSelected');    
     }
    });
}

function SetSqSelected(sq) {
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	
	$( ".Square" ).each(function( index ) {    
	//console.log("Looking Sq Selected RowBrd[sq] " + RowBrd[sq] + " ColBrd[sq] " + ColBrd[sq] + " position " + Math.round($(this).position().left/60) + "," + Math.round($(this).position().top/60));	
     if( (RowBrd[sq] == 7 - Math.round($(this).position().top/60)) && (ColBrd[sq] == Math.round($(this).position().left/60)) ){   
		//console.log("Setting Selected Sq");
     	$(this).addClass('SqSelected');    
     }
    });
}

function StartSearch() {
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	SearchPosition(); 	
	
	// TODO MakeMove here on internal board and GUI
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	$('#ThinkingPng').remove();
	CheckAndSet();
	//$("#SaveToSQL").text("Saved: " + BoardToFen());
	$("#lMove").val(BoardToFen()); 
	// id=lMove finns i main.php Jag sätter lMove till det som står ovan, alltså rutan får strängen ovan
	// när man trycker Spara spelet så lägger programmet det som nu är sparat i lMove i senasteDrag
}

$("#TakeButton").click(function () {	
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
	}
});

$("#SearchButton").click(function () {	
	GameController.PlayerSide = brd_side^1;
	PreSearch();	
});

$("#FlipButton").click(function () {	
	GameController.BoardFlipped ^= 1;
	console.log("Flipped:" + GameController.BoardFlipped);
	SetInitialBoardPieces();
});

function NewGame() {
	ParseFen(START_FEN);
	PrintBoard();		
	SetInitialBoardPieces();
	GameController.PlayerSide = brd_side;
	CheckAndSet();	
	GameController.GameSaved = BOOL.FALSE;
}

$("#NewGameButton").click(function () {	
	NewGame();
	newGameAjax();
});

function newGameAjax() {
	console.log('new Game Ajax');
	$.ajax({
		url : "insertNewGame.php",
		cache: false
		}).done(function( html ) {
		  console.log('result:' + html);
		});
}

function initBoardSquares() {

	
	var light = 0;
	var rowName;
	var colName;
	var divString;
	var lightString;
	var lastLight=0;
	
	for(rowIter = ROWS.ROW_8; rowIter >= ROWS.ROW_1; rowIter--) {	
		light = lastLight ^ 1;
		lastLight ^= 1;
		rowName = "row" + (rowIter + 1);			
		for(colIter = COLUMNS.COL_A; colIter <= COLUMNS.COL_H; colIter++) {			
		    colName = "col" + (colIter + 1); 
		    if(light==0) lightString="Light";
			else lightString="Dark";
			divString = "<div class=\"Square clickElement " + rowName + " " + colName + " " + lightString + "\"/>";
			//console.log(divString);
			light ^= 1;
			$("#Board").append(divString);
		}
	}	
}

function ClearAllPieces() {
	console.log("Removing pieces");
	$(".Piece").remove();
}

function SetInitialBoardPieces() {
	var sq;
	var sq120;
	var col,row;	
	var rowName;
	var colName;
	var imageString;
	var pieceColName;
	var pce;
	ClearAllPieces();
	for( sq = 0; sq < 64; ++sq) {
		
		sq120 = SQ120(sq);
		
		pce = brd_pieces[sq120]; // crucial here
		
		if(GameController.BoardFlipped == BOOL.TRUE) {
			sq120 = MIRROR120(sq120);
		}
		
		col = ColBrd[sq120];
		row = RowBrd[sq120];
		
		
		if(pce>=PIECES.wP && pce<=PIECES.bK) {				
			rowName = "row" + (row + 1);	
			colName = "col" + (col + 1);
			
			pieceColName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
			imageString = "<image src=\"" + pieceColName + "\" class=\"Piece " + rowName + " " + colName + "\"/>";
			//console.log(imageString);
			$("#Board").append(imageString);
		}
	}

}
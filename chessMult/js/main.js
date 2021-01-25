$(document).ajaxComplete(function() {
  	
  	
});

$(function() {
	init();
	$('#fenIn').val(START_FEN);
	NewGame();
	newGameAjax();
	
	$.ajax({
		url : "bookXml.xml",
		cache : false,
		dataType: "xml",
		success: function (xml) {				
			console.log("Read success");
			$(xml).find('line').each(function() {	
				var trimmed = $(this).text();
				trimmed = $.trim(trimmed);						
				brd_bookLines.push(trimmed);
			});
			GameController.BookLoaded = BOOL.TRUE;
			$('#LoadingBook').remove();
			console.log("Book length: " + brd_bookLines.length + " entries");
	
			for(var i = 0; i <brd_bookLines.length; ++i) {
			//	console.log('Array: ' + brd_bookLines[i]);
			}
		}
	});
	
	
});

function init() {	
	InitColsRowsBrd();
	InitSq120To64();
	InitHashKeys();
	InitBoardVars();
	InitMvvLva();
	initBoardSquares();
	EvalInit();
	srch_thinking = BOOL.FALSE;
}

function InitColsRowsBrd() {
	
	var index = 0;
	var col = COLUMNS.COL_A;
	var row = ROWS.ROW_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		ColBrd[index] = SQUARES.OFFBOARD;
		RowBrd[index] = SQUARES.OFFBOARD;
	}
	
	for(row = ROWS.ROW_1; row <= ROWS.ROW_8; ++row) {
		for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; ++col) {
			sq = fromRCMxToNumArrSq(col,row);
			ColBrd[sq] = col;
			RowBrd[sq] = row;
		}
	}
}


function InitBoardVars() {

	var index = 0;
	for(index = 0; index < MAXGAMEMOVES; index++) {
		brd_history.push({
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		}); 
	}
	
	for(index = 0; index < PVENTRIES; index++) {
		brd_PvTable.push({
			move : NOMOVE,
			posKey : 0
		}); 
	}

}

function EvalInit() {
	var index = 0;
	
	for(index = 0; index < 10; ++index) {				
		PawnRowsWhite[index] = 0;			
		PawnRowsBlack[index] = 0;
	}
}

// Initiera HashKeys såsom pjäs på pos och rokad... osv, array PieceKeys,Sidekey och CastleKeys definieras i defs.js
function InitHashKeys() {
    var index = 0;
	
	// Nycklar för varje pjäs på varje möjlig position
	for(index = 0; index < 13 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	
	//Nyckel för Vit eller Svart
	SideKey = RAND_32();
	
	//Nyckel för rokad
	for(index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

function InitSq120To64() { 
/*initiera två olika arrays från 64 rutor till 120 och tvärtom, dessa används sedan i funktionerna
 SQ64(sq120) SQ120(sq64) för att få fram de motsvarande index för de olika arrayerna, vill vi t.ex ha
 array med index 55 i 64 så skriver vi sq120(55)
 array med index 57 i 120 så skriver vi sq64(120)
 */

	var index = 0;
	var col = COLUMNS.COL_A;
	var row = ROWS.ROW_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;   // reset: sätt irrelevanta värden
	}
	
	for(index = 0; index < 64; ++index) { 
		Sq64ToSq120[index] = 120; // reset: sätt irrelevanta värden
	}
	
	for(row = ROWS.ROW_1; row <= ROWS.ROW_8; ++row) { 
		for(col = COLUMNS.COL_A; col <= COLUMNS.COL_H; ++col) {
			sq = fromRCMxToNumArrSq(col,row); // Denna tar fram [0][0] =21, [0][1] =22...[8][8] =98
			Sq64ToSq120[sq64] = sq;   // Sq64ToSq120[0]=21,Sq64ToSq120[1]=22...Sq64ToSq120[63]=98
			Sq120ToSq64[sq] = sq64;// Sq120ToSq64[21] = 0, Sq120ToSq64[22] = 1...Sq120ToSq64[98] = 63
			sq64++;  // sätt 1,2,3,4....
		}
	}
}



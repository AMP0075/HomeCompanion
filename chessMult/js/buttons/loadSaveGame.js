$("#lMoveSQL_submit").click(function () {
	//alert(BoardToFen());
	var lMoveSQL2 = $("#lMove").val(); // id=lMoveSQL finns i main.php
	var test="if not included I get an error on live server";
	$.post('php_pages/loadLMoveSQL.php',{test: test},function(data){
        if (data.msg != ""){
			ParseFen(data.msg);
		} else{
			ParseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		}
		//ParseFen(data.msg);
		PrintBoard();		
		SetInitialBoardPieces();	
		GameController.PlayerSide = brd_side;	
		CheckAndSet();	
		EvalPosition();	
		newGameAjax();
		},
	   'json');
});	


$("#lSaveSQL_submit").click(function () {
	
	var lSaveSQL = BoardToFen(); // id=lMoveSQL finns i main.php
	//alert(lSaveSQL);
	$.post('php_pages/lMoveSaveToSQL.php', {lSaveSQL: lSaveSQL}, function(data){ 
		//$('#infoSQL').text(data.msg);
		//alert(data.msg);
	},
   'json');
	  
	
});	
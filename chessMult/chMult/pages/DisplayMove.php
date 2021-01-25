<?php
	session_start();
	include "../classes/move.php";
	$lMove="";
	if(isset($_POST['MoveString'])){
		$move = new move();
		$move->setMoveUserId($_SESSION['UserId']);
		$move->setMoveString($_POST['MoveString']);
		$lMove=$move->getLastMove($_SESSION['GameId']);
	}
	$output = array("msg"=>"$lMove", "loggedin"=>"true");
	echo json_encode($output);
	/* 
		Return json to gui.js in function loadMove()
		Function loadMove() loads once and then with a setInvervall
	*/
?>
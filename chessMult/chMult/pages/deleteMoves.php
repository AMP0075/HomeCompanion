<?php
	include "../classes/move.php";

	$move = new move();
	$move->DeleteMoves();
	
	$output = array("msg"=>"Hola", "loggedin"=>"true");
	echo json_encode($output);
?>

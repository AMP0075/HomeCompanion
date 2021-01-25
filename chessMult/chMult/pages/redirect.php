<?php

	session_start();
	include "../../connectToDB.php";
	
	$token=$_GET["id"];
	
	$UserName=$_SESSION['UserName'];
	$_SESSION['GameId']=$token;
	
	$opponent=$_GET["name"];
	$_SESSION['Opponent']=$opponent;
	
	$GameOnReq=$_db->prepare("SELECT * FROM users WHERE UserId=:UserId");
	$GameOnReq->execute(array(
		'UserId'=>$_SESSION['UserId']
	));	
	
	$existCount = $GameOnReq->rowCount();
	if ($existCount == 0) { // evaluate the count
		return "Tom";
	}
	if ($existCount > 0) {
		while($rowGameOn=$GameOnReq->fetch()){
			if ($rowGameOn["GameId"] == 0) {
				$color="white";
				// Update User
				$GameIdInsert =$_db->prepare("UPDATE users SET GameId=?,GameOpponent=?,GameColor=? WHERE UserName=?");
				$GameIdInsert->execute(array($token,$opponent,$color,$UserName));
				$color="black";
				// Update Opponent
				$GameIdInsertOpp =$_db->prepare("UPDATE users SET GameId=?,GameOpponent=?,GameColor=? WHERE UserName=?");
				$GameIdInsertOpp->execute(array($token,$UserName,$color,$opponent));	
			}
		}
	}
	header("Location: Ch/index.php");
?>
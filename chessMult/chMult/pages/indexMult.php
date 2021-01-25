<?php
	/* 
		If a user chooses to play against someone, the user gets redirected to redirect.php 
		where information is given to the database. Like gameId and who is black who is white and so on
		
		The function DisplayMessage() in chatbox.js is diplaying the chats with a timeinterval. It also checks whether a user has 
		a gameId, if it does the user is also redirected to redirect.php
		If the information is already set it goes on the Ch/index.php and the connection has been made
	*/
	session_start();
	
	
	include "../classes/user.php";
	/* This is to delete gameId if gameId exists for a user and its opponent */
	$user = new user();
	if ($_SESSION['GameId']!=0){
		$user->DeleteGame($_SESSION['GameId']);
		$_SESSION['GameId']="";
	}
?>
<!DOCTYPE html>
<html lang="en">
	<META HTTP-EQUIV=Refresh; 
	<head>
	<link rel="stylesheet" href="../style/Style.css">
	<link rel="stylesheet" href="../../css/bootstrap.min.css">
	<link rel="stylesheet" href="../../css/sliderStyle.css">
	<link href="stylesChess.css" rel="stylesheet" type="text/css">
		<title>Chess Chat | HomeCompanion</title>
		
	
	</head>
	
	<body style="background-color: skyblue;">
	<div><header style="background-color: #b5651d ; padding: 8.5px;">
			<h3><a href="../../../home" style="background-color: gold; padding:5px; border-radius: 5px;">HomeCompanion</a> <a style="background-color:white;" href="../../">Logout</a></h3>
		</header></div>
	<h2>Welcome <span style="color:green"><?php
	echo $_SESSION['UserName'];
	?></span></h2>
	
	
		<div id="AvailablePlayers" style="margin-top:10px;margin-left:10px;">
		</div>
		
		<div id="ChatMessages" style="margin-top:50px;margin-left:100px;">
		</div>
	<div id="ChatBig"  style="margin-top:50px;margin-left:100px;"> 
		<span style="color:green">Chat</span><br/>
		<textarea id="ChatText" name="ChatText"></textarea>
	</div>
	
	<script src="../js/jquery.js"></script>	
	<script src="../js/availablePlayers.js"></script>
	<script src="../js/chatbox.js"></script>		
	</body>
</html>


		
	
	
	


<?php
	
	session_start();
	/* 
		If New opponent button is pushed the player is redirected to indexMult.
		This page checks if it has a gameId and if so it deletes the gameId for the user
		and the opponent
		The function DisplayMessageInGame() in chatBoxInGame.js is displaying the chats with a timeinterval. 
		It also check whether a user has 
		a gameId, if not it is also redirected to intexMult.php
	*/
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<META HTTP-EQUIV=Refresh; 
		<meta charset="utf-8">
		<meta name="keywords" content="Chess, Engine, Javascript, Play Chess, Chess Program, Javascript Chess, Game">
		<link rel="stylesheet" href="../../../css/bootstrap.min.css">
		<link rel="stylesheet" href="../../../css/sliderStyle.css">
		<link href="../stylesChess.css" rel="stylesheet" type="text/css">
		<title>Chess | HomeCompanion</title>
		<link href="styles.css" rel="stylesheet" type="text/css">
		<script type="text/javascript"> if (!window.console) console = {log: function() {}}; </script>
	</head>
	<body style="background-color: skyblue;">
		<header style="background-color: #b5651d ; padding: 8.5px;">
			<h3><a href="../../../../home" style="background-color: gold; padding:5px; border-radius: 5px;">HomeCompanion</a> <span>Chess</span></h3>			
		</header>
		   
		<input type="submit" onclick="parent.location='../indexMult.php'" id="deleteGame-submit" value="New Opponent">
		<h2>Welcome <span style="color:green"><?php echo $_SESSION['UserName'];?>! </span>You are playing against <span style="color:red"><?php echo $_SESSION['Opponent'];?>! </span>
		</h2>	
		<div id="FenInDiv" style="display:none;>			
			<input type="text" id="fenIn"/>		
			<button type="button" id="SetFen">Set Position</button>	
		</div>	
		<div id="ThinkingImageDiv">		
		</div>
		<div id="Board">
		</div>
		<div id="CurrentFenDiv">
			<span id="currentFenSpan" style="display:none;></span>		
		</div>				
		<div id="ChatMessages">
		</div>
		<div id="AvailablePlayers"></div>
		
		<div id="ChatMessages" style="margin-left:200px;"></div>
		<div id="ChatBig"style="margin-left:200px;"> 
			<span style="color:green">Chat</span><br/>
			<textarea id="ChatText" name="ChatText"></textarea>
		</div>
		<button type="button" id="NewGameButton">New Game</button><br/>
		<span id="GameStatus"></span>
<!--This div not outputted but needed to work  -->			
		<div id="EngineOutput"><br/>
			<select id="ThinkTimeChoice" style="display:none;">
			  <option value="1">1s</option>
			  <option value="2">2s</option>
			  <option value="4">4s</option>
			  <option value="6">6s</option>
			  <option value="8">8s</option>
			  <option value="10">10s</option>
			</select><br/><br/><br/>
	
			<span id="BestOut" style="display:none;">BestMove:</span><br/>
			<span id="DepthOut"style="display:none;">Depth:</span><br/>
			<span id="ScoreOut"style="display:none;">Score:</span><br/>
			<span id="NodesOut"style="display:none;">Nodes:</span><br/>
			<span id="OrderingOut"style="display:none;">Ordering:</span><br/>
			<span id="TimeOut"style="display:none;">Time:</span><br/><br/>
			<button type="button" id="SearchButton"style="display:none;">Move Now</button><br/>
			
			<button type="button" id="FlipButton"style="display:none;">Flip Board</button><br/><br/>
			<button type="button" id="TakeButton"style="display:none;">Take Back</button><br/><br/><br/>
			
		</div>
<!--  -->	
		<script src="js/jquery-1.10.1.min.js"></script>
		<script src="js/defs.js"></script>
		<script src="js/io.js"></script>
		<script src="js/board.js"></script>
		<script src="js/movegen.js"></script>
		<script src="js/makemove.js"></script>
		<script src="js/perft.js"></script>
		<script src="js/evaluate.js"></script>
		<script src="js/pvtable.js"></script>
		<script src="js/search.js"></script>
		<script src="js/protocol.js"></script>
		<script src="js/guiMultiPlayer.js"></script>
		<script src="js/main.js"></script>
		<script src="js/deleteDB.js"></script>
		<script src="../../js/chatboxInGame.js"></script>	
	</body>
</html>
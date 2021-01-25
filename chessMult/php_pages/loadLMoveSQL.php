<?php 
	include_once("../connectToDB.php");	
	$username=$_SESSION['username'];
	$sql = $_db->query("SELECT * FROM users WHERE UserName='$username' LIMIT 1"); // query the person
	$existCount = $sql->rowCount(); // count the row nums
	if ($existCount == 0) { // evaluate the count
		 $_SESSION['username'] = false;
		 $output = array('msg'=>'Hello $uname  with id $id', 'loggedin'=>'false');
	}
	if ($existCount > 0) {
	    while($row = $sql->fetch(PDO::FETCH_ASSOC)){ 
             $id = $row["UserId"];
			 $latestMove = $row["latestMove"];
        }
		$output = array("msg"=>"$latestMove", "loggedin"=>"true");
    } 
	echo json_encode($output);

?>
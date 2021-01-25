<?php
	include_once("../connectToDB.php");
	$username=$_SESSION['username'];
	$lSaveSQL=$_POST['lSaveSQL'];
	$sql = "UPDATE users SET latestMove='$lSaveSQL' WHERE UserName='$username'";
	$q = $_db->prepare($sql);
	$q->execute();
	$output = array("msg"=>"Hello $username  latest move $lSaveSQL", "loggedin"=>"true");
	echo json_encode($output);
?>




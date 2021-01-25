<!-- 
This is where we connect to the mysql database.
If you want to get access to database across multiple files, just include the file once and access it anywhere.
 -->

<?php
$con = mysqli_connect("localhost", "root", "", "try") or die("Error " . mysqli_error($con)); 
?>
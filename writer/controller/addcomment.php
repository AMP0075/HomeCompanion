<!DOCTYPE html>
<html>
<head>
</head>
<body>

  <?php

    $name = $_SESSION["username"];
    $id = $_SESSION["user_id"];
    if (!empty($name)){
      $navbar = True;
    }
    
    echo '<script>alert("Developed by Ananthu. Unauthorised access")</script>';


    //This file will contain the code for the ajax call for adding a new topic.
    //Pulling in the databases
    // require('../model/database.php');
    // require('../model/topics.php');

    //This get the response from what the user typed in.
    $comment = $_GET['q'];

    //Adding the topic to the topics table
    // add_topic($topic);

  ?>

</body>
</html>

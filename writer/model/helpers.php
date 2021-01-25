<?php

  //The methods in this file will be helper functions that will be making calls to the
   //database.
   //This function will get one user from the database
  function get_one_user($username, $password){
    global $db;
    $query = "SELECT * FROM users
            WHERE userName = :username AND
            password = :password";
    $statement = $db->prepare($query);
    $statement->bindValue(':username', $username);
    $statement->bindValue(':password', $password);
    $statement->execute();
    $user = $statement->fetch();
    $statement->closeCursor();
    return $user;
  }


 ?>

<?php

  // Start a session
  if (!isset($_SESSION)) {
    session_start();
  }
  //Pulling in the databases
  require('./model/database.php');
  global $db;

  $message = "";

  if (isset($_POST["login"])){
    $firstname = filter_input(INPUT_POST, 'firstname');
    $lastname = filter_input(INPUT_POST, 'lastname');
    $username = filter_input(INPUT_POST, 'username');
    $email = filter_input(INPUT_POST, 'email');
    $city = filter_input(INPUT_POST, 'city');
    $state = filter_input(INPUT_POST, 'state');
    $zip = filter_input(INPUT_POST, 'zip');
    $password = filter_input(INPUT_POST, 'password');
    $password2 = filter_input(INPUT_POST, 'password2');

    //Hashing the password
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    //This SQL query checks to see if the username is in the users table.
    $query = "SELECT * FROM users WHERE
              username = :username";
    $statement = $db->prepare($query);
    $statement->bindValue(':username', $username);
    $count = $statement->rowCount();

    //Conditional statements based on what the query returns.
    if ($count > 0){
      $message = '<label class="errorMsg">Username Taken!</label>';
    }else if ($password != $password2) {
      $message = '<label class="errorMsg">Passwords Do Not Match!</label>';
    }else {
      //Error messages for DB connection issues
      // ini_set('display_errors', 1);
      // ini_set('display_startup_errors', 1);
      // error_reporting(E_ALL);
      //Query to add new user to the users table
      $query = "INSERT INTO users
                  (firstname, lastname, username, email, city, state, zip, password)
                VALUES
                  (:firstname, :lastname, :username, :email, :city, :state, :zip, :password)";
      $statement = $db->prepare($query);
      $statement->bindValue(':firstname', $firstname);
      $statement->bindValue(':lastname', $lastname);
      $statement->bindValue(':username', $username);
      $statement->bindValue(':email', $email);
      $statement->bindValue(':city', $city);
      $statement->bindValue(':state', $state);
      $statement->bindValue(':zip', $zip);
      $statement->bindValue(':password', $password_hashed);
      $statement->execute();
      $statement->closeCursor();

      //Message to alert user that they signed up
      $message = '<label>User Signed Up!</label>';
    }
  }
?>
<?php include 'view/header.php'; ?>
<!-- have to include this link to get the css to apply to this file -->
<link rel="stylesheet" type="text/css" href="./assets/css/signup.css">

<div class="container">
  <div class="row">

    <form method="post" class="col s12 form_fix">
      <!-- Start of error handling -->
      <?php
        if (isset($message)){
          echo $message;
        }
      ?>
      <!-- End of error handling -->
      <div class="row">
        <div class="input-field col s6">
          <input name='firstname' id="first_name" type="text" class="validate" required>
          <label for="first_name">First Name</label>
        </div>
        <div class="input-field col s6">
          <input name='lastname' id="last_name" type="text" class="validate" required>
          <label for="last_name">Last Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input name='username' id="username" type="text" class="validate" required>
          <label for="username">Username</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input name='email' id="email" type="email" class="validate" required>
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <input name='city' id="first_name" type="text" class="validate" required>
          <label for="first_name">City</label>
        </div>
        <div class="input-field col s6">
          <input name='state' id="last_name" type="text" class="validate" required>
          <label for="last_name">State</label>
        </div>
        <div class="input-field col s6">
          <input name='zip' id="last_name" type="text" class="validate" required>
          <label for="last_name">Zip</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input name='password' id="password" type="password" class="validate" required>
          <label for="password">Password</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input name='password2' id="password2" type="password" class="validate" required>
          <label for="password2">Confirm Password</label>
        </div>
      </div>
      <button type="submit" name="login" class="btn btn-primary form-submit-btn">Sign Up</button><br><br>
      <a class="waves-effect waves-light btn" href="index.php">Login</a>
      <a href="index.php">One of Us? Sign In</a>
    </form>
  </div>
</div>

<?php include 'view/footer.php'; ?>

<?php
  $name = $_SESSION["username"];
  $id = $_SESSION["user_id"];
  if (!empty($name)){
    $navbar = True;
  }
?>
<!-- Bringing in CSS -->
<link rel="stylesheet" type="text/css" href="../assets/css/generic.css">
<link rel="stylesheet" type="text/css" href="../assets/css/see_comment.css">

<?php include '../view/header.php'; ?>

<h1>See Comments</h1>



<script type="text/javascript" src='../assets/js/support.js'></script>
<?php include '../view/footer.php'; ?>

<?php
  $name = $_SESSION["username"];
  $id = $_SESSION["user_id"];
  if (!empty($name)){
    $navbar = True;
  }
?>
<!-- Bringing in CSS -->
<link rel="stylesheet" type="text/css" href="../assets/css/generic.css">
<link rel="stylesheet" type="text/css" href="../assets/css/home.css">

<?php include '../view/header.php'; ?>

<!-- start of main section -->
<main>

  <section class='section_one'>
    <div class='section_one_div'>

      <div class='center'>
        <span class="white-text">Share you ideas with others...
        </span>
      </div>

      <div class='center'>
        <span class="white-text">Show your writing skills...
        </span>
      </div>

      <div class='center'>
        <span class="white-text">Be inspired by new ideas...
        </span>
      </div>

    </div>
  </section>

  <section class='section_two'>

    <h4 class='center'>Select A Topic:</h4>

    <form action="index.php" method="post" class="topic_selection_form">
      <input type="hidden" name="action" value="see_topic" />
      <select name="topics" class="browser-default">
        <?php foreach ($topics as $topic) : ?>
          <option value='<?php echo $topic['topic_id'] ?>'><?php echo $topic['topic']; ?></option>
        <?php endforeach; ?>
      </select>
      <br>
      <input type="submit" value="See Discussion" />
    </form>

    <h4 class='center'>Or...Make your Own:</h4>

    <form class="topic_selection_form">
      <div class="input-field col s6 form_fix">
        <input  name='topic' id="topic" type="text" class="validate">
        <label for="topic">Add Topic</label>
        <input onclick='createTopic(); return false;' class='button' type="submit" value="Add Topic" />
      </div>
    </form>

    <div id="message">
      <b></b>
      <div>
    </div>

  </section>




</main>
<!-- End of Main Section -->

<script type="text/javascript" src='../assets/js/support.js'></script>
<?php include '../view/footer.php'; ?>

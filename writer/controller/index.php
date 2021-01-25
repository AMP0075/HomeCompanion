<?php

  session_start();
  $name = $_SESSION["username"];
  $id = $_SESSION["user_id"];
  if (!empty($name)){
    $allowed = True;
  }

  //Pulling in the databases
  require('../model/database.php');
  require('../model/helpers.php');
  require('../model/topics.php');
  require('../model/comments.php');

  //Setting a default action
  $action = filter_input(INPUT_POST, 'action');
  if ($action == NULL) {
      $action = filter_input(INPUT_GET, 'action');
      if ($action == NULL) {
          $action = 'home';
      }
  }

  if ($allowed){
    switch ($action) {
      //This case will bring the user to the home page
      case 'home':
        $topics = get_all_Topics();
        include('home.php');
        break;
      //This case will bring the user to the page to see all of the topics
      case 'see_topic':
        $topic_id = filter_input(INPUT_POST, 'topics');
        //Getting topic name
        $topic = get_topic_name($topic_id);
        //Fetch all comments about the topic using topic ID
        $commments = get_all_comments_by_topic($topic_id);
        include('see_topic.php');
        break;
      //This case will add a comment
      case 'add_comment':
        $comment = filter_input(INPUT_POST, 'comment');
        $topic_id = filter_input(INPUT_POST, 'topic_id');
        $user_id = $id;
        $votes = 0;
        add_comments($comment, $topic_id, $user_id, $votes);
        $topic = get_topic_name($topic_id);
        $commments = get_all_comments_by_topic($topic_id);
        include('see_topic.php');
        break;
      //This case will delete a comment
      case 'delete_comment':
        $topic_id = filter_input(INPUT_POST, 'topic_id');
        $comment_id = filter_input(INPUT_POST, 'comment_id');
        delete_comment($comment_id);
        $topic = get_topic_name($topic_id);
        $commments = get_all_comments_by_topic($topic_id);
        include('see_topic.php');
        break;
      case 'change_vote':
        $topic_id = filter_input(INPUT_POST, 'topic_id');
        $comment_id = filter_input(INPUT_POST, 'comment_id');
        $vote_up = filter_input(INPUT_POST, 'up');
        $vote_down = filter_input(INPUT_POST, 'down');
        if ($vote_up){
          $comment = get_one_comment($comment_id);
          $new_vote = $comment['votes'] + 1;
          change_vote($new_vote, $comment_id);
        }
        if ($vote_down){
          $comment = get_one_comment($comment_id);
          $new_vote = $comment['votes'] - 1;
          change_vote($new_vote, $comment_id);
        }
        $topic = get_topic_name($topic_id);
        $commments = get_all_comments_by_topic($topic_id);
        include('see_topic.php');
        break;
    }
  }else {
    include('notAllowed.php');
  }



?>

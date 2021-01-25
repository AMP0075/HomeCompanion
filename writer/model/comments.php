<?php

  //This file will contain all of the code to get information out of the
  //comments table.

  //This function will get all comments by topic.
  function get_all_comments_by_topic($topic_id) {
    global $db;
    $query = 'SELECT *
              FROM comments c
              JOIN users u on u.user_id = c.user_id
              WHERE topic_id = :topic_id
              ORDER BY votes DESC';
    $statement = $db->prepare($query);
    $statement->bindValue(':topic_id', $topic_id);
    $statement->execute();
    $comments = $statement->fetchAll();
    $statement->closeCursor();
    return $comments;
  }

  //This function will add a comment to the comments table.
  function add_comments($comment, $topic_id, $user_id, $votes){
      global $db;
      $query = 'INSERT INTO comments
                    (comment, topic_id, user_id, votes)
                  VALUES
                    (:comment, :topic_id, :user_id, :votes)';
      $statement = $db->prepare($query);
      $statement->bindValue(':comment', $comment);
      $statement->bindValue(':topic_id', $topic_id);
      $statement->bindValue(':user_id', $user_id);
      $statement->bindValue(':votes', $votes);
      $statement->execute();
      $statement->closeCursor();
  }

  //This function will delete a comment from the comments table
  function delete_comment($comment_id){
    global $db;
    $query = 'DELETE FROM comments
              WHERE comment_id = :comment_id';
    $statement = $db->prepare($query);
    $statement->bindValue(':comment_id', $comment_id);
    $statement->execute();
    $statement->closeCursor();
  }

  //This function will get a specific comment
  function get_one_comment($comment_id){
    global $db;
    $query = 'SELECT * FROM comments
              WHERE comment_id = :comment_id';
    $statement = $db->prepare($query);
    $statement->bindValue(':comment_id', $comment_id);
    $statement->execute();
    $comment = $statement->fetch();
    $statement->closeCursor();
    return $comment;
  }

  //This function will change the votes
  function change_vote($new_vote, $comment_id){
    global $db;
    $query = 'UPDATE comments
    SET votes = :votes
    WHERE comment_id = :comment_id';
    $statement = $db->prepare($query);
    $statement->bindValue(':comment_id', $comment_id);
    $statement->bindValue(':votes', $new_vote);
    $statement->execute();
    $statement->closeCursor();
  }

?>

<?php

  //The functions in this file will be to get data from the topics table.

  //This function will get all the topics from the topics table.
  function get_all_Topics(){
    global $db;
    $query = "SELECT * FROM topics
              ORDER BY topic_id";
    $statement = $db->prepare($query);
    $statement->execute();
    $topics = $statement->fetchAll();
    $statement->closeCursor();
    return $topics;
  }

  //This function adds add a new topic to the topics table
  function add_topic($topic) {
    global $db;
    $query = 'INSERT INTO topics
                  (topic)
                VALUES
                  (:topic)';
      $statement = $db->prepare($query);
      $statement->bindValue(':topic', $topic);
      $statement->execute();
      $statement->closeCursor();
  }

  //This function will get the topic name based on the id
  function get_topic_name($topic_id){
    global $db;
    $query = 'SELECT * FROM topics
              WHERE topic_id = :topic_id';
    $statement = $db->prepare($query);
    $statement->bindValue(':topic_id', $topic_id);
    $statement->execute();
    $topic = $statement->fetch();
    $statement->closeCursor();
    return $topic;
  }


?>

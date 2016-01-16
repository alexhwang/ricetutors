<?php

$user_id = $_GET["user_id"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "INSERT INTO `users`(`users`) VALUES ('" .$user_id. "')";
$result = $connection->query($sql);

if ($result) {
    echo "success";
}
else {
    echo "error";
}

?>
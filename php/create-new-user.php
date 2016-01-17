<?php

$user_id = $_GET["user_id"];
$name = $_GET["name"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "INSERT INTO `users`(`users`, `names`) VALUES ('" .$user_id. "', '" .$name. "')";
$result = $connection->query($sql);

if ($result) {
    echo "success";
}
else {
    echo "error";
}

?>
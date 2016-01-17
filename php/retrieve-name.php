<?php
$user = $_GET["user"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "SELECT `names` FROM `users` WHERE `users`='" .$user. "'";
$result = $connection->query($sql);

while ($array = $result->fetch_assoc()) {
    echo $array["names"];
}

?>
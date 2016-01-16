<?php
// Inputs: unique ID of data entry
// Outputs: success is successful, error if otherwise

$unique_id = $_GET["unique_id"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");

$sql = "DELETE FROM `tutor-availability` WHERE `unique-id`='" .$unique_id. "'";
$result = $connection->query($sql);

echo $result;


?>
<?php
// Inputs: user ID, subject code
// Outputs: strings of tuples of the form (date, time)

$user_id = $_GET["user_id"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "SELECT `subject-code`, `date-available`, `timeslot-available`, `unique-id` FROM `tutor-availability` WHERE `user-id`='" .$user_id. "'";
$result = $connection->query($sql);

while ($array = $result->fetch_assoc()) {
    echo $array["subject-code"]. "," .$array["date-available"]. "," .$array["timeslot-available"]. "," .$array["unique-id"]. ";";
}

?>
<?php
// Inputs: user ID, subject code
// Outputs: strings of tuples of the form (date, time)

$subject_code = $_GET["subject_code"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "SELECT `user-id`,`date-available`, `timeslot-available`, `unique-id` FROM `tutor-availability` WHERE `subject-code`='" .$subject_code. "'";
$result = $connection->query($sql);

while ($array = $result->fetch_assoc()) {
    echo $array["user-id"]. "," .$array["date-available"]. "," .$array["timeslot-available"]. ";";
}

?>
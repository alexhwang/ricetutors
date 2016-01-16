<?php
// Inputs: user ID, subject code, date available, timeslot available
// Outputs: unique ID of the entry created if success, "error" otherwise

$user_id = $_GET["user_id"];
$subject_code = $_GET["subject_code"];
$date_available = $_GET["date_available"];
$timeslot_available = $_GET["timeslot_available"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");

$unique_id_sql = "SELECT `unique-id` FROM `tutor-availability` WHERE 1";
$unique_id_sql_result = $connection->query($unique_id_sql);

$existing_ids = array();
while ($array = $unique_id_sql_result->fetch_assoc()) {
    array_push($existing_ids, $array["unique-id"]);
}

// Add row with a unique ID:

$proceed = True;
while ($proceed) {
    $random = rand(100000,1000000);

    if (!in_array($random, $existing_ids)) {
        $sql = "INSERT INTO `tutor-availability` (`user-id`, `subject-code`, `date-available`, `timeslot-available`, `unique-id`) VALUES ('" .$user_id. "', '" .$subject_code. "', '" .$date_available. "', '" .$timeslot_available. "', '" .$random. "')";
        $result = $connection->query($sql);
        $proceed = False;

        if ($result) {
            echo "success";
        }
        else {
            echo "error";
        }
    }
}

?>
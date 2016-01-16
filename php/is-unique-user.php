<?php
// Inputs: potential user ID
// Outputs: "True" if user is not in database yet, "False" otherwise

$user_id = $_GET["user_id"];

$connection = mysqli_connect('localhost',"user","user","ricetutors");
$sql = "SELECT `users` FROM `users` WHERE 1";
$result = $connection->query($sql);

$users = array();

while ($array = $result->fetch_assoc()) {
    array_push($users, $array["users"]);
}

$is_unique = "True";
for ($i=0; $i<count($users); $i++) {
    if (in_array($user_id, $users)) {
        $is_unique = "False";
    }
}

echo $is_unique;

?>
<?php
$servername = "localhost";
$username = "jandrews2014";
$password = "Jesus999";
$dbname = "jandrews2014";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//TABLE
echo '<table border="1">';
echo  '<tr><th>Name</th><th>Gender</th><th>Number</th></tr>';

//OPENFILE---------------------------------------------------
$file = fopen("yob2014.txt", "r") or die("Unable to open file!");

while(!feof($file)){
    //openedfile reassignment
    $data = fgets($file);
    //split lines
    $line = explode(",", $data);
    
    $name = $line[0];
    $gender = $line[1];
    $number = $line[2];
    //entering data
    $sql = "INSERT INTO babynames (name, gender, rating)
VALUES ('$name', '$gender', '$number')";

    //display onto a table--OPTIONAL
    //echo "<tr><td>" . $name . "</td><td>" . $gender . 
    //"</td><td>" . $number . "</td></tr>";
    
    //--checking if it was uploaded to table
    if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

}

echo '</table>';
$conn->close();
fclose($file);
?>
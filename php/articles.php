<?php
$servername = "db4free.net";
$username = "wcstudio";
$password = "wcstudio";
//connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=wcsarticles", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

//Process the form
$category = $_POST["category"];
$name = $_POST["article_name"];
$content = $_POST["article_content"];

//Upload to database 
try{
$sql = "insert into articles (category, aname, content)
        values ('$category', '$name', '$content')";
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// use exec() because no results are returned
$conn->exec($sql);
echo "New record created successfully";
} catch(PDOException $e) {
echo $sql . "<br>" . $e->getMessage();
}

$conn = null;
?>
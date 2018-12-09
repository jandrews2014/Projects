<!DOCTYPE html>
<html class="full" lang="en">
<!-- Make sure the <html> tag is set to the .full CSS class. Change the background image in the full.css file. -->

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>NameABaby.love</title>

    <!-- Bootstrap Core CSS -->
    <link href="css2/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css2/the-big-picture.css" rel="stylesheet">

</head>

<body>

    <!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="http://lamp.cse.fau.edu/~jandrews2014/p6">Name A Baby</a>
                <a class="navbar-brand" href="http://lamp.cse.fau.edu/~jandrews2014/index.html">Main Page</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li></li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- jQuery -->
    <script src="js2/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js2/bootstrap.min.js"></script>

</body>

</html>

<?php
// Do not change the following two lines.
$teamURL = dirname($_SERVER['PHP_SELF']) . DIRECTORY_SEPARATOR;
$server_root = dirname($_SERVER['PHP_SELF']);

// You will need to require this file on EVERY php file that uses the database.
// Be sure to use $db->close(); at the end of each php file that includes this!

$dbhost = 'localhost';  // Most likely will not need to be changed
$dbname = 'jandrews2014';   // Needs to be changed to your designated table database name
$dbuser = 'jandrews2014';   // Needs to be changed to reflect your LAMP server credentials
$dbpass = 'Jesus999'; // Needs to be changed to reflect your LAMP server credentials

$db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if($db->connect_errno > 0) {
    die('Unable to connect to database [' . $db->connect_error . ']');
}
?>

    <!-- Page Content -->
<style>
    body{
        background-color: transparent;
        background-repeat: repeat;
    }
</style>
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <center><h1>Baby Names</h1></center>
            </div>
        </div>
        
        <table border="1">
        <form class="form-horizontal" role="form" name="nameEntry" action="index.php" onsubmit="return validateForm()" method="post">
            <div class="form-group">
                <label for="male" class="col-sm-2 control-label">Male Name:</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" name="male" id="male" pattern="[^0-9]+" maxlength="25">
                    </div>
            </div>
             
            <div class="form-group">
                <label for="female" class="col-sm-2 control-label">Female Name:</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" name="female" id="female" pattern="[^0-9]+" maxlength="25">
                    </div>
            </div>
            
             <div class="form-group">
                <div class="col-sm-10 col-sm-offset-2">
                  <input type="Submit" class="btn btn-outline-primary">
                </div>
             </div>
        </form>
        </table>
    </div>
    <!-- /.container -->

    
<?php
// Turn off all error reporting
error_reporting(0);
?>
 
 
<?php $db->query($createStmt); ?>
     
<?php
   
  if ( isset( $_POST[ "male" ] ) )                  //true if input present
  {
    $mName = strip_tags( trim( $_POST[ "male" ] ) );   //remove malicious tags/trim whitespace
    $mName = preg_replace('/\s+/', '', $mName);         //remove internal whitespace
    $mName = $db->real_escape_string($mName);           //library function to prevent malicious entries
    $mName = strtolower($mName);                        //convert to lower case
    $mGender = 'M';
    $mId = $mGender . $mName;
  }
 
  if ( isset( $_POST[ "female" ] ) )  
  {
    $fName = strip_tags( trim( $_POST[ "female" ] ) ); 
    $fName = preg_replace('/\s+/', '', $fName);       
    $fName = $db->real_escape_string($fName);         
    $fName = strtolower($fName);                      
    $fGender = 'F';
    $fId = $fGender . $fName;
 }
 
?>
 
<?php
//add Male name to table, if it already exists, only update count
$insertStatementM = 'INSERT INTO `babynames` (`id`,`name`, `gender`, `rating`)' . PHP_EOL
                        . ' VALUES (\'' . $mId . ' \', \'' . $mName . '\', \''. $mGender .'\', \'' . 1 . '\')'. PHP_EOL
                        . 'ON DUPLICATE KEY UPDATE `rating` = `rating` + 1' . PHP_EOL;
?>
 
 
<?php
//add Female name to table, if it already exists, only update count
$insertStatementF = 'INSERT INTO `babynames` (`id`,`name`, `gender`, `rating`)' . PHP_EOL
                        . ' VALUES (\'' . $fId . ' \', \'' . $fName . '\', \''. $fGender .'\', \'' . 1 . '\')'. PHP_EOL
                        . 'ON DUPLICATE KEY UPDATE `rating` = `rating` + 1' . PHP_EOL;
?>
 
 
 
 
<?php
  //add name to the database
  if($mName && (strlen($mName) <= 25) ) 
  {
    $db->query($insertStatementM);
  }
  if($fName && (strlen($fName) <= 25))  
  {
    $db->query($insertStatementF);
  }
 
?>
 
<!-- Display names -->
 
<?php
// Get the rows from the table
$selectStmtM = 'SELECT * FROM `babynames`' . PHP_EOL
                  .'WHERE gender="' . $mGender . '"' . PHP_EOL
                  .'ORDER BY rating DESC, name' . PHP_EOL
                  .'LIMIT 5' . PHP_EOL;
?>
 
<?php
// Get the rows from the table
$selectStmtF = 'SELECT * FROM `babynames`' . PHP_EOL
                  .'WHERE gender="' . $fGender . '"' . PHP_EOL
                  .'ORDER BY rating DESC, name' . PHP_EOL
                  .'LIMIT 5' . PHP_EOL;
 
?>
 
<?php
function printResults($result)
{
 
  if($result->num_rows > 0) //if we have any results
  {
     echo '<div class="entryArea alert alert-success">' . PHP_EOL;
     echo '             <table class="table table-striped table-bordered table-condensed">' . PHP_EOL;
     echo '               <tr><td>Name</td><td>Votes</td></tr>' . PHP_EOL;
     while($row = $result->fetch_assoc())
     {
         echo '               <tr><td>' . ucfirst($row["name"]) . '</td><td>' . $row["rating"] . '</td></tr> ' . PHP_EOL;
     }
     echo '             </table>' . PHP_EOL;
     echo '       </div>';
  }
  else  // there are no results
  {
     echo '        <div class="entryArea alert alert-success">No results yet</div>' . PHP_EOL;
  }
 
}
?>

<div class="container">
    <center><h1 class="section-title">Top Baby Names</h1></center>
    <div class="row">
        <div class="col-lg-11">
        </div>
      <div class="col-lg-12">
          <h2 class="section-subheading">Female:</h2>

          <?php
            $result = $db->query($selectStmtF);
            printResults($result);
          ?>
      </div>
    </div>

    <div class="row">
        <div class="col-lg-11">
        </div>
        <div class="col-lg-12">
            <h2 class="section-subheading">Male:</h2>

            <?php
              $result = $db->query($selectStmtM);
              printResults($result);
            ?>
        </div>
    </div>


</div>
    <!-- jQuery Version 1.11.1 -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

</body>

</html>

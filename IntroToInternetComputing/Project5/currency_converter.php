<?php
function currencyConverter($currency_from,$currency_to,$currency_input){
    
    $amount = urlencode($currency_input);
    $from_Currency = urlencode($currency_from);
    $to_Currency = urlencode($currency_to);
    $get = file_get_contents("https://www.google.com/finance/converter?a=$amount&from=$from_Currency&to=$to_Currency");
    $get = explode("<span class=bld>",$get);
    $get = explode("</span>",$get[1]);  
    $currency_output = preg_replace("/[^0-9\.]/", null, $get[0]);

    return $currency_output;
}

$display_result = false;
$currency_from = "USD";
$currency_to = "INR";
$currency_input = 100;

if (isset($_POST['currency_from']))
	$currency_from = $_POST['currency_from'];

if (isset($_POST['currency_to']))
	$currency_to = $_POST['currency_to'];

if (isset($_POST['currency_input']))
	$currency_input = $_POST['currency_input'];
 
$currency = currencyConverter($currency_from,$currency_to,$currency_input);
$display_result = true;

echo <<<_END
<html>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Welcome to Currency Converter 101</title>

    <!-- Bootstrap Core CSS -->
    <link href="css1/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <style>
    body {
        padding-top: 70px;
        /* Required padding for .navbar-fixed-top. Remove if using .navbar-static-top. Change if height of navigation changes. */
    }
    </style>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

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
                <a class="navbar-brand" href="http://lamp.cse.fau.edu/~jandrews2014/p5">Welcome to Currency Converter 101!</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="http://lamp.cse.fau.edu/~jandrews2014/index.html">Main Index Page</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- Page Content -->
    <div id="Home" class="content">

        <div class="row">
            <div class="col-lg-12 text-center">
                <img src="http://i67.tinypic.com/mhf2hi.jpg" border="0" alt="Image and video hosting by TinyPic">
                 <h1>Currency Converter</h1>
                <div id="page-content-wrapper">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
                        <form method="post" action="functions.php">
		<label>Enter amount:</label>
		<input type="text" name="currency_input" />
        <label>Select currency (from):</label>
        <select name="currency_from">
            <option value="USD">US Dollar</option>
            <option value="COP">Colombian Peso</option>
            <option value="JPY">Japanese Yen</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
            <option value="HKD">Hong Kong Dollar</option>
            <option value="KRW">South Korea Won</option>
            <option value="BRL">Brazilian Real</option>
            <option value="ILS">Isreali New Sheqel</option>
        </select>
        <label>Select currency (to):</label>
        <select name="currency_to">
            <option value="USD">US Dollar</option>
            <option value="COP">Colombian Peso</option>
            <option value="JPY">Japanese Yen</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
            <option value="HKD">Hong Kong Dollar</option>
            <option value="KRW">South Korea Won</option>
            <option value="BRL">Brazilian Real</option>
            <option value="ILS">Isreali New Sheqel</option>
        </select>
		<input type="submit" value="convert"/>
                        </form>
            </div>
        </div>
        <!-- /.row -->

    <!-- /.container -->

    <!-- jQuery Version 1.11.1 -->
    <script src="js1/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js1/bootstrap.min.js"></script>
    <script src="currency_converter.js"></script>
    <script src="jquery-1.11.2.js"></script>

</body>

</html>
</html>
_END;

if($display_result) {
    echo $currency_input.' '.$currency_from.' = '.$currency.' '.$currency_to;
}

?>
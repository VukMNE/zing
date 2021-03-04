<html>

	<head>
	<title>Zing King</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>

	</head>
	
	<style>
	
	body{
		background-color: #00695c;
		
	}
	
	.central{
		margin: 220px 0px 0px 550px;
	}
	
	
	</style>
	
	<body>
		<div class="central">
			<img src="slike/zinglogo.png" style="width: 200px; height: 150px;"></img>
			<div class="dugmad">
				<input type="button" class="btn btn-info" value="Log In"></input>
				<input type="button" class="btn btn-info" value="Continue to the game" onclick="goToGame()"></input>
			</div>
		<div>
		<script>
		function goToGame(){
			window.location.href = "zing.php";
		}
		</script>
	</body>
	
</html>
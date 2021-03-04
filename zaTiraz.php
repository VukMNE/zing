<?php
$row = 1;
define("SERVER","localhost");
define("USERNAME","root");
define("PASSWORD","1234");
define("DATABASE","tiraz");

$con = mysqli_connect(SERVER,USERNAME,PASSWORD,DATABASE) or die("Neuspjesna konekcija");

if(isset($_POST['submit'])){
    //validate whether uploaded file is a csv file
    $csvMimes = array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain');
    if(!empty($_FILES['chooseFile']['name']) && in_array($_FILES['chooseFile']['type'],$csvMimes)){
		if(is_uploaded_file($_FILES['chooseFile']['tmp_name'])){
            
            //open uploaded csv file with read only mode
            $csvFile = fopen($_FILES['chooseFile']['tmp_name'], 'r');
            //skip first line
            fgetcsv($csvFile,0,";");
            
            //parse data from csv file line by line
            while(($line = fgetcsv($csvFile,0,";")) !== FALSE){
				if($line[9] == 0){
					$line[9] = 0;
				}
				if($line[10] == null){
					$line[10] = 0;
				}
				$line[3] = (float)$line[3];
                mysqli_query($con, "INSERT INTO tiraziranje(datum, sifra_artikla, artikal, barkod, sifra_komitenta, kupac, kolicina, primljeno, neprispjelo, remitenda, prodato, sifra_objekta, objekat, trasa_id, trasa) VALUES(STR_TO_DATE('".$line[0]."',GET_FORMAT(DATE,'EUR')),".$line[1].",'".$line[2]."','".$line[3]. "'," . $line[4].",'".$line[5]."',".$line[6].",".$line[7].",".$line[8].",".$line[9].",".$line[10].",".$line[11].",'".$line[12]."',".$line[13].",'".$line[14]."')") or die(mysqli_error($con));
                mysqli_query($con, "INSERT INTO dupla_tabela(datum, sifra_artikla, artikal, barkod, sifra_komitenta, kupac, kolicina, primljeno, neprispjelo, remitenda, prodato, sifra_objekta, objekat, trasa_id, trasa) VALUES(STR_TO_DATE('".$line[0]."',GET_FORMAT(DATE,'EUR')),".$line[1].",'".$line[2]."','".$line[3]. "'," . $line[4].",'".$line[5]."',".$line[6].",".$line[7].",".$line[8].",".$line[9].",".$line[10].",".$line[11].",'".$line[12]."',".$line[13].",'".$line[14]."')") or die(mysqli_error($con));

            }
            $unesiArtikle = "INSERT INTO artikli(sifra_artikla,naziv,barkod) SELECT distinct sifra_artikla, artikal, barkod from tiraziranje";
			$unesiKupce = "INSERT INTO kupac (sifra_komitenta, naziv) SELECT distinct sifra_komitenta, kupac from tiraziranje";
			$unesiObjekte = "INSERT INTO objekti (sifra_komitenta, sifra_objekta, naziv, trasa_id, trasa) SELECT distinct sifra_komitenta, sifra_objekta, objekat, trasa_id, trasa from tiraziranje";
			mysqli_query($con,$unesiArtikle) or die(mysqli_error($con));
			mysqli_query($con, $unesiKupce);
			mysqli_query($con, $unesiObjekte);
			
            //close opened csv file
            fclose($csvFile);
        }
    }
}


?>

<html>

	<head>
	<title>Program za tiraziranje</title>
	</head>

	<style>
	
	div.meni ul{
		list-style-type: none;
		background-color: #ffa500;
		padding: 10px;
	}
	
	div.meni ul li{
		display: inline;
		margin-left: 30px;
		padding:10px;
	}
	
	div.meni ul li:hover{
		background-color: #dd8300;
		color: #fff;
	}
	
	div.meni ul li:nth-child(1){
		background-color: #dd8300;
		color: #fff;
		
	}
	</style>
	
	<body>
	<div class="meni">
		<ul>
			<li><a>Import podataka</a>
			<li><a>Plan tiraža</a>
		</ul>
	</div>
		<div class="forma1">
			<form method="POST" action="zaTiraz.php" enctype="multipart/form-data">
				<input type="file" id="chooseFile" name="chooseFile" value="Odaberite fajl"></input>
				<input type="submit" id="submit" name="submit" value="Importujte podatke"></input>
			</form>
		</div>
		
		
		<div class="forma2">
			<form method="GET" action="zaTiraz.php">
				Odaberite artikal   <select name="artikal">
				<?php
				$getArtikli = "SELECT * from artikli";
				$doGetArtikli = mysqli_query($con,$getArtikli);
				$artikli = array();
				while($art = mysqli_fetch_assoc($doGetArtikli)){
					$artikli[] = $art;
				}
				foreach($artikli as $a){
					echo "<option value='" . $a['sifra_artikla'] . "'>" . $a['naziv']. "</option>";
				}
				?>
				</select><br/>
				Odaberite kupca   <select name="kupac" onchange="this.form.submit()">
				<?php
				$getKupac = "SELECT * from kupac";
				$doGetKupac = mysqli_query($con,$getKupac);
				$kupci = array();
				while($kup = mysqli_fetch_assoc($doGetKupac)){
					$kupci[] = $kup;
				}
				foreach($kupci as $k){
					echo "<option value='" . $k['sifra_komitenta'] . "'>" . $k['naziv']. "</option>";
				}
				?>
				</select>
			</form>
		</div>
	</body>
</html>

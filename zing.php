<?php

define("SERVER","localhost");
define("USERNAME","root");
define("PASS","1234");
define("DATABASE","zing");

$kon = mysqli_connect(SERVER,USERNAME,PASS,DATABASE) or die ("Greška u konekciji");

$getIdString = "SELECT COALESCE(MAX(id),0) + 1 as ID FROM igraci_na_mrezi";
$getUpit = mysqli_query($kon, $getIdString);
$getID = mysqli_fetch_assoc($getUpit);
$id_igraca = $getID['ID'];


$noviIgracUpit = "INSERT INTO igraci_na_mrezi values(" . $id_igraca . ")";
mysqli_query($kon, $noviIgracUpit);


?>
<html>

	<head>
		<title>Zing</title>
		<meta charset="utf-8"></meta>
		<link type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"></link>
		<link rel="stylesheet" type="text/css" media="all" href="animate2.css">
		<link rel="stylesheet" type="text/css" href="zing.css"></link>
	</head>

	
	<body>
	<div id="pored">
		<div class="comppts">
			<h2>Kompjuter:</h2>
			<h3>0</h3>
		</div>
		<div class="mypts">
			<h2>Ja:</h2>
			<h3>0</h3>
		</div>
		
	</div>
		<div id="sto">
		<div id="njegoviPoeni" class="poeni">
				
			</div>
			<div id="njegoveKarte">
				
			</div>
			<div id="gameplay">
				<div class="okoSpila">
					<div id="špil" class="animated bounceInLeft">
					</div>
					<div id="ispodSaca">
					</div>
				</div>
				<div id="talon">
					
				</div>
					<div id="dugmad">
						<input type="button" class="fino-dugme" value="Preśeči špil" onclick="presjeciSpil()"></input>
					</div>
			<div id="mojiPoeni" class="poeni">
				
			</div>
			<div id="mojeKarte">
				
			</div>
			</div>
			
		</div>
		<div id="Pravila">
		<ul>Pravila Zinga
		<li> Zing je Crnogorska kartaška igra. U Zingu se koristi samo jedan špil, i može da se igra u 2, ali pravi Zing je u četvoro.
		<li> Poslije miješnja špila, onaj koji dijeli karte, daje protivniku da presječe
		<li> Prvo se izvuku 4 karte na talon, pa se onda svim igračima podijele iste karte
		<li> Žandar nosi sve. Ista karta nosi istu ( 8 nosi 8 bilo kojeg znaka...)
		<li> Kada je prazan talon (nema nijedna karta), i neko baci kartu, i ti poneseš tu kartu istom, to je Zing, i vrijedi 10 poena, osim u slučaju da je u pitanju Žandar, onda je to dupli Zing (20 poena)
		
		
		</div>
			<script src="mijesanje.js"></script>
			<script src="presjeci.js"></script>
			<script src="dijeljenje.js"></script>
			<script src="protivnik.js"></script>
			<script type="text/javascript" src = "jquery-3.1.1.js"></script>


		<script>
		
		var karte = new Array();
		var talon = new Array();
		var mojeKarte = new Array();
		var njegoveKarte = new Array();
		var mojiPoeni = new Array();
		var tvojiPoeni = new Array();
		brojac = 0;
		var inkrement = 1;
		var znakovi = ["<3","<>", "-3","-E>"];
		//ovaj dio se odnosi na popunjavanje niza karte tako da on liči na špil
		while(brojac < 4){
			var karta = {broj: inkrement, znak: znakovi[brojac] }
			karte.push(karta);
			if(inkrement == 10){
			inkrement += 2;
			}
			else if(inkrement < 14){
			inkrement++;
			}
			else{
			inkrement = 1;
			brojac++;
			}
		}
		
		//Kažu da je dovoljno 7 puta promiješati špil da bismo dobili nasumične karte
		brojMijesanja = 10 + parseInt(Math.random() * 10);
		var k = 0;
		while(k < brojMijesanja){
			karte = mijesanjeSpila(karte);
			k++;
		}
		
		var nosenja = new Array();
		var ruka = 1;
		var potez = 1;
		var igrac = 1;
		
		function returnZnak(simbol){
		var val;
			switch(simbol){
			case "<3":
			val = 0;
			break;
			case "<>":
			val = 1;
			break;
			case "-3":
			val = 2;
			break;
			case "-E>":
			val = 3;
			break;
			}
			return val; 
		}

		function prebrojavanjePoena(niz){
			var s1 = 0;
			var brojPoena = 0;
			while(s1<niz.length){
			if(niz[s1].broj>= 10 || niz[s1].broj== 1 ){
				if(!niz[s1].hasOwnProperty("count")){ // ako nema property count
					brojPoena++;
					if(niz[s1].broj== 10 && niz[s1].znak== "<>"){
					brojPoena++;
					}
				}
			}
			else{
				if(niz[s1].broj==2){
					if(niz[s1].znak == "-3"){
					brojPoena++;
					}
				}
			}
			s1++;
			}
			
			return brojPoena;
		}
		
		function triNaKarte(){
		console.log(mojiPoeni);
		console.log(tvojiPoeni);
		if(mojiPoeni.length > tvojiPoeni.length){
			var mPts = parseInt($('.mypts > h3').text()) + 3;
			$('.mypts > h3').text(mPts);
		}
		else if(tvojiPoeni.length > mojiPoeni.length){
			var comPts = parseInt($('.comppts > h3').text()) + 3;
			$('.comppts > h3').text(comPts);
		}
		}
		//Moram da pišem komentare
		
		function zing(){
		if(talon.length == 2){
			if(talon[0].broj == talon[1].broj){
				var natpis = $('<img src="slike/zing-cards_logo.png">').addClass('animated rubberBand');
				$('#talon').append(natpis);
				if(talon[0].broj != 12){
				switch(igrac){
				case 1:
					var mPts = parseInt($('.mypts > h3').text()) + 10;
					$('.mypts > h3').text(mPts);
					break;
				case 2:
					var comPts = parseInt($('.comppts > h3').text()) + 10;
					$('.comppts > h3').text(comPts);
					break;
				}
			}
			else{
				switch(igrac){
				case 1:
					var mPts = parseInt($('.mypts > h3').text()) + 20;
					$('.mypts > h3').text(mPts);
					break;
				case 2:
					var comPts = parseInt($('.comppts > h3').text()) + 20;
					$('.comppts > h3').text(comPts);
					break;
				}
			}
			talon[0].count = 0;
			}
		}
		
		}
		</script>
	</body>
	
</html>
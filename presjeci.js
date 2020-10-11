function presjeciSpil(){
		$('#špil').removeClass('bounceInLeft');
		$('#špil').addClass('pulse');
		var sjeca = Math.floor(Math.random()*52);
		var ispodSaca = karte[sjeca];
		var znak = 0;
		var urlKarte;
			switch(ispodSaca.znak){
			case "<3":
			znak = 0;
			break;
			case "<>":
			znak = 1;
			break;
			case "-3":
			znak = 2;
			break;
			case "-E>":
			znak = 3;
			break;
			}
		
		var prikaz = setTimeout( function (){$('#ispodSaca').css('background-image','url(karte/' + ispodSaca.broj + '-' + znak + ".jpg").addClass('animated zoomInLeft');
		$('#dugmad').addClass('animated fadeOut');
		var dno = karte.slice(0,sjeca);
		var vrh = karte.slice(sjeca+1);
		karte = vrh.concat(dno);
		karte.push(ispodSaca);
		console.log(karte);
		$('#dugmad').hide();
		dijeljenje();
		
		},200);
		}
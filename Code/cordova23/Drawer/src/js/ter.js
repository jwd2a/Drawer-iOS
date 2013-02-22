$('#placeInput').submit(function(){

	$.getJSON('https://api.foursquare.com/v2/venues/search?near=Tampa%2CFL&query=Jimbos&client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&v=20120621', function(response){
	alert("JSON Data:" + response.response.venues[0].name);		
	});//end getJSON
});//end submit binding



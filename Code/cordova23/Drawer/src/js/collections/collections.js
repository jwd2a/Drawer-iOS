/* Collections */

window.Places = Backbone.Collection.extend({
	
	initialize: function(models, options){
	this.placeName = options.searchterm;
	this.loc = options.loc;
	},
	
	model: CompactPlace,
	
	url: function() {
		return "https://api.foursquare.com/v2/venues/search?v=20120321&intent=checkin&query="+this.placeName+"&client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&near="+this.loc;
	},
	
	parse: function(resp, xhr) {
		console.log("hey");
		return resp.response.venues
	},
	
	getUsersPlaces: function () {
			
	}
});

window.SavedPlaces = Parse.Collection.extend({

	model: Place,
	
	getByDistance: function() {
		var self=this;
		this.sortMode = "distance";
		navigator.geolocation.getCurrentPosition(
				function(position){ //success
					util.rgeocode(position.coords.latitude, position.coords.longitude);
					Parse.User.current().set({
									"geopoint" :  new Parse.GeoPoint({
										latitude: position.coords.latitude, 
										longitude: position.coords.longitude
									})
								});
				console.log(Parse.User.current().get("geopoint"));
				var query = new Parse.Query(Place);
				query.equalTo("user", Parse.User.current());
				query.equalTo("status", "not_tried");
				query.near("geo", Parse.User.current().get("geopoint"));
				self.query = query;
				self.fetch();
				},
				function(error) {
					console.log("Unable to get location");
					console.log(error);
					self.getByCity();
		},
        {timeout:10000,"enableHighAccuracy": true});
		
	},
	
	getByCity: function() {
		this.sortMode = "city";
		var query = new Parse.Query(Place);
		query.equalTo("user", Parse.User.current());
		query.equalTo("status", "not_tried");
		query.ascending("sortableCity")
		this.query = query;
		this.fetch();
	}
	
});

window.TriedPlaces = Parse.Collection.extend({
	model: Place,
	query: (new Parse.Query(Place)).equalTo("status", "tried").equalTo("user", Parse.User.current())
});
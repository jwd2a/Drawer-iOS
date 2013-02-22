/*HUB VERSION*/

/* models FTW! */

window.Place = Parse.Object.extend({
	
	className: "Place",
	
	initialize: function(){

	},

	defaults: {
		"type" : "userplace",
		"location": {
			"address": "",
			"city" : "",
			"state" : "",
			"postalCode" : ""
		},
		"url" : "",
		"contact" : {
			"formattedPhone" : ""
		},
		"categories" :[{
			"name": ""
		}],
		"referrer": "",
		"notes" : ""
	},
	
	fetchFromFoursquare: function(id) {
		var self = this;
		this.loginResponse = $.ajax({
		 			url: "https://api.foursquare.com/v2/venues/"+id+"?client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&v=20130101",
					type: "GET",
					success: function(r) {
		 				window.r = r.response.venue;
						self.set(self.parse(r.response.venue));
						console.log(self);
		 			},
					error: function(e) {
						console.log(e);
					}
		 		});
	},

	del: function() {
		var self=this;
		self.set({
			"status": "deleted"
		});
		self.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/delete/"+self.get("name"), {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		});
	},
	
	markAsDone: function() {
		var self=this;
		this.set({
			"status": "tried",
			"triedDate" : new Date()
		});
		window.model = this;
		console.log("And, save!");
		this.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/markasdone/"+self.get("name"), {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		});
	}
});

window.CompactPlace = Place.extend({
});

// window.User = Parse.User.extend({
// 	
// 	className: "User",
// 	
// 	defaults: {
// 		"id" : null,
// 		"email" : null,
// 		"password" : null,
// 		"lat" : 26.2090319,
// 		"long" : -81.77077240000001
// 	},
// 	
// 	initialize: function() {
// 	
// 	},
// 	
// 	getLocation: function() {
// 		console.log("And, getting location...");
// 		var self=this;
// 		forge.geolocation.getCurrentPosition(function(position){
// 			self.set({
// 					"lat" : position.coords.latitude, 
// 					"lng" : position.coords.longitude,
// 					"geopoint" :  new Parse.GeoPoint({
// 						latitude: position.coords.latitude, 
// 						longitude: position.coords.longitude
// 						})
// 					});
// 			console.log("OK, set the latitude");
// 			console.log("I'll prove it: "+ self.get("lat"));
// 		
// 			util.rgeocode(position.coords.latitude,position.coords.longitude);
// 		});	
// 	  return;
// 	},
// 	
// 	register: function(email, password, userObj){
// 		var self=this;
// 		self.email=email;
// 		self.password=password;
// 		self.userObj=userObj;
// 		window.console.log("starting to register");
// 		window.ws.createUser(email, password).on("success", function(data, response){
// 			self.login(self.email, self.password);
// 			ws.set({
// 				f_id: userObj.userID,
// 				f_token: userObj.accessToken
// 			});
// 		});
// 	},
// 	
// 	login: function(email, password) {
// 		var self=this;
// 		var loginstring = "Basic " + base64.encode(email+":"+password);
// 		console.log(loginstring);
// 		window.console.log("logging in");
// 		this.loginResponse = $.ajax({
// 			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/account/login",
// 			type: "POST",
// 			contentType: "application/json",
// 			headers: {
// 				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1",
// 				"Authorization" : loginstring
// 			},
// 			success: function(r) {
// 				window.r = r;
// 				console.log(r.session_token);
// 				window.localStorage.setItem("jl_sess_token", r.session_token);
// 			//	$.cookie("sess_token", r.session_token, {expires: 14})
// 				window.App.User.set({"id" : r.profile.__id__});
// 				window.App.navigate("#home", {trigger: true});
// 			}
// 		});
// 	},
// 	
// 	checkLoginStatus: function() {
// 		console.log("checking login");
// 		var self=this;
// 		if (Parse.User.current()){
// 			console.log("yes");
// 			window.App.User = Parse.User.current();
// 			window.App.navigate("#home", {trigger:true});
// 			
// 		}
// 		window.App.navigate("#login", {trigger:true});
// 	}
// });
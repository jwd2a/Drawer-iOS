/*Views*/

//THIS IS THE HUB VERSION
/*The loginView View displays the login form*/

window.LoginView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#login-template').html());
	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"click #signInWithFacebookBtn": "loginWithFacebook",
		"vmousedown #signInWithFacebookBtn" : "highlightFBBtn",
		"vmouseup #signInWithFacebookBtn" : "unhighlightFBBtn",
		"click #goNativeLogin" : "goNativeLogin"
	},

	loginWithFacebook: function() {
		var self=this;
		FB.login(
            function(response){
                 var authResponse = response;
                 var expire_date = moment().add("seconds", response.authResponse.expiresIn).toDate();
                 console.log(expire_date);
                 FB.api('/me', function(response) {
                        console.log(authResponse.authResponse.accessToken);
                        Parse.FacebookUtils.logIn({
                                                  access_token:authResponse.authResponse.accessToken,
                                                    expiration_date: expire_date.toISOString(),
                                                    id: response.id
                                                  },
                                                  {
                                                    success: function(user){
                                                        user.set({"email":response.email});
                                                        window.App.navigate("#myplaces", {trigger:true});
                                                    },
                                                    error: function(user,error){
                                                        alert("error");
                                                        console.log(error);
                                                    }
                                                  }
                                                  );
                        }); //end FB API
                        },//end response handler
        { scope: "email" }); //end FB.login
 	},

	highlightFBBtn: function(e){
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},
	
	unhighlightFBBtn: function(e){
		$(e.currentTarget).css("backgroundColor", "#3b5a9a");
	},
	
	goNativeLogin: function() {
		App.navigate("#register", {
			trigger: "true"
		});
	}
});

window.NativeLoginView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#nativeLogin-template').html());
	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"submit #loginNative": "login",
		"focus #loginNative>input": "clearHints",
		"blur #loginNative>input": "writeHints",
		"click #regButton": "goRegister"
	},


	clearHints: function(e) {
		var value = $(e.target).val();
		if (value == "Email Address" || value == "Password") {
			$(e.target).removeClass("withHint").val("");
		};
	},

	writeHints: function(e) {
		var value = $(e.target).val();
		if (value == "" && $(e.target).attr("id") == "regPass") {
			$(e.target).addClass("withHint").val("Password");
		};

		if (value == "" && $(e.target).attr("id") == "regEmail") {
			$(e.target).addClass("withHint").val("Email Address");
		};
	},

	goHome: function() {
		alert($("#username").val());
	},

	login: function(e) {
		e.preventDefault();
		var email = $("#regEmail").val();
		var password = $("#regPass").val();
		Parse.User.logIn(email,password, {
			success: function(user){
				window.App.navigate("#myplaces", {trigger:true});
			},
			error: function(user, error){
				alert(error);
				console.log(error);
			}
		});
	},

	goRegister: function() {
		App.navigate("#register", {
			trigger: "true"
		});
	}
});

/* Registration View */

window.RegisterView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#register-template').html());

	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"submit #registerNative": "processRegistration",
		"focus input[type='text']" : "focusField",
		"blur input[type='text']" : "blurField",
		"click #showPass" : "togglePassChk"
	},

	processRegistration: function(e) {
		e.preventDefault();
		var user = new Parse.User();
		user.set("username", $("#regEmail").val());
		user.set("password", $("#regPass").val());
		user.set("email", $("#regEmail").val());

		user.signUp(null, {
		  success: function(user) {
			window.App.navigate("#myplaces", {trigger:true});
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
			$("#signInError").css("visibility", "visible");
			$("#signInError").html(error.message);
		    //	alert("Error: " + error.code + " " + error.message);
		  }
		});

	},
	
	focusField: function(e) {
		var field = e.currentTarget;
		if ($(field).val() == "Enter an email address" || $(field).val() == "Choose a password"){
			$(field).val("");
		}
		$(field).css("color", "#000");
	},
	
	blurField: function(e) {
		if ($(e.currentTarget).val() === "") {
			
			($(e.currentTarget).css("color", "#dddddd"));
			
			if ($(e.currentTarget).attr("id") == "regEmail") {
				$(e.currentTarget).val("Enter an email address");
			}
			
			if ($(e.currentTarget).attr("id") == "regPass") {
				$(e.currentTarget).val("Choose a password");
			}
		}
	},
	
	togglePassChk: function() {
		if($("img#showPassChk").attr("src")=="img/checkbox_checked.png") {
			$("img#showPassChk").attr("src", "img/checkbox_unchecked.png");
			$("#regPass").css("-webkit-text-security", "disc");
		}
		else {
			$("img#showPassChk").attr("src", "img/checkbox_checked.png");
			if ($("#regPass").val() != "") {
				$("#regPass").css("-webkit-text-security", "none");
			}	
		}
	}

});


/*Location Detail View shows information about a location*/
/*THIS IS A LEGACY VIEW FROM A PRIOR VERSION, MyLocationDetailView extends this, however, so left for now*/
/*TODO: Merge this view functionality with MyLocationDetailView and blow this view away*/

window.LocationDetailView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template($('#locationDetail-template').html());
		window.loc = this.model;
	},

	render: function() {
		var self=this;
		var renderedContent = this.template(this.model.toJSON());
		if (this.model.get("photos")){
			console.log("yes");
			var viewportHeight = $("html").height();
			var viewportWidth = $("html").width();
			var imageHeight = Math.round(viewportHeight*.291666667);
			var imgSrc = self.model.get("photos").groups[0].items[0].prefix+viewportWidth+"x"+imageHeight+self.model.get("photos").groups[0].items[0].suffix;
			console.log(imgSrc);
			var renderedContent = renderedContent.replace("<img src='' alt='' id='placeImg' />", "<img id='placeImg' src='"+imgSrc+"' alt='"+self.model.get('name')+"' />");
		}
		
		else{
			var renderedContent = renderedContent.replace("<img src='' alt='' id='placeImg' />", "<img id='placeImg' src='img/test_photo2.jpg' alt='"+self.model.get('name')+"' />");
		}
		
		$(this.el).html(renderedContent);
		return this;
	},
	
	postRender: function(){
		var self=this;
		
	},

	events: {
		"click #savePlace": "savePlace"
	},

	savePlace: function() {
		this.model.save()
	}

});

window.MyLocationDetailView = window.LocationDetailView.extend({
	initialize: function() {
		this.template = _.template($('#myLocationDetail-template').html());
		window.loc = this.model;
		if (this.model.get("url")){
			var locUrl = this.model.get("url");
			this.model.set({url:util.cleanUpURL(locUrl)});
		}

	},

	events: {
		"click #removePlace": "removePlace",
		"click #triedPlace": "markAsDone",
		"click .back" : "goBack",
		"click .edit" : "editPlace",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .edit" : "highlightEdit",
		"vmouseup .edit" : "unhighlightEdit",
		"vmouseup .locationDetailBtn" : "highlightBtn",
		"vmousedown .locationDetailBtn" : "unhighlightBtn",
        "click #notifyMe" : "markAsNotified"
		
	},

	removePlace: function() {
		this.model.del();
	},
	
	
	editPlace: function() {
		window.model = this.model;
		window.App.navigate("#editPlace", {trigger:true});
	},
	

	markAsDone: function() {
		this.model.markAsDone();
	},
    
    markAsNotified: function() {
        var params = {"fid":this.model.id, "radius":5, "latitude": this.model.get("location").lat, "longitude": this.model.get("location").lng};
        console.log(params);
        DGGeofencing.addRegion(
        params,
        function(result) {
        console.log("add success");
        },
        function(result) {
        alert("failed to add region");
        });
    },
	
	goBack: function() {
		window.App.navigate("myplaces", {trigger:true});
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},
	
	highlightEdit: function(e) {
			util.highlightOnVMouseDown(e, "edit");
	},
	
	unhighlightEdit: function(e) {
			util.unhighlightOnVMouseUp(e, "edit");
	},

	highlightBtn: function(e){
		window.BtnBGColor = $(e.currentTarget).css("backgroundColor");
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},
	
	unhighlightBtn: function(e){
		$(e.currentTarget).css("backgroundColor", window.BtnBGColor);
	},

});

window.MyPlacesView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		this.template = _.template($('#myPlaces-template').html());
		_(this).bindAll("render");
		this.collection.bind('reset', self.render);
	},

	events: {
		"click .add" : "goAdd",
		"click .sortDistance" : "sortDistance",
		"click .sortCity" : "sortCity",
		"click .settings" : "goSettings",
		"vmousedown li" : "highlightItem",
		"vmouseup li" : "unhighlightItem",
		"vmousedown .add" : "highlightAdd",
		"vmouseup .add" : "unhighlightAdd",
		"vmousedown .settings" : "highlightSettings",
		"vmouseup .settings" : "unhighlightSettings",
		"vmousemove li" : "unhighlightItem"
	},

	render: function() { 
		var self = this;
		var renderedContent = this.template();

		self.list = "";
		self.currentCity = "";
		window.collection = this.collection;
		
		if (this.collection.sortMode == "city") {
			$(".sortCity").addClass("sortActive").removeClass("sortInactive");
			$(".sortDistance").addClass("sortInactive").removeClass("sortActive");
				this.collection.each(function(place) {
					if (place.get("location")["city"] != self.currentCity) {
						self.currentCity = place.get("location")["city"];
						self.list += "<li class='locationDivider'><div class='actAsTableCell verticalCenter'>" + self.currentCity + ", " + place.get("location")["state"] + "</div></li>";
					}

					self.list += self.renderStandardListItem(place);
				});

				$("ul#placeList").html(self.list);
		}

		if (this.collection.sortMode == "distance") {
			$(".sortDistance").addClass("sortActive").removeClass("sortInactive");
			$(".sortCity").addClass("sortInactive").removeClass("sortActive");
				var distanceMarker = null;
                    
						self.list += self.renderNearDistanceListItem(place, placeDistance);
					}

					else {
						if (distanceMarker == "near" || distanceMarker == null) {
							distanceMarker = "far";
							self.list += "<li class='locationDivider'><div class='actAsTableCell verticalCenter'>Far from here</div></li>";
						}
						self.list += self.renderFarDistanceListItem(place);
					}

				});

			$("ul#placeList").html(self.list);
		}
		
		$("ul#placeList").listview("refresh");
		
		$(this.el).html(renderedContent);
	},
	
	postRender: function(){
		var listSortHeight = $("#listSort").height();
		$("#confirmationMessage").css({
			"height" : listSortHeight,
			"margin-top" : -listSortHeight
		});
		
		if (this.options.action == "delete"){
			$(".message").html("You removed "+this.options.place);
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);
		}
		
		if (this.options.action == "markasdone"){
			$(".message").html("Alright! That's one more in the books.");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);
		}
		
		if (this.options.action == "saved") {
			$(".message").html("Saved to your list!");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);		
		}
		
		if (this.options.action == "edited") {
			$(".message").html("Changed saved!");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);		
		}
		
	},
	
	highlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#fcd0cc");
	},
	
	unhighlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#ffffff");
	},
	
	highlightAdd: function(e) {
			util.highlightOnVMouseDown(e, "add");
	},
	
	unhighlightAdd: function(e) {
			util.unhighlightOnVMouseUp(e, "add");
	},
	
	highlightSettings: function(e) {
			util.highlightOnVMouseDown(e, "settings");
	},
	
	unhighlightSettings: function(e) {
			util.unhighlightOnVMouseUp(e, "settings");
	},

	renderStandardListItem: function(place) {
		window.place = place;
		return "<li data-icon='false' class='non_theme placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["city"] + " ," + place.get("location")["state"] + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by " + place.get("referrer") + "</span></div></a></li>";
	},

	renderNearDistanceListItem: function(place, placeDistance) {
		var placeDistance = Math.round(placeDistance * 10) / 10;
		return "<li data-icon='false' class='placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='distance'>" + placeDistance + " mi</span><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by "+place.get("referrer")+"</span></div></a></li>";
	},

	renderFarDistanceListItem: function(place) {
		return "<li data-icon='false' class='placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["city"] + " ," + place.get("location")["state"] + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by " + place.get("referrer") + "</span></div></a></li>";
	},

	sortCity: function() {
		$("ul#placeList").html('<img src="img/loading_sorting.gif" id="ajaxLoader" alt="Loading...">');
		$(".sortCity").addClass("sortActive").removeClass("sortInactive");
		$(".sortDistance").addClass("sortInactive").removeClass("sortActive");
		this.collection.getByCity();
	},

	sortDistance: function() {
		$("ul#placeList").html('<img src="img/loading_location.gif" id="ajaxLoader" alt="Loading...">');
		$(".sortDistance").addClass("sortActive").removeClass("sortInactive");
		$(".sortCity").addClass("sortInactive").removeClass("sortActive");
		this.collection.getByDistance();
	},
	
	goAdd: function() {
		App.navigate("#findPlace", {
			trigger: true
		});
	},
	
	goSettings: function() {
		App.navigate("#settings", {
			trigger: true
		});
	}

});

window.AddItemView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template($('#addItem-template').html());
		this.model.bind('change', this.render, this);
		var placeID = this.model.id; //get the foursquare id for the venue we just requested
		this.model.fetchFromFoursquare(placeID); //replace the model with the full venue details from foursquare
		window.addPlace = this.model;
	},

	render: function() {
		var self = this;
		var renderedContent  = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		setTimeout(function() {
		        var windowHeight = $("html").height();
				var headerHeight = $("#header").height();
				var placeInfoHeight = $("#placeInfo").height();
				var placeFeedbackHeight = windowHeight - (headerHeight+placeInfoHeight);
				
				console.log("#placeFeedback should be: " + placeFeedbackHeight);
				$("#placeFeedback").height(placeFeedbackHeight);
		    }, 0);
		
		if(this.model.get("photos")) {
				var viewportWidth = $("html").width();
				var imageWidth = viewportWidth*.2; //make the image 20% of the width of the screen
				var imgSrc = self.model.get("photos").groups[0].items[0].prefix+imageWidth+"x"+imageWidth+self.model.get("photos").groups[0].items[0].suffix;
				$("#addPlaceImage").attr("src", imgSrc);
			}
		return this;
	},
	
	events: {
		"submit #recommendedPlaceFeedback": "savePlace",
		"click .back" : "goBack",
		"click .edit" : "editPlace",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
		},

	savePlace: function(e) {
		e.preventDefault();
		var geopoint = new Parse.GeoPoint({
			latitude: this.model.get("location").lat, 
			longitude: this.model.get("location").lng
			});
		this.model.set({
			"user" : Parse.User.current(),
			"notes" : $("#notes").val(), 
			"referrer" : $("#recommendedBy").val(),
			"status" : "not_tried",
			"geo" : geopoint,
			"fs_id" : this.model.id,
			"sortableCity" : this.model.get("location").city.replace(/\s+/g, '') + this.model.get("location").state
		});
		delete this.model.id;
		this.model.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/saved", {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		});
	},
	
	goBack: function() {
		window.history.back();
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},
	
	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	
	
	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	},
	
	editPlace: function() {
		window.App.navigate("#editPlace", {trigger:true});
	}
});

window.EditPlaceView = window.AddItemView.extend({
	initialize: function() {
		console.log("initialize editPlaceView");
		this.template = _.template($('#addItem-template').html());
	},
	
	events: {
		"submit #recommendedPlaceFeedback": "savePlace",
		"click .back" : "goBack",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
	},
	
	savePlace: function(e) {
		e.preventDefault();
		this.model.set({
			"notes" : $("#notes").val(), 
			"referrer" : $("#recommendedBy").val()
		});

		this.model.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/edited", {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		}); 
	},
	
	goBack: function() {
		window.history.back();
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},

	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	

	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	}
	
});

window.FindPlaceView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#findPlace-template').html());
	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		var input = $('#location', this.el).get(0);
		var options = {
			types: ['(cities)']
		};
		autocomplete = new google.maps.places.Autocomplete(input, options);
		
		if (Parse.User.current().get("city")){
			$('#location', this.el).val(Parse.User.current().get("city") + ", " + Parse.User.current().get("state"));
		}

		return this;
	},
	
	postRender: function() {
		var self=this;
		console.log("loaded");
		$("#searchBox").focus(function(){
			$(this).css("color","#000000");
		});
	},

	events: {
		"submit form#searchBar": "processForm",
		"click .cancel" : "cancelAdd",
		"focus #searchBox" : "clearSearchField",
		"vmousedown .cancel" : "highlightCancel",
		"vmouseup .cancel" : "unhighlightCancel",
		"vmousedown li" : "highlightItem",
		"vmouseup li" : "unhighlightItem",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
	},

	setLocation: function(e) {
		$("#searchLocationInput").hide();
		this.setLocation = $("#location").val();
		$("#searchLocation").html(this.setLocation).show();
	},

	drawList: function(collection) {
		$("ul#resultsList").empty();
		window.testplace = collection[0];
		collection.each(function(place) {
			if (!(place.get("location")["address"] = place.get("location")["address"])) {
				place.get("location")["address"] = "";
			}

			if (place.get("categories").length == 0) {
				place.category = "";
			} else {
				place.category = place.get("categories")[0]["name"];
			}

			$("ul#resultsList").append("<a href='#add/venue/"+place.id+"'><li class='result' data-id='" + place.cid + "'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.category + "</span></li></a>");
		});
		
		$("ul#resultsList").listview("refresh");
		$("#searchSubmit").val("Search again");
		$("#searchSubmit").css("background-color", "#1cbbb4");
		
		setTimeout(function(){
			var findContainerHeight = $("#findContainer").height();
			var findContainerTopPadding = $("#findContainer").css("padding-top");
			$("#resultsContainer").css("margin-top", findContainerHeight+parseInt(findContainerTopPadding, 10));
		},0);		
	},

	processForm: function(e) {
		e.preventDefault();
		var self = this;
		this.querystring = $("#searchBox").val(); //get the query
		this.loc = $("#location").val();
		$("#searchSubmit").val("Searching...");
		$("#searchSubmit").css("background-color", "#dddddd");
		self.runQuery(this.querystring, this.loc);

	},

	runQuery: function(querystring, loc) {
		var self = this;
		$("ul#resultsList").html('<img src="img/ajax-loader_gray.gif" id="ajaxLoader" alt="Loading...">');
		self.collection = new Places(null, {
			searchterm: querystring,
			loc: loc
		}); //create a new collection, passing the query to the Foursquare URL
		window.searchresults = self.collection;
		self.collection.fetch({
		  success: function(collection) {
		  },
		  error: function(collection, error) {
		    // The collection could not be retrieved.
		  }
		});
		self.collection.bind('reset', function(collection) {
			self.drawList(collection);
		});
	},
	
	onClose: function() {
		this.model.unbind("change", this.render);
	},
	
	cancelAdd: function() {
			window.searchresults = null;
			App.navigate("#myplaces", {
				trigger: true
			});
	},
	
	clearSearchField: function() {
		if ($("#searchBox").val() == "What's the place?") {
			$("#searchBox").val("");
		}
	},
	
	highlightCancel: function(e) {
			util.highlightOnVMouseDown(e, "cancel");
	},
	
	unhighlightCancel: function(e) {
			util.unhighlightOnVMouseUp(e, "cancel");
	},
	
	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	
	
	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	},
	
	highlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#fcd0cc");
	},

	unhighlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#ffffff");
	}

});

window.SettingsView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#settings-template').html());
	},
	
	events: {
		"click #logOut" : "logOut",
		"click .back" : "goBack",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit",
        "click #globalNotifyToggle" :"enableNotifications"
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	logOut: function() {
		console.log("go log out");
		Parse.User.logOut();
		forge.facebook.logout();
		App.navigate("#login", {
			trigger: true
		});
	},
    
    enableNotifications: function() {
    
        DGGeofencing.startMonitoringSignificantLocationChanges(
            function(result) {
                alert("Location Monitor Success:" + result);
            },
            function(error) {
                alert("Failed to monitor location changes");
            });
    },
	
	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	
	
	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	},
	
	goBack: function() {
		App.navigate("#myplaces", {
			trigger: true
		});
	}
});

window.staticContentView = Backbone.View.extend({
	initialize: function() {
		
	},
	
	events: {
		"click .back" : "goBack"
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	goBack: function() {
		window.history.back();
	}
});

window.FeedbackView = window.staticContentView.extend({
	initialize: function() {
		this.template = _.template($('#feedback-template').html());
	},
	
	events: {
		"click #submitFeedback" : "sendFeedback",
		"click .back" : "goBack"
	},
	
	sendFeedback: function(e) {
		e.preventDefault();
		console.log("OK, go send");
		Parse.Cloud.run("sendSupportEmail", {
			"bodyText" : $("#messageText").val(), 
			"email" : Parse.User.current().get("email"),
			"hardware" : navigator.userAgent,
			"supportType" : $("#reasonForMessage").val()
			 }, {
				success: function(result) {
					$("#launchModal").fancybox({
						closeBtn: false,
						scrolling: 'no',
						closeClick: true,
						afterClose: function(){
							App.navigate("#settings", {
								trigger: true
							});
						}
					});
					$("#launchModal").trigger('click');	
				},
				error: function(result) {
					console.log(result);
				}
			});
	},
	
	goBack: function() {
		window.history.back();
	}
});

window.TriedPlacesView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template($('#triedPlaces-template').html());
		_.bindAll(this, "renderContent");
		this.collection.bind('reset', this.renderContent);
	},
	
	events: {
		"click .back" : "goBack"
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	renderContent: function() {
		var self=this;
		self.list="";
		this.collection.each(function(place){
			window.list = self.list;
			var dateSinceTried = "";
			if (place.get("triedDate")){
				var dateSinceTried = moment(place.get("triedDate")).fromNow();
			}
			self.list += "<tr><td class='tbl_col1'>"+dateSinceTried+"</td><td class='tbl_col2'>"+place.get("name")+"</td></tr>";
		});
		$("#triedList").html(self.list);
		if (this.collection.length==0){
			$("#content").html("<h3 class='noTried'>Looks like you haven't tried any places yet.<br/><br/>Better get on that!</h3>"); 
		}
	},
	
	goBack: function() {
		window.history.back();
	}
	
});

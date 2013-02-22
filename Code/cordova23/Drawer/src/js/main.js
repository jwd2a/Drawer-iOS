util = {};	
util.rgeocode = function(lat,lon){
	$.ajax({
		url: "http://where.yahooapis.com/geocode?location="+lat+","+lon+"&appid=dEaFGa4g&flags=j&gflags=r",
		success: function(r){
			var locationData = [];
			window.r = r;
			locationData["city"] = r.ResultSet.Results[0].city;
			locationData["state"] = r.ResultSet.Results[0].statecode;
			Parse.User.current().set({ //this needs to eventually pass back to the user model, to separate concerns
				"city" : locationData["city"],
				"state" : locationData["state"]
			});
		},
		error: function(r){
			return r.ResultSet.ErrorMessage;
		}	
	});
}

util.randomString = function() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

util.cleanUpURL = function(url) {
	var newurl = url.replace(/.*?:\/\//g, "");
	var newurl = newurl.replace(/\//, "");
	return newurl;
}

util.prepForStackMob = function(object) { //this makes all keys at least 3 char, and everything lowercase, per StackMob restrictions
	console.log(object);
	_.each(Object.keys(object.attributes), function(key) {
			var newkey = key.toLowerCase();
		    object.attributes[newkey] = object.attributes[key];
		    delete object.attributes[key];
	})
	for (var key in object.attributes) {
	    if (key.length === 2) {
	        object.attributes["mod_"+key] = object.attributes[key];
	        delete object.attributes[key];
	    }
	}
	console.log(object);
	return object;
}

util.highlightOnVMouseDown = function(target, imageName) {
	var bgImage = $(target.currentTarget).css("backgroundImage");
	var image = bgImage.replace("btn_"+imageName,"btn_"+imageName+"_active");
	$(target.currentTarget).css("backgroundImage", image);
}

util.unhighlightOnVMouseUp = function(target, imageName) {
	var bgImage = $(target.currentTarget).css("backgroundImage");
	var image = bgImage.replace("btn_"+imageName+"_active","btn_"+imageName);
	$(target.currentTarget).css("backgroundImage", image);
}

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

spin = {};
spin.opts = {
  lines: 13, // The number of lines to draw
  length: 8, // The length of each line
  width: 3, // The line thickness
  radius: 11, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 69, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

DGGeofencing.getPendingRegionUpdates(
				function(result) { 
					var updates = result.pendingupdates;
					$(updates).each(function(index, update){
						var fid = update.fid;
						var status = update.status;
						var timestamp = update.timestamp;
						alert("fid: " + fid + " status: " + status + " timestamp: " + timestamp);

						var regions = Region.all().filter("fid", '=', fid);
						regions.list(null, function (results) {
					        $(results).each(function(index, item){
					            if (fid == item.fid) {
					                if(status == "enter") {
										item.currentlyHere = "yes";
										alert("entered: " + item.name);
									} else {
										item.currentlyHere = "no";
										alert("exited: " + item.name);
									}
								}
					        });
						});
                    });
                });
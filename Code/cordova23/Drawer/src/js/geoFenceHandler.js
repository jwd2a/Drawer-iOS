function handleGeofenceAlert(geoFenceEvent) {
	var locID = geoFenceEvent.regionupdate.fid;
	var updateType = geoFenceEvent.regionupdate.status;
	
	if(updateType=="enter"){ //if we're entering the geofence, get the place from Parse
    console.log("entering!");
        var placeQuery = new Parse.Query(Place);
        var affectedLocation = placeQuery.get(locID, {
        
            success: function(affectedLocation){
                navigator.notification.alert(
                "You're nearby a place in your Drawer: "+affectedLocation.get("name")+"(recommended by"+affectedLocation.get("referrer")+")! Make sure to check it out while you're here!",
                alertDismissed,
                "Drawer Alert!",
                "Got it");
            },
            error: function(object, error){
                console.log(error);
            }
        });

    }
}

function alertDismissed(){
}
//THIS IS THE HUB VERSION

window.JotLocale = Backbone.Router.extend({
	routes: {
	'' : 'checkLogin',
	'myplaces' : 'myplaces',
	'searchresults/:query/location/:location' : 'searchresults',
	'home/:action(/:placename)' : 'myplaces',
	'locationdetail/:id' : 'locationdetail',
	'register' : 'register',
	'myplaces/:action(/:placename)' : 'myplaces',
	'login' : 'login',
	'nativeLogin' : 'nativeLogin',
	'mylocation/:id' : 'mylocation',
	'add/venue/:id' : 'addItem',
	'findPlace' : 'findPlace',
	'editPlace' : 'editPlace',
	'settings' : 'settings',
	'staticContentPage/:page' : "staticContentPage",
	'triedPlaces' : 'triedPlaces',
	'feedback' : 'feedback'
	},
	
	initialize: function() {
		
	},
	
	login: function() {
		this.changePage(new LoginView({}));
	},
	
	nativeLogin: function() {
		this.changePage(new NativeLoginView({}));
	},
	
	checkLogin: function(){
		console.log("checking login");
		if(!Parse.User.current()){
			window.App.navigate("#login", {trigger:true});
		}
		else {
			window.App.navigate("#myplaces", {trigger:true});
		}
		
		
	},
	
	mylocation: function(id) {
		console.log(id);
		var place = window.collection.get(id);
		console.log(place);
		this.changePage(new MyLocationDetailView({model: place}), "slide");
	},
	
	register: function(){
		this.changePage(new RegisterView({}));

	},
	
	myplaces: function(action, place) {
		console.log("my places route");
		if (!action){
			var action = "";
			var place = "";
		}
		if (window.collection) {
			var myPlaceList = window.collection;
			if (myPlaceList.sortMode == "distance") {
				myPlaceList.getByDistance();
			}
			else{
				myPlaceList.getByCity();
			}
		}
		else {
			var myPlaceList = new SavedPlaces();
			window.collection = myPlaceList;
			window.collection.sortMode = "distance";
			myPlaceList.getByDistance();
		}
		var self=this;
		self.changePage(new MyPlacesView({
			collection: myPlaceList,
			action:action,
			place:place
		}));
	},	
	
	addItem: function(id) {
		var place =  new Place(); //create a new model for the view
		place.id = id; //set the ID of the place, so we can use it to update the view in a second...
		this.changePage(new AddItemView({model:place}), "slide");
	},
	
	findPlace: function() {
		this.changePage(new FindPlaceView({}), "flip");
	},
	
	editPlace: function(){
		this.changePage(new EditPlaceView({model:window.loc}), "flip");
	},
	
	settings: function() {
		this.changePage(new SettingsView({}), "fade");
	},
	
	triedPlaces: function() {
		var triedPlaces = new TriedPlaces();
		triedPlaces.fetch();
		window.triedPlaces = triedPlaces;
		this.changePage(new TriedPlacesView({collection:triedPlaces}), "slide");
	},
	
	feedback: function() {
		this.changePage(new FeedbackView(), "slide");
	},
	
	staticContentPage: function(page) {
		var view = new staticContentView();
		if (page == "about") {
			view.template = _.template($('#aboutDrawer-template').html());
		}
		
		if (page == "TOS") {
			view.template = _.template($('#TOS-template').html());
		}
		
		this.changePage(view,"fade");
	},

	changePage:function (view, transition) {
			this.currentView = view;
	        $(view.el).attr('data-role', 'page');
	        view.render();
	        $('body').append($(view.el));
	        $.mobile.changePage($(view.el), {changeHash:false, transition: transition});
			setTimeout(function() {
			       if (view.postRender) {
				        view.postRender();
				}
			}, 0);
			
	}
	
});


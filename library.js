"use strict";
var Settings = module.parent.require('./settings');
var SocketAdmin = module.parent.require('./socket.io/admin');

//settings and such
var defaultSettings = {
    booleans: {
      replace: true
    },
    strings: {
      apilink: "https://spaffnerds.com/api/songs/",
      afterSong: "lyrics",
	  afterUrl: "name"
    }
};
  
var settings = new Settings('spaffnerds', '1.0.4', defaultSettings, function() 
{
		// the settings are ready and can accessed.
		//console.log(mySettings === this); // true
		//console.log(this.get('strings.someString') === mySettings.get().strings.someString); // true
});

SocketAdmin.settings.syncspaffnerds = function() {
    settings.sync();
};

//initialize
var spaffnerds = {}

spaffnerds.init = function(params, callback) { 
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	function render (req, res, next) {
      res.render('admin/plugins/spaffnerds')
    }
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/spaffnerds', hostMiddleware.admin.buildHeader, render);
	router.get('/api/admin/plugins/spaffnerds', render);

	callback();
};

//create admin view
spaffnerds.admin = {
	menu: function(custom_header, callback) {
			custom_header.plugins.push({
				route: '/plugins/spaffnerds',
				icon: 'fa-tint',
				name: 'Spaffnerds'
			});
			callback(null, custom_header);
			};
};

//replace song names with links
spaffnerds.replaceEverything = function(data, callback)	{

	//get settings
	var api = settings.get('strings.apilink');
    var afterSN = settings.get('strings.afterSong');
	var afterSNULS = settings.get('strings.afterURL');
	var replacebool = settings.get('booleans.replace');
	
	var post = data.postData.content; //get post data
	alert(post);
	
	if(!post || !replacebool)
	{
		alert("There is no text to parse here, or you've turned me off!");
	} else {
		
		var songnames; //initialize
		var songurls;

		fetch('https://spaffnerds.com/api/songs/') //get data from spaffnerds api
		.then(function(response) {
				return response.text();
			}).then(function(text) { 
				var sn = text.match(/((\w|\s|[(]|[)]|[']|[,]|[&])+?)(?=","lyrics")/g); //find song names
				songnames = sn;
				alert(songnames);
			var snuls = text.match(/((\w|-)+?)(?=","name")/g); //find song ids
			songurls = snuls;
			replace();
			//the actual replacement of text is defined in a separate function and called from here 
			//because if the replace() function contents are written here,
			//the fetched data will be unavailable.
		});
		
		function replace() {
			var regexlook;
			for(n = 0; n < songnames.length; n++) //search and replace song names with links
			{
				regexlook = RegExp(songnames[n] + "(?!])", "ig")
				post = post.replace(regexlook, "[" + songnames[n] + "]" + "(" + "https://spaffnerds.com/songs/" + songurls[n] + ")"); 
			}
			
			var datelist = post.match(/(\d\d\d\d-\d\d-\d\d)(?!(]|[)]))/g);
			for(i=0; i < datelist.length; i++)
			{
				post = post.replace(/(\d\d\d\d-\d\d-\d\d)(?!(]|[)]))/g, "[" + datelist[i] + "]" + "(" + "https://spaffnerds.com/shows/" + datelist[i] + ")");
			}
			
			data.postData.content = post;
		}
		
	}
	callback(null, data);
};

module.exports = spaffnerds;
"use strict";

var spaffnerds = {}

//initialize
spaffnerds.init = function(params, callback) { 
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/spaffnerds', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/spaffnerds', controllers.renderAdminPage);

	callback();
};

//create admin view
spaffnerds.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/spaffnerds',
		icon: 'fa-tint',
		name: 'Spaffnerds'
	});

	callback(null, header);
};

//replace song names with links
spaffnerds.replaceSongNames = function(data, callback)	{

	var post = data.postData.content; //get post data
	alert(post);
	
	if(!post)
	{
		alert("There is no text to parse here!");
	} else {
		
		var songnames; //initialize
		var songurls;

		fetch('https://spaffnerds.com/api/songs/') //get data from spaffnerds api
		.then(function(response) {
				return response.text();
			}).then(function(text) { 
				var sn = text.match(/((\w|\s|[(]|[)]|[']|[,]|[&])+?)(?=","lyrics")/g); //find song names
				songnames = sn;
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
			data.postData.content = post;
		}
	}
	callback(null, data);
};

//add show date to your post
spaffnerds.addShowDate = function(postData, callback) {

	var post = data.postData.content; //get post data
	var datelist;
	
		//look for dates and put into array
	datelist = post.match(/(\d\d\d\d-\d\d-\d\d)(?!(]|[)]))/g);
	
	for(i=0; i < datelist.length; i++)
	{
		post = post.replace(/(\d\d\d\d-\d\d-\d\d)(?!(]|[)]))/g, "[" + datelist[i] + "]" + "(" + "https://spaffnerds.com/shows/" + datelist[i] + ")");
	}
	
	
};

module.exports = spaffnerds;
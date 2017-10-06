"use strict";

var spaffnerds = {

	replaceText: function(postData) {
	
		data.postData.content = parser.render(data.postData.content); //get post data
		
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
			var post = data.postData.content;
			var regexlook;
			for(n = 0; n < songnames.length; n++) //search and replace song names with links
			{
				current = songnames[n];
				regexlook = RegExp(current, "ig")
				post = post.replace(regexlook, "[" + current + "]" + "(" + "https://spaffnerds.com/songs/" + songurls[n] + ")"); 
			}
			data.postData.content = post;
		}
	}
};

module.exports = spaffnerds;
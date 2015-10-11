		if (annyang) {
		  // Let's define a command.
		  var commands = {
		    'search *something': function(something) { 
		    	$.ajax({
				    url: "https://api.genius.com/search?q=" + something,
				    type: "GET",
				    headers: {"Authorization": "Bearer WJCDe9kbzfhPQnwzBXQcMw8JExlRMefEWN19V0elsOMNhriiJodaO9Ld6hQ2TZn9"},
  					success: function (data) {

  						
  						
			            document.getElementById("artist").innerHTML = data.response.hits[0].result.title; 
			            document.getElementById("title").innerHTML = "By " + data.response.hits[0].result.primary_artist.name; 



			            $.ajax({
						    url: "https://api.genius.com/songs/" + data.response.hits[0].result.id,
						    type: "GET",
						    headers: {"Authorization": "Bearer WJCDe9kbzfhPQnwzBXQcMw8JExlRMefEWN19V0elsOMNhriiJodaO9Ld6hQ2TZn9"},
		  					success: function (data) {

					        }
						});

			        }
				});
		    	

		    	$.get(
					"https://www.googleapis.com/youtube/v3/search", {
						part: 'snippet', 
						maxResults: 10,
						order: 'relevance', 
						q: data.response.hits[0].result.title + data.response.hits[0].result.primary_artist.name, 
						type: 'video',
						key: 'AIzaSyAAYhBMn77W-cQ35ub-7o8F960_03DzYr4'
					}, 
					function(data){
						$.each(data.items, function(i, item) {
							if(i == 0)
							{
								console.log(item);
								var videoToPlay = "https://www.youtube.com/watch?v=" + item.id.videoId + "&autoplay=1"; 
								var videoToPlay = videoToPlay.replace("watch?v=", "v/");


								$.get(
									"https://www.googleapis.com/youtube/v3/captions", {
										part: 'snippet', 
										videoId: item.id.videoId,
										key: 'AIzaSyAAYhBMn77W-cQ35ub-7o8F960_03DzYr4'
									}, 
									function(data){
									}
								)
								document.getElementById("VID").src = videoToPlay; 
							}
						})
					}
				)


		     },
		    'stop': function() { pause(); }, 
		    'go': function() { resume(); },
		    'Drake if i': function() {  }
		  };



		  //https://www.googleapis.com/youtube/v3/videos
		  //&key=AIzaSyAAYhBMn77W-cQ35ub-7o8F960_03DzYr4

		  // Add our commands to annyang
		  annyang.addCommands(commands);

		  annyang.addCallback('error', function () {
			console.log("There's an error!")
		  });

		  annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
		  	//console.log("Matches!"); 
			//console.log(userSaid); 
			//console.log(commandText);
			//console.log(phrases); 
		  });

		  annyang.addCallback('resultNoMatch', function (phrases) {
			//console.log("No matches!"); 
			//console.log(phrases); 
		  });

		  // Start listening.
		  annyang.start({continuous: true });
		}
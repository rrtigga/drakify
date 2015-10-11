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

			            var title = data.response.hits[0].result.title; 
			            var name = data.response.hits[0].result.primary_artist.name; 

			            $.ajax({
						    url: "https://api.genius.com/songs/" + data.response.hits[0].result.id,
						    type: "GET",
						    headers: {"Authorization": "Bearer WJCDe9kbzfhPQnwzBXQcMw8JExlRMefEWN19V0elsOMNhriiJodaO9Ld6hQ2TZn9"},
		  					success: function (data) {
		  						console.log("success");
		  						$.get(
									"https://www.googleapis.com/youtube/v3/search", {
										part: 'snippet', 
										maxResults: 10,
										order: 'relevance', 
										//q is the search query
										q: title + " " + name  , 
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
										});
									}
								);
							}
						});
					}
				});
			},
		    'stop': function() { pause(); }, 
		    'go': function() { resume(); },
		    'Drake if i': function() {  }
		  };
		    	

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



/**
*these functions will return the best match URL of a string lyric match
* only call return_url_best_song(user_input)
**/

function findIndexOfGreatest(array) {
  var greatest;
  var indexOfGreatest;
  for (var i = 0; i < array.length; i++) {
    if (!greatest || array[i] > greatest) {
      greatest = array[i];
      indexOfGreatest = i;
    }
  }
  return indexOfGreatest;
}
function split_check(user_input, song_text){
	var truths = 0;
	var sp1 = user_input.split(" ");
	var s1 = add_words(sp1.slice(0, (sp1.length / 2)));
	var s2 = add_words(sp1.slice(sp1.length / 2));
	var sp2 = s1.split(" ");
	var sp3 = s2.split(" ");
	var s3 = add_words(sp2.slice(0, (sp2.length / 2)));
	var s4 = add_words(sp2.slice(sp2.length / 2));
	var s5 = add_words(sp3.slice(0, (sp3.length / 2)));
	var s6 = add_words(sp3.slice(sp3.length / 2));
	if(song_text.search(s1) >= 0) truths += 1
	if(song_text.search(s2) >= 0) truths += 1
	if(song_text.search(s2) >= 0) truths += 1
	if(song_text.search(s3) >= 0) truths += 1
	if(song_text.search(s4) >= 0) truths += 1
	if(song_text.search(s6) >= 0) truths += 1
	return truths
	}
	function add_words(arr_of_words){
	s = ""
	for(var i=0; i < arr_of_words.length; i++)
		s += arr_of_words[i] + " ";
	return s.trim();
}


/* call this method to get the url of a youtube video, user URL to redirect to new video*/
function return_url_best_song(user_input){
	var song_file_names = ['hold_on_we_are_going_home.txt', 'lord_knows.txt'];
	var song_score = [];
	for(var i = 0; i < song_file_names.length; i ++){
		song_score.push(split_check(user_input,get_song_text(song_file_names[i])));
	}
	best_song_match = findIndexOfGreatest(song_score);
	selected_text = get_song_text(song_file_names[best_song_match]);
	url_index = selected_text.search("url:") + 4;
	url_string = selected_text.slice(url_index);
	return url_string;
}

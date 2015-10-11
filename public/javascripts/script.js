		if (annyang) {
		  // Let's define a command.
		  var commands = {

		    'search *something': function(something) {
		    	$.ajax({
				    url: "https://api.genius.com/search?q=" + something,
				    type: "GET",
				    headers: {"Authorization": "Bearer WJCDe9kbzfhPQnwzBXQcMw8JExlRMefEWN19V0elsOMNhriiJodaO9Ld6hQ2TZn9"},
  					success: function (data) {
									console.log('reached');
									var flag = true;
  								var pote_url = return_url_best_song(something);
									if ((pote_url.search('t')+pote_url.search('s') == 5) && something.split(" ").length > 4){
										document.getElementById("artist").innerHTML = data.response.hits[0].result.title;
										document.getElementById("title").innerHTML ="By " + data.response.hits[0].result.primary_artist.name;
										console.log(pote_url);
										var videoToPlay = pote_url + "&autoplay=1";
										var videoToPlay = videoToPlay.replace("watch?v=", "v/");
										document.getElementById("VID").src = videoToPlay;
										flag = false;
									}
									else if(flag){
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
													if(flag){
																var videoToPlay = "https://www.youtube.com/watch?v=" + item.id.videoId + "&autoplay=1";
																var videoToPlay = videoToPlay.replace("watch?v=", "v/");
															}


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

					}/* func end statment */
				});
			},
		    'stop': function() { pause(); },
		    'go': function() { resume(); },
		    'Drake': function() {  }
		  };


		  // Add our commands to annyang
		  annyang.addCommands(commands);

		  annyang.addCallback('error', function () {
			console.log("There's an error!");
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
function split_check(user_input,song_text){
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
	if(song_text.search(s1) >= 0) truths += 1;
	if(song_text.search(s2) >= 0) truths += 1;
	if(song_text.search(s3) >= 0) truths += 1;
	if(song_text.search(s4) >= 0) truths += 1;
	if(song_text.search(s5) >= 0) truths += 1;
	if(song_text.search(s6) >= 0) truths += 1;

	// if (Math.abs(song_text.search(s3)-song_text.search(s4)>10) || Math.abs(song_text.search(s5)-song_text.search(s6)>10)){
	// 	return "";
	// }
	// else{
	// 	return truths;
	// }

	return truths;
	}
	function add_words(arr_of_words){
	s = "";
	for(var i=0; i < arr_of_words.length; i++)
		s += arr_of_words[i] + " ";
	return s.trim();
}


/* call this method to get the url of a youtube video, user URL to redirect to new video*/
function return_url_best_song(user_input){

	var song_file_names = ['hold_on_we_are_going_home', 'lord_knows','started_from_the_bottom','trophies','energy','take_care','forever','over','make_me_proud','hotline_bling'];
	var song_score = [];
	for(var i = 0; i < song_file_names.length; i ++){
		song_score.push(split_check(user_input,song_dictionary[song_file_names[i]]));
	}
	var best_song_match = findIndexOfGreatest(song_score);

	if (song_score[best_song_match] < 5 ){
		return "";
	}
	var selected_text = song_dictionary[song_file_names[best_song_match]];
	var url_index = selected_text.search("url:") + 4;
    var url_string = selected_text.slice(url_index);
	return url_string;
}
var song_dictionary = [];
song_dictionary['hold_on_we_are_going_home'] = "hold on we are going home i got my eyes on you you're everything that i see i want your high love and emotion endlessly i can't get over you you left your mark on me i want your high love and emotion endlessly cause you're a good girl and you know it you act so different around me cause you're a good girl and you know it i know exactly who you could be just hold on we're going home just hold on we're going home it's hard to do these things alone just hold on we're going home i got my eyes on you you're everything that i see i want your high love and emotion endlessly i can't get over you you left your mark on me i want your high love and emotion endlessly cause you're a good girl and you know it you act so different around me cause you're a good girl and you know it i know exactly who you could be so just hold on we're going home just hold on we're going home it's hard to do these things alone  just hold on we're going home  you're the girl you're the one gave you everything i love i think there's something, baby i think there's something, baby you're the girl you're the one gave you everything i love i think there's something, baby i think there's something, baby cause you're a good girl and you know it you act so different around me cause you're a good girl and you know it i know exactly who you could be oh just hold on we're going home just hold on we're going home  it's hard to do these things alone  just hold on we're going home hold on url:https://www.youtube.com/watch?v=-NW9M0dYSgc";
song_dictionary['lord_knows'] = "all we wanted was opportunity just blaze lord knows!  it's your worst nightmare it's my first night here and this girl right here who knows what she knows? so i'm going through her phone if she go to the bathroom and her purse right there i don't trust these hoes at all but that's just the result of me paying attention to all these women that think like men with the same intentions talking strippers and models that try to gain attention even a couple porn stars that i'm ashamed to mention but weezy and stunna are my only role models heffer and jordan my only role models that's why i walk around with all this gold on and every time i run into these niggas they want no problems bottom sixes and chains and some bracelets and rings all of the little accents that make me a king i never hear the disses they try and point out to me but it's whatever if somebody wan' make it a thing i'm more concerned what niggas thinkin' about christmas in august do anything to buy gifts for they daughters get some shake a brick in the press and chef it like mrs fields they're making the cookie stretch i know it so well i know the hustle so well stunt like i'm workin' overnighters right by the motel drug money outfit record clean spend it all on me and my fuckin' team matchin' rollies for real matchin' rovers for real places they say they've been we've actually going for real i'm really killin' shit fuck all the jiggy rappin' i'm going trigga happy just to see my niggas happy mixtape legend underground kings lookin' for the right way to do the wrong things with my new bitch that's living in palm springs young ass nigga lifelong dreams they take the greats from the past and compare us i wonder if they'd ever survive in this era in a time where it's recreation to pull all your skeletons out the closet like halloween decorations i know of all the things that i hear they be pokin' fun at never the flow though they know i run that fuck you all i claim that whenever i change rap forever the game back together yup ym i remain that forever in the same place my brother wayne at forever i'm a descendent of either marley or hendrix i haven't figured it out cause my story is far from finished i'm hearing all of the jokes i know that they tryna push me i know that showin' emotion don't ever mean i'm a pussy know that i don't make music for niggas who don't get pussy so those are the ones i count on to diss me or overlook me lord knows lord knows i'm heavy i got my weight up roberson boost the rate up it's time that somebody paid up a lot of niggas came up off of a style that i made up but if all i hear is me then who should i be afraid of? bought a white ghost now shit is gettin' spooky very very scary like shit you see in the movies in this bitch all drinks on the house like snoopy that's why all the real soldiers salute me trill nigga for real  you know i love this yolo you only live once i'm going so hard my nigga i swear homie everyday is another opportunity to reach that goal  i fell in love with the pen started fucking in ink the hustle's an art i paint it what i would think still allergic to broke prescription straight to the paper destined for greatness but got a place in jamaica villa on the water with the wonderful views only fat nigga in the sauna with jews went and got a yacht i'm talkin' carnival cruise and these niggas talkin' like hoes they mad they not in my shoes it's the red bottom boss came to buy the bar every by week shit i'm bound to buy a car murder-cedes benz of that bubble double r headlights flickin' lookin' like a fallin' star everyday them hammers bang whippin' ye' like anime i run the game but the ladies think i'm running game mink coats making women wanna fornicate rosay and drake i'm gettin' cake nothin' short of great huh!  gettin' cake, nothin' short of great huh url:https://www.youtube.com/watch?v=FyBU0JZ3RbY";
song_dictionary['started_from_the_bottom'] = "started from the bottom now we're here started from the bottom now my whole team fucking here started from the bottom now we're here started from the bottom now the whole team here nigga started from the bottom now we're here started from the bottom now my whole team here nigga started from the bottom now we're here started from the bottom now the whole team fucking here i done kept it real from the jump living at my mama's house we'd argue every month nigga i was trying to get it on my own working all night traffic on the way home and my uncle calling me like where ya at? i gave you the keys told ya bring it right back nigga i just think its funny how it goes now i'm on the road half a million for a show and we started from the bottom now we're here started from the bottom now my whole team fucking here started from the bottom now we're here started from the bottom now the whole team here nigga started from the bottom now we're here started from the bottom now my whole team fucking here started from the bottom now we're here started from the bottom now my whole team here nigga boys tell stories about the man say i never struggled wasn't hungry yeah i doubt it nigga i could turn your boy into the man there ain't really much i hear that's poppin' off without us nigga we just want the credit where it's due i'ma worry about me give a fuck about you nigga just as a reminder to myself i wear every single chain even when i'm in the house cause we started from the bottom now we're here started from the bottom now my whole team fucking here started from the bottom now we're here started from the bottom now the whole team here nigga no new niggas nigga we don't feel that fuck a fake friend where your real friends at? we don't like to do too much explainin' story stay the same i never changed it no new niggas nigga we don't feel that fuck a fake friend where your real friends at? we don't like to do too much explainin' story stay the same through the money and the fame cause we started from the bottom now we're here started from the bottom now my whole team fucking here started from the bottom now we're here started from the bottom now the whole team here nigga started from the bottom now we're here started from the bottom now my whole team here nigga started from the bottom now we're here started from the bottom now my whole team here nigga url:https://www.youtube.com/watch?v=eEpDiHNoSkw";
song_dictionary['trophies'] = "yeah had hit records on my demo did y'all boys not get the memo i do not stay at the intercontinental and anything i got is not a rental i own that mothafucka figured out this shit it's simple my stock been going up like a crescendo a bunch of handshakes from the fakes but nigga i do not want to be friends though i told y'all mofuckers man this sh-t is not a love song this is a fuck a stripper on a mink rug song this a fuck them boys forever hold a grudge song pop some fucking champagne in the tub song nigga just because song what's the move? can i tell truth? if i was doing this for you then i have nothing left to prove nah this for me though i'm just tryna stay alive and take care of my people and they don't have no award for that trophies trophies and they don't have no award for that shit don't come with trophies ain't no envelopes to open i just do it 'cause i'm 'sposed to nigga bitch i go to dreams with a suitcase i got my whole country on a new wave she like i heard all your niggas stay where you stay house so big i haven't seen them boys in two days bitch i use a walkie talkie just to get a beverage i saw my parents split up right after the wedding that taught my ass to stay committed fuck the credit bitch check the numbers i'm the one who really get it i told y'all mo'fuckas man this shit is not a love song this a doing me and only god can judge song i do not know what the fuck you thought it was song pop some fucking champagne in the tub song nigga just because song what's the move? can i tell truth? if i was doing this for you then i have nothing left to prove nah this for me though i'm just tryna stay alive and take care of my people and they don't have no award for that trophies trophies and they don't have no award for that shit don't come with trophies ain't no envelopes to open i just do it 'cause i'm 'sposed to nigga url:https://www.youtube.com/watch?v=s1DcqRJqxUk";
song_dictionary['energy'] = "got a lot of enemies energy lickwood means rewind a gunshot means forward you requested it so we rewind  yeah way way way up turn it all up yeah look  i got enemies got a lotta enemies got a lotta people tryna drain me of my energy they tryna take the wave from a nigga fuckin' with the kid and pray for your nigga  i got girls in real life tryna fuck up my day fuck goin' online that ain't part of my day i got real shit poppin' with my family too i got niggas that can never leave canada too i got 2 mortgages thirty million in total i got niggas that'll still try fuckin' me over i got rap niggas that i gotta act like i like but my actin' days are over fuck them niggas for life yea  i got enemies got a lotta enemies got a lotta people tryna drain me of this energy they tryna take the wave from a nigga fuckin' with the kid and pray for your nigga  i got people talkin' down man like i give a fuck i bought this one a purse i bought this one a truck i bought this one a house i bought this one a mall i keep buyin' shit just make sure you keep track of it all i got bitches askin' me about the code for the wi-fi so they can talk about they timeline and show me pictures of they friends just to tell me they ain't really friends ex-girl she the female version of me i got strippers in my life but they virgins to me i hear everybody talkin' bout what they gonna be i got high hopes for you niggas we gon' see i got money in the courts so all my niggas are free bout to call your ass a uber i got somewhere to be i hear fairy tales 'bout how they gon' run up on me well run up when you see me then and we gon' see  i got enemies got a lotta enemies got a lotta people tryna drain me of this energy tryna take the wave from a nigga fuckin' with the kid and pray for your nigga  yeah yeah  naw fuck all of you niggas i ain't finished y'all don't wanna hear me say it's a goal y'all don't wanna see wayne win fifty awards i got real ones livin' past kennedy road i got real ones with me everywhere that i go i'm tryna tell ya i got enemies got a lotta enemies every time i see 'em somethin' wrong with they memory tryna take the wave from a nigga so tired of savin' all these niggas mayne!  yeah run up  i got enemies got a lotta enemies got a lotta people tryna drain me of this energy tryna take the wave from a nigga fuckin' with the kid and pray for your nigga  i'm off this man url:https://www.youtube.com/watch?v=7LnBvuzjpr4";
song_dictionary['take_care']= "i know you've been hurt by someone else i can tell by the way you carry yourself if you let me here's what i'll do i'll take care of you i've loved and i've lost  i've asked about you and they've told me things but my mind didn't change i still the feel the same what's a life with no fun please don't be so ashamed i've had mine you've had yours we both know we know they don't get you like i will my only wish is i die real cause that truth hurts and those lies heal and you can't sleep thinking that he lies still so you cry still tears all in the pillow case big girls all get a little taste pushing me away so i give her space dealing with a heart that i didn't break i'll be there for you i will care for you i keep thanking you just don't know trying to run from that say you're done with that on your face girl it just don't show when you're ready just say you're ready when all the baggage just ain't as heavy and the parties over just don't forget me we'll change the pace and we'll just go slow you won't ever have to worry you won't ever have to hide and you seen all my mistakes so look me in my eyes  cause if you let me here's what i'll do i'll take care of you i've loved and i've lost  it's my birthday i get high if i want to can't deny that i want you but i lie if have to cause you don't say you love me to your friends when they ask you even though we both know that you do (you do) one time been in love one time you and all your girls in the club one time all so convinced that you're following your heart cause your mind don't control what it does sometimes we all have our nights though don't be so ashamed i've had mine you've had yours we both know we know you hate being alone you ain't the only one you hate the fact that you bought the dream and they sold you one you love your friends but somebody shoulda told you something to save you instead they say  i know you've been hurt by someone else i can tell by the way you carry yourself if you let me here's what i'll do i'll take care of you i've loved and i've lost  and loved and I've lost url:https://www.youtube.com/watch?v=-zzP29emgpg";
song_dictionary['forever'] = " it may not mean nothing to y'all but understand nothing was done for me so i don't plan on stopping at all i want this shit forever mayne ever mayne ever mayne i'm shutting shit down at the mall and telling every girl she the one for me and i ain't even planning to call i want this shit forever mayne ever mayne ever mayne  last name ever first name greatest like a sprained ankle boy ain't nothing to play with it started off local but thanks to all the haters i know g4 pilots on a first name basis in your city faded off the brown nino she insists she got more class we know! swimming in the money come and find me nemo if i was at the club you know i balled chemo dropped the mixtape that shit sounded like an album who'd have thought a country wide tour would be the outcome labels want my name beside the x like malcolm everybody got a deal i did it without one yeah nigga i'm about my business killing all these rappers you would swear i had a hit list everyone who doubted me is asking for forgiveness if you ain't been a part of it at least you got to witness bitches    forever ever mr west is in da building ain't no question who about to kill 'em i used to have hood dreams big fame big chains i stuck my dick inside this life until that bitch came i went hard all fall like the ball teams just so i can make it rain all spring y'all seen my story my glory i had raped the game young you can call it statutory when a nigga blow up they can build statures of me old money benjamin button what nothin' now superbad chicks giving me mclovin you would think i ran the world like michelle's husband you would think these niggas would know me when they really doesn't like they was down with the old me no you fucking wasn't you're such a fucking loser he didn't even go to class bueller trade the grammy plaques just to have my granny back remember she had that bad hip like a fanny pack chasing that stardom would turn you into a maniac all the way in hollywood and i can't even act they pull their cameras out and god damn they snap i used to want this thing forever y'all can have it back   ok hello it's the martian space jam jordan's i want this shit forever wake up and smell the garden fresher than the harvest step up to the target if i had one guess than i guess i'm just new orleans and i will never stop like i'm running from the cops hopped up in my car and told my chauffeur to the top life is such a fucking roller coaster then it drops but what should i scream for this is my theme park my minds shine even when my thoughts seem dark pistol on my side you don't wanna hear that thing talk let the king talk check the price and pay attention lil wayne that's what they got to say or mention i'm like nevada in the middle of the summer i'm resting in the lead i need a pillow and a cover shh my foot's sleeping on the gas no brake pads no such thing as last    there they go packing stadiums as shady spits his flow nuts they go macadamian they go so ballistic wow we can make them look like bozos he's wondering if he should spit this slow fuck no go for broke his cup just runneth over oh no he ain't had a buzz like this since the last time he overdosed they've been waiting patiently for pinocchio to poke his nose back into the game and they know rap will never be the same as before bashing in the brains of these hoes and establishing a name as he goes the passion and the flame is ignited you can't put it out once we light it this shit is exactly what the fuck i'm talking about when we riot you dealin' with a few true villains whose staying inside of the booth truth spillin' and spit true feelings til our tooth fillings come flying up out of our mouths now rewind it payback motherfucker for the way you got at me so hows it taste? when i slap the taste out your mouth with the bass so loud that it shakes the place i'm hannibal lecter so just in case you're thinking of saving face you ain't gonna have no face to save by the time i'm through with this place so drake ing face You ain't gonna have no face to save By the time I'm through with this place, so Drake. url:https://www.youtube.com/watch?v=A66LmUwXnGA";
song_dictionary['over']="i know way too many people here right now that i didn't know last year who the fuck are y'all? i swear it feels like the last few nights we been everywhere and back but i just can't remember it all  what am i doin'? what am i doin'? oh yeah that's right i'm doin' me i'm doin' me i'm livin' life right now mayne  and this what i'm a do 'til it's over 'til it's over but it's far from over  bottles on me long as someone drink it never drop the ball fuck are y'all thinkin'? makin' sure the young money ship is never sinkin' 'bout to set it off in this bitch jada pinkett i shouldn't've drove tell me how i'm gettin' home you too fine to be layin' down in bed alone i could teach you how to speak my language rosetta stone i swear this life is like the sweetest thing i've ever known 'bout to go thriller mike jackson on these niggas all i need's a fucking red jacket with some zippers super good smiddoke a package of the swishers i did it overnight it couldn't happen any quicker y'all know them? well fuck it me either but point the biggest skeptic out i'll make him a believer it wouldn't be the first time i done it throwin' hundreds when i should be throwin' ones bitch i run it (ah)  i know way too many people here right now that i didn't know last year who the fuck are y'all? i swear it feels like the last few nights we been everywhere and back but i just can't remember it all  what am i doin'? what am i doin'? oh yeah that's right i'm doin' me i'm doin' me i'm livin' life right now mayne  and this what i'm a do 'til it's over 'til it's over but it's far from over  one thing 'bout music when it hits you feel no pain and i swear i got that shit that make these bitches go insane so they tell me that they love me i know better than that it's just game it's just what comes with the fame and i'm ready for that i'm just sayin' but i really can't complain everything is kosher two thumbs up ebert and roeper i really can't see the end getting any closer but i probly still be the man when everything is over so i'm riding through the city with my high beams on can you see me? can you see me? get your visine on y'all just do not fit the picture turn your widescreen on if you thinkin' i'm a quit before i die dream on man they treat me like a legend am i really this cold? i'm really too young to be feelin' this old it's about time you admit it who you kiddin' man? man nobody's never done it like i did it (ugh)  i know way too many people here right now that i didn't know last year who the fuck are y'all? i swear it feels like the last few nights we been everywhere and back but i just can't remember it all  what am i doin'? what am i doin'? oh yeah that's right i'm doin' me i'm doin me i'm livin' life right now mayne  and this what i'm a do 'til it's over 'til it's over but it's far from over yeah that's right i'm doin' me i'm doin me i'm livin' life right now mayne  and this what i'm a do 'til it's over 'til it's over but it's far from over 's over 'Til it's over But it's far from over url:https://www.youtube.com/watch?v=2lTB1pIg1y0";
song_dictionary['make_me_proud']="i like a woman with a future and a past a little attitude problem all good it'll make the shit last don't make it too easy girl don't take it too fast yeah that's it right there that's it do it just like that only you can do it just like that and i love it when your hair still wet 'cause you just took a shower runnin' on a treadmill and only eating salad sound so smart like you graduated college like you went to yale but you probably went to howard knowin' you weekend in miami trying to study by the pool couple things due but you always get it done might have been a time when i loved her too but you take that away and you'll always be the one one i wonder why the moon look nice girl maybe it's just right for the night you said niggas coming on too strong girl they want you in their life as a wife that's why you want to have no sex why you want to protest why you want to fight for your right 'cause you don't love them boys pussy run everything fuck that noise   i know things get hard but girl you got it girl you got it there you go can't you tell by how they looking at you everywhere you go? wondering what's on your mind it must be hard to be that fine when all these muthafuckas wanna waste your time it's just amazing girl and all i can say is i'm so i'm so i'm so i'm so i'm so proud of you i'm so i'm so i'm so i'm so i'm so proud of you i'm so i'm so i'm so i'm so i'm so proud of you everything's adding up you've been through hell and back that's why you're bad as fuck and you  bet i am all of them bitches i'm badder than mansions in malibu babylon but i never mention everything i dabble in and i always ride slow when i'm straddlin' and my shit's so wet you gotta paddle in gotta r-r-row gotta row ya boat it's pink friday records and ovo done did the pop tour i'm the realest still the best legal team so the deals is ill it's mac opi and a fragrance too apparel i'm dominating every avenue cobblestone good view little gravel too gotta pay for the entourage travel too 'cause i'm fl-fl-fly i'm flying high ain't got time to talk just hi and bye bitch  but baby if you ask me to take a break i'll give it all away don't care what the people say i'll be a million billion trillion miles away  he asked my sign i said a sag' i'm a star sheriff badge what's the point if i'm guarding? double d up hoes dolly parton    i'm so i'm so i'm so i'm so i'm so proud of you i'm so i'm so i'm so i'm so i'm so proud of you i'm so i'm so i'm so i'm so i'm so proud of you everything's adding up you've been through hell and back that's why you're bad as fuck and you know you are you're bad as fuck and you know you are url:https://www.youtube.com/watch?v=AP6ps5CxgVk";
song_dictionary['hotline_bling']="you used to call me on my you used to you used to you used to call me on my cell phone late night when you need my love call me on my cell phone late night when you need my love i know when that hotline bling that can only mean one thing i know when that hotline bling that can only mean one thing  ever since i left the city you got a reputation for yourself now everybody knows and i feel left out girl you got me down you got me stressed out cause ever since i left the city you started wearing less and goin' out more glasses of champagne out on the dance floor hangin' with some girls i've never seen before  you used to call me on my cell phone late night when you need my love call me on my cell phone late night when you need my love i know when that hotline bling that can only mean one thing i know when that hotline bling that can only mean one thing  ever since i left the city you you you you and me we just don't get along you make me feel like i did you wrong going places where you don't belong ever since i left the city you you got exactly what you asked for running out of pages in your passport hanging with some girls i've never seen before  you used to call me on my cell phone late night when you need my love call me on my cell phone late night when you need my love i know when that hotline bling that can only mean one thing i know when that hotline bling that can only mean one thing  these days all i do is wonder if you bendin' over backwards for someone else wonder if your rollin' backwoods for someone else doing things i taught you gettin' nasty for someone else you don't need no one else you don't need nobody else no why you never alone why you always touching road used to always stay at home be a good girl you was in the zone you should just be yourself right now you're someone else  you used to call me on my cell phone late night when you need my love call me on my cell phone late night when you need my love i know when that hotline bling that can only mean one thing i know when that hotline bling that can only mean one thing  ever since i left the cityeft the city url:https://www.youtube.com/watch?v=UpuqS-f2lZU";

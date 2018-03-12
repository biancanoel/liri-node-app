require("dotenv").config();
var request = require('request');
var keys = require('./keys.js')
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];



//TWITTER
if (command==="my-tweets") {
    var params = {screen_name: 'bnoeltorres'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        
        for (i=0; i<tweets.length; i++) {
            console.log(' "'+tweets[i].text+'"' + " was tweeted on " +moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm:ss a'));
        }
      }
    });
}

//SPOTIFY 
if (command=== "spotify-this-song") {
  var track="";
  var argv = process.argv;

  if (argv.length>3) {
    for (i=3; i<argv.length; i++) {
      track =track+ " " +argv[i];
    }
  }  else {
    track = "The Sign";
  };
  spotifySong();
}

function spotifySong() {
  spotify.search({ type: 'track', query: track, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  console.log("artist name "+data.tracks.items[0].album.artists[0].name);
  console.log("album name "+ data.tracks.items[0].album.name);
  console.log("track name: "+data.tracks.items[0].name)
  console.log("preiview song: "+data.tracks.items[0].preview_url)
  //console.log(JSON.stringify(data, null, 2)); 
  });
  
}


//OMDB
 if(command === "movie-this") {
  //Get movie name 
  var movieName = ""; 
   var argv = process.argv; 
   if (argv.length > 3) {
     for (i=3; i<argv.length; i++) {
       movieName = movieName +" "+argv[i];
     }
     
   } else {
     movieName= "Mr. Nobody";
   }
  
   
  console.log(movieName);
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body){
    if(!error && response.statusCode===200) {
      //console.log(body)
      console.log(JSON.parse(body).Title);
      console.log("Released in"+JSON.parse(body).Year);
      console.log("Languages: "+JSON.parse(body).Language);
      console.log("Made in country: "+JSON.parse(body).Country);
      console.log("Actors: "+JSON.parse(body).Actors);
      console.log(JSON.parse(body).Ratings[1].Source +" " + JSON.parse(body).Ratings[1].Value);
      console.log("Plot: "+JSON.parse(body).Plot);
    }
  })
 }  

 //DO WHAT IT SAYS
 if ( command==="do-what-it-says") {
   //read text from random.txt file 
   fs.readFile("random.txt", "utf8", function(err, data) {
     if (err) {
       return console.log("Error: "+err);
     }
     //console.log(data)
     var newArray = data.split(",");
     //console.log(newArray);
     command = newArray[0];
     track = newArray[1];
     console.log(command+ " , " + track)
     spotifySong();

   })
 }



  






    


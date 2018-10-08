require("dotenv").config();
var keys = require("./keys.js");

var request = require("request");

var moment = require('moment');
moment().format();

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

// Pull band data
function concertThis() {

  var artistNameArr = [];
  for (var i = 3; i < process.argv.length; i++) {
    artistNameArr.push(process.argv[i]);
  }
  var artistName = artistNameArr.join("+");

  var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
  console.log(queryUrl);

  request(queryUrl, (error, response, body) => {
    if(!error && response.statusCode === 200) {
      var artistData = JSON.parse(body);
      for (var i = 0; i < artistData.length; i++) {
        var venueNameStr = "Venue: " + artistData[i].venue.name + "\n";
        var locationStr = "Location: " + artistData[i].venue.city + ", " + artistData[i].venue.country + "\n";
        // if a region is declared, update the location to include it
        if (artistData[i].venue.region) {
          locationStr = "Location: " + artistData[i].venue.city + ", " + artistData[i].venue.region + ", " + artistData[i].venue.country + "\n";
        }
        // convert date substring to MM/DD/YYYY format using "L" format
        var date = moment(artistData[i].datetime.substring(0, 10)).format("L");
        var dateStr = "Date: " + date + "\n";
        var separatorStr = "====================================";

        console.log(venueNameStr, locationStr, dateStr, separatorStr)
      }
    }
  });
}

// Pull Spotify data
function spotifyThis() {

}

// Pull movie data
function movieThis() {

  var movieNameArr = [];
  for (var i = 3; i < process.argv.length; i++) {
    movieNameArr.push(process.argv[i]);
  }
  var movieName = movieNameArr.join("+");

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  console.log(queryUrl);

  request(queryUrl, (error, response, body) => {
    if(!error && response.statusCode === 200) {
      var movieData = JSON.parse(body);
      console.log(
        "Title: " + movieData.Title + "\n" +
        "Release Year: " + movieData.Year + "\n" +
        "IMDB: " + movieData.Ratings[0].Value + "\n" +
        "Rotten Tomatoes: " + movieData.Ratings[1].Value + "\n" +
        "Country: " + movieData.Country + "\n" +
        "Language: " + movieData.Language + "\n" +
        "Plot: " + movieData.Plot + "\n" +
        "Actors: " + movieData.Actors + "\n"
      );
    }
  });
  
}

// ???
function doWhatItSays() {

}

switch (command) {
  case 'concert-this':
    concertThis();
    break;
  case 'spotify-this-song':
    spotifyThis();
    break;
  case 'movie-this':
    movieThis();
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;
  default:
    console.log("Not a valid query");
}
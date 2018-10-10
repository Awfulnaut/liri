require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
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
        var separatorStr = "--------------------------";

        console.log(venueNameStr, locationStr, dateStr, separatorStr)
      }
    }
  });
}

// Pull Spotify data
function spotifyThis() {

  var trackNameArr = [];
  for (var i = 3; i < process.argv.length; i++) {
    trackNameArr.push(process.argv[i]);
  }
  var trackName = trackNameArr.join("+");

  spotify.search({ type: 'track', query: trackName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var trackData = data.tracks.items;

    function findArtists(trackNum) {
      var albumArtists = [];
      for (var j = 0; i < trackData[i].album.artists.length; i++) {
        albumArtists.push(trackData[trackNum].album.artists[j].name);
      }
      return albumArtists;
    }

    // For each track item
    for (var i = 0; i < trackData.length; i++) {
      var artists = [];

      // Loop through the artists in each album
      // HALP! THIS NEEDS RECURSION
      for (var j = 0; i < trackData[i].album.artists.length; i++) {
        artists.push(trackData[i].album.artists[j].name);
      }
      // artists.push(findArtists(i));
      
      var songName = trackData[i].name;
      var previewURL = trackData[i].preview_url;
      var albumName = trackData[i].album.name;

      // Log out each entry
      console.log(
        i +
        "\nArtist(s): " + artists +
        "\nThe first artist is: " + trackData[i].album.artists[0].name +
        "\nSong name: " + songName +
        "\nPreview song: " + previewURL +
        "\nAlbum: " + albumName +
        "\n---------------------------"
      );
    }
  });
}

// Pull movie data
function movieThis() {

  // Default movie will be Mr. Nobody
  var movieNameArr = ["Mr.", "Nobody"];
  for (var i = 3; i < process.argv.length; i++) {
    // When arguments are provided, clear out the default values in the array
    movieNameArr = [];
    movieNameArr.push(process.argv[i]);
  }
  var movieName = movieNameArr.join("+");

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

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
  var randomCommandArr = [];
  randomCommandArr.push(fs.readFile("random.txt"));
}

switch (command) {
  case 'concert':
    concertThis();
    break;
  case 'spotify':
    spotifyThis();
    break;
  case 'movie':
    movieThis();
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;
  default:
    console.log("Not a valid query");
}
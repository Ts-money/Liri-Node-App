require("dotenv").config();

const keys = require("./keys.js");

const fs = require("fs");

const Spotify = require("node-spotify-api");

const axios = require("axios");

const moment = require("moment");

const spotify = new Spotify(keys.spotify);

let command = process.argv[2];

let log = '';

if (command == "do-what-it-says") {
    console.log("Test");
    fs.readFile('random.txt', 'utf8', function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data

        // Then split it by commas (to make it more readable)
        const dataArr = data.split(',').map((dataa) => dataa.trim());
        // We will then re-display the content as an array for later use.
        command = dataArr[0];
        process.argv[3] = dataArr[1];
        concert();
        searchSpotify();
        movie();
    });
} else {
    concert();
    searchSpotify();
    movie();
}

function saveLog() {
    fs.appendFile('log.txt', log, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function concert() {
    if (command == "concert-this") {
        var searchParam = process.argv.splice(3);
        var artist = searchParam.join(" ");

        axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`).then(resp => {
            console.log(`Printing Venue Information for ${artist}`);
            console.log(`Venue Name: ${resp.data[0].venue.name}`);
            console.log(`Venue Location: ${resp.data[0].venue.city}, ${resp.data[0].venue.country}`);
            var date = moment(resp.data[0].datetime).format('MM/DD/YYYY');
            console.log(`Venue Date: ${date}`);
            log = `Concert: ${artist}\r\nVenue Name: ${resp.data[0].venue.name}\r\nVenue Location: ${resp.data[0].venue.city}, ${resp.data[0].venue.country}\r\nVenue Date: ${date}\r\n`;
            saveLog();
        });
    }

}

function searchSpotify() {
    if (command == "spotify-this-song") {
        var song = "The Sign Ace of Base";

        if (process.argv.length > 3) {
            var searchParam = process.argv.splice(3);
            song = searchParam.join(" ");
        }

        spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log(`Printing Song Information for ${song}`);
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Song: ${data.tracks.items[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview URL: ${data.tracks.items[0].external_urls.spotify}`);
            log = `Song: ${song}\r\nArtist: ${data.tracks.items[0].artists[0].name}\r\nSong: ${data.tracks.items[0].name}\r\nAlbum: ${data.tracks.items[0].album.name}\r\nPreview URL: ${data.tracks.items[0].external_urls.spotify}\r\n`;
            saveLog();
        });
    }
}

function movie() {
    if (command == "movie-this") {
        var movie = "Mr. Nobody";

        if (process.argv.length > 3) {
            var searchParam = process.argv.splice(3);
            movie = searchParam.join(" ");
        }

        axios.get(`http://www.omdbapi.com/?t=${movie}&apikey=trilogy`).then(resp => {
            console.log(`Printing Song Information for ${movie}`);
            console.log(`Title: ${resp.data.Title}`);
            console.log(`Year: ${resp.data.Year}`);
            console.log(`IMDB Rating: ${resp.data.Ratings[0].Value}`);
            console.log(`Rotten Tomatoes: ${resp.data.Ratings[1].Value}`);
            console.log(`Country of Production: ${resp.data.Country}`);
            console.log(`Language: ${resp.data.Language}`);
            console.log(`Plot: ${resp.data.Plot}`);
            console.log(`Actors: ${resp.data.Actors}`);
            log = `Movie: ${movie}\r\nTitle: ${resp.data.Title}\r\nYear: ${resp.data.Year}\r\nIMDB Rating: ${resp.data.Ratings[0].Value}\r\nRotten Tomatoes: ${resp.data.Ratings[1].Value}\r\nCountry of Production: ${resp.data.Country}\r\nLanguage: ${resp.data.Language}\r\nPlot: ${resp.data.Plot}\r\nActors: ${resp.data.Actors}\r\n`;
            saveLog();
        });

    }
}
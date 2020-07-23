var jsonData;
const Ranking = require('./ranking.js');

function getPlaylist(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  //console.log(jsonData.album.images);
  playlist = $("#playlist-entry").val();
  console.log(playlist);
  jsonData = getSpotifyData(getSpotifyToken(), playlist);
  var ranking = new Ranking(jsonData);
  console.log(jsonData.tracks);
  var imageURL = jsonData.images[0].url;

  $("#image").append('<img class="rounded-circle" src="' + imageURL +'"/>');
  $("p").html("");
  
  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
  
}

//$(document).ready(function(){
//  jsonData = getSpotifyData(getSpotifyToken());
//})

function getWeather() {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&units=imperial&appid="+ apiKey;

  $.ajax(url,{success: function(data){
    $(".city").text(data.name);
    $(".temp").text(data.main.temp);
  }})
}

var accessToken;
function getSpotifyToken() {
  $.post({
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Authorization": "Basic " + window.btoa(spotifyClientID + ':' + spotifyClientSecret),
    },
    async: false,
    data: {
      grant_type: 'client_credentials'
    },
    success: function(data) {
        accessToken = data.access_token;
        
    }
  });   
  while (accessToken == "") {
    ;
  }
  return accessToken;
}
function getSpotifyData(accessToken, playlistURL) {
  playlistID = playlistURL.substring(playlistURL.indexOf("playlist/") + 9, playlistURL.indexOf('?'));
  baseURL = "https://api.spotify.com/v1/playlists";
  apiURL = baseURL + '/' + playlistID;
  $.ajax({
    url: apiURL,
    type: 'GET',
    async: false,
    headers: {
        'Authorization' : 'Bearer ' + accessToken
    },
    success: function(data) {
      jsonData = data;
    }
  });
  return jsonData;
}
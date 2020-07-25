class Ranking {
  iterationNumber = 0;
  songArray = [];
  currentPair = [];

  constructor(songArray) {
    this.songArray = songArray;
    this.songArray.sort(() => Math.random() - 0.5);
    this.currentPair = [songArray[0], songArray[1], 0, 1]
  }

  update(choice) {
    if (this.getStatus()) {
      return;
    }
    let leftInd = this.currentPair[2];
    let rightInd = this.currentPair[3];
    if (choice == 0) {
      this.swap(leftInd, rightInd);
      if (rightInd == this.songArray.length - this.iterationNumber - 1) {
        this.reset();
        return;
      } else {
        let newCurrentPair = [this.currentPair[0], this.songArray[rightInd + 1], leftInd, rightInd + 1];
        this.currentPair = newCurrentPair;
      }
    } else if (choice == 1) {
      if (rightInd == this.songArray.length- this.iterationNumber - 1) {
        this.reset();
        return;
      }
      let newCurrentPair = [this.currentPair[1], this.songArray[rightInd + 1], rightInd, rightInd + 1];
      this.currentPair = newCurrentPair;
    }
  }

  reset() {
    this.iterationNumber++;
    this.currentPair = [this.songArray[0], this.songArray[1], 0, 1];
  }

  swap(index1, index2) {
    var temp = this.songArray[index1];
    this.songArray[index1] = this.songArray[index2];
    this.songArray[index2] = temp;
  }

  getOptions() {
    return [this.currentPair[0], this.currentPair[1]];
  }

  /**
   * Returns 1 if the array has been sorting to prevent oversorting
   */
  getStatus() {
    if (this.iterationNumber == this.songArray.length - 1) {
      return 1;
    }
    else {
      return 0;
    }
  }



}



var jsonData;
var ranking;


function getPlaylist(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  //console.log(jsonData.album.images);
  playlist = $("#playlist-entry").val();
  jsonData = getSpotifyData(getSpotifyToken(), playlist);
  ranking = new Ranking(jsonData.tracks.items);
  var imageURL = jsonData.images[0].url;
  $("#image").append('<img class="rounded-circle" src="' + imageURL +'"/>');
  displayChoice();

  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
  
}

//$(document).ready(function(){
//  jsonData = getSpotifyData(getSpotifyToken());
//})



function displayChoice() {
  console.log(ranking.iterationNumber);
  $("p").html(ranking.getOptions()[0].track.name + ranking.getOptions()[1].track.name);
}

function displayRankings() {
  $("p").html("");
  for (let i = 0; i < ranking.songArray.length; i++) {
    console.log(ranking.songArray[i].track.name);
    $("p").append(ranking.songArray[i].track.name);
  }
}

function getWeather() {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&units=imperial&appid="+ apiKey;
  
  $.ajax(url,{success: function(data){
    $(".city").text(data.name);
    $(".temp").text(data.main.temp);
  }})
}

function choice(num) {
  ranking.update(num);
  if (ranking.getStatus() == 1) {
    displayRankings();
  } else {
    displayChoice();
  }
}

function getSpotifyToken() {
  let accessToken;
  console.log(spotifyClientID);
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

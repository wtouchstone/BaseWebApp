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
    console.log(this.currentPair);
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
      if (rightInd == this.songArray.length - this.iterationNumber - 1) {
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

$(document).ready(function(){
  showPlaylistEntry();
})

function getPlaylist(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  //console.log(jsonData.album.images);
  playlist = $("#playlist-field").val();
  jsonData = getSpotifyData(getSpotifyToken(), playlist);
  ranking = new Ranking(jsonData.tracks.items);
  var imageURL = jsonData.images[0].url;
  $("#image").append('<img class="rounded-circle" src="' + imageURL +'"/>');
  hidePlaylistEntry();
  displayChoice();

  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
  
}




function showPlaylistEntry() {
  $('#playlist-entry').html(
    '<p>Enter a spotify playlist below</p>' +
    '<input id="playlist-field" value="https://open.spotify.com/playlist/31j60hVcGTeo1goD97RBGy?si=7K0LFcszTseTVyhhI9wmSw"></input>' +
    '<button onClick="getPlaylist()" class="btn btn-dark">Click me</button>'
  );
}

//these aren't used, keeping for sleeping reference
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fadeLight(song) {
  for (let i = 34; i < 100; i++) {
    await sleep(5);
    let hexi = i.toString(16);
    $("#" + song).css("background-color", "#" + hexi + hexi + hexi);
    $(".song-display").css("background-color", "#" + hexi + hexi + hexi);  
  }
}

async function fadeDark(song) {
  let currentRGB = $("#" + song).css("background-color").split(",")[1];
  for (let i = currentRGB; i >= 34; i--) {
    await sleep(5);
    let hexi = i.toString(16);
    $("#" + song).css("background-color", "#" + hexi + hexi + hexi);
    $(".song-display").css("background-color", "#" + hexi + hexi + hexi);
  }
}
function createSongDisplay(imageURL, title, artist, side) {
  return (
      '<div onclick="choice(' + side + ')" class="song-display">' +
        '<img class="album-picture" width=300 src="' + imageURL + '"/> ' + 
        '<h3> ' + title + '</h3f>' + 
        '<h4>' + artist + '</h4>' +
      '</div>' 
  );
}

function hidePlaylistEntry() {
  $('#playlist-entry').html("");
}


function displayChoice() {
  console.log(ranking.iterationNumber);
  console.log(ranking.getOptions()[0]);
  console.log(ranking.getOptions()[1].track.artists[0]);
  $("#song1").html(createSongDisplay(
    ranking.getOptions()[0].track.album.images[0].url,
    ranking.getOptions()[0].track.name,
    ranking.getOptions()[0].track.artists[0].name,
    0
  ));
  $("#song2").html(createSongDisplay(
    ranking.getOptions()[1].track.album.images[0].url,
    ranking.getOptions()[1].track.name,
    ranking.getOptions()[1].track.artists[0].name,
    1
  ));
}

function displayRankings() {
  console.log(ranking.songArray);
  $("#main").html('<ul class="list-group">\n');

  for (let i = ranking.songArray.length - 1; i >= 0; i--) {
    console.log(ranking.songArray[i].track.name);
    $("#main").append(
      '<li class="list-group-item">\n' + 
        '<img width=100 src="' + ranking.songArray[i].track.album.images[0].url + '"/> ' +
        ranking.songArray[i].track.name +
        ' </li>\n'
    );
  }
  $("#main").append("</ul>");
}


function choice(num) {
  ranking.update(num);
  if (ranking.getStatus() == 1) {
    displayRankings();
    displayStartOver();
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

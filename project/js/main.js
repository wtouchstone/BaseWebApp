function showPicture(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  $("#image").append('<img class="rounded-circle" src="images/high-five.gif"/>');
  $("p").html("High five! You're building your first web app!");
  
  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
  
}

$(document).ready(function(){
  getSpotifyData();
})

function getWeather() {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&units=imperial&appid="+ apiKey;

  $.ajax(url,{success: function(data){
    $(".city").text(data.name);
    $(".temp").text(data.main.temp);
  }})
}

function getSpotifyData() {
  var postUrl = "https://accounts.spotify.com/api/token";
  $.ajax({
    url: 'http://api.spotify.com/v1/track/6rqhFgbbKwnb9MLmUQDhG6',
    type: 'GET',
    headers: {
        'Authorization' : 'Bearer ' + spotifyClientID
    },
    success: function(data) {
        console.log(data);
    }
});
}
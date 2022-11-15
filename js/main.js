var xhr = new XMLHttpRequest();
// var $body = document.querySelector('body');
var $main = document.querySelector('main');
var arrayOfSongs = [];
// var objectOfSongs = {};
var dawndusk = [];

xhr.open('GET', 'https://acnhapi.com/v1/backgroundmusic');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  // console.log(xhr.status);
  arrayOfSongs = Object.values(xhr.response);
  // objectOfSongs = xhr.response;
  // console.log('Array of songs:', arrayOfSongs);
  // console.log('Object of songs:', objectOfSongs);

  for (var i = 0; i < arrayOfSongs.length; i++) {
    // bunch of switch case? for i when it gets to 18, 36, 24, or for if property at songs[i] has certain weather or number
    if (arrayOfSongs[i].hour < 6) {
      dawndusk.push(arrayOfSongs[i]);
    }
  }

  // console.log('value of dawndusk:', dawndusk);

  var $song = document.createElement('video');
  $song.setAttribute('controls', '');
  $song.setAttribute('autoplay', '');
  $song.setAttribute('loop', '');
  $song.setAttribute('name', 'media');

  var $audio = document.createElement('source');
  $audio.setAttribute('src', xhr.response.BGM_24Hour_12_Snowy.music_uri);
  $audio.setAttribute('type', 'audio/mpeg');

  $main.appendChild($song);
  $song.appendChild($audio);
});
xhr.send();

var xhr = new XMLHttpRequest();
// var $body = document.querySelector('body');
var $main = document.querySelector('ul');
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

    dawndusk.push(arrayOfSongs[i]);
    var $listitem = document.createElement('li');
    $listitem.setAttribute('class', 'row list');

    var $songname = document.createElement('p');
    var rawtitle = lastChars(8, arrayOfSongs[i]['file-name']);
    var newTitle = lastChars(5, rawtitle) + ' ' + firstChars(2, rawtitle);

    $songname.textContent = newTitle;
    $listitem.appendChild($songname);
    var $song = document.createElement('audio');
    $song.setAttribute('controls', '');
    // $song.setAttribute('autoplay', '');
    // $song.setAttribute('loop', '');
    $song.setAttribute('name', 'media');

    var $audio = document.createElement('source');
    $audio.setAttribute('src', dawndusk[i].music_uri);
    $audio.setAttribute('type', 'audio/mpeg');

    $main.appendChild($listitem);
    $listitem.appendChild($song);
    $song.appendChild($audio);
    $song.addEventListener('play', pauseOthers);
    $song.addEventListener('ended', startNext);

  }
});
xhr.send();

function pauseOthers(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] !== event.target) {
      $songs[i].pause();
    }
  }
}

function startNext(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] === event.target) {
      $songs[i + 1].play();
    }
  }
}

function firstChars(length, string) {
  var newString = '';
  if (length > string.length) {
    return string;
  }
  for (var i = 0; i < string.length - (string.length - length); i++) {
    newString += string[i];
  } return newString;
}

function lastChars(length, string) {
  var newString = '';
  if (length > string.length) {
    return string;
  }
  for (var i = string.length - length; i < string.length; i++) {
    newString += string[i];
  } return newString;
}

var xhr = new XMLHttpRequest();
var $main = document.querySelector('ul');
var arrayOfSongs = [];
var rainy = document.createElement('p');
rainy.setAttribute('class', 'category rainy');
var sunny = document.createElement('p');
sunny.setAttribute('class', 'category sunny');
var snowy = document.createElement('p');
snowy.setAttribute('class', 'category snowy');

xhr.open('GET', 'https://acnhapi.com/v1/backgroundmusic');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  arrayOfSongs = Object.values(xhr.response);
  renderSongs('time');
});
xhr.send();

function renderSongs(view) {
  rainy.textContent = 'Rainy Weather';
  sunny.textContent = 'Sunny Weather';
  snowy.textContent = 'Snowy Weather';
  for (var i = 0; i < arrayOfSongs.length; i++) {
    const song = arrayOfSongs[i];
    var $listitem = document.createElement('li');
    $listitem.setAttribute('class', 'row column');

    var $songname = document.createElement('p');
    $songname.setAttribute('class', 'songtitle');
    var rawtitle = lastChars(8, song['file-name']);
    var newTitle = lastChars(5, rawtitle) + ' ' + firstChars(2, rawtitle);
    $songname.textContent = newTitle;
    $listitem.appendChild($songname);

    var leafSong = document.createElement('div');
    leafSong.setAttribute('class', 'leafsong row');

    var leaf = document.createElement('img');
    leaf.setAttribute('src', 'images/leaf.png');
    leaf.setAttribute('alt', 'leaf icon');
    leaf.setAttribute('class', 'leaf');
    leafSong.appendChild(leaf);

    var $song = document.createElement('audio');
    $song.setAttribute('controls', '');
    $song.setAttribute('name', 'media');
    $song.setAttribute('class', 'audioplayer');

    var $audio = document.createElement('source');
    $audio.setAttribute('src', song.music_uri);
    $audio.setAttribute('type', 'audio/mpeg');
    if (view === 'time') {
      var timeOfDay = document.createElement('p');
      timeOfDay.setAttribute('class', 'category');
      switch (i) {
        case 0:
          timeOfDay.textContent = 'Dawn / Dusk';
          $main.appendChild(timeOfDay);
          break;
        case 18:
          timeOfDay.textContent = 'Morning';
          $main.appendChild(timeOfDay);
          break;
        case 36:
          timeOfDay.textContent = 'Afternoon';
          $main.appendChild(timeOfDay);
          break;
        case 54:
          timeOfDay.textContent = 'Night';
          $main.appendChild(timeOfDay);
          break;
        default:
          break;
      }
      $main.appendChild($listitem);
      leafSong.appendChild($song);
      $listitem.appendChild(leafSong);
      $song.appendChild($audio);
      $song.addEventListener('play', pauseOthers);
      $song.addEventListener('ended', startNext);
      $song.addEventListener('playing', currentSongBorder);
    } else if (view === 'weather') {
      $main.appendChild(rainy);
      $main.appendChild(sunny);
      $main.appendChild(snowy);
      switch (song.weather) {
        case 'Rainy':
          rainy.appendChild($listitem);
          break;
        case 'Sunny':
          sunny.appendChild($listitem);
          break;
        case 'Snowy':
          snowy.appendChild($listitem);
          break;
        default:
          break;
      }
      leafSong.appendChild($song);
      $listitem.appendChild(leafSong);
      $song.appendChild($audio);
      $song.addEventListener('play', pauseOthers);
      $song.addEventListener('ended', startNext);
      $song.addEventListener('playing', currentSongBorder);
    }
  }
}

function currentSongBorder(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] !== event.target) {
      $songs[i].classList.remove('playing');
    } else if ($songs[i] === event.target) {
      $songs[i].classList.add('playing');
    }
  }
}
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
    if (!$songs[i + 1]) {
      return;
    } else if ($songs[i] === event.target) {
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
  }
  newString = militaryTo12(newString);
  return newString;
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

function militaryTo12(newString) {
  if (newString === '00') {
    newString = '12AM';
  } else if (Number(newString) < 10) {
    newString = newString[newString.length - 1] + 'AM';
  } else if (Number(newString) >= 10 && Number(newString) < 12) {
    newString += 'AM';
  } else if (newString === '12') {
    newString += 'PM';
  } else if (Number(newString) > 12) {
    newString = Number(newString) - 12;
    newString += 'PM';
  }
  return newString;
}

const $clock = document.querySelector('.fa-clock');
const $cloud = document.querySelector('.fa-cloud-moon-rain');

$clock.addEventListener('click', () => changeViews('time'));

$cloud.addEventListener('click', () => changeViews('weather'));

function changeViews(view) {
  const $icon = document.querySelector('.icon.left');
  const $icon2 = document.querySelector('.icon.right');
  const mainicon = $icon.firstElementChild;
  const mainiconp = $icon.lastElementChild;
  if (event.target.parentElement.classList.contains('right')) {
    $icon.replaceChildren(event.target, event.target.nextElementSibling);
    $icon2.replaceChildren(mainicon, mainiconp);
  }
  snowy.replaceChildren();
  rainy.replaceChildren();
  sunny.replaceChildren();
  $main.replaceChildren();
  renderSongs(view);
}

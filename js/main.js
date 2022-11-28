var xhr = new XMLHttpRequest();
var $main = document.querySelector('ul');
var arrayOfSongs = [];

xhr.open('GET', 'https://acnhapi.com/v1/backgroundmusic');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  arrayOfSongs = Object.values(xhr.response);
  renderSongs(6);
});
xhr.send();

function renderSongs(lasthour) {
  for (var i = 0; i < arrayOfSongs.length; i++) {
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
        timeOfDay.textContent = 'Weather';
    }
    var $listitem = document.createElement('li');
    $listitem.setAttribute('class', 'row column');

    var $songname = document.createElement('p');
    $songname.setAttribute('class', 'songtitle');
    var rawtitle = lastChars(8, arrayOfSongs[i]['file-name']);
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
    $audio.setAttribute('src', arrayOfSongs[i].music_uri);
    $audio.setAttribute('type', 'audio/mpeg');

    $main.appendChild($listitem);
    leafSong.appendChild($song);
    $listitem.appendChild(leafSong);
    $song.appendChild($audio);
    $song.addEventListener('play', pauseOthers);
    $song.addEventListener('ended', startNext);
    $song.addEventListener('playing', currentSongBorder);
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

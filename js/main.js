/* global data */
/* exported data */

var $main = document.querySelector('ul');
const maincontainer = document.querySelector('main.container');
var arrayOfSongs = [];
const homeview = document.querySelector('.home');
const songview = document.querySelector('.songs');
const favsview = document.querySelector('.favorites');
const homeclock = document.getElementById('homeclock');
const homecloud = document.getElementById('homecloud');
const $icon = document.querySelector('.icon.left');
const $icon2 = document.querySelector('.icon.right');
const $cloud = document.querySelector('.fa-cloud-moon-rain');
const $clock = document.querySelector('.fa-clock');
const $music = document.querySelector('.fa-music');
const $cloudp = $cloud.nextElementSibling;
const $clockp = $clock.nextElementSibling;
const $mainlogo = document.querySelector('.logo');
const headnav = document.querySelector('.head-nav');
const ulplaylist = document.getElementById('favs');
const loadingspinner = document.querySelector('.loading');

var rainy = document.createElement('div');
var rainyp = document.createElement('p');
rainy.setAttribute('class', 'weather column');
rainyp.setAttribute('class', 'category align-center center-self');
var sunny = document.createElement('div');
var sunnyp = document.createElement('p');
sunny.setAttribute('class', 'weather column');
sunnyp.setAttribute('class', 'category align-center center-self');
var snowy = document.createElement('div');
var snowyp = document.createElement('p');
snowy.setAttribute('class', 'weather column');
snowyp.setAttribute('class', 'category align-center center-self');

const TIMEOUT_DURATION = 10 * 1000; // 10 seconds in milliseconds

function fetchSongs() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://acnhapi.com/v1/backgroundmusic');
    xhr.responseType = 'json';

    // Set up a timeout mechanism
    const timeout = setTimeout(() => {
      xhr.abort(); // Abort the request if it takes too long
      // eslint-disable-next-line no-console
      console.log('Abort!!!');
      reject(new Error('Request timed out'));
    }, TIMEOUT_DURATION);

    xhr.addEventListener('load', function () {
      clearTimeout(timeout);
      if (xhr.status === 200) {
        const fetchedsongs = Object.values(xhr.response);
        resolve(fetchedsongs);
      } else {
        reject(xhr.statusText);
      }
    });
    xhr.send();
  });
}

fetchSongs()
  .then(fetchedsongs => {
    arrayOfSongs = fetchedsongs;
    renderSongs('time');
    loadingspinner.classList.add('hidden');
  })
  .catch(err => console.error(err));

function renderSongs(view) {
  loadingspinner.classList.remove('hidden');
  rainyp.textContent = 'Rainy Weather';
  sunnyp.textContent = 'Sunny Weather';
  snowyp.textContent = 'Snowy Weather';
  rainy.appendChild(rainyp);
  sunny.appendChild(sunnyp);
  snowy.appendChild(snowyp);
  for (var i = 0; i < arrayOfSongs.length; i++) {
    const song = arrayOfSongs[i];
    const leafSong = makeLeafSong();
    const $song = makeSong();
    var $audio = document.createElement('source');
    $audio.setAttribute('src', song.music_uri);
    $audio.setAttribute('type', 'audio/mpeg');
    $song.appendChild($audio);
    leafSong.appendChild($song);
    var $songname = document.createElement('p');
    $songname.setAttribute('class', 'song-title no-decor');
    var rawtitle = lastChars(8, song['file-name']);
    var newTitle = lastChars(5, rawtitle) + ' ' + firstChars(2, rawtitle);
    $songname.textContent = newTitle;
    const $listitem = makeListItem($songname, leafSong);

    if (view === 'time') {
      var timeOfDay = document.createElement('p');
      timeOfDay.setAttribute('class', 'category align-center center-self');
      switch (i) {
        case 0:
          timeOfDay.textContent = 'Night / Dawn';
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
          timeOfDay.textContent = 'Evening';
          $main.appendChild(timeOfDay);
          break;
        default:
          break;
      }
      $main.appendChild($listitem);
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
    }
    $song.addEventListener('play', () => {
      pauseOthers(event);
      headnav.classList.remove('currently-playing');
    });
    $song.addEventListener('ended', startNext);
    $song.addEventListener('playing', currentSongBorder);
  }
  loadingspinner.classList.add('hidden');
}

function currentSongBorder(event) {
  var $songs = document.querySelectorAll('audio');
  if (event.target.closest('.container').classList.contains('favorites')) {
    headnav.classList.add('currently-playing');
  }
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] !== event.target) {
      $songs[i].parentElement.parentElement.classList.remove('playing');
    } else if ($songs[i] === event.target) {
      $songs[i].parentElement.parentElement.classList.add('playing');
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
      $songs[i].classList.remove('playing');
      headnav.classList.remove('currently-playing');
      return;
    } else if ($songs[i] === event.target) {
      $songs[i + 1].currentTime = 0;
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

function changeSongs(view) {
  $icon.replaceChildren(event.target, event.target.nextElementSibling);
  if (event.target === $clock) {
    $icon2.replaceChildren($cloud, $cloudp);
  } else if (event.target === $cloud) {
    $icon2.replaceChildren($clock, $clockp);
  }
  snowy.replaceChildren();
  rainy.replaceChildren();
  sunny.replaceChildren();
  $main.replaceChildren();
  renderSongs(view);
}

function changeViews(newview) {
  let hiddenview;
  let otherview2;
  let otherview;
  if (newview === 'favorites' && !ulplaylist.firstElementChild.classList.contains('hidden')) {
    hiddenview = favsview;
    otherview = homeview;
    otherview2 = songview;
    data.view = 'favorites';
  } else if (newview === 'favorites') {
    hiddenview = favsview;
    otherview = homeview;
    otherview2 = songview;
    data.view = 'favorites';
  } else if (homeview.classList.contains('hidden') || newview === 'home') {
    hiddenview = homeview;
    otherview2 = favsview;
    otherview = songview;
    data.view = 'home';
    homeclock.replaceChildren($clock, $clock.nextElementSibling);
    homecloud.replaceChildren($cloud, $cloud.nextElementSibling);
  } else if (songview.classList.contains('hidden')) {
    hiddenview = songview;
    otherview = homeview;
    otherview2 = favsview;
    data.view = 'songs';
  }
  hiddenview.classList.remove('hidden');
  otherview.classList.add('hidden');
  otherview2.classList.add('hidden');
}

$mainlogo.addEventListener('click', () => changeViews('home'));

$clock.addEventListener('click', () => {
  if ($icon.firstElementChild !== event.target) {
    changeSongs('time');
    if (songview.classList.contains('hidden')) {
      changeViews();
    }
    window.scrollTo(0, 0);
  }
});

$cloud.addEventListener('click', () => {
  if ($icon.firstElementChild !== event.target) {
    changeSongs('weather');
    if (songview.classList.contains('hidden')) {
      changeViews();
    }
    window.scrollTo(0, 0);
  }
});

$music.addEventListener('click', () => changeViews('favorites'));

maincontainer.addEventListener('click', () => {
  const favoritesancestor = event.target.closest('.container');
  const addButton = event.target.closest('.add-button');
  if (addButton && addButton.firstElementChild.classList.contains('leaf') && !favoritesancestor.classList.contains('favorites')) {
    event.target.setAttribute('src', 'images/leaf.png');
    const favclone = event.target.closest('li').cloneNode(true);
    const shifticons = makeIcons();
    favclone.lastElementChild.lastElementChild.addEventListener('pause', () => {
      if (event.target.classList.contains('playing')) {
        headnav.classList.remove('currently-playing');
      }
    });
    favclone.lastElementChild.lastElementChild.addEventListener('play', function () {
      if (event.target.closest('.container').classList.contains('favorites')) {
        headnav.classList.add('currently-playing');
      }
      pauseOthers(event);
    });
    favclone.lastElementChild.lastElementChild.addEventListener('ended', startNext);
    favclone.lastElementChild.lastElementChild.addEventListener('playing', currentSongBorder);
    favclone.lastElementChild.appendChild(shifticons);

    const newObj = {
      title: favclone.firstElementChild.textContent,
      src: favclone.querySelector('source').getAttribute('src')
    };
    if (ulplaylist.firstElementChild.classList.contains('temp-banner')) {
      ulplaylist.firstElementChild.classList.add('hidden');
      data.entries.push(newObj);
      ulplaylist.appendChild(favclone);
    } else {
      data.entries.push(newObj);
      ulplaylist.appendChild(favclone);
    }
  } else if (addButton && addButton.firstElementChild.classList.contains('leaf') && favoritesancestor.classList.contains('favorites')) {
    const forListElement = event.target.closest('li');
    const $deleteModal = addModal(forListElement);
    favsview.appendChild($deleteModal);
    document.querySelector('body').style.overflow = 'hidden';
  }
});

function addModal(forListElement) {
  var $deleteModal = document.createElement('div');
  $deleteModal.setAttribute('class', 'modal whole-page grey-back row justified-center centered-items column-full');
  var $popUp = document.createElement('div');
  $popUp.setAttribute('class', 'pop-up centered-items space-around column-half row');
  $deleteModal.appendChild($popUp);
  var $modaltext = document.createElement('div');
  $modaltext.setAttribute('class', 'column-full');
  $popUp.appendChild($modaltext);
  var $deleteText = document.createElement('p');
  $deleteText.innerText = 'Are you sure you want to delete this song?';
  $deleteText.setAttribute('class', 'cancel-text big-font align-center');
  $modaltext.appendChild($deleteText);
  var $cancelButton = document.createElement('button');
  $cancelButton.setAttribute('class', 'green-back modal-button big-font white-text');
  $cancelButton.innerText = 'KEEP';
  $popUp.appendChild($cancelButton);
  var $confirmButton = document.createElement('button');
  $confirmButton.setAttribute('class', 'salmon white-text big-font modal-button');
  $confirmButton.innerText = 'DELETE';
  $popUp.appendChild($confirmButton);
  $cancelButton.addEventListener('click', removeModal);
  $confirmButton.addEventListener('click', () => {
    const favlist = ulplaylist.querySelectorAll('li');
    if (ulplaylist.childElementCount < 2) {
      ulplaylist.firstElementChild.classList.remove('hidden');
    }
    for (let i = 0; i < favlist.length; i++) {
      if (favlist[i] === forListElement) {
        data.entries.splice(i - 1, 1);
      }
    }
    ulplaylist.removeChild(forListElement);
    removeModal();
  });
  return $deleteModal;
}

function removeModal() {
  const allmodals = document.querySelectorAll('.modal.grey-back');
  for (let i = 0; i < allmodals.length; i++) {
    favsview.removeChild(allmodals[i]);
  }
  document.querySelector('body').style.overflow = 'visible';
}

ulplaylist.addEventListener('mouseover', event => {
  if (event.target.classList.contains('leaf')) {
    event.target.setAttribute('src', 'images/delete-x.png');
  }
});

ulplaylist.addEventListener('mouseout', event => {
  if (event.target.classList.contains('leaf')) {
    event.target.setAttribute('src', 'images/leaf.png');
  }
});

$main.addEventListener('mouseover', event => {
  if (event.target.classList.contains('leaf')) {
    event.target.setAttribute('src', 'images/add.png');
  }
});

$main.addEventListener('mouseout', event => {
  if (event.target.classList.contains('leaf')) {
    event.target.setAttribute('src', 'images/leaf.png');
  }
});

ulplaylist.addEventListener('click', event => {
  const tomove = event.target.closest('li');
  const favlist = ulplaylist.querySelectorAll('li');
  const shiftbutton = event.target.closest('button');
  if (!shiftbutton || event.target.classList.contains('leaf')) return;
  if ((shiftbutton.firstElementChild.classList.contains('fa-chevron-up')) && (tomove.previousElementSibling.previousElementSibling)) {
    for (let i = 0; i < favlist.length; i++) {
      if (favlist[i] === tomove) {
        const tempid = data.entries[i - 1];
        data.entries[i - 1] = data.entries[i - 2];
        data.entries[i - 2] = tempid;
      }
    }
    ulplaylist.insertBefore(tomove, tomove.previousElementSibling);
  } else if ((shiftbutton.firstElementChild.classList.contains('fa-chevron-down')) && (tomove.nextElementSibling)) {
    for (let i = 0; i < favlist.length; i++) {
      if (favlist[i] === tomove) {
        const tempid = data.entries[i - 1];
        data.entries[i - 1] = data.entries[i];
        data.entries[i] = tempid;
      }
    }
    ulplaylist.insertBefore(tomove, tomove.nextElementSibling.nextElementSibling);
  }
});

window.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.entries.length; i++) {
    ulplaylist.appendChild(renderOldSong(data.entries[i]));
  }
  changeViews(data.view);
  if (data.entries.length > 0) {
    ulplaylist.firstElementChild.classList.add('hidden');
  }
});

function makeLeafSong() {
  var leafSong = document.createElement('div');
  leafSong.setAttribute('class', 'space-around row');
  const addButton = document.createElement('button');
  addButton.setAttribute('class', 'add-button');
  var leaf = document.createElement('img');
  leaf.setAttribute('src', 'images/leaf.png');
  leaf.setAttribute('alt', 'leaf icon');
  leaf.setAttribute('class', 'leaf');
  addButton.appendChild(leaf);
  leafSong.appendChild(addButton);
  return leafSong;
}

function makeSong() {
  var song = document.createElement('audio');
  song.setAttribute('controls', '');
  song.setAttribute('name', 'media');
  song.setAttribute('class', 'audio-player');
  return song;
}

function makeListItem($songname, leafSong) {
  var $listitem = document.createElement('li');
  $listitem.setAttribute('class', 'row column');
  $listitem.appendChild($songname);
  $listitem.appendChild(leafSong);
  return $listitem;
}

function makeIcons() {
  const up = document.createElement('button');
  const down = document.createElement('button');
  const arrowup = document.createElement('i');
  const arrowdown = document.createElement('i');
  const shifticons = document.createElement('div');
  shifticons.setAttribute('class', 'column justified-center');
  arrowup.setAttribute('class', 'fa-solid fa-chevron-up small-icon');
  arrowdown.setAttribute('class', 'fa-solid fa-chevron-down small-icon');
  up.setAttribute('class', 'shift row justified-center centered-content');
  down.setAttribute('class', 'shift row justified-center centered-content');
  up.appendChild(arrowup);
  down.appendChild(arrowdown);
  shifticons.appendChild(up);
  shifticons.appendChild(down);
  return shifticons;
}

function renderOldSong(entry) {
  const leafSong = makeLeafSong();
  const $song = makeSong();
  var $audio = document.createElement('source');
  $audio.setAttribute('src', entry.src);
  $audio.setAttribute('type', 'audio/mpeg');
  $song.appendChild($audio);
  leafSong.appendChild($song);
  var $songname = document.createElement('p');
  $songname.setAttribute('class', 'song-title no-decor');
  $songname.textContent = entry.title;
  const $listitem = makeListItem($songname, leafSong);
  const shifticons = makeIcons();
  $listitem.lastElementChild.appendChild(shifticons);
  $song.addEventListener('play', () => {
    pauseOthers(event);
    headnav.classList.remove('currently-playing');
  });
  $song.addEventListener('ended', startNext);
  $song.addEventListener('playing', currentSongBorder);
  return $listitem;
}

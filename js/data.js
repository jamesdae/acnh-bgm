/* exported data */

var data = {
  view: 'home',
  entries: []
};

var previousdataJSON = localStorage.getItem('javascript-local-storage');

if (previousdataJSON !== null) {
  data = JSON.parse(previousdataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('javascript-local-storage', dataJSON);
});

window.addEventListener('pagehide', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('javascript-local-storage', dataJSON);
});

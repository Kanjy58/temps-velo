'use strict';

var init = L.Permalink.getMapLocation(13, [48.11, -1.67], ['temps']);
var map = L.map('mapid', {
  center: init.center,
  zoom: init.zoom
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
  ' | <a href="static/LICENSES.txt">Licenses</a>'
}).addTo(map);

L.control.scale({
  imperial: false
}).addTo(map);

var timesGroup = L.layerGroup();

for(let i in points) {
  L.marker(
    points[i].latlng, {
      color: 'black',
      fillColor: 'white',
      fillOpacity: 1,
      radius: 5,
      icon: L.divIcon({
        html: '<p class="ll-point-label">' + points[i].name + '</p>',
        iconAnchor: [10, 10]
      })
    }
  ).addTo(timesGroup);
}

for(let i in lines) {
  var color = '#95303e';
  if(lines[i].time < 20) color = '#d38545';
  if(lines[i].time < 10) color = '#3791ac';
  L.polyline([lines[i].from.latlng, lines[i].to.latlng], {
    color: color
  }).setText(lines[i].time + " min", {
    center: true,
    attributes: {class: "ll-line-label"}
  }).addTo(timesGroup);
}


var updateLayers = function(layers) {
  if(layers.has('temps'))
    map.addLayer(timesGroup);
  else
    map.removeLayer(timesGroup);
}

L.Permalink.setup(map, init.layers, updateLayers);

L.control.layers({}, {
  'temps': timesGroup
}).addTo(map);

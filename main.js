'use strict';

var init = L.Permalink.getMapLocation(13, [48.11, -1.67], ['temps', 'points']);
var map = L.map('mapid', {
  center: init.center,
  zoom: init.zoom
});

L.control.scale({
  imperial: false
}).addTo(map);

var pointsGroup = L.layerGroup();

for(let i in points) {
  L.marker(
    [points[i].lat, points[i].lng], {
      color: 'black',
      fillColor: 'white',
      fillOpacity: 1,
      radius: 5,
      icon: L.divIcon({
        html: '<p class="ll-point-label">' + points[i].name + '</p>',
        iconAnchor: [10, 10]
      })
    }
  ).addTo(pointsGroup);
}

var linesGroup = L.layerGroup();

for(let i in lines) {
  var color = '#95303e';
  if(lines[i].minutes <= 20) color = '#d38545';
  if(lines[i].minutes <= 10) color = '#3791ac';
  L.polyline([lines[i].west, lines[i].east], {
    color: color
  }).setText(lines[i].minutes + " min", {
    center: true,
    attributes: {class: "ll-line-label"}
  }).addTo(linesGroup);
}


var updateLayers = function(layers) {
  if(layers.has('temps'))
    map.addLayer(linesGroup);
  else
    map.removeLayer(linesGroup);
  if(layers.has('points'))
    map.addLayer(pointsGroup);
  else
    map.removeLayer(pointsGroup);
}

L.Permalink.setup(map, init.layers, updateLayers);

var attr =
  ' | By <a href="https://twitter.com/taflevelo">@taflevelo</a>' +
  ' | <a href="https://gitlab.com/taflevelo/temps-velo/">source code</a>';
L.control.layers({
  'OSM': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + attr
  }).addTo(map),
  'vide': L.tileLayer('', {
    attribution: attr
  })
}, {
  'points': pointsGroup,
  'temps': linesGroup,
}).addTo(map);

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

function draw_point(point, name, group) {
  L.marker(
    point, {
      color: 'black',
      fillColor: 'white',
      fillOpacity: 1,
      radius: 5,
      icon: L.divIcon({
        html: '<p class="ll-point-label">' + name + '</p>',
        iconAnchor: [10, 10]
      })
    }
  ).addTo(group);
}
function draw_line(start, end, time, group) {
  var color = '#95303e';
  if(time < 20) color = '#d38545';
  if(time < 10) color = '#3791ac';
  L.polyline([start, end], {
    color: color
  }).setText(time + " min", {
    center: true,
    attributes: {class: "ll-line-label"}
  }).addTo(group);
}

var mairie = [(48 + 6/60 + 41/3600), (-1 + -40/60 + -48/3600)];
var tnb = [(48 + 6/60 + 29/3600), (-1 + -40/60 + -21/3600)];
var liberte = [(48 + 6/60 + 24/3600), (-1 + -40/60 + -36/3600)];
draw_line(mairie, tnb, 21, timesGroup);
draw_line(mairie, liberte, 19, timesGroup);
draw_line(liberte, tnb, 7, timesGroup);
draw_point(tnb, "TNB", timesGroup);
draw_point(mairie, "Mairie", timesGroup);
draw_point(liberte, "Le Liberté", timesGroup);

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

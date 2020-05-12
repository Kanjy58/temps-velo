'use strict';

var attr =
  ' | By <a href="https://twitter.com/taflevelo">@taflevelo</a>' +
  ' | <a href="https://gitlab.com/taflevelo/temps-velo/">source code</a>';

var init = L.Permalink.getMapLocation(13, [48.11, -1.67], ['temps', 'points']);
var map = L.map('mapid', {
  center: init.center,
  zoom: init.zoom,
  minZoom: levels.reduce(function(a,b) { return Math.min(a, b); }),
});

L.control.scale({
  imperial: false
}).addTo(map);

var zoomData = [];

var pointsGroup = L.layerGroup();

for(let i in points) {
  var p = L.marker(
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
  );

  zoomData.push({
    'layer': p,
    'group': pointsGroup,
    'show': function(z) { return z >= points[i].level; }
  });
}

var linesGroup = L.layerGroup();

for(let i in lines) {
  var color = '#ff4b4b';
  if(lines[i].minutes <= 20) color = '#ffa24b';
  if(lines[i].minutes <= 10) color = '#4b4bff';
  var l = L.polyline([lines[i].west, lines[i].east], {
    color: color
  }).setText(lines[i].minutes + " min", {
    center: true,
    attributes: {class: "ll-line-label"}
  });

  zoomData.push({
    'layer': l,
    'group': linesGroup,
    'show': function(z) {
      var levelidx = levels.indexOf(lines[i].level);
      if((levels.length - 1) == levelidx) // last
        return z >= lines[i].level;
      return (z >= lines[i].level) && (z < levels[levelidx + 1]);
    }
  });
}

function zoomUpdate(e) {
  zoomData.forEach(function(z) {
    if(z.show(map.getZoom())) {
      if(!z.group.hasLayer(z.layer))
        z.group.addLayer(z.layer);
    }
    else if(z.group.hasLayer(z.layer))
      z.group.removeLayer(z.layer);
  });
}

map.on('zoomend', zoomUpdate);
zoomUpdate();

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

L.control.layers({
  'OSM': L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + attr
  }).addTo(map),
  'vide': L.tileLayer('', {
    attribution: attr
  })
}, {
  'points': pointsGroup,
  'temps': linesGroup,
}).addTo(map);

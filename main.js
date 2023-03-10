'use strict';

var attr =
  ' Par <a href="https://twitter.com/taflevelo">@taflevelo</a>' +
  ' | <a href="javascript:void(0)" id="explanation-link">Explications</a>';

var map = L.map('map', {
  minZoom: levels.reduce(function(a,b) { return Math.min(a, b); }),
});

L.control.scale({
  imperial: false
}).addTo(map);

var zoomData = [];

var pointsGroup = L.featureGroup();

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

  // Initially add all of them to get default zoom and center
  pointsGroup.addLayer(p);

  zoomData.push({
    'layer': p,
    'group': pointsGroup,
    'show': function(z) { return z >= points[i].level; }
  });
}

// Init map zoom and center
var init = L.Permalink.getMapLocation(['temps', 'points']);
if(init.hasOwnProperty('zoom') && init.hasOwnProperty('center')) {
  map.setView(init.center, init.zoom);
}
else {
  map.fitBounds(L.latLngBounds(pointsGroup.getBounds()));
}

var linesGroup = L.featureGroup();

for(let i in lines) {
  var color = '#ff4b4b';
  var weight = 2;
  if(lines[i].minutes <= 20) {
    color = '#ffa24b';
    weight = 4;
  }
  if(lines[i].minutes <= 10) {
    color = '#4b4bff';
    weight = 6;
  }
  var l = L.polyline([lines[i].west, lines[i].east], {
    color: color,
    weight: weight
  }).setText(lines[i].minutes + " min", {
    center: true,
    offset: 5,
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
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ' + attr
  }).addTo(map),
  'cyclOSM': L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ' + attr
  }),
  'vide': L.tileLayer('', {
    attribution: attr
  })
}, {
  'points': pointsGroup,
  'temps': linesGroup,
}).addTo(map);

function showExplanation() {
  MicroModal.show('modal-1', {
    awaitCloseAnimation: true,
    disableFocus: true,
    onClose: function(modal) {
      // Set cookie
      document.cookie = "explainv1=true;max-age=" + (3600 * 24 * 30)
    },
  });
}

document.getElementById('explanation-link').onclick = showExplanation;

// Show explanation modal once, if cookie is not set
if(document.cookie.replace(/(?:(?:^|.*;\s*)explainv1\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
  showExplanation();
}

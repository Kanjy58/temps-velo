L.Permalink = {
    //gets the map center, zoom-level and enabled layers from the URL if present
    getMapLocation: function (layers) {
        'use strict';
        var zoom, center;
        var layers = (layers) ? layers : [];

        if (window.location.hash !== '') {
            var hash = window.location.hash.replace('#', '');
            var parts = hash.split(',');
            if (parts.length >= 3) {
                center = {
                    lat: parseFloat(parts[0]),
                    lng: parseFloat(parts[1])
                };
                zoom = parseInt(parts[2].slice(0, -1), 10);
                if((parts.length >= 4) && (parts[3] !== "")) {
                  layers = parts.slice(3);
                }
            }
          return {zoom: zoom, center: center, layers: new Set(layers)};
        }
        return {layers: new Set(layers)};
    },

    setup: function (map, layers, updateLayers) {
        'use strict';
        var shouldUpdate = true;

        // map.eachLayer() + hasLayer() always return true, so we maintain our
        // own list of enabled overlays
        var currentLayers = layers;
        updateLayers(currentLayers);

        var updatePermalink = function () {
            if (!shouldUpdate) {
                // do not update the URL when the view was changed in the 'popstate' handler (browser history navigation)
                shouldUpdate = true;
                return;
            }

            var center = map.getCenter();
            var hash = '#' +
                    Math.round(center.lat * 100000) / 100000 + ',' +
                    Math.round(center.lng * 100000) / 100000 + ',' +
                    map.getZoom() + 'z,' +
                    Array.from(currentLayers).sort().join(',')
            var state = {
                zoom: map.getZoom(),
                center: center,
                layers: currentLayers
            };
            window.history.pushState(state, 'map', hash);
        };

        var overlayAdd = function(e) {
          currentLayers.add(e.name);
          updatePermalink();
        };

        var overlayRemove = function(e) {
          currentLayers.delete(e.name);
          updatePermalink();
        };

        map.on('moveend', updatePermalink);
        map.on('overlayadd', overlayAdd);
        map.on('overlayremove', overlayRemove);

        // restore the view state when navigating through the history, see
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
        window.addEventListener('popstate', function (event) {
            if (event.state === null) {
                return;
            }
            map.setView(event.state.center, event.state.zoom);
            currentLayers = event.state.layers;
            updateLayers(currentLayers);
            shouldUpdate = false;
        });
    }
};

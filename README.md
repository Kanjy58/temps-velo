Temps Vélo - a bike travel time map
===================================

This is a map showing a mesh of bike travel segments over a set of points.
It does not give routes, but give an overview of how much time is needed to bike somewhere / how far we can reach biking.

Made by [@taflevelo](https://twitter.com/taflevelo).

How does it work?
-----------------

The map generation is based on a simple list of places.
Each place has several attributes:
- A name
- A location (either an address or coordinates)
- A zoom level

Starting from this list, everything else is computed automatically:

1. For each place, if the coordinates are not provided, the location is converted to coordinates thanks to a geocoding service
2. For each zoom level:
    1. All places with a zoom level attribute **equal or less precise** (smaller) are selected
    2. A [Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) is computed from the selected places' coordinates. The triangulation automatically selects which paths will be displayed at the end. In this step, only the distance as the crow flies matters
    3. For each (unique) edge of all triangles, a route is computed by an online routing service, with a bicycle profile. Only the duration is extracted from the route
    4. Routes with duration above a threshold are discarded. This is a simple solution to remove edges from the border of the map, which may be ugly
3. The website is generated from all this data

Change / Update
---------------

1. Edit `points.csv` (see format below)
2. Get an API key from [https://openrouteservice.org/dev/](https://openrouteservice.org/dev/)
3. When using Gitlab CI:
    1. Set the API key in an environment variable named `OPENROUTESERVICEKEY` in the [CI settings](https://docs.gitlab.com/ee/ci/variables/#create-a-custom-variable-in-the-ui):
        1. In Gitlab UI, go to `Settings` → `CI / CD`, then expand `Variables`
        2. Click `Add Variable` button
        3. Set `Key` to `OPENROUTESERVICEKEY`, set `Value` to your key, keep `Type` set to `Variable`
        4. CHECK THE CHECKBOXES `Protect variable` and `Mask variable`. This will prevent people from STEALING your key
        5. If you did not set your key this way, delete your key from [Openrouteservice](https://openrouteservice.org/dev/), ask for a new one and start over
    2. Commit and push
4. When using other tools, or manually:
    1. Put the API key in an environment variable named `OPENROUTESERVICEKEY`
    2. Run `./build-data.py` to precompute all points coordinates and trip durations
    2. Run `./build-site.sh` to build the site
    3. copy the `public/` directory on a web server

For other regions:
1. edit title, modal text and Twitter metadata in index.html
2. optionally edit/append attribution (first lines of `main.js`)


The dependencies can be handled by:
- using pip: `pip install -r requirements.txt`
- running the scripts inside a `nix-shell` (with [Nix](https://nixos.org/) installed)

Note: as rates are low for Nominatim and Openrouteservice, requests results are cached in the file `cache*.p`. After the first long run, incremental updates should be faster.

points.csv format
-------------------

- `level`: from which zoom level the point should be added to the mesh (and displayed with its connected lines)
- `lat` and `lng`: coordinates of the point
- `query`: string used to query geocoding service and get coordinates
- `name`: displayed name on the map.

For each row, use either coordinates or query string (̀coordinates takes precedence).

Tips for people making map with this tool
-----------------------------------------

- the zoom level is the number in the URL after the `#` character and just before the `z` character
- play around to see how zoom management works and how the map renders. The zoom mechanism is designed to increase precision (with more points and more edges) as the user zooms
- do not duplicate a line with the same data but different zoom levels. A point set with a given zoom level attribute will appear at this zoom level and stay for all more precise zoom levels
- avoid showing too much information at a given zoom level: if names and travel times are illegible, the map becomes useless
- avoid showing too much information at all. Having a lot of edges with 3 or 4 minutes is not very useful and makes the map less readable. The map should be a general scheme showing how much time is needed to ride from point A to point B
- the map should be readable for all zoom levels. Test all of them
- avoid selecting places that are too close to each other: this is useless and makes the triangulation ugly
- the query string should be precise enough to get an unique result. In fact, only the first result is used
- test the query string on [Nominatim](https://nominatim.openstreetmap.org/). You can use [Nominatim special phrases](https://wiki.openstreetmap.org/wiki/Nominatim/Special_Phrases/EN) to refine the search
- query strings are fine for places like cities. Otherwise, directly giving coordinates can be more convenient

Thanks
------

Many thanks to:
- [OpenStreeMap](https://www.openstreetmap.org/): Collaborative creation of map data, they distribute it under a free license + provide the tiles
- [Nominatim](https://nominatim.openstreetmap.org/): Geocoding
- [Openrouteservice](https://openrouteservice.org/): Compute route time
- [Scipy](https://www.scipy.org/): Compute Delaunay triangulation
- [Leaflet](https://leafletjs.com/): Display the map in your browser
- [leaflet.Permalink](https://github.com/MarcChasse/leaflet.Permalink): Make URL shareable (slightly updated to get/put the current overlays in url)
- [leaflet.TextPath](https://github.com/makinacorpus/Leaflet.TextPath): Display time on the edges
- [Micromodal](https://github.com/Ghosh/micromodal): Display explanation modal
- All dependencies of these projects, and all dependencies of these projects, and (Error: infinite recursion)
- Others, see source code
- Authors of all free software that I used (Error: list too long)

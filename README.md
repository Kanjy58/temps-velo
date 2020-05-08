Temps Vélo - a bike travel time map
===================================

This is a map showing a mesh of bike travel segments over a set of points.
It does not give routes, but give an overview of how many time is needed to bike somewhere / how far we can reach biking.

Made by [@taflevelo](https://twitter.com/taflevelo).

Change / Update
---------------

1. Get an API key from [https://openrouteservice.org/dev/](https://openrouteservice.org/dev/)
2. Set API key in file `update.py` (use [Nix](https://nixos.org/), or edit shebang and manually install dependencies)
3. Edit `points.tsv` (see format below)
5. Run `update.py` and wait, this generates `data.js`
6. Commit and push to a gitlab server with CI and pages enabled OR manually run instructions in `.gitlab-ci.yml` and put the `public/` directory on a web server.

Note: as rates are low for Nominatim and Openrouteservice, requests results are cached in the file `cache.p`. After the first long run, incremental updates should be faster.

For other regions:
1. edit title in index.html
2. edit default coordinates and zoom (first lines of `main.js`)

points.tsv format
-------------------

Tab separator is chosen because comma are common in Nominatim queries.

- `level`: not used for now. In the future, we may want a hierarchy in order to not display too much information at the same time (cities, subway stations, etc)
- `query`: string used to query Nominatim and get coordinates. It should be precise enough to get an unique result. In fact, we just use the first result. Test the query string on [Nominatim](https://nominatim.openstreetmap.org/)
- `name`: displayed name on the map.

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
- All dependencies of these projects, and all dependencies of these projects, and (Error: infinite recursion)
- Others, see source code
- Authors of all free software that I used (Error: list too long)

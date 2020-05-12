Temps Vélo - a bike travel time map
===================================

This is a map showing a mesh of bike travel segments over a set of points.
It does not give routes, but give an overview of how many time is needed to bike somewhere / how far we can reach biking.

Made by [@taflevelo](https://twitter.com/taflevelo).

Change / Update
---------------

1. Edit `points.csv` (see format below)
2. Get an API key from [https://openrouteservice.org/dev/](https://openrouteservice.org/dev/)
3. When using Gitlab CI:
    1. Put the API key in an environment variable named `OPENROUTESERVICEKEY` in the [CI settings](https://docs.gitlab.com/ee/ci/variables/#create-a-custom-variable-in-the-ui).
    2. Commit and push
4. When using other tools, or manually:
    1. Put the API key in an environment variable named `OPENROUTESERVICEKEY`
    2. Run `./update.py` to precompute all points coordinates and trip durations
    2. Run `./build-site.sh` to build the site
    3. copy the `public/` directory on a web server

For other regions:
1. edit title and Twitter metadata in index.html
2. edit default coordinates and zoom (first lines of `main.js`)
3. optionally edit/append attribution (first lines of `main.js`)


The dependencies can be handled by:
- using pip: `pip install -r requirements.txt`
- running the scripts inside a `nix-shell` (with [Nix](https://nixos.org/) installed)

Note: as rates are low for Nominatim and Openrouteservice, requests results are cached in the file `cache*.p`. After the first long run, incremental updates should be faster.

points.csv format
-------------------

- `level`: from which zoom level the point should be added to the mesh (and displayed with its connected lines)
- `lat` and `lng`: coordinates of the point
- `query`: string used to query Nominatim and get coordinates. It should be precise enough to get an unique result. In fact, we just use the first result. Test the query string on [Nominatim](https://nominatim.openstreetmap.org/). You can use [Nominatim special phrases](https://wiki.openstreetmap.org/wiki/Nominatim/Special_Phrases/EN) to refine the search.
- `name`: displayed name on the map.

For each row, use either coordinates or query string (̀coordinates takes precedence).

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

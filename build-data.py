#! /usr/bin/env python3

import sys
import os
import pandas as pd
import requests
from time import sleep
from scipy.spatial import Delaunay
from threading import Lock
import pickle
from pathlib import Path
import openrouteservice
import json

# Nomitatim rate limit (requests per minutes)
# https://operations.osmfoundation.org/policies/nominatim/
nominatim_rate_limit = 60

# openrouteservice rate limit (requests per minutes)
# https://openrouteservice.org/plans/
# https://openrouteservice.org/restrictions/
openrouteservice_rate_limit  = 40

# filter out lines exceeding this time (should filter long exterior edges of triangulation)
maxminutes = 60


# increment when updating to incompatible cache
cacheversion = "2"


nominatim_mutex = Lock()

def write_cache(cache):
    pickle.dump(cache, open('cache' + cacheversion + '.p', 'wb'))

def getLatLng(s):
    if not pd.isna(s['lat']) and not pd.isna(s['lng']):
        print('use coordinates for {}'.format(s['name']), file=sys.stderr)
    # caching by query
    elif s['query'] in cache['nominatim']:
        print('[cached] nominatim request for {}'.format(s['name']), file=sys.stderr)
        s['lat'], s['lng'] = cache['nominatim'][s['query']]
    else:
        nominatim_mutex.acquire()

        print('nominatim request for {}'.format(s['name']), file=sys.stderr)
        json = requests.get(url="https://nominatim.openstreetmap.org/search?limit=1&format=jsonv2&q={}".format(s['query'])).json()

        sleep(60 / nominatim_rate_limit)
        nominatim_mutex.release()

        if len(json) == 0:
            print('ERROR: nominatim request finds no results for {} (query: <{}>)'.format(s['name'], s['query']))
            sys.exit(1)

        coords = float(json[0]['lat']), float(json[0]['lon'])

        cache['nominatim'][s['query']] = coords
        write_cache(cache)

        s['lat'], s['lng'] = coords

    return s

def getTime(departure, arrival):
    coords = ((departure.lng, departure.lat), (arrival.lng, arrival.lat))

    # caching by coords
    if coords in cache['openrouteservice']:
        print('[cached] openrouteservice request for {} -> {}'.format(departure['name'], arrival['name']), file=sys.stderr)
        return cache['openrouteservice'][coords]
    else:
        while True:
            try:
                print('openrouteservice request for {} -> {}'.format(departure['name'], arrival['name']), file=sys.stderr)
                routes = client.directions(coords, profile='cycling-regular')
                break
            except openrouteservice.exceptions.HTTPError: # 502 can happen
                print('oops, retrying in a few moments', file=sys.stderr)
                sleep(4) # just be nice with the servers

        sleep(60 / openrouteservice_rate_limit)

        minutes = round(routes['routes'][0]['summary']['duration'] / 60)

        cache['openrouteservice'][coords] = minutes;
        write_cache(cache)

        return minutes

# Read cache
if Path('cache' + cacheversion + '.p').is_file():
    cache = pickle.load(open('cache' + cacheversion + '.p', 'rb'))
else:
    cache = {
        'nominatim': {},
        'openrouteservice': {}
    }

# read wanted points
points = pd.read_csv('points.csv', delimiter=';')

# do requests to Nominatim to get points' coordinates where needed
points = points.apply(getLatLng, axis=1, result_type='expand')

if not 'OPENROUTESERVICEKEY' in os.environ:
    print('ERROR: set OPENROUTESERVICEKEY environment variable. Get an API key from https://openrouteservice.org/dev/')
    sys.exit(1)

client = openrouteservice.Client(key=os.environ['OPENROUTESERVICEKEY'])
lines = []

# compute Delaunay triangulation + request time for each requested level
levels = pd.unique(points['level']).tolist()
levels.sort()
for level in levels:
    print('level <= {}'.format(level), file=sys.stderr)
    # compute Delaunay triangulation
    pointsLevel = points[points['level'] <= level];

    if pointsLevel.shape[0] < 3:
        print('WARNING: not enough points to triangulate at level <= {}: skipping'.format(level))
        continue

    triangles = Delaunay(pointsLevel[['lat', 'lng']]).simplices

    # get all unique edges
    edges = set()
    for triangle in triangles:
        edges.add(tuple(sorted([triangle[0], triangle[1]])))
        edges.add(tuple(sorted([triangle[1], triangle[2]])))
        edges.add(tuple(sorted([triangle[0], triangle[2]])))

    # get trip time for each edge
    for p1, p2 in edges:
        minutes = getTime(pointsLevel.iloc[p1], pointsLevel.iloc[p2])

        # East/west is important to not get text reversed
        p1lat = float(pointsLevel.iloc[p1].lat)
        p1lng = float(pointsLevel.iloc[p1].lng)
        p2lat = float(pointsLevel.iloc[p2].lat)
        p2lng = float(pointsLevel.iloc[p2].lng)
        if p1lng > p2lng:
            west = [p2lat, p2lng]
            east = [p1lat, p1lng]
        else:
            west = [p1lat, p1lng]
            east = [p2lat, p2lng]

        if(minutes <= maxminutes):
            lines.append({
                'west': west,
                'east': east,
                'minutes': minutes,
                'level': level,
            })

# write results
with open('data.js', 'w') as output:
    output.write('// Autogenerated file, do not edit\n')
    output.write('var levels = ')
    output.write(json.dumps(levels))
    output.write(';\nvar points = ')
    output.write(points[['name', 'lat', 'lng', 'level']].to_json(orient='records'))
    output.write(';\nvar lines = ')
    output.write(json.dumps(lines))
    output.write(';')

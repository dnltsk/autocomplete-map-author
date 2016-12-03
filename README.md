#  Autocomplete Map Author (WIP)

enables everyone to create autocomplete maps à la "Why is [] so ..."

![latest screenshot](screenshot.png)

## Basic Concept

1. user uploads GeoJSON file with Geometries and Properties
   => GeoJSON is displayed on the map
2. user defines the phrase which has to gets autocompleted as "Why is ${name} so ..."
   => Googles Suggestion API is getting requested for every Feature
   => Geometries are filled with labels

## Tech Stack

d3, RiotJS, ReduxJS, Bootstrap 

## start

1. `npm install` (only once)
2. `npm run build`
3. `npm run start`
4. open http://localhost:8080 

## develop

fire `npm run dev` instead of step 2 and 3 to enable webpack's file watcher  

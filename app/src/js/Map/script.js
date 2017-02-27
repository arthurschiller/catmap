import $ from "jquery";

var darkGray = "#373D40",
	primaryColor = "#D8597F",
	secondaryColor = "#7D64FF"

var logCount = 0

var map = null
var routeLine = null
var homeCoordinates = [13.651298, 52.376738]

var catMarker = null

var routeDataSource = null

var slider = null

var createGeoJSONCircle = function(center, radiusInKm, points) {
    
    if(!points) points = 64

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
}

export default {
	name: 'Map',
	data() {
		return {}
	},
}

document.addEventListener("DOMContentLoaded", function(event) { 

	$("#info-overlay_toggle").click(function(){
		$(".info-overlay").toggleClass("info-overlay--visible")
	})


	slider = document.getElementById('time-slider')

	mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyc2NoaWxsZXIiLCJhIjoiY2l4cm1iamZxMDAzeDJxcmJhdG5sNGRkbCJ9.o1r2qoVtyIgFco7r5ErM2A';
	// This adds the map to your page
	map = new mapboxgl.Map({
	  // container id specified in the HTML
	  container: 'map',
	  // style URL
	  style: 'mapbox://styles/arthurschiller/ciyu45zq6004v2rqmorg8phtj',//'mapbox://styles/mapbox/light-v9',
	  // // initial position in [long, lat] format
	  center: homeCoordinates,
	  // // initial zoom
	  minZoom: 13.5,
	  zoom: 14,
	  pitch: 50,
	});

	addOverlay()
})

function measureDistance(data) {

	var linestring = {
	    "type": "Feature",
	    "geometry": {
	        "type": "LineString",
	        "coordinates": []
	    }
	}

	var coordinates = data.features[0].geometry.coordinates
	//console.log(coordinates)
}

function getLogCount(data) {

	var times = data.features[0].properties.coordTimes

	logCount = times.length
	//console.log(logCount)
	slider.max = logCount
}

function addRouteToMap(data, map) {

	routeLine = map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
        	"type": "geojson",
        	"data": data
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round",
            //"line-offset": "10px"
        },
        "paint": {
            "line-color": primaryColor,//"#02DBC1",//#D8597F",
            "line-width": 2,
            "line-dasharray": [2, 2],
            //"line-gap-width": 10
        }
    });
}

function addCatMarker() {

	var el = document.createElement('div');
	el.className = 'cat-marker';
	el.style.width = 100 + 'px';
	el.style.height = 100 + 'px';

	let coordinates = getCatMarkerCoordinates(0)

	catMarker = new mapboxgl.Marker(el, {offset: [-50, -110]})
		.setLngLat(coordinates)
	    .addTo(map);
}

function updateCatMarker() {
	
	document.getElementById('time-slider').addEventListener('input', function(e) {
	  
		// get the current hour as an integer
		let logValue = parseInt(e.target.value)
		let coordinates = getCatMarkerCoordinates(logValue)

		//console.log(coordinates)
		catMarker.setLngLat(coordinates)
	});
}

function getCatMarkerCoordinates(index) {

	if (index >= routeDataSource.length) {
		console.log("No coordinates for marker available.")
		return
	}

	let geoData = routeDataSource.features[0].geometry.coordinates[index]
	let coordinates = [geoData[0], geoData[1]]

	//console.log(coordinates)

	return coordinates
}

function addHomeIcon() {

    var el = document.createElement('div');
    el.className = 'home-marker';
    el.style.width = 50 + 'px';
    el.style.height = 60 + 'px';
    el.style.backgroundImage = 'url(src/svg/raw/home-pin.svg)';

    new mapboxgl.Marker(el, {offset: [-25, -60]})
    	.setLngLat(homeCoordinates)
        .addTo(map);
}

/*
function addHomeIcon(data) {

	let geoData = data.features[0].geometry.coordinates[0]
	let coordinates = [geoData[0], geoData[1]]

	console.log(coordinates)

    var el = document.createElement('div');
    el.className = 'home-marker';
    el.style.width = 50 + 'px';
    el.style.height = 60 + 'px';
    el.style.backgroundImage = 'url(src/svg/raw/home-pin.svg)';

    new mapboxgl.Marker(el, {offset: [-30, -90]})
    	.setLngLat(coordinates)
        .addTo(map);
}
*/

function addOverlay() {
	
	map.on('load', function () {

	    map.addSource("area", createGeoJSONCircle(homeCoordinates, 1.14))

		map.addLayer({
		    "id": "areaCircle",
		    "type": "fill",
		    "source": "area",
		    "layout": {},
		    "paint": {
		        "fill-color": primaryColor,
		        "fill-opacity": 0.08,
		        //"fill-antialias": true,
		        //"fill-outline-color": "red",
		        //"line-width": 2
		    }
		})

		$.getJSON("logs/sampleLog.geojson", function(data) { 
			
			routeDataSource = data
			
			addRouteToMap(data, map)
			getLogCount(data)

			addHomeIcon()
			addCatMarker()

			//getCatMarkerCoordinates(2)
			updateCatMarker()
			//measureDistance(data)
			//turf.lineDistance(lineString)
		});

		//addHomeIcon()
		//addCatMarker()
	})
}
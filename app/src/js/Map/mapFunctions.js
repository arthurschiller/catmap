import $ from "jquery";

var dataSetHelper = require("./dataHelper.js")

var darkGray = "#373D40",
	primaryColor = "#D8597F",
	secondaryColor = "#7D64FF"

var homeMarker = null
var catMarker = null

let routeSourceID = "routeSource"
let routeLayerID = "routeLayer"

let areaSourceID = "areaSource"
let areaLayerID = "areaLayer"

var currentDataSet = null

// ## create geoJSON Circle
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

// ## get total count of logs from dataset
function getLogCount(slider, data) {

	var times = data.features[0].properties.coordTimes

	logCount = times.length
	//console.log(logCount)
	slider.max = logCount
}

// ## draw stuff on map
function drawRouteOn(map, data) {

	map.addSource(routeSourceID, {
		"type": "geojson",
		"data": data,
	})

	map.addLayer({
		"id": routeLayerID,
		"type": "line",
		"source": routeSourceID,
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
	})
}

function drawRadiusCircle(map, center, radius) {

	map.addSource(areaSourceID, createGeoJSONCircle(center, radius))

	map.addLayer({
		"id": areaLayerID,
		"type": "fill",
		"source": areaSourceID,
		"layout": {},
		"paint": {
			"fill-color": primaryColor,
			"fill-opacity": 0.08,
			//"fill-antialias": true,
			//"fill-outline-color": "red",
			//"line-width": 2
		}
	})
}

function addHomeIcon(map, coordinates) {

	var el = document.createElement('div');
	el.className = 'home-marker';
	el.style.width = 50 + 'px';
	el.style.height = 60 + 'px';
	el.style.backgroundImage = 'url(src/svg/raw/home-pin.svg)';

	homeMarker = new mapboxgl.Marker(el, {offset: [-25, -60]})
		.setLngLat(coordinates)
		.addTo(map);
}

function addCatMarkerTo(map, data) {

	var el = document.createElement('div');
	el.className = 'cat-marker';
	el.style.width = 100 + 'px';
	el.style.height = 100 + 'px';

	let coordinates = dataSetHelper.getCatMarkerCoordinatesFor(0, data)[0]

	catMarker = new mapboxgl.Marker(el, {offset: [-50, -110]})
		.setLngLat(coordinates)
		.addTo(map);
}

function setSliderIndicatorPosition(slider, time) {

	let timeIndicator = $("#time-indicator"),
	offset = 17,
	trackWidth = $(slider).width() - offset * 2,
	value = slider.value,
	maxValue = slider.max

	let percentage = value / maxValue
	let computedPosition = -offset + (trackWidth * percentage)

	console.log(computedPosition)

	$(timeIndicator).text(time)
	$(timeIndicator).css("left", + computedPosition + "px")
}

function updateCatMarker(marker, slider) {
	
	slider.addEventListener('input', function(e) {

		let logValue = parseInt(e.target.value)
		let dataSet = dataSetHelper.getCatMarkerCoordinatesFor(logValue, currentDataSet)

		console.log(dataSet)

		let coordinates = dataSet[0],
		time = dataSet[1]

		console.log(time)

		setSliderIndicatorPosition(slider, time)

		// var oldIndex = 0

		// if (!logValue == 0) {
		// 	oldIndex = logValue - 1
		// }

		// console.log(oldIndex)
		// let oldCoordinates = dataSetHelper.getCatMarkerCoordinatesFor(oldIndex, currentDataSet)

		// map.flyTo({
		// 	center: coordinates,
		// 	zoom: cat.zoom,
		// })

		// console.log(Stringcoordinates)
		// console.log(oldCoordinates)

		marker.setLngLat(coordinates)
	});
}

// ## expose helper methods
module.exports = {

	extrudeBuildings: function(map) {

		map.addLayer({
			'id': '3d-buildings',
			'source': 'composite',
			'source-layer': 'building',
			'filter': ['==', 'extrude', 'true'],
			'type': 'fill-extrusion',
			'minzoom': 16,
			'paint': {
				'fill-extrusion-color': '#A79584',
				'fill-extrusion-height': {
					'type': 'identity',
					'property': 'height'
				},
				'fill-extrusion-base': {
					'type': 'identity',
					'property': 'min_height'
				},
				'fill-extrusion-opacity': .25
			}
		})
	},

	displayInitialData: function(map, slider, cat) {

		map.flyTo({
			zoom: cat.data.zoom,
			center: cat.homeCoordinates
		})
		
		console.log("Displaying data for cat " + cat.name)

		$.getJSON(cat.data.trackingData, function(data) {

			currentDataSet = data

			drawRouteOn(map, data)

			slider.max = dataSetHelper.getLogCountFor(data)

			addCatMarkerTo(map, data)
			updateCatMarker(catMarker, slider)
		});

		addHomeIcon(map, cat.homeCoordinates)
		drawRadiusCircle(map, cat.homeCoordinates, cat.data.radius)
	},

	switchData: function(map, slider, cat) {

		map.flyTo({
			zoom: cat.data.zoom,
			center: cat.homeCoordinates
		})

		console.log("Displaying data for cat " + cat.name)

		$.getJSON(cat.data.trackingData, function(data) {

			currentDataSet = data
			//console.log(data)

			map.getSource(routeSourceID).setData(data)

			slider.max = dataSetHelper.getLogCountFor(data)
			slider.value = 0

			let coordinates = dataSetHelper.getCatMarkerCoordinatesFor(0, data)[0]
			catMarker.setLngLat(coordinates)
		});

		homeMarker.setLngLat(cat.homeCoordinates)

		map.removeLayer(areaLayerID)
		map.removeSource(areaSourceID)
		drawRadiusCircle(map, cat.homeCoordinates, cat.data.radius)
	}
};
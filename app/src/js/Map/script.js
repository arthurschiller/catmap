import $ from "jquery";

// var datasources = require("./datasources.js");
var mapHelper = require("./mapFunctions.js");
var userInteractions = require("./uiInteractions.js");

document.addEventListener("DOMContentLoaded", function(event) {

	var initialCat = null
	var selectedCatString = null

	// cats
	var coco = require("./coco.js")
	var mio = require("./mio.js")

	// ## datasets
	let cocoDataSet = {
		zoom: 18,
		trackingData: "logs/cocoLog.geojson",
		date: "13.02.2017",
		startTime: "22:17",
		endTime: "07:27",
		speed: 0.3,
		radius: 0.10125,
		distance: 3.2,
		temperature: -1,
		weatherCondition: "Cloudy"
	}

	let mioDataSet = {
		zoom: 19,
		trackingData: "logs/mioLog_2.geojson",
		date: "21.02.2017",
		startTime: "22:52",
		endTime: "06:12",
		speed: 0.1,
		radius: 0.0475,
		distance: 1.3,
		temperature: 2,
		weatherCondition: "Cloudy"
	}

	coco.data = cocoDataSet
	mio.data = mioDataSet

	console.log(mio.data.trackingData)

	// ## general stuff related to the map and visual appearance
	var homeCoordinates = [13.651155, 52.37671]

	var slider = document.getElementById('time-slider'),
	map = null,
	mapSources = null,
	mapLayers = null,
	catMarker = null

	userInteractions.handleOverlayToggling()

	// ## setup map
	mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyc2NoaWxsZXIiLCJhIjoiY2l4cm1iamZxMDAzeDJxcmJhdG5sNGRkbCJ9.o1r2qoVtyIgFco7r5ErM2A'

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/arthurschiller/ciyu45zq6004v2rqmorg8phtj',//'mapbox://styles/mapbox/light-v9',
		center: homeCoordinates,
		minZoom: 13.5,
		zoom: 13.5,
		pitch: 50,
	});

	configure(map, homeCoordinates)

	setInitialCat(coco, function() {
		visualizeDataOn(map, slider, initialCat)
		setSliderIndicatorPosition()
	})

	$("#initial-overlay .cat-picker li").click(function() {

		$("body").removeClass("initial-overlay-open")
	})

	map.on('load', function() {

		console.log("Map finished loading.")
		$("body").addClass("finished-loading")

		// ## user interaction
		$("[data-cat-identifier]").click(function() {

			let catId = this.dataset.catIdentifier
			console.log(catId)

			if (catId == selectedCatString) {
				console.log("already selected")
				return
			}

			selectedCatString = catId

			$("[data-cat-identifier]").each(function() {
				$(this).removeClass("selected-cat")
			})

			$(this).addClass("selected-cat")
			
			switch (catId) {
				
				case "mio":
					console.log("switch to mio")
					mapHelper.switchData(map, slider, mio)
					userInteractions.switchUIFor(mio)
					break

				case "coco":
					console.log("switch to coco")
					mapHelper.switchData(map, slider, coco)
					userInteractions.switchUIFor(coco)
					break
			}

			$('#time-slider')[0].value = 0
			setSliderIndicatorPosition()
		})

		// setTimeout(function(){

		// 	mapHelper.switchData(map, slider, mio)

		// }, 2000);
	})

	function setInitialCat(cat, completion) {
		
		initialCat = cat
		selectedCatString = initialCat.name.toLowerCase()
		userInteractions.switchUIFor(cat)
		completion()
	}

	let someValue = 1.12356
	let otherValue = 1.123378

	console.log(String(someValue).substring(0, 5))
})

// ## functions
function configure(map, homeCoordinates) {

	map.on('load', function() {

		mapHelper.extrudeBuildings(map)
	})
}

function visualizeDataOn(map, slider, cat) {

	map.on('load', function() {

		mapHelper.displayInitialData(map, slider, cat)
	})
}

function setSliderIndicatorPosition() {

	let slider = $('#time-slider')[0],
	timeIndicator = $("#time-indicator"),
	offset = 17,
	trackWidth = $(slider).width() - offset * 2,
	value = slider.value,
	maxValue = slider.max

	let percentage = value / maxValue
	let computedPosition = -offset + (trackWidth * percentage)

	console.log(maxValue)

	$(timeIndicator).css("left", + computedPosition + "px")
}

window.onresize = function(event) {
	setSliderIndicatorPosition()
};

export default {
	
	name: 'Map',
	data() {
		return {}
	},
}
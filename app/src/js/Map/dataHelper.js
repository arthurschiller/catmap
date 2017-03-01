function getTimeAndDateFrom(string) {

	var date = new Date(string)

	var time = date.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"}),
	day = date.getDate(),
	month = date.getMonth() + 1

	return time
}

module.exports = {

	getCatMarkerCoordinatesFor: function(index, data) {

		let coordinatesDataSet = data.features[0].geometry.coordinates

		if (index >= coordinatesDataSet.length) {
			
			console.log("No coordinates for marker available.")
			let geoData = coordinatesDataSet[coordinatesDataSet.length - 1]
			let timeString = data.features[0].properties.coordTimes[coordinatesDataSet.length - 1]

			return [[geoData[0], geoData[1]], getTimeAndDateFrom(timeString)]
		}

		let geoData = coordinatesDataSet[index]
		let coordinates = [geoData[0], geoData[1]]

		let timeString = data.features[0].properties.coordTimes[index]

		//console.log("Coordinates: " + coordinates)

		return [coordinates, getTimeAndDateFrom(timeString)]
	},
	
	getLogCountFor: function(data) {

		var times = data.features[0].properties.coordTimes

		return times.length
	}
};
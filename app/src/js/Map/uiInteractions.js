import $ from "jquery";

module.exports = {

	handleOverlayToggling: function() {

		$("#info-overlay_toggle").click(function() {
			$("#info-overlay").toggleClass("info-overlay--visible")
		})
	},

	switchUIFor: function(cat) {

		let infoContainer = $("#info-overlay"),
		image = $(infoContainer).find('[data-cat-image]'),
		nameLabel = $(infoContainer).find('[data-cat-name]'),
		ageLabel = $(infoContainer).find('[data-cat-age] span'),
		weightLabel = $(infoContainer).find('[data-cat-weight] span'),
		foodLabel = $(infoContainer).find('[data-cat-food] span'),
		dateLabel = $(infoContainer).find('[data-cat-date] span'),
		timeframeLabel = $(infoContainer).find('[data-cat-timeframe] span'),
		distanceLabel = $(infoContainer).find('[data-cat-distance] span'),
		speedLabel = $(infoContainer).find('[data-cat-speed] span'),
		radiusLabel = $(infoContainer).find('[data-cat-radius] span')

		image.attr("src", cat.image)
		nameLabel.text(cat.name)
		ageLabel.text(cat.age)
		weightLabel.text(cat.weight + " kg")
		foodLabel.text(cat.food)
		dateLabel.text(cat.data.date)
		timeframeLabel.text(cat.data.startTime + " – " + cat.data.endTime)
		distanceLabel.text(cat.data.distance + "km")
		speedLabel.text(cat.data.speed + " km/h")
		radiusLabel.text(cat.data.radius + " km")

		let selectedCatImage = $("[data-selected-cat-image]")
		selectedCatImage.attr("src", cat.image)

		$("[data-cat-identifier=" + cat.name.toLowerCase() + "]").addClass("selected-cat")

		$("#startTime").text(cat.data.startTime)
		$("#endTime").text(cat.data.endTime)

		$("#time-indicator").text(cat.data.startTime)

		$("#weather span").text(cat.data.temperature + "°C, " + cat.data.weatherCondition )
	}
}
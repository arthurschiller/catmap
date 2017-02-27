import Vue from 'vue/dist/vue.common.js'
import AppComponent from './App/index.vue'
// mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyc2NoaWxsZXIiLCJhIjoiY2l4cm1iamZxMDAzeDJxcmJhdG5sNGRkbCJ9.o1r2qoVtyIgFco7r5ErM2A';
// // This adds the map to your page
// var map = new mapboxgl.Map({
//   // container id specified in the HTML
//   container: 'map',
//   // style URL
//   style: 'mapbox://styles/mapbox/light-v9',
//   // initial position in [long, lat] format
//   center: [-77.034084, 38.909671],
//   // initial zoom
//   zoom: 14
// });

// L.mapbox.accessToken = 'pk.eyJ1IjoiYXJ0aHVyc2NoaWxsZXIiLCJhIjoiQWgwZ2g0dyJ9.C-KqVAkPm2XBtoBL9eAonw';
// var map = L.mapbox.map('map', 'mapbox.streets')
//     .setView([40, -74.50], 9);

let viewModel = new Vue({
	el: '#app',
	components: {
		app: AppComponent,
	},
	render: h => h('app'),
})
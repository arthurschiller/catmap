import TopBar from '../topbar/index.vue'
import BottomBar from '../bottombar/index.vue'
import MapSection from '../map/index.vue'

export default {
	name: 'App',
	components: {
    	'topbar': TopBar,
    	'mapsection': MapSection,
    	'bottombar': BottomBar
  	},
	data() {
		return {}
	},
}
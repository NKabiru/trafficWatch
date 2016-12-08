
var config = {
    apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
    authDomain: "trafficwebapp.firebaseapp.com",
    databaseURL: "https://trafficwebapp.firebaseio.com",
    storageBucket: "trafficwebapp.appspot.com",
    messagingSenderId: "563780534539"
  };
  firebase.initializeApp(config);

// Get elements
var btnClearMarkers = document.getElementById('btnClearMarkers');
var selectMarkerType = document.getElementById('selectMarkerType');
var checkboxRoute = document.getElementById('routeCheckbox');
var checkboxTraffic = document.getElementById('trafficCheckbox');
var divLayerSelector = document.getElementById('layer-selector-control');
var divTextDirections = document.getElementById('directions-panel');
var inputDestination = document.getElementById('destination-input');
var divDirectionsSelector = document.getElementById('directions-selector');

var map;
var trafficLayer;


// Setting up the location to find the route marker icons
var iconBase = window.location.href.toString().split(window.location.pathname)[0];
var icon = {
	congestion: {
		icon: iconBase + "/images/congestionMarker.png"
	},
	accident: {
		icon: iconBase + "/images/accidentMarker.png"
	},
	floods: {
		icon: iconBase + "/images/floodsMarker.png"
	},
	police: {
		icon: iconBase + "/images/policeMarker.png"
	},
	roadworks: {
		icon: iconBase + "/images/roadworksMarker.png"
	}
};
var markers = {};
// console.log(icon);



function initMap()
{
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var directionsService = new google.maps.DirectionsService;
	// var destinationAutocomplete = new google.maps.places.Autocomplete(inputDestination, {componentRestrictions:{country: 'KE'} });
	
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 1, lng: 38},
		zoom: 15,
		mapTypeControl:false
	});

	// divDirectionsSelector.style.opacity = 0;
	// TODO: Add checkbox control to map to observe various layers
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(divLayerSelector);
	// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(divDirectionsSelector);

	// Get the browser's location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		map.setCenter(pos);
		console.log(pos);
		});

	}

	// Bind routing layer to checkbox
	
		
	
			// navigator.geolocation.getCurrentPosition(function(position){
			// 	var pos = {
			// 		lat: position.coords.latitude,
			// 		lng: position.coords.longitude
			// 	};
				
			// 	// Make destination input visible
			// 	// inputDestination.style.visibility = 'visible';
			// 	// divDirectionsSelector.style.opacity = 1;

			// 	// Listen for selected destination & determine route
			// 	// destinationAutocomplete.addListener('place_changed', function(){
			// 	// 	var place = destinationAutocomplete.getPlace();
			// 	// 	calculateAndDisplayRoute(directionsService, directionsDisplay, pos, place.place_id);
			// 	// });
		
			// });
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(divTextDirections);
		
			// // When unchecked, removes route, directions & textBox
			// inputDestination.style.visibility = 'hidden';
			// // divDirectionsSelector.style.opacity = 0;
			// directionsDisplay.setMap(null);
			// directionsDisplay.setPanel(null);
		
	

	// Bind traffic layer display to checkbox
	checkboxTraffic.addEventListener('change', function(){
	if (checkboxTraffic.checked) {
		// Generate traffic layer which refreshes every 10 min
		trafficLayer = new google.maps.TrafficLayer();
		setInterval(trafficLayer.setMap(map), 600000);
		} else {
			trafficLayer.setMap(null);
		}
	});

	// Generating marker based on traffic alert
	setInterval(firebaseOperation(map), 3600000);
		
}



// Call the marker data from firebase
function firebaseOperation (map){
	firebase.database().ref('markers').on('value', snap =>{

		// Loop over each marker
		snap.forEach(childSnap =>{
			var childKey = childSnap.key;
			var childData = childSnap.val();
			var date = +new Date();

			// TODO: make marker persist for only 1 hour after creation
			if (childData.roadState == 'clear') {
				return;

				}else if ((childData.timestamp + 3600000) >= date) {
					console.log((childData.timestamp + 3600000) < date);
					var marker = new google.maps.Marker({
						map: map,
						animation: google.maps.Animation.DROP,
						position: childData.position,
						icon: icon[childData.roadState].icon,
						title: childData.roadState
					});

					// setTimeout(() => {
					// 	marker.setMap(null);
					// 	delete marker;
					// }, 3600000);
				}	

		});


	});

}

function calculateAndDisplayRoute(directionsService, directionsDisplay , position, place){
	// Test value: {lat:-1.284863, lng: 36.825575}
		directionsService.route({
			origin: position,
			destination: {'placeId': place},
			travelMode: 'DRIVING',
			provideRouteAlternatives: true,
			drivingOptions: {
				departureTime: new Date(),
				trafficModel: 'optimistic'
			}
		}, function(response, status){
			if (status == 'OK') {
				directionsDisplay.setDirections(response);
			}else {
				console.log('Error: '+ status);
		}
	});

	
}

var config = {
    apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
    authDomain: "trafficwebapp.firebaseapp.com",
    databaseURL: "https://trafficwebapp.firebaseio.com",
    storageBucket: "trafficwebapp.appspot.com",
    messagingSenderId: "563780534539"
  };
  firebase.initializeApp(config);

// Add side-nav to mobile screens
 $(".button-collapse").sideNav({
 	menuWidth: 240
 });
 $('#directions-modal').modal();

// Get elements
var btnClearMarkers = document.getElementById('btnClearMarkers');
var selectMarkerType = document.getElementById('selectMarkerType');
var checkboxRoute = document.getElementById('routeCheckbox');
var checkboxTraffic = document.getElementById('trafficCheckbox');
var divLayerSelector = document.getElementById('layer-selector-control');
var divTextDirections = document.getElementById('directions-panel');
var inputDestination = document.getElementById('destination-input');
var divDirectionsSelector = document.getElementById('directions-selector');
var divDirectionsButton = document.getElementById('show-directions-control');
var btnShowDirections = document.getElementById('btnDirections');

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

// Capitalize the first Letter
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

// Create map
function initMap()
{
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var directionsService = new google.maps.DirectionsService;
	var destinationAutocomplete = new google.maps.places.Autocomplete(inputDestination, {componentRestrictions:{country: 'KE'} });
	
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 1, lng: 38},
		zoom: 15,
		mapTypeControl:false
	});

	// Set position of controls on the map
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(divLayerSelector);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(divDirectionsSelector);
	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(divDirectionsButton);

	// Get the browser's location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		map.setCenter(pos);
		var userMarker = new google.maps.Marker({
			position: pos,
			map: map,
			icon: iconBase + '/images/userMarker.png'
		});

		}, e => console.log("Position unavailable."), {enableHighAccuracy: true});

	}	
			
	navigator.geolocation.getCurrentPosition(function(position){
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		// Listen for selected destination & determine route
		destinationAutocomplete.addListener('place_changed', function(){
			var place = destinationAutocomplete.getPlace();
			calculateAndDisplayRoute(directionsService, directionsDisplay, pos, place.place_id);
		});
	});

		directionsDisplay.setMap(map);

		btnShowDirections.addEventListener('click', () => {
			directionsDisplay.setPanel(divTextDirections);
		});
		

	// Set traffic layer 
	trafficLayer = new google.maps.TrafficLayer();
	setInterval(trafficLayer.setMap(map), 600000);

	// Bind traffic layer display to checkbox
	checkboxTraffic.addEventListener('change', function(){
	if (checkboxTraffic.checked) {
		// Generate traffic layer which refreshes every 10 min
		trafficLayer.setMap(null);
		} else {	
			trafficLayer = new google.maps.TrafficLayer();
			setInterval(trafficLayer.setMap(map), 600000);
		}
	});

	// Generating marker based on traffic alert
	firebaseOperation(map);
		
}


// Call the marker data from firebase
function firebaseOperation (map){
	var infowindow = new google.maps.InfoWindow();

	firebase.database().ref('markers').on('value', snap =>{

		// Loop over each marker
		snap.forEach(childSnap =>{
			var childKey = childSnap.key;
			var childData = childSnap.val();
			var date = +new Date();

			var contentString  =
			'<div id="marker content">'+
			'<div>'+
			'<h6>' + childData.roadName + '</h6>'+
			'<em>['+ childData.roadState.capitalize() + ']</em>'+
			'<p>' + childData.roadDetails + '</p>'+
			'</div>'+
			'</div>';

			// TODO: make marker persist for only 1 hour after creation
			if (childData.roadState == 'clear') {
				return;

				}else {
					
					var marker = new google.maps.Marker({
						map: map,
						animation: google.maps.Animation.DROP,
						position: childData.position,
						icon: icon[childData.roadState].icon
					});

					marker.addListener('click', () => {
						infowindow.setContent(contentString);
						infowindow.open(map, marker);
					});

					// Remove marker if it is older than 1 hour
					if (childData.timestamp <= (Date.now() - 3600000)) {
						marker.setMap(null);
					}
				}	
		});
	});


	// Delete marker if it is older than 1 hour
	// var cutoff = Date.now() - 3600000;

	// firebase.database().ref('markers').orderByChild('timestamp').endAt(cutoff).limitToLast(1).on('child_added', snap => {
	// 	snap.ref.remove();
	// });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, position, place){
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
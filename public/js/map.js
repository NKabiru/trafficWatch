
var config = {
    apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
    authDomain: "trafficwebapp.firebaseapp.com",
    databaseURL: "https://trafficwebapp.firebaseio.com",
    storageBucket: "trafficwebapp.appspot.com",
    messagingSenderId: "563780534539"
  };
  firebase.initializeApp(config);


var btnClearMarkers = document.getElementById('btnClearMarkers');
var selectMarkerType = document.getElementById('selectMarkerType');

var iconBase = window.location.href.toString().split(window.location.pathname)[0];
var icon = {
	default: {
		icon: null
	},
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
	
	var map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 1, lng: 38},
		zoom: 15,
	});

	// TODO: Add checkbox control to map to observe various layers

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		map.setCenter(pos);
		console.log(pos);
		calculateAndDisplayRoute(directionsService, directionsDisplay, pos);
		});

	}
	// Generate traffic layer
	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);

	// Generating marker based on traffic alert
	firebaseOperation(map);
	// Getting position from local scope
	var userPos = {lat:map.getCenter().lat(), lng:map.getCenter().lng()};

	console.log(userPos);
	// Generate directions
	directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay, userPos);


	
}

// Call the marker data from firebase
function firebaseOperation (map){
	firebase.database().ref('markers').on('value', snap =>{

		// Loop over each marker
		snap.forEach(childSnap =>{
			var childKey = childSnap.key;
			var childData = childSnap.val();

			var marker = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				position: childData.position,
				icon: icon[childData.roadState].icon
			});


		});


	});

}

function calculateAndDisplayRoute(directionsService, directionsDisplay , position){
	// TODO: add options for alternate routes, add placeId addresses, convert pos using toUrlValue()
		// calculate route then
		directionsService.route({
			origin: position,
			destination: {lat:-1.284863, lng: 36.825575},
			travelMode: 'DRIVING'
			// drivingOptions: {
			// 	departureTime: new Date(),
			// 	trafficModel: 'pessimistic'
			// }
		}, function(response, status){
			if (status == 'OK') {
				directionsDisplay.setDirections(response);
			}else {
				console.log('Error: '+ status);
		}
	});

	
}
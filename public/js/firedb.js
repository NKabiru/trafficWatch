(function() {
	var config = {
    apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
    authDomain: "trafficwebapp.firebaseapp.com",
    databaseURL: "https://trafficwebapp.firebaseio.com",
    storageBucket: "trafficwebapp.appspot.com",
    messagingSenderId: "563780534539"
  };
  firebase.initializeApp(config);

  // Get elements
  var roadNameInput = document.getElementById('road-title');
  var roadDetailsInput = document.getElementById('road-details');
  var addAlertButton = document.getElementById('add-alert');
  var alertsTable =  document.getElementById('alerts-table-results');
  var addMarkerButton = document.getElementById('add-marker');
  var roadStateOptions = document.getElementById('road-state');
  var checkboxMarker = document.getElementById('road-marker');
  var spanAccountUsername = document.getElementById('account-username');

  // TODO: using the onAuthStateChanged listener later on
  var user;

  // Adding autocomplete to the road Title textbox
  var roadAutoComplete = new google.maps.places.Autocomplete(roadNameInput, {componentRestrictions:{country: 'KE'} });


  /*FUNCTIONS*/
  // Showing the user that is logged in
  function displayUsername(name) {
    var el = document.createElement('em');
    el.innerText = name;
    spanAccountUsername.insertBefore(el ,btnSignOut);
    btnSignOut.style.visibility = 'visible';
  }

  // Adding new alert to db
  function writeNewAlert(uid, username, roadTitle, roadDetails, roadState){
     
    var alertData = {
      author: username,
      uid: uid,
      roadName: roadTitle,
      roadDetails: roadDetails,
      roadState: roadState,
      timestamp: +new Date()
    }; 

    // Get a new key for every alert
    var newAlertKey = firebase.database().ref().child('alerts').push().key;

    // Write the new data simultaneously in the alerts and user-alerts lists
    var updates = {};
    updates['/alerts/' + newAlertKey] = alertData;
    updates['/user-alerts/' + uid + '/' + newAlertKey] = alertData;

    return firebase.database().ref().update(updates);
  }

  // Adding new marker to db
  function writeNewMarker(uid, username, roadTitle, roadDetails, roadState, latlng){

    var markerData = {
      author: username,
      uid: uid,
      roadName: roadTitle,
      roadDetails: roadDetails,
      roadState: roadState,
      position: latlng,
      timestamp: +new Date()
    };

    var newMarkerKey = firebase.database().ref().child('markers').push().key;

    var updates = {};
    updates['/markers/' + newMarkerKey] = markerData;
    updates['/user-markers/' + uid + '/' + newMarkerKey] = markerData;

    return firebase.database().ref().update(updates);
  }



    // Checks if a user is signed in 
  firebase.auth().onAuthStateChanged(firebaseUser =>{
    if (firebaseUser) {
      displayUsername(firebaseUser.displayName);
      user = firebaseUser;
    } else {
      var el = document.createElement('em');
      el.innerText = 'Not signed in';
      spanAccountUsername.insertBefore(el, btnSignOut);
    }
  });
  
  // Sync changes
  firebase.database().ref().child('alerts').on('child_added', snap => {

  	var tr = document.createElement('tr');
  	var td = document.createElement('td');
  	
    // TODO: Fix presentation of alerts
  	var objReturned = snap.val();
  	td.innerHTML = "<b>" + objReturned.road + ":</b> " + objReturned.details ;

  	alertsTable.appendChild(tr);
  	tr.appendChild(td);

  });

  // Add firebase reference, if checkbox is true, save alerts details as marker arguments also
  addAlertButton.addEventListener('click', snap => {
    if (checkboxMarker.checked) {
      writeNewAlert(user.uid, user.displayName, roadNameInput.value, roadDetailsInput.value, roadStateOptions.value);

      var placeLatLng = {
        lat: roadAutoComplete.getPlace().geometry.location.lat(),
        lng: roadAutoComplete.getPlace().geometry.location.lng(),
      };
      console.log(placeLatLng);
      writeNewMarker(user.uid, user.displayName, roadNameInput.value, roadDetailsInput.value, roadStateOptions.value, placeLatLng);
    } else {
      writeNewAlert(user.uid, user.displayName, roadNameInput.value, roadDetailsInput.value, roadStateOptions.value);
    }
    roadNameInput.value = "";
    roadDetailsInput.value = "";
  });

  // Sign out current user
  btnSignOut.addEventListener('click', function(){
  firebase.auth().signOut().then( function(){
    // Successful signout
    console.log('Logout Successful');
    window.location = 'index.html';
  }, function(error){
    // Unsuccessful signout
    console.log(error.code +":"+ error.message);
  });
});


}());
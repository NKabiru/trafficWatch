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
  var accountUsername = document.getElementById('account-username');
  var divAlertContainer = document.getElementsByClassName('container')[0];
  var btnCloseForm = document.getElementById('close-alertForm');
  var sectionAlertForm = document.getElementById('hide-panel');
  var btnShowForm = document.getElementById('show-alertform');

  var mobileBtnSignOut = document.getElementById('mobile-btnSignOut');
  var mobileAccountUsername = document.getElementById('mobile-account-username');


  // TODO: using the onAuthStateChanged listener later on
  var user;

  // Adding autocomplete to the road Title textbox
  var roadAutoComplete = new google.maps.places.Autocomplete(roadNameInput, {componentRestrictions:{country: 'KE'} });


  /*FUNCTIONS*/

  // Capitalize the first Letter
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }


  // Showing the user that is logged in
  function displayUsername(name) {
    var el = document.createTextNode(name);
    accountUsername.appendChild(el);
    mobileAccountUsername.appendChild(el.cloneNode(true));
    btnSignOut.style.display = 'initial';
    mobileBtnSignOut.style.display = 'initial';
  }

  // Adding new alert to db
  function writeNewAlert(uid, username, roadTitle, roadDetails, roadState){
     
    var alertData = {
      author: username,
      uid: uid,
      roadName: roadTitle,
      roadDetails: roadDetails,
      roadState: roadState,
      timestamp: +new Date(),
      ".priority":  0 - +new Date()
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

  /*NORMAL EXECUTION CODE*/
  // Checks if a user is signed in 
  firebase.auth().onAuthStateChanged(firebaseUser =>{
    if (firebaseUser) {
      displayUsername(firebaseUser.displayName);
      user = firebaseUser;
    } else {
      mobileBtnSignOut.style.display = 'none';
      mobileAccountUsername.style.display = 'none';
      btnSignOut.style.display = 'none';
      accountUsername.style.display = 'none';
    }
  });
  
  // Sync changes
  firebase.database().ref('alerts').startAt().limitToFirst(15).on('child_added', snap => {

    var alertObject = snap.val();

    // Pretty-print some of the data stored
    var prettyRoadState = alertObject.roadState.capitalize();
    var date = new Date(alertObject.timestamp);
    var prettyTimestamp = ("0" + date.getDate()).slice(-2) + "/" + ("0"+(date.getMonth()+1)).slice(-2) + "/" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);


    // <div class="card-panel">
    //   <div class="card-content">
    //     <div class="cyan-text">Card Title<span class="right">Status</span></div>

    //     <div>Lorem ipsum</div>

    //     <div><span class="right">Author &emsp; 12.34pm</span></div>
    //   </div>
    // </div>


    var html = 
    '<div class="card-panel" id="alert-'+ snap.key +'">'+
    '<div class="card-content">' +
    '<div class="cyan-text"><b>'+ alertObject.roadName  +'</b><span class="right">&nbsp; Event: '+ prettyRoadState +'</span></div>'+
    '<div>'+ alertObject.roadDetails +'</div>'+
    '<div class="alert-footer"><span class="right details">'+ alertObject.author +' &emsp; '+ prettyTimestamp +'</span></div>'+
    '</div>'+
    '</div>';
  	
    // TODO: Fix presentation of alerts
  	divAlertContainer.insertAdjacentHTML('beforeend', html);

  });

  btnShowForm.addEventListener('click', () => {
    sectionAlertForm.style.display = 'block';
  });

  // If close icon clicked, set display to none.
  btnCloseForm.addEventListener('click', () => {
    sectionAlertForm.style.display = 'none';
  });

  // Add firebase reference, if checkbox is true, save alerts details as marker arguments also
  addAlertButton.addEventListener('click', () => {
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
    location.reload();
    sectionAlertForm.style.display = 'none';
    roadNameInput.value = "";
    roadDetailsInput.value = "";
  });

  // Sign out current user
  mobileBtnSignOut.addEventListener('click', function(){
  firebase.auth().signOut().then( function(){
    // Successful signout
    console.log('Logout Successful');
    window.location = 'index.html';
  }, function(error){
    // Unsuccessful signout
    console.log(error.code +":"+ error.message);
  });
});

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
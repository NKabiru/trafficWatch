// Initialize firebase
var config = {
  apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
  authDomain: "trafficwebapp.firebaseapp.com",
  databaseURL: "https://trafficwebapp.firebaseio.com",
  storageBucket: "trafficwebapp.appspot.com",
  messagingSenderId: "563780534539"
};
firebase.initializeApp(config);

// Global variable to store the user's unique ID
var userID;

// Get elements
var btnSignOut = document.getElementById('btnSignOut');
var btnSignIn = document.getElementById('btnSignIn');
var signInEmail = document.getElementById('signin-email');
var signInPassword = document.getElementById('signin-password');
var spanAccountUsername = document.getElementById('account-username');

// Check if the logged in user has admin privilege
function checkIfAdmin(userId){
  firebase.database().ref('users/' + userId).once('value', snap => {
    if(snap.val().isAdmin == true){
      window.location = 'dashboard.html';
    } else {
      // TODO: Redirect user away from dashboard
      window.alert("You are not admin!");
      firebase.auth().signOut().then(function(){
        window.location = 'index.html';
      });

    }
  });
}

// Display the username on the page after sign in
function displayUsername(name) {
  var el = document.createElement('em');
  el.innerText = name;
  spanAccountUsername.insertBefore(el ,btnSignOut);
} 

// Listen for changes in authentication state
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      userID = firebaseUser.uid;
      checkIfAdmin(userID);
      btnSignOut.style.visibility = 'visible';    
      displayUsername(firebaseUser.displayName);
      
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
    }
  });

// Bind sign-in event
btnSignIn.addEventListener('click', function(){
  var loginEmail = signInEmail.value;
  var loginPass =  signInPassword.value;
  firebase.auth().signInWithEmailAndPassword(loginEmail, loginPass).catch(e =>{
    console.log(e.code +":"+ e.message);
});
// Clear sign-in form values
signInPassword.value = "";
signInEmail.value = "";
});

// Bind sign-out event
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
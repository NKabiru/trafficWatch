(function() {
  var config = {
    apiKey: "AIzaSyAd-sKH5USIlYL7-GWzP7g8EPMyE3PF17o",
    authDomain: "trafficwebapp.firebaseapp.com",
    databaseURL: "https://trafficwebapp.firebaseio.com",
    storageBucket: "trafficwebapp.appspot.com",
    messagingSenderId: "563780534539"
  };
  firebase.initializeApp(config);

  // Elements of sign-up page
  var inputUsername = document.getElementById('username');
  var inputEmail = document.getElementById('email');
  var inputPassword = document.getElementById('password');
  var btnSignUp = document.getElementById('btnSignUp');
  
  var accountUsername = document.getElementById('account-username');

  // Elements of sign-in page
  var btnSignOut = document.getElementById('btnSignOut');
  var btnSignIn = document.getElementById('btnSignIn');
  var signInEmail = document.getElementById('signin-email');
  var signInPassword = document.getElementById('signin-password');

  // Global variables
  var username;
  var signInClicked = false;

 

  // Add user to database
  function writeUserData (userId, name, email) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email : email,
      isAdmin: false
    });
  }

  // Signing-in users
  function signInUser () {
      btnSignIn.addEventListener('click', function(){
      var loginEmail = signInEmail.value;
      var loginPass =  signInPassword.value;
      firebase.auth().signInWithEmailAndPassword(loginEmail, loginPass).catch(e =>window.alert(e.message));
      // Clear sign-in form values
      signInPassword.value = "";
      signInEmail.value = "";
      signInClicked = true;
    });
  }

  // Signing up new users
  function signUpUser () {  
    // Bind sign-up event
    btnSignUp.addEventListener('click', e => {
      var email = inputEmail.value;
      var pass = inputPassword.value;
      username = inputUsername.value;
      var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
      promise.catch(e => window.alert(e.message));

      // Clear sign-up form values
      inputUsername.value = "";
      inputEmail.value = "";
      inputPassword.value = "";
    });
  }

  function displayUsername(name) {
    var el = document.createTextNode(name);
    accountUsername.appendChild(el);
    btnSignOut.style.visibility = 'visible';
  }

  var currentUID;

  // Listen to the authentication state
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      currentUID = firebaseUser.uid;      
      firebaseUser.updateProfile({displayName: username});

      // Check if the sign-in button was clicked. If not, it assumes the sign-up button was clicked.
      if(signInClicked != true){
        writeUserData(currentUID, username, firebaseUser.email);
        displayUsername(username);
      } else {
        displayUsername(firebaseUser.displayName);
        window.location = 'index.html';
      }

      console.log(firebaseUser);
    } else {
      console.log('not logged in');

    }
  });

  // Choosing which pages load which functions
  switch(document.location.pathname) {
    case '/signin.html':
      signInUser();
      break;
    case '/signup.html':
      signUpUser();
      break;

  }

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
  
}());
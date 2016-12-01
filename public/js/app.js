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
  
  var spanAccountUsername = document.getElementById('account-username');

  // Elements of sign-in page
  var btnSignOut = document.getElementById('btnSignOut');
  var btnSignIn = document.getElementById('btnSignIn');
  var signInEmail = document.getElementById('signin-email');
  var signInPassword = document.getElementById('signin-password');

  // Global variable to store username
  var username;

  // Choosing which pages load which functions
  switch(document.location.pathname) {
    case '/index.html':
      break;
    case '/signin.html':
      signInUser();
      break;
    case '/signup.html':
      signUpUser();
      var user = function (){
        writeUserData(currentUID, username, firebaseUser.email);
        firebaseUser.updateProfile({
        displayName: username
      });
      }
      break;

  }

  // Adding users to firebase
  // var userRefObj = firebase.database().ref().child('users');
  // userRefObj.on()


  // Add user to database
  function writeUserData (userId, name, email) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email : email,
    });
  }

  function signUpUser () {  
    // Bind sign-up event
    btnSignUp.addEventListener('click', e => {
      var email = inputEmail.value;
      var pass = inputPassword.value;
      username = inputUsername.value;
      var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.code +":"+ e.message));

      writeUserData(currentUID, username, firebaseUser.email);
      firebaseUser.updateProfile({
        displayName: username
      });
      // Clear sign-up form values
      inputUsername.value = "";
      inputEmail.value = "";
      inputPassword.value = "";
    });
  }

  function signInUser () {
      btnSignIn.addEventListener('click', function(){
      var loginEmail = signInEmail.value;
      var loginPass =  signInPassword.value;
      firebase.auth().signInWithEmailAndPassword(loginEmail, loginPass).catch(e =>{
        console.log(e.code +":"+ e.message);
        signInPassword.value = "";
        signInEmail.value = "";
      });
    });
  }

  function displayUsername(name) {
    var el = document.createElement('em');
    el.innerText = name;
    spanAccountUsername.insertBefore(el ,btnSignOut);
  }

  var currentUID;

  // Add listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      currentUID = firebaseUser.uid;
      displayUsername(firebaseUser.displayName);
      btnSignOut.style.visibility = "visible";
      console.log(firebaseUser);
    } else {
      console.log('not logged in');

    }
  });




  // TODO: Binding buttons


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
var userID;

// Get elements
var btnSignOut = document.getElementById('btnSignOut');
var accountUsername = document.getElementById('account-username');
var accountStuff = document.getElementsByClassName('account');

// Make sign up and sign in disappear
function accountDetails(){
  for(var i = 0; i < accountStuff.length; i++){
    accountStuff[i].style.visibility = 'hidden';
  }
}

// Showing the user that is logged in
function displayUsername(name) {
  var el = document.createTextNode(name);
  accountUsername.appendChild(el);
  btnSignOut.style.visibility = 'visible';
}

// Listen for changes in authentication state
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      userID = firebaseUser.uid;
      accountDetails();
      displayUsername(firebaseUser.displayName);
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
      btnSignOut.style.visibility = 'hidden';
      document.getElementById('account-username').style.visibility = 'hidden';
    }
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
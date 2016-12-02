var userID;

// Get elements
var btnSignOut = document.getElementById('btnSignOut');

// Listen for changes in authentication state
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      userID = firebaseUser.uid;
      btnSignOut.style.visibility = 'visible';
      console.log(firebaseUser);
    } else {
      console.log('not logged in');

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
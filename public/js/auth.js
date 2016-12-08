var userID;

// Get elements
var btnSignOut = document.getElementById('btnSignOut');
var accountUsername = document.getElementById('account-username');
var accountStuff = document.getElementsByClassName('account');
var mobileBtnSignOut = document.getElementById('mobile-btnSignOut');
var mobileAccountUsername = document.getElementById('mobile-account-username');

// Make sign up and sign in disappear
function accountDetails(){
  for(var i = 0; i < accountStuff.length; i++){
    accountStuff[i].style.display = 'none';
  }
}

// Showing the user that is logged in
function displayUsername(name) {
  var el = document.createTextNode(name);  
  mobileAccountUsername.appendChild(el);
  accountUsername.appendChild(el.cloneNode(true));
  mobileBtnSignOut.style.display = 'initial';
  btnSignOut.style.display = 'initial';
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
      btnSignOut.style.display = 'none';
      mobileBtnSignOut.style.display = 'none';
      mobileAccountUsername.style.display = 'none';
      accountUsername.style.display= 'none';
    }
  });

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


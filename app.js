// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDM1QlyiKvlZB6vCWI2FjaQDx7886rZfPg",
    authDomain: "js-assign12-chatapp.firebaseapp.com",
    databaseURL: "https://js-assign12-chatapp.firebaseio.com",
    projectId: "js-assign12-chatapp",
    storageBucket: "js-assign12-chatapp.appspot.com",
    messagingSenderId: "208008471201",
    appId: "1:208008471201:web:70edad883b14bd2527c6e0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // ---------------------------------------------
  
  const imgProfile = document.getElementById('imgProfile');
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const pass = document.getElementById('pass');
  let db = firebase.database().ref('User');
  
  let googleSignin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function (result) {
        window.location.replace('chat.html');
      })
      .catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }
  
  let signout = () => {
    firebase.auth().signOut()
      .then(function () {
        window.location.replace('index.html');
      })
      .catch(function (error) {
        alert(error);
      });
  }
  
  function onAuthStateChanged() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {      
        let key = db.push().key;
        var userData = {
          email: firebase.auth().currentUser.email,
          displayName: firebase.auth().currentUser.displayName,
          photo: firebase.auth().currentUser.photoURL,
          key: key
        };
  
        var flag = false;
        db.on('value', function (user) {
          user.forEach(function (data) {
            let userEmail = data.val();
            if (userData.email === userEmail.email) {
              flag = true;
            }
          })
          if (flag === false) {
            db.child(key).set(userData);
          }
          else {
            imgProfile.src = firebase.auth().currentUser.photoURL;
            username.innerHTML = firebase.auth().currentUser.displayName;
          }
        })
  
      } else {
        imgProfile.src = 'img/userIcon.png';
        username.innerHTML = '';
      }
    });
  }
  onAuthStateChanged();

//////////////////////////////////////////////////
var input = document.getElementById('input');
var sentMessage = document.getElementById('sentMessage');
var receivedMessage = document.getElementById('receivedMessage');
var body = document.getElementById('body');

$(document).ready(function(){
    $("#exampleModal").modal('show');
});

function onkeyPress(){
    document.addEventListener('keydown',key =>{
        if(key.which === 13){
            sentFunction();
        }
    })    
}
let sentFunction = () => {
    //for p tag and its text
    var li = document.createElement('li');
    var liText = document.createTextNode(input.value);
    li.setAttribute('class', 'sent')
    li.appendChild(liText);
    sentMessage.appendChild(li);    
    input.value = "";
    input.focus();
    body.scrollTo(0,body.clientHeight);


    // let usermsg = {
    //     idkey:userData.key()
    // }
}

//////////////////////////////////////////////////////////
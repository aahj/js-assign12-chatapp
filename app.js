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
//*********************************************************************************************

const imgProfile = document.getElementById('imgProfile');
const username = document.getElementById('username');
const email = document.getElementById('email');
const pass = document.getElementById('pass');
let db = firebase.database().ref('User');
var receivedMessage = document.getElementById('receivedMessage');
var sentMessage = document.getElementById('sentMessage');
var exampleModal = document.getElementById('exampleModal');
var friendList = document.getElementById('friendList');
var input = document.getElementById('input');
var body = document.getElementById('body');
let currentuserKey = '';
let chatKey = '';

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
      var key = db.push().key;
      var userData = {
        email: firebase.auth().currentUser.email,
        displayName: firebase.auth().currentUser.displayName,
        photo: firebase.auth().currentUser.photoURL,
        key: key
      };

      var flag = false;
      db.on('value', function (user) {
        user.forEach(function (data) {
          var user = data.val();
          if (userData.email === user.email) {
            currentuserKey = user.key;
            flag = true;
          }
        })
        if (flag === false) {
          db.child(key).set(userData);
        }
        else {
          return;
        }
      })

    } else {
      imgProfile.src = 'img/userIcon.png';
      username.innerHTML = '';
    }
  });
}
onAuthStateChanged();

//*********************************************************************************************

$(document).ready(function () {
  $("#exampleModal").modal('show');
});

function initiate_chat(frndKey, frndName, frndPic) {
  var frndDB = firebase.database().ref('FriendData');
  var frnd_data = {
    frndId: frndKey,
    activeUser: currentuserKey
  }
  var flag = false;
  frndDB.on('value', function (frnds) {
    frnds.forEach(function (data) {
      var user = data.val();
      if (user.frndId === frnd_data.frndId && user.activeUser === frnd_data.activeUser || user.frndId === frnd_data.activeUser && user.activeUser === frnd_data.frndId) {
        flag = true;
        chatKey = data.key;
      }
    })
    if (flag === false) {
      chatKey = frndDB.push(frnd_data, function (error) {
        if (error) alert(error);
      }).getKey();
    }
    imgProfile.src = frndPic;
    username.innerHTML = frndName;
  })

}

function populateFriend() {
  var lists = '';
  var key = db.push().key;
  var flag = false;
  db.on('value', function (users) {

    users.forEach(function (data) {
      var user = data.val();
      if (user.email !== firebase.auth().currentUser.email) {
        lists += ` <li class="list-group-item list-group-item-action" data-dismiss="modal" onclick="initiate_chat('${data.key}','${user.displayName}','${user.photo}')">
        <div class="row">
            <div class="col-md-2">
                <img src="${user.photo}" alt="" class="rounded-circle" width="50px"
                    height="50px">
            </div>
            <div class="col-md-10" style="cursor: pointer;">
                <p class="frnd-username">${user.displayName}</p>
            </div>
        </div>
    </li>`;
      }
    })
    friendList.innerHTML += lists;
  })

}

function onkeyPress() {
  document.addEventListener('keydown', key => {
    if (key.which === 13) {
      sentFunction();
    }
  })
}
let sentFunction = () => {
  var chatting = {
    msg: input.value
  }
  firebase.database().ref('Chat Messages').child(chatKey).push(chatting);

  //for p tag and its text
  var li = document.createElement('li');
  var liText = document.createTextNode(input.value);
  li.setAttribute('class', 'sent')
  li.appendChild(liText);
  sentMessage.appendChild(li);
  input.value = "";
  input.focus();
  body.scrollTo(0, body.clientHeight);
}
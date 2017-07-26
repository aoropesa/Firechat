
var config = {
  apiKey: "AIzaSyCxZ-qJG6O2hdB9nFbCkL-gQSZdOnhoMPs",
  authDomain: "firechat-c578b.firebaseapp.com",
  databaseURL: "https://firechat-c578b.firebaseio.com",
  projectId: "firechat-c578b",
  storageBucket: "firechat-c578b.appspot.com",
  messagingSenderId: "196201020797"
};

var userdata = '';

firebase.initializeApp(config);

document.getElementById('login').addEventListener('click',function(){
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    userdata = result.user;
    console.log(userdata);
    localStorage.setItem('user',JSON.stringify(userdata));

    document.getElementById('container').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'block';

    var title = document.getElementById('initial');
    title.innerHTML = '<span class="ion-arrow-left-b"></span><h3 class="title">'+ userdata.displayName +'</h3>';
    LoadMessages(userdata);
    loadChat();
    $('#message-input').focus();
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    alert('Error login in');
    console.log(error);
    // ...
  });
});

$('#message-input').keydown(function (e){
    if(e.keyCode == 13){
        SendMSG();
    }
})

document.getElementById('send-message').addEventListener('click', SendMSG);

function SendMSG(){
  firebase.database().ref().push({
    id: userdata.uid,
    username: userdata.displayName ,
    photo: userdata.photoURL,
    message: document.getElementById('message-input').value,
    time: JSON.stringify(new Date())
  })
  .then(res=>{
    console.log(res);
  });
  $('#message-input').val('');
  $('#message-input').focus();
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}


var LoadMessages = userdata => {
  if(userdata){
    firebase.database().ref().on("value", function(snapshot){
      //console.log(snapshot.val());
      var msgDiv = document.getElementById('messages');
      var messages = snapshot.val();
      var appendstr = '';
      for(k in messages){
        appendstr+=`<div class="result ${messages[k].username === userdata.displayName ? 'right' : 'left'}">
          <div class="allresult">
            <img class='img' src=${messages[k].photo}>
            <p class="time">${prettytime(messages[k].time)}</p>
          </div>
          <div class="text">
            <h3 class="msg">${messages[k].message}</h3>
          </div>
          </div>`

      }
      msgDiv.innerHTML = appendstr;
      document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
  };
};

function loadChat() {
    var winH = window.innerHeight;
    var topH = document.getElementById('initial').offsetHeight;
    var bottomH = document.getElementById('send').offsetHeight;
    document.getElementById('messages').style.height = winH - (topH + bottomH) + 'px';
  //  console.log( winH, topH, bottomH);
}
function prettytime(t){
  if(t){
    var time = new Date(JSON.parse(t));
    console.log(time);
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var f = h > 12 ? 'pm' : 'am';

    h = h > 12 ? h%12 : h;

    return h + ":" + m + f;
  }
  return '';
}

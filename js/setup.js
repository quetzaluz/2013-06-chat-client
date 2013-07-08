$(document).ready(function () {
  fetch();
  $('#usernameField').val(getUsername());
  msgIntervalID = setInterval(function () {
    fetch(lastTime);
  }, 3000);

  $('#usernameSubmit').on('click', function(e) {
    window.location.search = 'username=' + $('#usernameField').val();
  });

  $('#textSubmit').on('click', function (e) {
    e.preventDefault();
    msg = $('#msgField').val();
    send(msg);
    $('#msgField').val('');
  });

  $('#chatroomSubmit').on('click', function (e) {
    //should have a way to detect duplicate chatroom names
    e.preventDefault();
    roomName = $('#chatroomField').val();
    var $room = $('<div class="chatroom"></div>');
    $room.text(roomName);
    $room.attr('id', roomName);
    $room.addClass('currentRoom');
    currentRoom = roomName;
    $('.chatroom').each(function() {$(this).removeClass('currentRoom');});
    $('#chatroomField').val('');
    $room.appendTo('#rooms');
  });

  $(document).delegate('.chatroom', 'click', function () {
    console.log('clicked a room');
    $('.chatroom').each(function() {$(this).removeClass('currentRoom');});
    $(this).addClass('currentRoom');
    currentRoom = $(this).attr('id');
  });

  $(document).delegate('.usr', 'click', function () {
    if (friendList[$(this).attr('data-usr')]) {
      friendList[$(this).attr('data-usr')] = false;
    } else {
      friendList[$(this).attr('data-usr')] = true;
      $('.msg').each(function () {
        if (friendList[$(this).attr('data-usr')]) {
          $(this).toggleClass('friend', true);
        }
      });
    }
  });

});

//Bad global variables, obvious vulnerability in client.
var lastTime;
var friendList = {};
var currentRoom = 'default';

var fetch = function (time) {
  //record time of most recent message, and only publish most recent
  //Date.parse('01/01/2011 10:20:45') > Date.parse('01/01/2011 5:10:10')
  $.ajax('http://127.0.0.1:8080/1/classes/messages', {
    contentType: 'application/json',
    type: "GET",
    success: function(data){
      //The code below repeats itself to an extent and can probably be
      //refactored to eliminate repitition
      console.log(data);
      if (!lastTime) {lastTime = data.results[99].createdAt;}
      if (currentRoom === 'default') {
        for (var i = 99; i >0; i--) {
          if (Date.parse(data.results[i].createdAt) > Date.parse(lastTime)) {
            makeMsg(data.results[i]);
          }
        }
      } else {
        for (var i = 99; i >0; i--) {
          if (Date.parse(data.results[i].createdAt) > Date.parse(lastTime) && data.results[i].room === currentRoom) {
            makeMsg(data.results[i]);
          }
        }

      }

    },

    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var makeMsg = function (data) {
  if (data.objectId) {
    var $msg = $('<span class="msg"></span>');
    var $usr = $('<span class="usr"></span>');
    $msg.text(data.text);
    $usr.text(data.username);
    $usr.attr('data-usr', data.username);
    $msg.attr('data-usr', data.username);
    if (friendList[data.username]) {
      $msg.addClass('friend');
    }
    $usr.prependTo($msg);
    $msg.prependTo('#viewMsgs');
    var lastTime = data.createdAt;
  }
};

var getUsername = function(){
  var results = new RegExp('[\\?&]username=([^&#]*)').exec(window.location.href);
  return results[1] || 0;
};

var send = function (msgText) {
  console.log('sending...');
  var usr = getUsername();
  return $.ajax({
    contentType: 'application/json',
    type:"POST",
    url: "http://127.0.0.1:8080/1/classes/messages",
    data: JSON.stringify({text: msgText, username: usr, room: currentRoom})
  });
};

if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});
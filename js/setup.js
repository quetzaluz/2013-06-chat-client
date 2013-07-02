$(document).ready(function () {
	fetch();
  msgIntervalID = setInterval(function () {
  	fetch(lastTime);
  }, 3000);
  $('#textSubmit').on('click', function (e) {
  	e.preventDefault();
    msg = $('#textField').val();
    send(msg);
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

var fetch = function (time) {
	//record time of most recent message, and only publish most recent
	//Date.parse('01/01/2011 10:20:45') > Date.parse('01/01/2011 5:10:10')
	$.ajax('https://api.parse.com/1/classes/messages?order=-createdAt', {
	  contentType: 'application/json',
	  success: function(data){
	  	if (!lastTime) {lastTime = data.results[99].createdAt}
			for (var i = 99; i >0; i--) {
				if (Date.parse(data.results[i].createdAt) > Date.parse(lastTime)) {
					makeMsg(data.results[i]);
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
		var $usr = $('<span class="usr"></span>')
		var msgText = data.text.slice(0, 500);
		$msg.text(msgText);
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
}

var getUsername = function(){
  var results = new RegExp('[\\?&]username=([^&#]*)').exec(window.location.href);
  return results[1] || 0;
}

var send = function (msgText) {
	console.log('sending...')
	var usr = getUsername();
	return $.ajax({
		contentType: 'application/json',
		type:"POST",
		url: "https://api.parse.com/1/classes/messages",
		data: JSON.stringify({text: msgText, username: usr})
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
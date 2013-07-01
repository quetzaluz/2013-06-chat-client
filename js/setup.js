
$(document).ready(function () {
	fetch();
  msgIntervalID = setInterval(function () {
  	fetch(lastTime);
  }, 3000);
  $('#textSubmit').on('click', function () {
          msg = $('#textField').val();
          send(msg);
        });
});

var lastTime;

var fetch = function (time) {
	//record time of most recent message, and only publish most recent
	//Date.parse('01/01/2011 10:20:45') > Date.parse('01/01/2011 5:10:10')
	$.ajax('https://api.parse.com/1/classes/messages?order=-createdAt', {
	  contentType: 'application/json',
	  success: function(data){
	  	if (!lastTime) {lastTime = data.results[99].createdAt}
			for (var i = 0; i < 100; i++) {
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
		$msg.text(data.text);
		$usr.text(data.username);
		$msg.attr('data-id', data.objectId);
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
	$.ajax({
		contentType: 'application/json',
		type:"POST",
		url: "https://api.parse.com/1/classes/messages",
		//SEE OLD FORMAT BELOW. I believe this is correct, but all of
		//my classmates have been sending only message text.
		//data: JSON.stringify({text: (getUsername()+ ": "+ msgText)})
		data: JSON.stringify({username: getUsername(), text: msgText})
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
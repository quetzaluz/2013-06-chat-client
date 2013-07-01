$(document).ready(function () {
  msgIntervalID = setInterval(function () {
  	fetch();
  }, 3000)();
});

var fetch = function () {
	//makeMsg is called within this function. Get data from
	//server and publish each message.
	$.ajax('https://api.parse.com/1/classes/messages', {
	  contentType: 'application/json',
	  success: function(data){
	  	console.log(data);
	    for (var i = 0; i < data.results.length; i++) {
	      makeMsg(data.results[i]);
	    }
	  },
	  error: function(data) {
	    console.log('Ajax request failed');
	  }
	});
};

var makeMsg = function (data) {
	if (data.createdAt) {
		var $msg = $('<span class="msg"></span><br>');
		$msg.attr('data-created-at', data.createdAt);
		$msg.attr('data-object-id', data.objectId);
		$msg.text(data.text);
		$msg.appendTo('#viewMsgs');
	}
}

// var send = function (msgText) {
// 	$.ajax({
// 		type:"POST",
// 		url: "https://api.parse.com/1/classes/chats",
// 		data: JSON.stringify({text: ($.urlParam('username')+ ": " msg)})
// 	});
// };

// $.urlParam = function(name){
//   var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
//   return results[1] || 0;
// }

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

$.ajax('https://api.parse.com/1/classes/messages', {
  contentType: 'application/json',
  success: function(data){
    for (var i = 0; i < data.results.length; i++) {
      makeMsg(data.results[i].text);
    }
    console.log(data);
  },
  error: function(data) {
    console.log('Ajax request failed');
  }

});
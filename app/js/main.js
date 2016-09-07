'use strict';

var API_KEY = 'AIzaSyB4EM_00r6a7_ACyUOvHz-tLhC9KAKcz4E';
//var SUBSCRIPTION_KEY_1 = 'eO45iVneuac:APA91bHwAINIK5ILInDI9YnzfLWk6b5IfQ9D43wi9yXEUIQH2IROgj4kNPqE1PT3yKkK4UVOwIn3xM-alb5IZ01R40onszbOitiN-2fIUuZR2JB5UH0tcEWa7ycDXsO5BD-EtpCMLmwn'
//var SUBSCRIPTION_KEY_2 = 'd2ZJdZlYnFY:APA91bEKyUkph6VHKtA1LuDso1pphvxo18o4iNngakLPXwtzykXCH3nk5amgC6WJIuSihWr0HxfAlo_CeiBt0XdFZnARdzQqW-aGBv_muCyGkbuiaGHj_jnsWa14GYcgkrfh3uCrEP3e'

var isEnabled = false;
var subscriptionEndpoint = null;

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported.');
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    console.log(':^)', registration);

    registration.pushManager.subscribe({
      userVisibleOnly: true
    }).then(function(subscription) {
      console.log('endpoint: ', subscription.endpoint);
      subscriptionEndpoint = subscription.endpoint;
    }, function(err) {
      console.log('Service Worker Subscription Error.');
      console.log(err);
    });
  }).catch(function(err) {
    console.log(':^(', err);
  });
}

var el = document.getElementById('toggleButton');
el.addEventListener('click', function(event) {
      var buttonEl = event.toElement;
      console.log('toggleButton clicked: ' + event);
    }, false);

var el = document.getElementById('sendNotificationButton');
el.addEventListener('click', function(event) {
      var buttonEl = event.toElement;
      sendPushNotificationToGcm();
    }, false);

function sendPushNotificationToGcm() {
  if (subscriptionEndpoint == null) {
    console.log("Service Worker is not subscribe to an endpoint.");
    return;
  }
  return callAjax();
}

function callAjax() {
  console.log('Sending Notification.');

  var endpointId = subscriptionEndpoint.match(/send\/(.+)/)[1];
  var dataJSON = {
    'registration_ids': [endpointId]
  }

  $.ajax({
    url: 'https://android.googleapis.com/gcm/send',
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(dataJSON),
    contentType: 'application/json',
    headers: {
      'Authorization': 'key=' + API_KEY
    },
    success: function(result) {
      console.log('Response successful.');
    },
    error: function(err) {
      console.log('Response Error.');
      console.log(err);
    }
  });
}

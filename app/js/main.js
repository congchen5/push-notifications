'use strict';

$(function() {

var API_KEY = 'AIzaSyB4EM_00r6a7_ACyUOvHz-tLhC9KAKcz4E';

var registration;
var subscription;
var isSubscribed = false;
var subscriptionEndpoint = null;
var subscriptionButton = $('#subscriptionButton');
var sendNotificationButton = $('#sendNotificationButton');

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported.');
  navigator.serviceWorker.register('sw.js')
    .then(function(swRegistration) {
      registration = swRegistration;

      console.log(':^)', registration);
      subscriptionButton.prop('disabled', false);
    }).catch(function(err) {
      console.log(':^(', err);
    });
}


$('#subscriptionButton').on('click', function(event) {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});


$('#sendNotificationButton').on('click', function(event) {
  var buttonEl = event.toElement;
  sendPushNotificationToGcm();
});


function subscribe() {
  console.log('Subscribing');

  registration.pushManager.subscribe({
        userVisibleOnly: true
      }).then(function(swSubscription) {
        subscription = swSubscription;

        console.log('Subscribed! Endpoint: ', subscription.endpoint);
        subscriptionEndpoint = subscription.endpoint;

        sendNotificationButton.prop('disabled', false);
        subscriptionButton.text('Unsubscribe from Push Notifications');
        isSubscribed = true;
      }, function(err) {
        console.log('Service Worker Subscription Error.');
        console.log(err);
      });
};

function unsubscribe() {
  console.log('Unsubscribing');

  subscription.unsubscribe().then(function(event) {
    console.log('Unsubscribed!', event);

    subscriptionButton.text('Subscribe to Push Notifications');
    sendNotificationButton.prop('disabled', true);
    isSubscribed = false;
  }, function(error) {
    console.log('Errr unsubscribing', error);
  });
};


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

});

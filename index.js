mode = 0;
marker = null;
markers = [];
data = null;
//data = { "locs": [{ "name": "Vintergatan", "lat": "64.7515032", "lng": "20.9523000", "cost": "$1", "cleanliness": "60", "smell": "70", "amenities": "50" }, { "name": "Espresso House", "lat": "64.7507458", "lng": "20.9520959", "cost": "-1", "cleanliness": "90", "smell": "90", "amenities": "60" }, { "name": "Ainas Café", "lat": "64.7503940", "lng": "20.9663109", "cost": "-1", "cleanliness": "80", "smell": "70", "amenities": "60" }, { "name": "McDonalds", "lat": "64.7313882", "lng": "20.9760380", "cost": "-1", "cleanliness": "90", "smell": "80", "amenities": "50" }, { "name": "Stora Coop", "lat": "64.7383501", "lng": "20.9665109", "cost": "0", "cleanliness": "60", "smell": "70", "amenities": "40" }] };
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

$(document).ready(function(){

  console.log("Hello");
  $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBQhMKpUkmBY6uCHJ9sERBoCw0OlE9srjI&callback=initMap");
  });

var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 64.75, lng: 20.95 },
    disableDefaultUI: true,
    mapTypeControl: true,
    zoomControl: true,
    zoom: 6,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ]
  });
  infoWindow = new google.maps.InfoWindow;

  locateAndLoad();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function showInfo(mid = 100) {
  //document.getElementById("debug").textContent=mid;
  document.getElementById("nameInfo").textContent = data.locs[mid].name;
  document.getElementById("rating").textContent = calculateRating(mid) + "/5";
  document.getElementById("costInfo").textContent = data.locs[mid].cost;
  document.getElementById("costInfo").style.color = "#ff3333";
  if (data.locs[mid].cost == "0") {
    document.getElementById("costInfo").textContent = "FREE";
    document.getElementById("costInfo").style.color = "#33ff33";
  }
  if (data.locs[mid].cost == "-1") {
    document.getElementById("costInfo").textContent = "Free for guests";
    document.getElementById("costInfo").style.color = "#ffff33";
  }
  document.getElementById("cleanlinessInfo").style.width = data.locs[mid].cleanliness + "%";
  document.getElementById("smellInfo").style.width = data.locs[mid].smell + "%";
  document.getElementById("amenitiesInfo").style.width = data.locs[mid].amenities + "%";
  document.getElementById("addModal").style.visibility = "hidden";
  document.getElementById("moreModal").style.visibility = "hidden";
  document.getElementById("infoModal").style.visibility = "visible";

  var destinationB = new google.maps.LatLng(Number(data.locs[mid].lat), Number(data.locs[mid].lng));

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [myPos],
      destinations: [destinationB],
      travelMode: 'WALKING',
    }, callback);
}

function callback(response, status) {
  //console.log(response);
  distance = response.rows[0].elements[0].distance.text;
  duration = response.rows[0].elements[0].duration.text;
  //console.log(distance);
  document.getElementById("distanceInfo").textContent = distance;
  document.getElementById("durationInfo").textContent = duration;
}

function calculateRating(id) {
  loc = data.locs[id];
  average = parseInt((Number(loc.cleanliness) + Number(loc.smell) + Number(loc.amenities)) / 3);
  average = parseInt(average / 2) / 10;
  return average;
}

function showAdd(lat, lng) {
  hideAll();
  document.getElementById("addModal").style.visibility = "visible";
  document.getElementById("addLat").textContent = lat.toFixed(7);
  document.getElementById("addLng").textContent = lng.toFixed(7);
}

function hideAdd() {
  document.getElementById("addModal").style.visibility = "hidden";
}

function hideInfo() {
  document.getElementById("infoModal").style.visibility = "hidden";
}

function showFind() {
  hideAll();
  document.getElementById("findModal").style.visibility = "visible";
  document.getElementById("findList").innerHTML = "";
  for (i = 0; i < data.locs.length; i++) {
    document.getElementById("findList").innerHTML += "<div>" + data.locs[i].name + " (" + calculateRating(i) + ")</div>";
  }
  console.log(document.getElementById("findList").innerHTML);
}

function hideFind() {
  document.getElementById("findModal").style.visibility = "hidden";
}

function showMore() {
  hideAll();
  document.getElementById("moreModal").style.visibility = "visible";
}

function hideMore() {
  document.getElementById("moreModal").style.visibility = "hidden";
}

function hideAll() {
  document.getElementById("addModal").style.visibility = "hidden";
  document.getElementById("findModal").style.visibility = "hidden";
  document.getElementById("infoModal").style.visibility = "hidden";
  document.getElementById("moreModal").style.visibility = "hidden";
}

function toggleMode() {
  if (mode == 0) {
    mode = 1;
    document.getElementById("topNav").textContent = "EDIT MODE - click on map to add toilet";
    document.getElementById("topNav").style.color = "#ffff33";
    document.getElementById("map").style.top = "5%";
    document.getElementById("map").style.height = "85%";
    document.getElementById("topNav").style.height = "5%";
    hideAll();
  } else {
    mode = 0;
    document.getElementById("topNav").textContent = "STANDARD MODE";
    document.getElementById("topNav").style.color = "#ffffff";
    document.getElementById("map").style.top = "0";
    document.getElementById("map").style.height = "90%";
    document.getElementById("topNav").style.height = "0";
    hideAll();
  }
}

function addToilet() {
  toilet = new Object();
  toilet.name = document.getElementById("nameValue").value;
  toilet.lat = document.getElementById("addLat").textContent;
  toilet.lng = document.getElementById("addLng").textContent;
  toilet.cleanliness = (document.getElementById("cleanlinessValue").textContent * 20).toString();
  toilet.smell = (document.getElementById("smellValue").textContent * 20).toString();
  toilet.amenities = (document.getElementById("amenitiesValue").textContent * 20).toString();
  toilet.cost = "0";
  console.log(data);
  console.log(toilet);
  data.locs.push(toilet);
  console.log(data);
  hideAdd();
  $.post("https://isak.pythonanywhere.com/loo/",
  {
    action: "write",
    password: "pass123",
    data: JSON.stringify(data, null, 2)
  },
  function(answer, status){
    console.log(answer);
    locateAndLoad();
  });
  
}

function locateAndLoad() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      myPos = pos;

      /*infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);*/
      if (marker) marker.setMap(null);
      if (markers) {
        for (i = 0; i < markers.length; i++) {
          if (markers[i]) marker[i].setMap(null);
        }
      }

      image = {
        url: 'toilets_inclusive.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(32, 37),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(16, 37)
      };

      map.setCenter(pos);
      map.setZoom(14);
      var marker = new google.maps.Marker({ position: pos, map: map, title: 'You are here' });

      //loadMarkers();
      loadJSON();

      map.addListener('click', function (e) {
        if (mode == 1) showAdd(e.latLng.lat(), e.latLng.lng());
      });

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function loadJSON(){

$.post("https://isak.pythonanywhere.com/loo/",
  {
    action: "read",
  },
  function(dat, status){
    data = dat;
    //console.log(JSON.stringify(data));
    console.log("Data fetched. Initializing...");
    loadMarkers();
  });

}

function loadMarkers(){
  var markers = [];
      console.log(data.locs[0]);
      for (i = 0; i < data.locs.length; i++) {
        markers[i] = new google.maps.Marker({ position: { lat: Number(data.locs[i].lat), lng: Number(data.locs[i].lng) }, map: map, icon: image, title: 'Toilet' });
        markers[i].addListener('click', showInfo.bind(null, i));
      }
}
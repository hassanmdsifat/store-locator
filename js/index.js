
var map;
var markers = [];
var infoWindow = '';
var locationSelect;
window.onload = () => {
}

function initMap() {

    var styledMapType = new google.maps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ],
        {name: 'Styled Map'});

    var losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap,styled_map',
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    infoWindow = new google.maps.InfoWindow();
}

function displayStores(stores){
    var storesHtml = '';
    var count = 1;
    for(var store of stores){
        storesHtml +=  `<div class="store-container">
                          <div class="store-container-background">
                              <div class="store-info-container">
                                  <div class="store-address">
                                      <span>${store.addressLines[0]}</span>
                                      <span>${store.addressLines[1]}</span>
                                  </div>
                                  <div class="store-phone-number">${store.phoneNumber}</div>
                              </div>
                              <div class="store-number-container">
                                  <div class="store-number">
                                      ${count}
                                  </div>
                              </div>
                          </div>
                      </div>`;
        count++;
        document.querySelector('.stores-list').innerHTML = storesHtml ;
    }
}

function showStoresMarkers(stores){
    var count = 1;
    var bounds = new google.maps.LatLngBounds();
    for(var store of stores){
        var name = store.name;
        var address = store.addressLines[0];
        var phoneNumber = store.phoneNumber;
        var openStatusTag = store.openStatusText;
        var latLong = new google.maps.LatLng(store.coordinates.latitude, store.coordinates.longitude);
        createMarker(name, address, latLong, phoneNumber, openStatusTag);
        bounds.extend(latLong);
        count++;
    }
    map.fitBounds(bounds);
}

function createMarker(name, address, latlng, phone, openStatusTag){
    var icon = "./images/map_marker.png";

    var html = `<div class="store-info-window">
                    <div class="store-info-name">
                        ${name}
                    </div>
                    <div class="store-info-status">
                        ${openStatusTag}
                    </div>
                    <div class="store-info-address">
                    <div class="circle">
                    <i class="fas fa-location-arrow"></i> 
                    </div>
                    <a href="https://www.google.com/maps/place/${address}" target="_blank"> ${address} </a>
                    </div>
                    <div class="store-info-phone">
                    <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                    </div>
                        ${phone}
                    </div>
                <div>`;

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: icon
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}
function setOnCLickListener(){
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach((element, index)=>{
      element.addEventListener('click', function(){
        google.maps.event.trigger(markers[index], 'click');
      });
  });
}

function searchStores(){
  var foundStores = [];
  var zipCodeValue = document.getElementById('zip-code-input').value;
  if(zipCodeValue){
    for(var store of stores){
      var postal = store.address.postalCode.substr(0,5);
      if(postal === zipCodeValue){
          foundStores.push(store);      
      }
    }
    if(foundStores.length === 0){
      var html = `<div class="not-found">
                      <img src="./images/sad.png" height="100px" width="100px" align="middle">
                  </div>
                  <div class="not-found-text">
                    <p>No Location Found!!!</p>
                  </div>
                  `;
      document.querySelector('.stores-list').innerHTML = html;
    }
  }
  else{
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnCLickListener();

}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
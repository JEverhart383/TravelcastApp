//Begin Geolocate user, map init, and control creation 

var currentPosition;
var startPoint;
var endPoint;
var map;
var startMarker;
var markerEnd;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function geolocationSuccess(position){
	//set map options and marker based on location and create new map object
	directionsDisplay = new google.maps.DirectionsRenderer();
	currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	
	var mapOptions = {
			zoom: 7,
			center: currentPosition,
			mapTypeId : google.maps.MapTypeId.ROADMAP

		};

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		directionsDisplay.setMap(map);

		startMarker = new google.maps.Marker({
			map: map,
			position: currentPosition
		});

		startPoint = currentPosition;
		console.log(startPoint);


	//Add an autocomplete field attached to "start" point input element 
  		var startInput = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));

  		map.controls[google.maps.ControlPosition.TOP_LEFT].push(startInput);
  		var autocomplete = new google.maps.places.Autocomplete(startInput);
  		autocomplete.bindTo('bounds', map);

	//Create marker and info window for "start point" 

		var infowindowStart = new google.maps.InfoWindow();
	    /*var markerStart = new google.maps.Marker({
	    map: map,
	    anchorPoint: new google.maps.Point(0, -29)
	  	}); */ 

 	//Add eventlistener for Start place change 
 
	   google.maps.event.addListener(autocomplete, 'place_changed', function() {
			      infowindowStart.close();
			      startMarker.setVisible(false);
			      var place = autocomplete.getPlace();
			      if (!place.geometry) {
			        return;
			      }

			      // If the place has a geometry, then present it on a map.
			      if (place.geometry.viewport) {
			        map.fitBounds(place.geometry.viewport);
			      } else {
			        map.setCenter(place.geometry.location);
			        map.setZoom(8);  // Why 17? Because it looks good.
			      }
			      startMarker.setIcon(/** @type {google.maps.Icon} */({
			        url: place.icon,
			        size: new google.maps.Size(71, 71),
			        origin: new google.maps.Point(0, 0),
			        anchor: new google.maps.Point(17, 34),
			        scaledSize: new google.maps.Size(35, 35)
			      }));
			      startMarker.setPosition(place.geometry.location);
			      startMarker.setVisible(true);

			      //Set global startPoint variable 

			      startPoint = place.geometry.location;
			      console.log(startPoint);

			      var address = '';
			      if (place.address_components) {
			        address = [
			          (place.address_components[0] && place.address_components[0].short_name || ''),
			          (place.address_components[1] && place.address_components[1].short_name || ''),
			          (place.address_components[2] && place.address_components[2].short_name || '')
			        ].join(' ');
			      }

			      infowindowStart.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			      infowindowStart.open(map, startMarker);
	    }); //End eventlistener function
	
	//Add autocomplete field for ending point input element
				
				  var inputEnding = document.getElementById('pac-input-ending');
				  map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(inputEnding);
				 

				  var autocompleteEnd = new google.maps.places.Autocomplete(inputEnding);
				  autocompleteEnd.bindTo('bounds', map);

				  var infowindowEnd = new google.maps.InfoWindow();
					markerEnd = new google.maps.Marker({
					  map: map,
					  anchorPoint: new google.maps.Point(0, -29)
					});

				  google.maps.event.addListener( autocompleteEnd, 'place_changed', function() {
					      infowindowEnd.close();
					      markerEnd.setVisible(false);
					      var place = autocompleteEnd.getPlace();
					      if (!place.geometry) {
					        return;
					      }

					      // If the place has a geometry, then present it on a map.
					      if (place.geometry.viewport) {
					        map.fitBounds(place.geometry.viewport);
					      } else {
					        map.setCenter(place.geometry.location);
					        map.setZoom(8);  // Why 17? Because it looks good.
					      }
					      markerEnd.setIcon(/** @type {google.maps.Icon} */({
					        url: place.icon,
					        size: new google.maps.Size(71, 71),
					        origin: new google.maps.Point(0, 0),
					        anchor: new google.maps.Point(17, 34),
					        scaledSize: new google.maps.Size(35, 35)
					      }));
					      markerEnd.setPosition(place.geometry.location);
					      markerEnd.setVisible(true);
					      endPoint = place.geometry.location;
			      		  console.log(endPoint);

					      var address = '';
					      if (place.address_components) {
					        address = [
					          (place.address_components[0] && place.address_components[0].short_name || ''),
					          (place.address_components[1] && place.address_components[1].short_name || ''),
					          (place.address_components[2] && place.address_components[2].short_name || '')
					        ].join(' ');
					      }

					      infowindowEnd.setContent('<div><strong>' + place.name + '</strong><br>' + address);
					      infowindowEnd.open(map, markerEnd);
    				}); //End eventlistener for end marker

		//begin constructor for "Use Current Location" custom control

		  // Create the DIV to hold the control and
		  // call the HomeControl() constructor passing
		  // in this DIV.
		  var homeControlDiv = document.createElement('div');
		  var homeControl = new HomeControl(homeControlDiv, map);

		  homeControlDiv.index = 1;
		  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

		//begin constructor for "Get Directions" custom control 
		
		  var directionControlDiv = document.createElement('div');
		  var directionControl = new DirectionControl(directionControlDiv, map);

		  directionControlDiv.index = 1;
		  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(directionControlDiv);  



}//End geolocation success

function geolocationError(positionError) {
        document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
      }

function geolocateUser(){ 
	if (navigator.geolocation){

		var positionOptions = {
			enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
		};
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
	} else {
          document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
      }

}//End geolocate user and map init 

//run geolocation and map init on window load
google.maps.event.addDomListener(window,"load", geolocateUser);



//Add custom control to user Geolocate as "start" point 

function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to user current location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Use Current Location</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to current position
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(currentPosition);
    
    startMarker.setMap(null);
    

    var marker = new google.maps.Marker({
      position: currentPosition,
      map: map,
      title: 'Hello World!'
  	});
    startPoint = currentPosition;
    console.log(startPoint);
  });

}


// Add custom control that when clicked Creates Directions objects, 
function DirectionControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to user current location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Get Directions</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to make directions request, and display directions results 
  google.maps.event.addDomListener(controlUI, 'click', function() {
    
   
		  var start = startPoint;
		  var end = endPoint;
		  var request = {
		      origin:start,
		      destination:end,
		      travelMode: google.maps.TravelMode.DRIVING
		  	};
		  directionsService.route(request, function(response, status) {
			    if (status == google.maps.DirectionsStatus.OK) {
			      directionsDisplay.setDirections(response);
		    	}
		  	});
		});//End event listener

} //End direction control function

//Things to do: add clear locations control to reset data points and markers


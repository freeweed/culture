angular.module('starter.directives', [])

.directive('map',function(){
	return{
		restrice: 'E',
		scope:{
			onCreate: '&'
		},
		link: function($scope,$element,$attr){
            var LatLng = new google.maps.LatLng(18.768867, 99.010748);
            navigator.geolocation.getCurrentPosition(function (pos) {
              LatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
              //$scope.map.setCenter(new google.maps.LatLng(18.768867, 99.010748));
            }, function (error) {
              alert('Unable to get location: ' + error.message);
            });
			//var LatLng = new google.maps.LatLng(13.736607, 100.520501);
			var map;
			function initialize(){

				var style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

				var mapOptions = {
					center: LatLng,
					zoom: 11,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				map = new google.maps.Map($element[0], mapOptions);
				$scope.onCreate({map:map})
				map.setOptions({styles: style});

			  	var centerControlDiv = document.createElement('button');
				var centerControl = new CenterControl(centerControlDiv, map);

				centerControlDiv.index = 1;
				map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

			}

		function CenterControl(controlDiv, map) {

			  controlDiv.className = "button button-light icon ion-ios-location control";
			  controlDiv.onclick = function() {map.setCenter(LatLng);};
			  // Setup the click event listeners: simply set the map to Chicago.

			}

      	if (document.readyState === "complete") {
		    initialize();
		  } else {
		    google.maps.event.addDomListener(window, 'load', initialize);
		  }
		}
	}
});
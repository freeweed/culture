angular.module('starter.services', ['ngCordova'])
.factory('Url', function(){
  return {
    nodeserver: 'http://188.166.191.169:7070/', //main server
    map: 'http://maps.google.com/?q=',
    getprovince: 'getProvince/', //province path
    getCategory: 'getCategory/',
    getMarker: 'getMarker/',
    register: 'register/',//register path
    login: 'login/',//login path
    edit: 'edit/',//edit user
    search: 'search/',//search location
    searchRecord: 'recordSearch/',//record search location
    getHigh: 'getActivity/',//get highlight
    getAnswer: 'getAnswer/',//get answer
    uploadImg: 'uploadImage/',//upload picture
  }
})
.factory('Map', function($ionicPopup, Url){
  var map;
  var markers = [];
  var markerCluster = [];
  var marker, i;
  var searchMarker = null;
  return {
    /*init google map function*/
    init: function(){
      var mapProp = {
        center:new google.maps.LatLng(18.6998064,98.9478965),
        zoom:11,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      /*set style*/
      var style = [{"featureType":"all","elementType":"all","stylers":[{"saturation":-100},{"gamma":0.5}]}];
      map = new google.maps.Map(document.getElementById("map"),mapProp);
      map.setOptions({styles: style});
    },
    /*set marker*/
    mark: function($index, locations){
      markerCluster.push([]);
      console.log("marker:"+JSON.stringify(locations));
      // var infowindow = new google.maps.InfoWindow();
      markers.push([$index]);
      for (i = 0; i < locations.length; i++) {
        if(locations[i].CD_Icon == "User.png"){
            icon = "img/icon/11.png";
        }else if(locations[i].CD_Icon == "Setting.png"){
            icon = "img/icon/item.png";
        }else if(locations[i].CD_Icon == "Heart.png"){
            icon = "img/icon/nation.png";
        }else if(locations[i].CD_Icon == "Church.png"){
            icon = "img/icon/place.png";
        }else if(locations[i].CD_Icon == "nature.png"){
            icon = "img/icon/temple.png";
        }else{
            icon = "img/icon/else.png";
        }

        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i].Coverage_Latitude, locations[i].Coverage_Longitude),
          icon: icon,
          map: map
        });
      //  console.log(JSON.stringify(markers));
        markers[$index][i] = marker;
        google.maps.event.addListener(marker, 'mousedown', (function(marker, i, e) {
            return function() {
                // infowindow.setContent(title[i]);
                // infowindow.open($scope.map, marker);

                  var confirmPopup = $ionicPopup.confirm({
                    title: locations[i].Title,
                    template: locations[i].Description,
                    buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                       text: 'Close',
                       type: 'button-default',
                       onTap: function(e) {
                          // e.preventDefault() will stop the popup from closing when tapped.
                          //e.preventDefault();
                       }

                    }, {
                       text: 'Map',
                       type: 'button-positive',
                       onTap: function(e) {
                         console.log("map url:"+Url.map + locations[i].Coverage_Latitude + "," + locations[i].Coverage_Longitude);
                         cordova.InAppBrowser.open(Url.map + locations[i].Coverage_Latitude + "," + locations[i].Coverage_Longitude, '_system', 'location=yes');
                       }

                    }]
                  });

                  confirmPopup.then(function(res) {
                    if(res) {
                      console.log('You are sure');
                    } else {
                      console.log('You are not sure');
                    }
                  });

            }
        })(marker, i));
      }
      // var clusterStyles = [
      //   {
      //     textColor: 'white',
      //     url: 'path/to/smallclusterimage.png',
      //     height: 50,
      //     width: 50
      //   }
      // ];
      //
      // var mcOptions = {
      //   gridSize: 50,
      //   styles: clusterStyles,
      //   maxZoom: 15
      // };

      markerCluster[$index] = new MarkerClusterer(map, markers[$index]);
    },
    searchMark: function(searchData){
      console.log(JSON.stringify(searchData));
      if(searchMarker){
        console.log("if")
        searchMarker.setMap(null);
      }
      searchMarker = new google.maps.Marker({
        position: new google.maps.LatLng(searchData.Coverage_Latitude, searchData.Coverage_Longitude),
        map: map
      });
      google.maps.event.addListener(searchMarker, 'click', function() {

          var confirmPopup = $ionicPopup.confirm({
            title: searchData.Title,
            template: searchData.Description,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
               text: 'Close',
               type: 'button-default',
               onTap: function(e) {
                  // e.preventDefault() will stop the popup from closing when tapped.
                  //e.preventDefault();
               }

            }, {
               text: 'Map',
               type: 'button-positive',
               onTap: function(e) {
                 console.log("map url:"+Url.map + searchData.Coverage_Latitude + "," + searchData.Coverage_Longitude);
                 cordova.InAppBrowser.open(Url.map + searchData.Coverage_Latitude + "," + searchData.Coverage_Longitude, '_system', 'location=yes');
               }

            }]
          });

          confirmPopup.then(function(res) {
            if(res) {
              console.log('You are sure');
            } else {
              console.log('You are not sure');
            }
          });
      });

      var latLng = searchMarker.getPosition(); // returns LatLng object
      map.setCenter(latLng);
    },
    /*unset marker*/
    unmark: function($index){
      //console.log(JSON.stringify(markers[$index]));
      for(var i=0;i<markers[$index].length;i++){
          marker = markers[$index][i];
          marker.setMap(null);
      }
      markers[$index].splice(0,markers[$index].length);
      markerCluster[$index].clearMarkers();
    }
  }
})
.factory('subFunction', function($http, Url){

  var callback = function(data) {
    return data;
  };

  return {
    /*get province*/
    getProvince: function(callback){
      console.log(Url.nodeserver + Url.getprovince);
      $http.get(Url.nodeserver + Url.getprovince)
      .success(function(response) {
          callback(response);
      }).error(function(err) {
          console.log("error" + JSON.stringify(err));
      });
    },

    /*get index of json*/
    getIndexObj: function(obj, callback){
      var key = [];
      var i = 0;
      for(var keyName in obj){
        key[i] = keyName;
        i++;
      }
      callback(key);
    }
  }
})
.factory('highlightMenu', function(){
  return {
    menu: [
        {
          "month":"มกราคม",
          "icon":"img/calendar/Calendar1.png"
        },{
          "month":"กุมภาพันธ์",
          "icon":"img/calendar/Calendar2.png"
        },{
          "month":"มีนาคม",
          "icon":"img/calendar/Calendar3.png"
        },{
          "month":"เมษายน",
          "icon":"img/calendar/Calendar4.png"
        },{
          "month":"พฤษภาคม",
          "icon":"img/calendar/Calendar5.png"
        },{
          "month":"มิถุนายน",
          "icon":"img/calendar/Calendar6.png"
        },{
          "month":"กรกฎาคม",
          "icon":"img/calendar/Calendar7.png"
        },{
          "month":"สิงหาคม",
          "icon":"img/calendar/Calendar8.png"
        },{
          "month":"กันยายน",
          "icon":"img/calendar/Calendar9.png"
        },{
          "month":"ตุลาคม",
          "icon":"img/calendar/Calendar10.png"
        },{
          "month":"พฤศจิกายน",
          "icon":"img/calendar/Calendar11.png"
        },{
          "month":"ธันวาคม",
          "icon":"img/calendar/Calendar12.png"
        },{
          "month":"วันพิเศษ",
          "icon":"img/calendar/Calendar.png"
        }
    ]
  }
});

angular.module('starter.controllers', [])
.controller('HighlightCtrl', function($scope, $http, Url , highlightMenu, $ionicModal, $sce){
  console.log("test");
  $scope.highlights = highlightMenu.menu;
  // console.log(JSON.stringify($scope.highlights));
  $scope.Search = {};

    /*show search*/
  $ionicModal.fromTemplateUrl('highlightSearch.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.search = function(){
    //alert($scope.Search.key);
    $http.get(Url.nodeserver + Url.search + $scope.Search.key)
    .success(function(response) {
      console.log(JSON.stringify(response));
       $scope.Search.result = response;
    }).error(function(err) {

    });
  }
  $scope.getHtml = function(html){
      return $sce.trustAsHtml(html);
  };
})
.controller('HighlightDetailCtrl', function($scope, $stateParams, $http, Url, $sce){
  $scope.month = $stateParams.month;
  $scope.event = null;
  $http.get(Url.nodeserver + Url.getHigh + $stateParams.month)
  .success(function(response) {
    console.log(JSON.stringify(response));
    $scope.events = response;
  }).error(function(err) {
    //alert("error");
  });
  $scope.getHtml = function(html){
      return $sce.trustAsHtml(html);
  };
  $scope.navigator = function($index){
    cordova.InAppBrowser.open(Url.map + $scope.events[$index].location.lat + "," + $scope.events[$index].location.lng, '_system', 'location=yes');
  }
})

.controller('MapCtrl', function($scope, $ionicPopover, $ionicModal, $http, Url, Map) {
  $scope.selected = {};
  $scope.categorys = {};
  $scope.Search = {};
  /*set popover*/
  $ionicPopover.fromTemplateUrl('templates/filter.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.filter = popover;
  });

  /*set filter*/
  $scope.filterShow = function($event){
    console.log("filter show:"+$scope.categorys.length);
    if(Object.keys($scope.categorys).length == 0){
      $http.get(Url.nodeserver + Url.getCategory)
      .success(function(response){
        // console.log("data:"+JSON.stringify(response));
        $scope.filter.show($event);
        // $scope.categorys = response;
        var i = 0;
        for(i=0;i<response.length;i++){
          $scope.categorys[i] = response[i];
          $scope.categorys[i].isCheck = false;
        }
        console.log(JSON.stringify($scope.categorys));
      }).error(function(err){
        alert(err);
      });
    }else{
      $scope.filter.show($event);
    }
  }

  /*get marker*/
  $scope.getMarker = function($index){
    if($scope.categorys[$index].isCheck == true){
      // alert($scope.categorys[$index÷].ID);
      $http.post(Url.nodeserver + Url.getMarker, $scope.categorys[$index])
      .success(function(response) {
        console.log(JSON.stringify(response));
        Map.mark($index,response);
      }).error(function(err) {
          console.log("error" + JSON.stringify(err));
      });
    }else{
      Map.unmark($index);
    }
  }

  /*show search*/
  $ionicModal.fromTemplateUrl('mapSearch.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  /*search location*/
  $scope.search = function(){
    //alert($scope.Search.Key);
    $http.get(Url.nodeserver + Url.search + $scope.Search.Key)
    .success(function(response) {
      console.log(JSON.stringify(response));
      $scope.Search.result = response;
    }).error(function(err) {

    });
  }

  $scope.selectLocation = function($index){
    Map.searchMark($scope.Search.result[$index]);
    $scope.modal.hide();
    $http.get(Url.nodeserver + Url.searchRecord + $scope.Search.result[$index].Title)
    .success(function(response) {
      console.log(JSON.stringify(response));
    }).error(function(err) {

    });
  }
  //call init map function
  Map.init();
})

.controller('ChatsCtrl', function($scope, $http, $ionicModal, $cordovaPreferences, $ionicPopup, Url, $sce, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // $scope.closeModal = function() {
  //   $scope.modal.hide();
  // };
  $scope.cat = {}
  $scope.cat.name = "สีนิล วัดดอน";//ai name
  $scope.cat.first = "สวัสดีครับมีอะไรให้กระผมรับใช้ขอรับ";//first word
  $scope.cat.answers = [];//answers
  $scope.user = {};
  $scope.user.image = "img/icon-02.png";
  $scope.user.questions = [];//question
  $scope.menu = {};
  $ionicModal.fromTemplateUrl('notLogin.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.goBack = function(){
    $scope.modal.hide();
    $state.go('tab.highlight');
  }
  $cordovaPreferences.fetch('user')
  .success(function(value) {
    console.log("prefer:" +JSON.stringify(value));
    if(value == null){//not login
      $scope.modal.show();//show modal
    }else{//already login
      var image = document.getElementById('myImage');
      // image.src = Url.nodeserver + $scope.user.member_pic;
      console.log(JSON.stringify(image));
      $scope.user.name = value.member_name;
      $scope.user.image = Url.nodeserver + value.member_pic;
      console.log("already login:"+JSON.stringify(value));
    }
  })
  .error(function(error) {
    // alert("Error account: " + error);
  })

  $scope.submit = function(){
    $scope.modal.hide();//show modal
  }

  $scope.goLogin = function(){
    $scope.modal.hide();
    $state.go('tab.login');
  }
  /*get answers*/
  $scope.getAnswer = function(){
    $scope.user.questions.push($scope.user.question);
    console.log("getAns:"+ $scope.user.question+":"+Url.nodeserver + Url.getAnswer + $scope.user.question);
    $http.get(Url.nodeserver + Url.getAnswer + $scope.user.question)
    .success(function(response){
      //console.log("success:"+JSON.stringify(response));
      //alert(JSON.stringify(response));
      if(response.answer == false){
        //alert("false");
        $scope.cat.answers.push({answer: "ขออภัยขอรับกระผมไม่เข้าใจที่ท่านพูด"});
        $scope.menu.wrong = false;
      }else{
        if(response.data){
          $scope.menu.detail = true;
          if(response.data.location){
            $scope.menu.navi = true;
            console.log("navi");
          }else{
            $scope.menu.navi = false;
            console.log("!navi");
          }
        }else{
          $scope.menu.detail = false;
          console.log("!data");
        }
        $scope.cat.answers.push(response);
      }
      $scope.user.question = "";
    })
    .error(function(error){
      console.log("error:"+JSON.stringify(error));
    });
  }

  $scope.navigator = function($index){
    cordova.InAppBrowser.open(Url.map + $scope.cat.answers[$index].data.location.lat + "," + $scope.cat.answers[$index].data.location.lng, '_system', 'location=yes');
  }

  $scope.detail = function($index){
    console.log(JSON.stringify($scope.cat.answers[$index]));
    title = $scope.cat.answers[$index].data.word;
    des = $scope.cat.answers[$index].data.Description;
    var alertPopup = $ionicPopup.alert({
     title: title,
     template: $scope.getHtml(des)
   });

   alertPopup.then(function(res) {
     //console.log('Thank you for not eating my delicious ice cream cone');
   });
  }

  $scope.getHtml = function(html){
    //alert(html);
      return $sce.trustAsHtml(html);
  };
})

.controller('AccountCtrl', function($scope, $state, subFunction, $cordovaPreferences, $ionicModal, $http, Url, $window, $ionicActionSheet, $cordovaCamera) {
  $scope.loginDetail = {};
  $scope.user = {};
  var image = document.getElementById('myImage');
  /*get image from camera*/
  function getPicture(source){
    var options = {
      destinationType: Camera.DestinationType.FILE_URL,
      sourceType: source,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function(imageURI) {
      $scope.hasImage = true;
      var image = document.getElementById('myImage');
      image.src = imageURI;
      $scope.user.member_pic = imageURI;
    }, function(err) {
      // error
    });
  }

  /*show action sheet*/
  $scope.showCamera = function(){
    /*set action sheet*/
    var showSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Camera' },
       { text: 'Album' }
     ],
     titleText: 'Choose Your Action',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       if(index == 0){//get image from camera
         getPicture(Camera.PictureSourceType.CAMERA);
       }else if(index == 1){//get image from album
         getPicture(Camera.PictureSourceType.PHOTOLIBRARY);
       }
       return true;
     }
    });
  }
  /*set up modal*/
  $ionicModal.fromTemplateUrl('login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.goBack = function(){
    $scope.modal.hide();
    $state.go('tab.highlight');
  }
  /*go register*/
  $scope.goRegis = function(){
    $scope.modal.hide();
    $state.go('tab.register');
  }

  /*get user detail*/
  $cordovaPreferences.fetch('user')
  .success(function(value) {
    console.log("prefer:" +value);
    if(value == null){//not login
      $scope.modal.show();//show modal
    }else{//already login
      $scope.user = value;//set user value
      image.src = Url.nodeserver + $scope.user.member_pic;
      $scope.user.image = Url.nodeserver + value.member_pic;
      console.log("already login:"+JSON.stringify(value));
    }
  })
  .error(function(error) {
    // alert("Error account: " + error);
  })

  /*get province*/
  subFunction.getProvince(function(res){
    $scope.provinces = res;
  });

  /*login function*/
  $scope.login = function(){
    $http.post(Url.nodeserver + Url.login, $scope.loginDetail)
    .success(function(response) {
        console.log("result:"+JSON.stringify(response));
        if(response.length == 0){//wrong username or password
          alert('ชื่อผู้ใช้หรือรหัสผ่านผิด');
        }else{//correct username and password
          alert('เข้าสู่ระบบสำเร็จ');
          $scope.user = response[0];//set data
          image.src = Url.nodeserver + $scope.user.member_pic;//set image
          console.log("image:"+image.src);
          $cordovaPreferences.store('user', $scope.user)//save preferences
          .success(function(value) {
            console.log("Success: " + value);
          })
          .error(function(error) {
            console.log("Error login: " + error);
          });
          $scope.modal.hide();
        }
    }).error(function(err) {
        console.log("error" + JSON.stringify(err));
    });
  }

  /*logout function*/
  $scope.logout = function(){
    $cordovaPreferences.remove('user')//delete preferences
    .success(function(value) {
      $state.go('tab.highlight');
    })
    .error(function(error) {
      alert("Error logout: " + error);
    })
  }

  /*user edit*/
  $scope.submit = function(){
    var data = null;//data
    var condition = null;//
    $http.post(Url.nodeserver + Url.edit, $scope.user)
    .success(function(response){
      console.log(JSON.stringify(response));
      alert("แก้ไขข้อมูลสำเร็จ");
    }).error(function(){

    });
  }
})

.controller('RegisterCtrl', function($scope, $http, $ionicPlatform, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, Url, subFunction, $ionicLoading) {
    $scope.hasImage = false;
    $scope.province = null;
    $scope.user = {};
    $ionicPlatform.ready(function(){

      /*get province*/
      subFunction.getProvince(function(res){
        $scope.provinces = res;
        JSON.stringify($scope.provinces);
      });
      /*get image from camera*/
      function getPicture(source){
        var options = {
          destinationType: Camera.DestinationType.FILE_URL,
          sourceType: source,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true
        };

        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $scope.hasImage = true;
          var image = document.getElementById('myImage');
          image.src = imageURI;
          $scope.user.member_pic = imageURI;
        }, function(err) {
          // error
        });
      }

      /*show action sheet*/
      $scope.showCamera = function(){
        /*set action sheet*/
        var showSheet = $ionicActionSheet.show({
          buttons: [
           { text: 'Camera' },
           { text: 'Album' }
         ],
         titleText: 'Choose Your Action',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
           if(index == 0){//get image from camera
             getPicture(Camera.PictureSourceType.CAMERA);
           }else if(index == 1){//get image from album
             getPicture(Camera.PictureSourceType.PHOTOLIBRARY);
           }
           return true;
         }
        });
      }

      /*submit form*/
      $scope.submit = function(){
        console.log("user="+JSON.stringify($scope.user));
        // File name only
        var keep_image = $scope.user.member_pic;
        if($scope.hasImage){
          var filename = $scope.user.member_pic.split("/").pop();
        }else{
          var filename = 'none';
        }
        console.log('filename = '+filename);
        var options = {
             fileKey: "file",
             fileName: filename,
             chunkedMode: false,
             mimeType: "image/jpg",
             params : {'directory':'upload', 'fileName':filename} // directory represents remote directory,  fileName represents final remote file name
         };
        $cordovaFileTransfer.upload(Url.nodeserver + Url.uploadImg, $scope.user.member_pic, options)
        .then(function(result) {
          console.log("upload: "+JSON.stringify(result));
          $scope.user.member_pic = "uploads/" + result.response;
          $http.post(Url.nodeserver + Url.register, $scope.user)
          .success(function(response){
            $ionicLoading.hide();
            console.log("data:"+JSON.stringify(response));
            if(typeof response.result != 'undefined'){
              $scope.user.member_pic = keep_image;
              if(response.result.localeCompare("'member_email'") == 0){
                alert("อีเมล์นี้มีผู้ใช้แล้ว");
              }else if(response.result.localeCompare("'member_tel'") == 0){
                alert("เบอร์โทรนี้มีผู้ใช้แล้ว");
              }
            }else{
              alert("สมัครสมาชิกสำเร็จ");
              $state.go('tab.login');
            }
          }).error(function(){
            console.log("error");
          });
        }, function(err) {
            console.log("err:"+JSON.stringify(err));
        }, function (progress) {
          console.log("progress:"+JSON.stringify(progress));
          $ionicLoading.show({
            template: 'Loading...'
          });
        });
      }

    });
});

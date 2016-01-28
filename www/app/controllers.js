angular.module('SampleApp.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('ParksCtrl', function ($scope, parksService, $q) {
        $scope.title = "所有公園";
        $scope.skip = 0;
        $scope.limit = 10;
        $scope.pageNo = 1;
        $scope.searchText;

        $scope.nextPage = function () {
            $scope.pageNo++;
            $scope.skip = ($scope.pageNo - 1) * 10;
            $scope.getParks();
        }

        $scope.prevPage = function () {
            if ($scope.pageNo > 1) {
                $scope.pageNo--;
                $scope.skip = ($scope.pageNo - 1) * 10;
                $scope.getParks();
            }
        }

        $scope.doRefresh = function () {
            $scope.getParks().then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.getParks = function () {
            var deferred = $q.defer();
            var where = undefined;
            if ($scope.searchText) where = "ParkName:" + $scope.searchText;
            parksService.getParks(where, $scope.skip, $scope.limit).then(function (data) {
                $scope.parks = data;
                deferred.resolve()
            });
            return deferred.promise;
        }

        $scope.getParks();
    })

    .controller('ParkCtrl', function ($scope, parksService, $stateParams, $cordovaDialogs) {
        var self = this;
        self.park = parksService.getPark($stateParams.parkId);
        self.getDesc = function () {
            return self.park.Introduction.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        self.addFavorate = function () {
            $cordovaDialogs.alert("已加入收藏", "資訊", "確定");
            self.added = !self.added;
        }

        self.removeFromFavorates = function () {
            $cordovaDialogs.confirm("確定要移除收藏?", "警告", ["確定", "取消"]).then(function (buttonIndex) {
                if (buttonIndex == 1) {
                    alert("已移除收藏");
                    self.added = !self.added;
                } else {
                    alert("已取消");
                }
            });

        }


    })
    .controller('AreasCtrl', function ($scope, areaService) {
        $scope.areas = areaService.getAreas();
    })
    .controller('AreaCtrl', function ($scope, parksService, $stateParams) {
        $scope.parks = parksService.getParksInArea($stateParams.area);
        $scope.title = $stateParams.area;
    })
    .controller('ngCordovaCtrl', function ($cordovaVibration, $cordovaCamera,
        $cordovaCapture, $http, $cordovaDialogs, $rootScope, $cordovaFileTransfer) {
        var vm = this;
        vm.vibrate = function () {
            $cordovaVibration.vibrate(500);
        }

        vm.takePic = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            });
        }

        // vm.takeVideo = function () {
        //     var options = {
        //         quality: 50,
        //         sourceType: Camera.PictureSourceType.CAMERA,
        //         mediaType: 1,
        //         estinationType: Camera.DestinationType.FILE_URI
        //     };
        //     $cordovaCamera.getPicture(options).then(function (imageData) {
        //         console.log(imageData);
        //     });
        // }

        //https://devdactic.com/capture-and-store-videos-ionic/
        vm.takeVideo = function () {
            var options = { limit: 1, duration: 15,
            destinationType : Camera.DestinationType.FILE_URI,saveToPhotoAlbum:true };

            $cordovaCapture.captureVideo(options).then(function (videoData) {
                debugger;
                // var formData = new FormData();
                // formData.append("parkId", 1);
                // formData.append("description", "i like it");
                // formData.append("video", videoData[0]);

                var video = videoData[0];
                var path = video.fullPath.replace("file:/", "/");
                var serverUrl = encodeURI("http://parks.azurewebsites.net/images/post?parkId=1&description=xxx");

                var trustAllHosts = true;
                var options = {
                    fileKey: "yoro_vid",
                    fileName: video.name,
                    chunkedMode: false,
                    mimeType: video.type,
                    // params: {
                    //     filename : video.name
                    // }
                };

                $rootScope.$broadcast('loading:show');
                $cordovaFileTransfer.upload(serverUrl,
                    path, options)
                    .then(function (d) {
                        $rootScope.$broadcast('loading:hide');
                        $cordovaDialogs.alert("儲存成功", "資訊", "確定");
                    }, function (d) {
                        $rootScope.$broadcast('loading:hide');
                        $cordovaDialogs.alert("儲存失敗", "錯誤", "確定");
                    }
                );
            }, function (err) {
                // An error occurred. Show a message to the user
                alert(err);
            });
        }
    })
;

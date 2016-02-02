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
        $scope.parks = [];
        $scope.canShowMore = true;

        $scope.nextPage = function () {
            $scope.pageNo++;
            $scope.skip = ($scope.pageNo - 1) * 10;
            $scope.getParks();

            $scope.$broadcast('scroll.infiniteScrollComplete');
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
                if (data.length == 0)
                     $scope.canShowMore = false;
                else
                    $scope.parks = $scope.parks.concat(data);
                deferred.resolve()
            });
            return deferred.promise;
        }

        $scope.getParks();
    })

    .controller('ParkCtrl', function ($scope, parksService, $stateParams, $cordovaDialogs, $ionicPopup,
        favorateService) {
        var self = this;

        self.getDesc = function () {
            return self.park.Introduction.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }

        init();

        function init() {
            self.park = parksService.getPark($stateParams.parkId);
            self.added = favorateService.hasFavorate(self.park._id);
        }
        self.addFavorate = function () {
            favorateService.addFavorate(self.park._id);
            var added = favorateService.hasFavorate(self.park._id);
            $cordovaDialogs.alert("已加入收藏", "資訊", "確定");
            self.added = !self.added;
        }

        self.removeFromFavorates = function () {
            // $cordovaDialogs.confirm("確定要移除收藏?", "警告", ["確定", "取消"]).then(function (buttonIndex) {
            //     if (buttonIndex == 1) {
            //         alert("已移除收藏");
            //         self.added = !self.added;
            //     } else {
            //         alert("已取消");
            //     }
            // });

            var confirmPopup = $ionicPopup.confirm({
                title: '警告',
                template: '確定要移除收藏?',
                cancelText: '取消',
                okText : '確定'
            });
                confirmPopup.then(function(res) {
                    if (res) {
                        favorateService.removeFavorate(self.park._id);
                        $ionicPopup.alert({ title: "已移除收藏" });
                        self.added = !self.added;
                    } else {
                        $ionicPopup.alert({title: "已取消"});
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
    .controller('FavorateCtrl', function (parksService, favorateService) {
        //https://codepen.io/ionic/pen/JsHjf
        var vm = this;

        vm.data = {
            showDelete : false
        };

        vm.removeItem = function (favorate, index) {
            favorateService.removeFavorate(favorate._id);
            vm.favorates.splice(index, 1);
        }

        vm.moveItem = function (favorate, from, to) {
            vm.favorates.splice(from, 1);
            vm.favorates.splice(to, 0, favorate);
            favorateService.saveFavorates(vm.favorates);
        }

        vm.alertIt = function(favorate, message) {
            alert(message + " " + favorate.ParkName);
        }

        init();

        function init() {
            vm.favorates = parksService.getFavorateParks();
        }
    })
    .controller('ngCordovaCtrl', function ($cordovaVibration, $cordovaCamera,
        $cordovaCapture, $http, $cordovaDialogs, $rootScope, $cordovaFileTransfer) {
        var vm = this;
        vm.percentage = 0;
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
                    params: {
                        filename : video.name
                    },
                    headers: {
                        Connection: "close"
                    }
                };

                //$rootScope.$broadcast('loading:show');
                var watch = new StopWatch();
                watch.Start();
                $cordovaFileTransfer.upload(serverUrl,
                    path, options)
                    .then(function (d) {
                        watch.Stop();
                        $rootScope.$broadcast('loading:hide');
                        var parkImage = JSON.parse(d.response);
                        vm.videoUrl = parkImage.ImageUri;
                        //vm.videoContentType = parkImage.ContentType;
                        vm.videoContentType = video.type;
                        $cordovaDialogs.alert("儲存成功, " + watch.ElapsedMilliseconds + "msec", "資訊", "確定");
                    }, function (d) {
                        watch.Stop();
                        $rootScope.$broadcast('loading:hide');
                        $cordovaDialogs.alert("儲存失敗, " + watch.ElapsedMilliseconds + "msec", "錯誤", "確定");
                    }, function (progress) {
                        if (progress.lengthComputable) {
                            var perc = Math.floor(progress.loaded / progress.total * 100);
                            vm.percentage = perc;
                        }
                    }
                );
            }, function (err) {
                // An error occurred. Show a message to the user
                alert(err);
            });
        }
    })
;


// Create a stopwatch "class."
var StopWatch = function()
{
    this.StartMilliseconds = 0;
    this.ElapsedMilliseconds = 0;
}

StopWatch.prototype.Start = function()
{
    this.StartMilliseconds = new Date().getTime();
}

StopWatch.prototype.Stop = function()
{
    this.ElapsedMilliseconds = new Date().getTime() - this.StartMilliseconds;
}
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

    .controller('ParksCtrl', function ($scope, parksService) {
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


        $scope.getParks = function () {

            var where = undefined;
            if ($scope.searchText) where = "ParkName:" + $scope.searchText;
            parksService.getParks(where, $scope.skip, $scope.limit).then(function (data) {
                $scope.parks = data;
            });
        }

        $scope.getParks();
    })

    .controller('ParkCtrl', function ($scope, parksService, $stateParams) {
        $scope.park = parksService.getPark($stateParams.parkId);
        $scope.getDesc = function () {
            return $scope.park.Introduction.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        console.log($scope.park);
    })
    .controller('AreasCtrl', function ($scope, areaService) {
        $scope.areas = areaService.getAreas();
    })
    .controller('AreaCtrl', function ($scope, parksService, $stateParams) {
        $scope.parks = parksService.getParksInArea($stateParams.area);
        $scope.title = $stateParams.area;
    });

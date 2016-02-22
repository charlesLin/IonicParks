// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('SampleApp', ['ionic', 'SampleApp.controllers', 'ngCordova', 'LocalStorageModule'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })

            .state('app.areas', {
                url: '/areas',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/areas.html',
                        controller: 'AreasCtrl'
                    }
                }
            })

            .state('app.area', {
                url: '/areas/:area',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/parks.html',
                        controller: 'AreaCtrl'
                    }
                }
            })
            .state('app.parks', {
                url: '/parks',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/parks.html',
                        controller: 'ParksCtrl'
                    }
                }
            })

            .state('app.park', {
                url: '/parks/:parkId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/park.html',
                        controller: 'ParkCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.favorates', {
                url: '/favorates',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/favorates.html',
                        controller: 'FavorateCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.ngCordova',
                {
                    url: '/ngCordova',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/ngCordova.html',
                            controller: 'ngCordovaCtrl',
                            controllerAs: 'vm'
                        }
                    }
                });
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/parks');
    })
    .constant("ApiEndpoint", {
        url: 'http://data.taipei/opendata'
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($rootScope, $q) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                requestError: function (rejection) {
                    $rootScope.$broadcast('loading:hide');
                    return $q.reject(rejection);
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                responseError: function (rejection) {
                    console.log("Rejecton !");
                    console.log(rejection);
                    $rootScope.$broadcast('loading:hide');
                    return $q.reject(rejection);
                }
            }
        });
    })
    .config(function ($provide) {
        $provide.decorator("$exceptionHandler", ['$delegate', '$window',
            function ($delegate, $window) {
                return function (exception, cause) {
                    // if ($window.atatus) {
                    //     $window.atatus.notify(exception);
                    // }
                    alert(exception.toString());
                    // (Optional) Pass the error through to the delegate
                    $delegate(exception, cause);
                }
            }]);
    })
    .run(function ($rootScope, $ionicLoading) {
        $rootScope.$on("loading:show", function () {
            $ionicLoading.show({ template: '<ion-spinner icon="spiral" />' });
        })

        $rootScope.$on("loading:hide", function () {
            $ionicLoading.hide();
        })

    })
    .run(function ($cordovaPush, $cordovaToast, $rootScope, notificationService) {
        var androidConfig = {
            "senderID": "392821285701",
        };

        document.addEventListener("deviceready", function () {
            $cordovaPush.register(androidConfig).then(function (result) {
                // Success
                console.log("Register success " + result);
                $cordovaToast.showShortCenter('Registered for push notifications');

            }, function (err) {
                // Error
                 console.log("Register error " + err)
            })

            $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                switch (notification.event) {
                    case 'registered':
                        if (notification.regid.length > 0) {
                            alert('registration ID = ' + notification.regid);
                            notificationService.register(notification.regid).then(function (resp) {
                                alert(resp);
                            });
                        }
                        break;

                    case 'message':
                        // this is the actual push notification. its format depends on the data model from the push server
                        //alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                        $cordovaToast.showShortCenter(notification.message);
                        break;

                    case 'error':
                        alert('GCM error = ' + notification.msg);
                        break;

                    default:
                        alert('An unknown GCM event has occurred');
                        break;
                }
            });


            // WARNING: dangerous to unregister (results in loss of tokenID)
            $cordovaPush.unregister(options).then(function (result) {
                // Success!
            }, function (err) {
                // Error
            })

        }, false);
    })
    .filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])
    .directive('dynamicUrl', function () {
        return {
            restrict: 'A',
            scope: {
                dynamicUrlSrc: '='
            },
            link: function (scope, element, attr) {
                scope.$watch("dynamicUrlSrc", function (newValue, oldValue) {
                    element.attr('src', newValue);
                });

            }
        };
    })
//https://forum.ionicframework.com/t/signaturedirective-in-ionic-using-szimek-signature-pad/13179/6
//https://github.com/sonicd300/TNF-IonicUtils
//https://github.com/szimek/signature_pad
    .directive('signature', function ($ionicModal) {
        var canvas = null,
            ratio = 1.0;

        return {
            scope: {
                signature: '=ngModel'
            },
            link: function ($scope, $element, $attrs, $controller) {
                $scope.signature = null;
                $scope.signaturePadModel = {};

                $ionicModal.fromTemplateUrl('templates/signature/signaturePad.html', {
                    animation: 'slide-in-up',
                    scope: $scope,
                }).then(function (modal) {
                    $scope.signatureModal = modal;
                });

                $scope.$on('$destroy', function () {
                    $scope.signatureModal.remove();
                });

                $scope.openSignatureModal = function () {
                    $scope.signatureModal.show();
                    canvas = angular.element($scope.signatureModal.modalEl).find('canvas')[0];

                    $scope.signaturePad = new SignaturePad(canvas, {
                        backgroundColor: '#FFF',
                        minWidth: 1,
                        maxWidth: 1.5,
                        dotSize: 3,
                        penColor: 'rgb(66, 133, 244)',
                        onEnd: function () {
                            $scope.signature = $scope.signaturePad.toDataURL();
                        }
                    });

                    if ($scope.signature) {
                        $scope.signaturePad.fromDataURL($scope.signature);
                    }
                    $scope.resizeCanvas();
                };

                $scope.resizeCanvas = function () {
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext('2d').scale(ratio, ratio);
                };

                $scope.clear = function () {
                    $scope.signaturePadModel.signatureConfirm = false;
                    $scope.signaturePad.clear();
                    $scope.signature = null;
                };

                $scope.save = function () {
                    $scope.signaturePadModel = {};
                    $scope.signatureModal.hide();
                };
            },
            require: 'ngModel',
            replace: true,
            restrict: 'A',
            templateUrl: 'templates/signature/signaturePadButton.html'
        };
    });
;
;
;

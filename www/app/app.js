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
        $httpProvider.interceptors.push(function ($rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show')
                    return config
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide')
                    return response
                }
            }
        });
    })
    .run(function ($rootScope, $ionicLoading) {
        $rootScope.$on("loading:show", function () {
            $ionicLoading.show({ template: '<ion-spinner icon="spiral" />' });
        })

        $rootScope.$on("loading:hide", function () {
            $ionicLoading.hide();
        })

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
              dynamicUrlSrc : '='
            },
            link: function (scope, element, attr) {
                scope.$watch("dynamicUrlSrc", function (newValue, oldValue) {
                    element.attr('src', newValue);
                 });

            }
        };
    });
;
;
;

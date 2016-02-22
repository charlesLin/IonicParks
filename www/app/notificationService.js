(function () {
    'use strict';

    angular
        .module('SampleApp')
        .factory('notificationService', notificationService);

    notificationService.$inject = ['$http'];
    function notificationService($http) {
        var service = {
            register: register
        };

        return service;

        ////////////////
        function register(deviceId) {
            return $http.post("http://parks.azurewebsites.net/Notifications/registerDevice", { deviceId: deviceId });
        }
    }
})();
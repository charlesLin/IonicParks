(function() {
'use strict';

    angular
        .module('SampleApp')
        .factory('scheduleService', scheduleService);

    scheduleService.$inject = ['$http'];
    function scheduleService($http) {
        var service = {
            saveToServer:saveToServer
        };

        return service;

        ////////////////
        function saveToServer() {

         }
    }
})();
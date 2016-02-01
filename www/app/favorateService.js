(function () {
    'use strict';

    angular
        .module('SampleApp')
        .service('favorateService', favorateService);

    favorateService.$inject = ['localStorageService'];
    function favorateService(localStorageService) {
        this.addFavorate = addFavorate;
        this.hasFavorate = hasFavorate;

        var favorates = [];
        init();
        function init() {
            debugger;
            favorates = localStorageService.get("favorates");
            if (!favorates) favorates = [];
        }
        ////////////////
        function addFavorate(parkId) {
            if (favorates.indexOf(parkId) < 0) {
                favorates.push(parkId);
                localStorageService.set("favorates", favorates);
            }
        }

        function hasFavorate(parkId) {
            return favorates.indexOf(parkId) > -1;
        }
    }
})();
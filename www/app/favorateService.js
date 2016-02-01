(function () {
    'use strict';

    angular
        .module('SampleApp')
        .service('favorateService', favorateService);

    favorateService.$inject = ['localStorageService'];
    function favorateService(localStorageService) {
        this.addFavorate = addFavorate;
        this.hasFavorate = hasFavorate;
        this.removeFavorate = removeFavorate;
        this.getFavorateIds = getFavorateIds;
        this.saveFavorates = saveFavorates;


        var favorates = [];
        init();
        function init() {
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

        function removeFavorate(id) {
            var index = favorates.indexOf(id);
             favorates.splice(index, 1);
            localStorageService.set("favorates", favorates);
        }

        function getFavorateIds() {
            return favorates;
        }

        function saveFavorates(parks) {
            var favorates = _.map(parks, '_id');
            localStorageService.set("favorates", favorates);

        }
    }
})();
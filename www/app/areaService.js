(function () {
    'use strict';

    angular
        .module('SampleApp')
        .service('areaService', areaService);

    areaService.$inject = [];
    function areaService() {
        this.getAreas = getAreas;

        ////////////////
        function getAreas() {
            var areas = ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'];
            return areas;
        }
    }
})();

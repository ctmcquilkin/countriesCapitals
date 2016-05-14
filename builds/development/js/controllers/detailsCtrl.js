CountriesCapitals.controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', 'countryRequest', function ($scope, $routeParams, countryService, countryRequest) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();
        $scope.currentSelectedCountry = countryService.selected; 
        $scope.currentSelectedCountryCapital = countryService.selected.capital;
        var countryCode = countryService.selected.countryCode;
        $scope.mapBg = 'http://www.geonames.org/flags/x/' + countryCode + '.png) center center no-repeat';

        $scope.capitalFilter = function(geonames) {
          return geonames.fcodeName === "capital of a political entity";
        };

        countryRequest(['http://api.geonames.org/searchJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr', 'http://api.geonames.org/neighboursJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr']).then(function(datas){
            $scope.capitalData = datas[0].geonames;
            $scope.NeighbourData = datas[1].geonames;
          })
    }]);
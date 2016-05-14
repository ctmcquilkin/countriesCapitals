CountriesCapitals.controller('listCtrl', ['$rootScope', '$scope', '$window', 'allCountriesRequest', '$routeParams', 'countryService', 'countryRequest', 'sortable', '$filter', function ($rootScope, $scope, $window, allCountriesRequest, $routeParams, countryService, countryRequest, sortable, $filter) {

      $scope.params = $routeParams;

    $rootScope.query = '';
  
    $scope.gridToggleList = true;
    
//    console.log($scope.gridToggleList);
    $scope.action = function(){
      if ($scope.gridToggleList) {
        $scope.gridToggleThumb = true;
        $scope.gridToggleList = false;
//        console.log($scope.gridToggleList);
      } else {
        $scope.gridToggleThumb = false;
        $scope.gridToggleList = true;
//        console.log($scope.gridToggleList);
      }

    };  

    $scope.onQueryChange = function(val){
       $rootScope.query = val;
       $scope.search();
    };


       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
           sortable($scope, $scope.countries, 6, 'countryName');
      
       });

      $scope.displayCountry = function() {
          var selectedCountry = this.country; // selected country object
          var countryNameStr = selectedCountry.countryName.replace(/\s+/g, '_')

          countryService.selected.countryCode = selectedCountry.countryCode;
          countryService.saveData({ 'countryCode' : selectedCountry.countryCode, 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'capital' : selectedCountry.capital });

          $window.location.assign('#/countries/' + countryNameStr);
      };
  }]);
CountriesCapitals.factory('countryRequest',function($q,$http){
  
    return function(files){
  
    var promises = [];
  
    angular.forEach(files, function(file){
    
      var deffered  = $q.defer();
  
      $http({
        url : file,
        method: 'GET'
      }).success(function(data){
        deffered.resolve(data);
      }).
      error(function(error){
        deffered.reject();
      });
    
      promises.push(deffered.promise);

    })
  
    return $q.all(promises);
    }
  
  });
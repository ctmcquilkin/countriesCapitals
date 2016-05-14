CountriesCapitals.factory('countryService', function() {  
    var countryData = [];
    return {
      selected: {
        countryCode : 'US' // because I need a default value
      },
      saveData: function(data) {
        countryData.push(data);
      },
      getData: function() {
        return countryData;
      }
    };
  });
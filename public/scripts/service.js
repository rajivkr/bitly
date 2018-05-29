urlApp.factory('UrlService', ['$rootScope', '$http', '$log', '$q', function ($rootScope, $http, $log, $q) {
    return {
        submit: function (urlModel) {
            let deferred = $q.defer();
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    'dataType': 'json'
                }
            };
            $http.post('/url', urlModel, config)
                .then(function (response, status, headers, config) {
                    let shortUrl = response.data.frontUrl + response.data.url.shortUrl;
                    deferred.resolve(shortUrl);
                }).catch(function (response, status, headers, config) {
                console.log('error', response);
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }
}]);
// CONTROLLERS
urlApp.controller('homeController', ['$scope', 'UrlService', function ($scope, UrlService) {

    $scope.shortened_url = '';

    $scope.urlSubmit = function () {
        console.info('inside submit');
        UrlService.submit($scope.url).then(function (data) {
            $scope.shortened_url = data;
        }).catch((err) => {
            if (err)
                console.error(err);
        });
    };
}]);

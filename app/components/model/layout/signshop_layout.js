

catwalkApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('signshop', {
            abstract: false,
            url: "/signshop",
            templateUrl: "components/model/layout/signshop_layout.html"
        })

     }
]);

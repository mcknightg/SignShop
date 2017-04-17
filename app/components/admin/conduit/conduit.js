catwalkApp.controller('ConduitController', ['$scope','$global.services','$stateParams','Account',
    function ($scope,$services,$stateParams,Account) {
        $scope.account_service = Account;
    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
         
        $stateProvider
            .state('conduiteditor', {
                url: "/conduiteditor",
                templateUrl: "components/admin/conduit/editor.html",
                controller: "ConduitController",
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
    }
]);
catwalkApp.directive("conduitEditor", angularConduitEditor );
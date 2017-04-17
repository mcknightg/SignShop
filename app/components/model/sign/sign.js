'use strict';

//  Signshop Sign Controller
catwalkApp.controller('SignshopSignController', ['$scope','$location','$stateParams','$global.services', 'SignshopSign',
    function ($scope,location,$stateParams,$services, service) {
        $scope.name = "Sign";
        $scope.listParams = {rows:12,page:1,defaultsearchoper:"icn"};
        $scope.srchterm = '';

        $scope.get = function(id){
            $scope.modelData = service.get({id: id});
        };
        $scope.setPage = function(page){
            $scope.listParams.page = page;
            $scope.list();
        };
        $scope.search = function(){
            if($scope.srchterm && $scope.srchterm !== '' ){
                $scope.listParams['filterByFields'] =  {'name':$scope.srchterm};
            }else{
                $scope.listParams['filterByFields'] = {};
            }
            $scope.list();
        };
        $scope.save = function(){
            service.save($scope.modelData,function(){
                  $scope.back();
            });
        };

        $scope.list = function(){
            $scope.modelList = service.query($scope.listParams);
        };

        $scope.remove = function(id){
            service.delete({id: id}, function () {

            });
        };

        $scope.new= function(){
            location.path('/signshop/sign/');
        };

        $scope.update= function(id){
            location.path('/signshop/sign/' + id);
        };

        $scope.back = function () {
            window.history.back();
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}
    }
]);

//  Signshop Sign Routing
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
        .state('signshop.sign', {
            url: "/sign",
            templateUrl: "components/model/sign/signTable.html",
            controller: 'SignshopSignController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('signshop.signForm', {
            url: "/sign/:id",
            templateUrl: "components/model/sign/signForm.html",
            controller: 'SignshopSignController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
     }
]);

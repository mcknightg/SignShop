'use strict';

//  Signshop Material Controller
catwalkApp.controller('SignshopMaterialController', ['$scope','$location','$stateParams','$global.services', 'SignshopMaterial',
    function ($scope,location,$stateParams,$services, service) {
        $scope.name = "Material";
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
            location.path('/signshop/material/');
        };

        $scope.update= function(id){
            location.path('/signshop/material/' + id);
        };

        $scope.back = function () {
            window.history.back();
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}
    }
]);

//  Signshop Material Routing
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
        .state('signshop.material', {
            url: "/material",
            templateUrl: "components/model/material/materialTable.html",
            controller: 'SignshopMaterialController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('signshop.materialForm', {
            url: "/material/:id",
            templateUrl: "components/model/material/materialForm.html",
            controller: 'SignshopMaterialController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
     }
]);

'use strict';

//  Signshop Customer Controller
catwalkApp.controller('SignshopCustomerController', ['$scope','$location','$stateParams','$global.services', 'SignshopCustomer',
    function ($scope,location,$stateParams,$services, service) {
        $scope.name = "Customer";
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
            location.path('/signshop/customer/');
        };

        $scope.update= function(id){
            location.path('/signshop/customer/' + id);
        };

        $scope.back = function () {
            window.history.back();
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}
    }
]);

//  Signshop Customer Routing
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
        .state('signshop.customer', {
            url: "/customer",
            templateUrl: "components/model/customer/customerTable.html",
            controller: 'SignshopCustomerController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('signshop.customerForm', {
            url: "/customer/:id",
            templateUrl: "components/model/customer/customerForm.html",
            controller: 'SignshopCustomerController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
     }
]);

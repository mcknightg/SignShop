

'use strict';
var signshop_base_url  = base_url  + 'signshop/';
catwalkApp.factory('SignshopBaseService', ['$resource',
    function ($resource) {
            var factory = {};
            factory.getBaseUrl = function(){return signshop_base_url;};
            factory.getEntityUrl = function(entity){ return factory.getBaseUrl() + entity + "/";};
            factory.getResource = function(url,paramDefaults,actions,options){
                actions=angular.extend(actions,{
                    'query':{method:'GET',
                        transformResponse:function(data,headers){
                            return JSON.parse(data);
                        }
                    },
                    'get':{method:'GET'}
                    });
                return $resource(url+':id',paramDefaults,actions,options);
            };
            return factory;
    }
]);

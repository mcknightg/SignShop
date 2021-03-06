'use strict';

//  Signshop Customer Service
catwalkApp.factory('SignshopCustomer', ['SignshopBaseService',function (SignshopBaseService) {
    var entityUrl = SignshopBaseService.getEntityUrl('customer');
    return SignshopBaseService.getResource(entityUrl,{},{
        'columns':{method: 'POST', params:{},url:entityUrl + 'columns'},
        'api':{method: 'POST', params:{},url:entityUrl + 'api'},
        'schema':{method: 'POST', params:{},url:entityUrl + 'schema'}
    });
}
]);

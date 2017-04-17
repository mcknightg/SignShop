'use strict';

//  Signshop Customersigns Service
catwalkApp.factory('SignshopCustomersigns', ['SignshopBaseService',function (SignshopBaseService) {
    var entityUrl = SignshopBaseService.getEntityUrl('customersigns');
    return SignshopBaseService.getResource(entityUrl,{},{
        'columns':{method: 'POST', params:{},url:entityUrl + 'columns'},
        'api':{method: 'POST', params:{},url:entityUrl + 'api'},
        'schema':{method: 'POST', params:{},url:entityUrl + 'schema'}
    });
}
]);

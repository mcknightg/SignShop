'use strict';

//  Signshop Sign Service
catwalkApp.factory('SignshopSign', ['SignshopBaseService',function (SignshopBaseService) {
    var entityUrl = SignshopBaseService.getEntityUrl('sign');
    return SignshopBaseService.getResource(entityUrl,{},{
        'columns':{method: 'POST', params:{},url:entityUrl + 'columns'},
        'api':{method: 'POST', params:{},url:entityUrl + 'api'},
        'schema':{method: 'POST', params:{},url:entityUrl + 'schema'}
    });
}
]);

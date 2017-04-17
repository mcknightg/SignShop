'use strict';

//  Signshop Material Service
catwalkApp.factory('SignshopMaterial', ['SignshopBaseService',function (SignshopBaseService) {
    var entityUrl = SignshopBaseService.getEntityUrl('material');
    return SignshopBaseService.getResource(entityUrl,{},{
        'columns':{method: 'POST', params:{},url:entityUrl + 'columns'},
        'api':{method: 'POST', params:{},url:entityUrl + 'api'},
        'schema':{method: 'POST', params:{},url:entityUrl + 'schema'}
    });
}
]);

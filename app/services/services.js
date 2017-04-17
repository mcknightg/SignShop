catwalkApp.service('$global.services', [
    'SignshopSign',
    'SignshopMaterial',
    'SignshopCustomer',
    'SignshopCustomersigns',
    'UserManagerApplicationAuthority',
    'UserManagerApplicationPersistentToken',
    'UserManagerApplicationUser',
    'UserManagerApplicationUserAuthority',
    'UserManagerAppPassResetToken',
    'Account',
    'AppAPI',
function(
    SignshopSign,
    SignshopMaterial,
    SignshopCustomer,
    SignshopCustomersigns,
    UserManagerApplicationAuthority,
    UserManagerApplicationPersistentToken,
    UserManagerApplicationUser,
    UserManagerApplicationUserAuthority,
    UserManagerAppPassResetToken,
    Account,
    AppAPI
) {
            this.SignshopSign = SignshopSign;
            this.SignshopMaterial = SignshopMaterial;
            this.SignshopCustomer = SignshopCustomer;
            this.SignshopCustomersigns = SignshopCustomersigns;
            this.UserManagerApplicationAuthority = UserManagerApplicationAuthority;
            this.UserManagerApplicationPersistentToken = UserManagerApplicationPersistentToken;
            this.UserManagerApplicationUser = UserManagerApplicationUser;
            this.UserManagerApplicationUserAuthority = UserManagerApplicationUserAuthority;
            this.UserManagerAppPassResetToken = UserManagerAppPassResetToken;
            this.Account = Account;
        this.api = AppAPI;
}
]);

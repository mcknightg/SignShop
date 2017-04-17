(function () {
    function SessionVars() {
        this.sessionvars = {
            account:{
                login:null,
                firstname:null,
                lastName:null,
                email:null,
                roles:[]
            },
            userRoles:{
                all: '*',
                admin: 'ROLE_ADMIN',
                superUser: 'ROLE_SUPER_USER',
                user: 'ROLE_USER'
            }
        }
    }
    SessionVars.prototype.init = function($scope){
        this.sessionvars = $.extend(this.sessionvars,$scope);
        console.log(this.sessionvars);
    };
    SessionVars.prototype.isAuthenticated = function(){
        return this.getAccount()['login'];
    };
    SessionVars.prototype.getAccount = function(){
           return this.sessionvars.account;
    };
    SessionVars.prototype.isAdmin = function(){
        return this.isAuthorized('ROLE_ADMIN');
    };
    SessionVars.prototype.isSuperUser = function(){
          return this.isAuthorized('ROLE_SUPER_USER');
    };
    SessionVars.prototype.isAuthorized = function(role){
        return this.isAuthenticated() && this.sessionvars.account.roles.indexOf(role) !== -1;
    };

    window.session = new SessionVars();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.session );
})(jQuery);
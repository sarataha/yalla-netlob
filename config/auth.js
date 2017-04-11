// config/auth.js

module.exports = {

    'facebookAuth' : {
        'clientID'      : '1031532060279984',
        'clientSecret'  : '1dd2513ee0dca7aa76e286fdf138240c',
        'callbackURL'   : 'http://localhost:8090/auth/facebook/callback',
        'profileFields' : ['emails', 'name', 'photos', 'displayName']
    },

    'twitterAuth' : {
        'consumerKey'       : 'swa8XQeLOivtBATEeqCD4rcEP',
        'consumerSecret'    : 'NYxPJNGANRW65ZUr4i60be6apYSXkUYbl62YAGMfs6YeGlmS0P',
        'callbackURL'       : 'http://localhost:8090/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '988054688750-tofg1magugdef4hbpf468ms212ihnc81.apps.googleusercontent.com',
        'clientSecret'  : 'CiAx24oytEcfh514USEcQKBl',
        'callbackURL'   : 'http://127.0.0.1:8090/auth/google/callback'
    }

};
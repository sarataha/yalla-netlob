// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1031532060279984', // your App ID
        'clientSecret'  : '1dd2513ee0dca7aa76e286fdf138240c', // your App Secret
        'callbackURL'   : 'http://localhost:8090/auth/facebook/callback',
        'profileFields' : ['emails', 'name'],
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8090/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8090/auth/google/callback'
    }

};
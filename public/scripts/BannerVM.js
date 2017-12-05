class BannerVM {
  constructor() {
    this.vm = new Vue({
      // element to mount to
      el: '#banner',
      // initial data
      data: {
        isSignedIn: false
      },
      // firebase binding
      // https://github.com/vuejs/vuefire
      firebase: {
        users: firebase.database().ref('users')
      },
      // methods
      methods: {

        signinGoogle: function () {
          // https://firebase.google.com/docs/auth/web/google-signin
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithRedirect(provider);
        },

        signoutGoogle: function () {
          // https://firebase.google.com/docs/auth/web/google-signin
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("Signout Successful")
          }).catch(function(error) {
            // An error happened.
            console.log(error)
          });
        }
      },
      // 'created' lifecycle hook
      created: function () {
        firebase.auth().onAuthStateChanged(user => {
          if (user) console.log(user)
          this.isSignedIn = (user) ? true : false
        });
      }

    // end new
    })
  // end constructor
  }
// end class
}

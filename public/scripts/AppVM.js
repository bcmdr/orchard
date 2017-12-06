class AppVM {
  constructor() {
    let date = new Date()
    this.vm = new Vue({
      // element to mount to
      el: '#app',
      // initial data
      data: {
        isSignedIn: false,
        signInStatusKnown: false,
        date: date,
        tree: {
          title: "Write Code"
        },
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
      computed: {
        today: function() {
          var options = { weekday: 'long', month: 'long', day: 'numeric' }
          return this.date.toLocaleDateString('en-us', options)
        }
      },
      // 'created' lifecycle hook
      created: function () {
        firebase.auth().onAuthStateChanged(user => {
          if (user) console.log(user)
          this.isSignedIn = (user) ? true : false
          this.signInStatusKnown = true
        });
      }

    // end new
    })
  // end constructor
  }
// end class
}

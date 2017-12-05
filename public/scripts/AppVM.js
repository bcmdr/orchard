class AppVM {
  constructor() {
    this.vm = new Vue({
      // element to mount to
      el: '#app',
      // initial data
      data: {

      },
      // firebase binding
      // https://github.com/vuejs/vuefire
      firebase: {
        users: firebase.database().ref('users')
      },
      // computed property for form validation state
      computed: {
        // validation: function () {
        //   return {
        //     name: !!this.newUser.name.trim(),
        //     email: emailRE.test(this.newUser.email)
        //   }
        // },
        // isValid: function () {
        //   var validation = this.validation
        //   return Object.keys(validation).every(function (key) {
        //     return validation[key]
        //   })
        // }
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

        // addUser: function () {
        //   if (this.isValid) {
        //     usersRef.push(this.newUser)
        //     this.newUser.name = ''
        //     this.newUser.email = ''
        //   }
        // },
        // removeUser: function (user) {
        //   usersRef.child(user['.key']).remove()
        // }
      }
    })
  }
}

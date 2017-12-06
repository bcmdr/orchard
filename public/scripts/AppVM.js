class AppVM {
  constructor() {
    Vue.component('user-tree', {
      template: `
        <div class="mdl-cell mdl-cell--4-col">
          <div class="user-tree tree-card-wide mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text">{{title}}</h2>
            </div>
            <div class="mdl-card__supporting-text">
              <p>{{description}}</p>
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                Done
              </a>
            </div>
            <div class="mdl-card__menu">
              <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" v-on:click="$emit('remove')">
                <i class="material-icons">remove_circle_outline</i>
              </button>
            </div>
          </div>
        </div>
      `,
      props: [
        'id', 'title', 'description'
      ]
    })

    new Vue({
      // element to mount to
      el: '#app',
      // initial data
      data: {
        isSignedIn: false,
        signInStatusKnown: false,
        date: new Date(),
        newTreeTitle: '',
        newTreeDescription: '',
        trees: [
          {
            id: 1,
            title: 'Work On Orchard',
            description: '3 Git Pushes per Day'
          }
        ],
        nextTodoId: 2,
      },
      // firebase binding
      // https://github.com/vuejs/vuefire
      firebase: {
        users: firebase.database().ref('users')
      },
      computed: {
        today: function() {
          var options = { weekday: 'short', month: 'short', day: 'numeric' }
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
        },

        addNewTree: function () {
          if (!this.newTreeTitle || !this.newTreeDescription)
            return
          this.trees.push({
            id: this.nextTreeId++,
            title: this.newTreeTitle,
            description: this.newTreeDescription
          })
          this.newTreeTitle = ''
          this.newTreeDescription = ''
        }

      },


    // end new
    })
  // end constructor
  }
// end class
}

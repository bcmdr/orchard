function loadAppVM() {
  let userFruitComponent = {
    template: `
      <div class="mdl-cell mdl-cell--12-col">
        <div class="user-fruit fruit-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">{{title}}</h2>
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="collect-button mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" v-on:click="$emit('increment')">
              Collect
            </a>
            <button v-on:click="$emit('decrement')" v-for="n in collectCount" class="fruit-indicator mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i class="material-icons">check_circle</i>
            </button>
          </div>
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" v-on:click="$emit('remove')">
              <i class="material-icons">edit</i>
            </button>
          </div>
        </div>
      </div>
    `,
    props: [
      'title', 'collectCount'
    ]
  }

  // Firebase Refs
  let fruitsRef = firebase.database().ref('fruits')
  let usersRef = firebase.database().ref('users')

  // Vue Model
  let vm = new Vue({
    // element to mount to
    el: '#app',
    // initial data
    data: {
      loading: true,
      isSignedIn: false,
      signInStatusKnown: false,
      date: new Date(),
      newFruit: {
        title: '',
        collectCount: 0,
      },
    },
    // firebase binding
    // https://github.com/vuejs/vuefire
    firebase: {
      fruits: fruitsRef,
      users: usersRef,
    },
    computed: {
      today: function() {
        var options = { weekday: 'short', month: 'short', day: 'numeric' }
        return this.date.toLocaleDateString('en-us', options)
      },
      newFruitValidation: function () {
        return {
          name: !!this.newFruit.title.trim(),
        }
      },
      newFruitIsValid: function () {
        var validation = this.newFruitValidation
        return Object.keys(validation).every(function (key) {
          return validation[key]
        })
      },
      fruitsKnownEmpty: function () {
        // true if loaded and fruits array is empty
        return !(this.loading) && (this.fruits.length === 0)
      }
    },

    created: function () {
      firebase.auth().onAuthStateChanged(user => {
        if (user) console.log(user)
        this.isSignedIn = (user) ? true : false
        this.signInStatusKnown = true
      });
    },

    mounted: function () {
      fruitsRef.once('value', snapshot => {
        this.loading = false
      })
    },

    components: {
      'user-fruit': userFruitComponent
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

      addNewFruit: function () {
        if (this.newFruitIsValid) {
          fruitsRef.push(this.newFruit)
          this.newFruit.title = ''
          this.newFruit.collectCount = 0
        }
      },

      removeFruit: function(key) {
        fruitsRef.child(key).remove()
      },

      incrementCollectCount: function(key) {
        fruitsRef.child(key).child('collectCount').transaction(function(collectCount) {
          if (typeof collectCount === 'number') {
            collectCount = collectCount + 1;
          }
          return collectCount;
        })
      },

      decrementCollectCount: function(key) {
        fruitsRef.child(key).child('collectCount').transaction(function(collectCount) {
          if (typeof collectCount === 'number') {
            collectCount = collectCount - 1;
          }
          return collectCount;
        })
      }
    },

  // end new
  })
}

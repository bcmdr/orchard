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
              <span class="collect-marker"><i class="material-icons">check_circle</i></span>
            </button>
          </div>
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" v-on:click="$emit('remove')">
              <i class="material-icons">delete</i>
            </button>
          </div>
        </div>
      </div>
    `,
    props: [
      'title', 'collectCount'
    ]
  }

  let demoFruitComponent = {
    template: `
      <div class="mdl-cell mdl-cell--12-col">
        <div class="demo-fruit fruit-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">{{title}}</h2>
          </div>
          <div class="mdl-card__supporting-text">
            {{description}}
          </div>
        </div>
      </div>
    `,
    props: [
      'title', 'description'
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
      // firebase binded
      fruits: [],
      user: {},
      // vue binded
      usersRef: usersRef,
      isSignedIn: false,
      signInStatusKnown: false,
      readyToDisplayFruits: false,
      date: new Date(),
      newFruit: {
        title: ''
      },
      demoFruits: [
        {
          id: 1,
          title: "Welcome to Orchard",
          description: "Orchard helps grow better habits, one day at a time."
        },
        {
          id: 2,
          title: "This is a Fruit Tree",
          description: "It represents something you'd like to do at least once a day."
        },
        {
          id: 3,
          title: "Collect Fruit for a Better You",
          description: "The more you do, the more you get!"
        },
      ],
    },
    // firebase binding
    // https://github.com/vuejs/vuefire
    // firebase: function () {
    //   console.log(this.fruitsRef)
    //   return {
    //     fruits: this.fruitsRef
    //   }
    // },

    // computed
    computed: {
      fruitsLoaded: function() {
        return true // TODO: verify database connection somehow
      },
      today: function() {
        var options = { weekday: 'long', month: 'short', day: 'numeric' }
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
        // return !(this.loading) && (this.fruits.length === 0)
        return true //TODO: refactor out
      },
      // TODO: refactor to "user fruits ref"
      fruitsRef: function () {
        let currentUser = firebase.auth().currentUser
        if (!currentUser) {
          throw new Error('Not Signed In')
        }
        return fruitsRef.child(currentUser.uid)
      },
      userRef: function () {
        let currentUser = firebase.auth().currentUser
        if (!currentUser) {
          throw new Error('Not Signed In')
        }
        return currentUser && usersRef.child(currentUser.uid)
      },
    },

    // lifecycle hooks
    created: function () {
      // handle user state changes (sign in, sign out)
      firebase.auth().onAuthStateChanged(user => {
        let vm = this

        if (user) {
          let userId = user.uid
          vm.userId = userId
          // bind vue array 'fruits' to user fruits reference in db
          vm.$bindAsArray('fruits', fruitsRef.child(userId), () =>  {
            // callback on cancel fruits binding
            vm.fruits = []
          }, () => {
            // callback on fruits binding ready
            this.readyToDisplayFruits = true;
          })

          // check if user exists in database
          this.usersRef.child(userId).once('value', snapshot => {
            // if not, create a new user object in the database
            let user = snapshot.val()

            if (!user) {
              this.usersRef.child(userId).set({
                totalCollectCount: 0,
                lastSignInDate: Date.now(),
              })
            } else {
              // if so, save and set successive sign in data
              vm.$bindAsObject('user', this.usersRef.child(userId))

              // refresh fruits if next day then update last sign in date
              let lastSignInDate = (new Date(user.lastSignInDate)).getDate()
              let todaysDate = (new Date()).getDate()
              if (todaysDate > lastSignInDate) {
                //refresh user fruits
                this.fruits.forEach(fruit => {
                  this.fruitsRef.child(fruit['.key']).update({
                    collectCount: 0
                  })
                })
              }

              // update this sign in date
              this.usersRef.child(userId).update({
                lastSignInDate: Date.now()
              })

            }
          })

        }

        this.isSignedIn = (user) ? true : false // TODO refactor to computed value
        this.signInStatusKnown = true

      });
    },
    // Mounted lifecycle hook
    mounted: function () {
      return
    },

    // components
    components: {
      'user-fruit': userFruitComponent,
      'demo-fruit': demoFruitComponent,
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
        firebase.auth().signOut()
      },
      addNewFruit: function () {
        if (this.newFruitIsValid) {
          this.fruitsRef.push({
            title: this.newFruit.title,
            collectCount: 0,
          })
          this.newFruit.title = ''
        }
      },
      removeFruit: function(key) {
        let canDelete = confirm("Are you sure you'd like to delete this fruit?")
        if (canDelete) {
          // decrement the fruit from the total
          this.fruitsRef.child(key).once('value', (snapshot) => {
            let currentUser = firebase.auth().currentUser
            let fruit = snapshot.val()
            if (currentUser && fruit) {
              this.usersRef.child(currentUser.uid).child('totalCollectCount').transaction(value => {
                return (typeof value === 'number') ? value -= fruit.collectCount : value
              })
            }
          });

          // delete the fruit record
          this.fruitsRef.child(key).remove()

        }
      },
      incrementCollectCountBy: function(key, amount) {
        // Called on collection or uncollection of fruit
        // Needs to update local and total fruit counts
        let currentUser = firebase.auth().currentUser
        let dbRefs = [
          this.fruitsRef.child(key).child('collectCount'),
          this.usersRef.child(currentUser.uid).child('totalCollectCount'),
        ]
        dbRefs.forEach(ref => {
          ref.transaction(function(value) {
            return (typeof value === 'number') ? value += amount : value
          })
        })
      },
    } // end {methods}
  }) // end new
} // end funciton

class UserVM {
  constructor() {
    this.vm = new Vue({
      // element to mount to
      el: '#main',
      // initial data
      data: {
        date: new Date();
      },
      // firebase binding
      // https://github.com/vuejs/vuefire
      firebase: {
        users: firebase.database().ref('users')
      },

      computed: {
        today: function() {
          return this.date
        }
      }

      // methods
      methods: {

      },
      // 'created' lifecycle hook
      created: function () {

      }

    // end new
    })
  // end constructor
  }
// end class
}

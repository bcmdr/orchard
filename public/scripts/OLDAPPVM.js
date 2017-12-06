class OLDAppVM {
  constructor() {
    let date = new Date()
    this.vm = new Vue({
      // element to mount to
      el: '#app',
      // initial data
      data: {
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

      computed: {
        today: function() {
          var options = { weekday: 'long', month: 'long', day: 'numeric' }
          return this.date.toLocaleDateString('en-us', options)
        }
      },

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

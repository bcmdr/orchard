class TreeVM {
  constructor() {
    Vue.component('user-tree', {
      template: `
        <div id="tree-{{id}}" class="tree-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">{{title}}</h2>
          </div>
          <div class="mdl-card__supporting-text">
            <p>{{description}}</p>
            <button v-on:click="$emit('remove')">X</button>\
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Done
            </a>
          </div>
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i class="material-icons">info</i>
            </button>
          </div>
        </div>
      `,
      props: [
        'id', 'title', 'description'
      ]
    })

    new Vue({
      el: '#user-trees',
      data: {
        newTreeText: '',
        trees: [
          {
            id: 1,
            title: 'Work On Orchard',
            description: '3 Git Pushes per Day'
          },
          {
            id: 2,
            title: 'Stay In Shape',
            description: '10 Push Ups per Day'
          },
          {
            id: 3,
            title: 'Stay Hydrated',
            description: '3 Waterbottle refills per day'
          }
        ],
        nextTodoId: 4
      },
      methods: {
        addNewTree: function () {
          this.trees.push({
            id: this.nextTreeId++,
            title: this.newTreeText
          })
          this.newTreeText = ''
        }
      }
    })
  }
}

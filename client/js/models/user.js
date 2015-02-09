App.Models.User = Backbone.Model.extend({
  defaults: {
    id: 0,
    groupId: 0,
    username: 'try-user',
    password: '',
    country: 'Выбор страны',
    city: 'Выбор города',
    dateofbirth: new Date(),
    gender: 0,
    familystatus: 'Выбор статуса',    
    thisTry: false,
    mainUserLogged: false,
    permissionVisibleProfile: 0
  },
 
  urlRoot: '/api/v1/users'
});
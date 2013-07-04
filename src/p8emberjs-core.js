(function() {
  var P8Ember = Ember.Namespace.create();
  window.P8Ember = P8Ember;

}());


/*
(function() {
  
  Ember.Handlebars.registerHelper('p8formatDate', function(path, options) {
    var context = (options.contexts && options.contexts[0]) || this;

    var rawDate = context.get(path);
    if(rawDate === undefined) {
      return undefined;
    } 
    else {
      if(options.hash.time !== undefined) {
        return rawDate.p8DeDate(true);
      } else {
        return rawDate.p8DeDate();
      }
    }
  });

}());
*/
(function() {
  var P8DS = Ember.Namespace.create();
  window.P8DS = P8DS;
  

  P8DS.ILoadable = Ember.Mixin.create({
    loaded: false,
    loading: false
  });
  
  P8DS.Service = Ember.Object.extend({
    getJSON: function(url, params, pcallback, error) {
      var callback = pcallback;
      if(jQuery.isFunction(params)) {
        error = error || pcallback;
        callback = params;
        params = undefined;
      }
      var xhr = jQuery.getJSON(url, params, function(data) {
        if(callback !== undefined) {
          callback(data);
        }
      });
      
      if(error !== undefined) {
        xhr.error(error);
      }
    }
  });
  
  
  P8DS.Store = Ember.ArrayProxy.extend({
    content: null,
    _idIdx: {},
    init: function() {
      this._super();
      this.set('content', []);
    },
    find: function(id) {
      
      var content = this.get('content');
      if(this._idIdx[id] === undefined) {
        return undefined;
      }
      else {      
        return content.objectAt(this._idIdx[id]);
      }
    },
    indexOfId: function(id) {
      return this._idIdx[id];
    },
    put: function(o) {
      if(this._idIdx[o.id] === undefined) {
        this.pushObject(o);
        this._idIdx[o.id] = this.get('length')-1;
      } else {
        this.insertAt(this._idIdx[o.id], o);
      }
    }
  });
}());
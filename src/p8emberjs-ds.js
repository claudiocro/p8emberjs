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
      this.pushObject(o);
      this._idIdx[o.id] = this.get('length')-1; 
    }
  });
  

  var stripArrayObject = function(definition) {
    var startIdx = definition.indexOf('[')+1;
    
    
    //check only -1? why -2 ??
    var endIdx;
    if(definition.substring(definition.length-2,definition.length) !== '[]' && definition.substring(definition.length-1,definition.length)) {
      endIdx = definition.length-1;
      return definition.substr(startIdx,endIdx-startIdx);
    }
    
    return undefined;
    
  };
  
  var stripPropname = function(definition) {
    var endIdx = definition.indexOf('[');
    if(endIdx<0) {
      return definition;
    }

    return definition.substr(0,endIdx);
  };

  P8DS.Model = Ember.Object.extend({
    properties: null,
    init: function() {
      this._super();
      for(var i=0; i<this.properties.length; i++) {
        if( this.properties[i].substring(this.properties[i].length-2,this.properties[i].length) === '[]' ) { //simple array
          this.set(stripPropname(this.properties[i]), Ember.ArrayProxy.create({content:[]}));
        } 
        else if(this.properties[i].substring(this.properties[i].length-1,this.properties[i].length) === ']' ) { //object array
          this.set(stripPropname(this.properties[i]), Ember.ArrayProxy.create(P8DS.ILoadable, {content:[]}));
        }
      }
    },
    extend: function(o) {
      
     /* var arrayObjectClass = null;
      */
      
      function make_creator_handler(arrayObjectClass) {
        return function (item) {
            return arrayObjectClass.create(item);
        };
      }
      
      for(var i=0; i<this.properties.length; i++) {
        var propname = stripPropname(this.properties[i]);
        if( this.properties[i].substring(this.properties[i].length-2,this.properties[i].length) === '[]' ) { //simple array
          if(o[propname] !== undefined) {
            this.get(propname).pushObjects(o[propname]);
          }
        } 
        else if( this.properties[i].substring(this.properties[i].length-1,this.properties[i].length) === ']' ) { //object array
          
          if(o[propname] !== undefined) {
            var arrayObjectName = stripArrayObject(this.properties[i]);
            var arrayObjectClass = Ember.get(this, arrayObjectName, false) || Ember. get(window, arrayObjectName);
            
            this.get(propname).pushObjects(o[propname].map(make_creator_handler(arrayObjectClass)));
          }
        } 
        else {
          if(o[this.properties[i]] !== undefined) {
            this.set(this.properties[i], o[this.properties[i]]);
          }
        }
      }
    }
  });
  
}());
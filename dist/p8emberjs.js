/*!
 * p8emberjs - v0.5.4
 * plus8.ch
 * 
 * Copyright (c) 2012, Claudio Romano
 * Licensed Apache-2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Date: 2012-11-06 17:04:12 +0100
 */

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
(function() {
  var get = Ember.get;
  
  window.P8UI = Ember.Namespace.create();
  var P8UI = Ember.Namespace.create();
  if(window) {
    window.P8UI = P8UI;
  }
  
  
  P8UI.TableView = Ember.ContainerView.extend({
    tagName: 'table',
    content: null,
    columns: null,
    columnsMeta: null,
    classNames: ['p8ui-tableView'],
    childViews: ['headerView', 'bodyView'],
    clickItem: null
  });
  
  P8UI.TableView.reopen({
    headerView: Ember.computed(function() {
      return Ember.View.create({
        tagName: 'thead',
        columns: get(this, 'columns'),
        columnsMeta: get(this, 'columnsMeta'),
        template: Ember.computed(function() {
          var bodyTpl = "<tr>";
          for(var i=0; i<this.get('columns').length; i++) {
            var col = this.get('columns')[i];
            bodyTpl += '<th class="col-'+i+'"';
            if(get(this, 'columnsMeta.'+col+'.headerWidth') !== undefined && get(this, 'columnsMeta.'+col+'.headerWidth')) {
              bodyTpl += ' style="width: '+get(this, 'columnsMeta.'+col+'.headerWidth')+';"';  
            }
            
            bodyTpl += '>';
            
            if(get(this, 'columnsMeta.'+col+'.headerValue') !== undefined && get(this, 'columnsMeta.'+col+'.headerValue') !== null) {
              bodyTpl += get(this, 'columnsMeta.'+col+'.headerValue');
            } else {              
              bodyTpl += col;
            }
            
            bodyTpl += '</th>';
          }
          bodyTpl += "</tr>";
          return Ember.Handlebars.compile(bodyTpl);
        })
      });
    }).property(),
    
    bodyView:  Ember.computed(function() {
      return P8UI.CollectionView.create({
        clickItem: this.get('clickItem'),
        content: Ember.computed(function() {
          return get(this.get('tableView'), 'content');
        }).property('tableView.content.@each').cacheable(),
        tableView: this,
        columns: get(this, 'columns')
      });
    }).property()
    
  });
  


  P8UI.CollectionView = Ember.CollectionView.extend({
    tagName: 'tbody',
    clickItem: null,
    itemViewClass: Ember.View.extend({
      template: Ember.computed(function(){
        var bodyTpl = "";
        for(var i=0; i<this.get('parentView.columns').length; i++) {
          bodyTpl += '<td {{action "_clickItem" target="view" on="click"}}  class="col-'+i+'"><p>{{view.content.'+this.get('parentView.columns')[i]+'}}</p></td>';
        }
        return Ember.Handlebars.compile(bodyTpl);
      }),
      _clickItem: function() {
        if(this.get('parentView').clickItem !== null) {
          this.get('parentView').clickItem(this.get('content'));
        }
      }
    })
    
  });

  
  P8UI.ScrollView = Ember.View.extend({
    classNames: ['p8ui-scrollView'],
    alignBottomTo: null,
    _TO: false,
    _resize: function() {
      var self = this;
      
      var alignBottomTo = self.get('alignBottomTo');
      if(alignBottomTo !== null) {
        var alignTo = self.$().parents(alignBottomTo).filter(':first');
        self.$().css({'height': alignTo.height() - (self.$().offset().top) + alignTo.offset().top});
        self.$().mCustomScrollbar('update');
      }
    },
    _windowResizeListener: function(event){
      if(event.data.scrollView._TO !== false) {
        clearTimeout(event.data.scrollView._TO);
      }
      event.data.scrollView._TO = setTimeout(event.data.scrollView._resize.call(event.data.scrollView), 200);
    },
    
    didInsertElement: function() {
     
      var self = this;
      setTimeout(function(){
      self.$().mCustomScrollbar({
        set_width:false, 
        set_height:false,
        //horizontalScroll:false, 
        scrollInertia:550, 
        scrollEasing:"easeOutCirc", 
        mouseWheel:"auto", 
        autoDraggerLength:true, 
        scrollButtons:{ 
          enable:false, 
          scrollType:"continuous", 
          scrollSpeed:20, 
          scrollAmount:40 
        },
        advanced:{
          updateOnBrowserResize:false, 
          updateOnContentResize:false, 
          autoExpandHorizontalScroll:false 
        },
        callbacks:{
          onScroll:function(){}, 
          onTotalScroll:function(){}, 
          onTotalScrollOffset:0 
        }
      });
      
      setTimeout(function(){self._resize.call(self);},200);
      
      
      
      var alignBottomTo = self.get('alignBottomTo');
      if(alignBottomTo !== null) {
        jQuery(window).bind('resize', {scrollView: this}, self._windowResizeListener);
      }
      },200);
    },
    willDestroyElement: function() {
      jQuery(window).unbind('resize', this._windowResizeListener);
    }
  });
}());

(function() {
  var get = Ember.get;
  
  window.P8UI = Ember.Namespace.create();
  var P8UI = Ember.Namespace.create();
  if(window) {
    window.P8UI = P8UI;
  }
  
  
  P8UI.HiddenInput = Ember.View.extend({
    tagName: 'input',
    attributeBindings: ['name', 'value', 'type'],
    value: "",
    name:"",
    type:"hidden"
  });
  
  
  
  function hasClickable(meta) {
    return meta !== undefined && Ember.get(meta,'clickable') !== undefined && Ember.get(meta,'clickable') !== false && Ember.get(meta,'clickable') !== null;
  }
  
  P8UI.CollectionItemViewClass = Ember.View.extend({
    template: Ember.computed(function(){
      var bodyTpl = "";
      for(var i=0; i<this.get('parentView.columns').length; i++) {
        bodyTpl += '<td class="col-'+i+'">'+this.getValueTmpl(i)+'</td>';
      }
      return Ember.Handlebars.compile(bodyTpl);
    }),
    
    actions: {
      _clickItem: function() {
        if(this.get('parentView').clickItem !== null) {
          this.get('parentView').clickItem(this.get('content'));
        }
      }
    },
    
   getValueTmpl: function(column) {
      //console.log(this.get('columnsMeta.'+column+'.headerWidth'));
      var meta = this.get('parentView.columnsMeta.'+this.get('parentView.columns')[column].replace(".",''));
      var value = '';
      var action = '_clickItem';
      if(hasClickable(meta)) {
        if(Ember.get(meta, 'clickable') !== true) {
          action = Ember.get(meta, 'clickable');
        }
        value += '<a href="#" {{action ' + action + ' target="view"}}>';
      }
      
      if(!Ember.isNone(Ember.get(meta, 'template'))) {
        value += Ember.get(meta, 'template').apply(this, [meta]);
      } else {
        value += '{{view.content.'+this.get('parentView.columns')[column]+'}}';
      }
      
      if(hasClickable(meta)) {
        value += '</a>';
      }
      
      return value;
    }
  });
  
  P8UI.CollectionView = Ember.CollectionView.extend({
    tagName: 'tbody',
    clickItem: null,
    columnsMeta: null,
    itemViewClass: P8UI.CollectionItemViewClass.extend()
  });
  
  
  P8UI.TableView = Ember.ContainerView.extend({
    tagName: 'table',
    content: null,
    columns: null,
    columnsMeta: null,
    classNames: ['p8ui-tableView'],
    childViews: ['headerView', 'bodyView'],
    clickItem: null,
    collectionView: P8UI.CollectionView
  });
  
  P8UI.TableView.reopen({
    headerView: Ember.computed(function() {
      return Ember.View.extend({
        tagName: 'thead',
        columns: get(this, 'columns'),
        columnsMeta: get(this, 'columnsMeta'),
        template: Ember.computed(function() {
          var bodyTpl = "<tr>";
          for(var i=0; i<this.get('columns').length; i++) {
            var col = this.get('columns')[i].replace(".",'');
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
      }).create();
    }).property(),
    
    bodyView:  Ember.computed(function() {
      return this.get('collectionView').extend({
        clickItem: this.get('clickItem'),
        columnsMeta: this.get('columnsMeta'),
        content: Ember.computed(function() {
          return get(this.get('tableView'), 'content');
        }).property('tableView.content').cacheable(),
        tableView: this,
        columns: get(this, 'columns'),
        emptyView: Ember.View.extend({
          template: Ember.Handlebars.compile('<td class="muted" colspan="'+this.get('columns.length')+'">Keine Daten vorhanden</td>')
        })
      }).create();
      //return Ember.View.create();
    }).property()
    
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



(function() {
  
  
  function defineProperty(mv, i, invalidProps, dependencies) {
    
    var validations = mv.get('validations');
    var validationProps = Ember.keys(mv.get('validations'));
    
    var invalidProp = 'invalid'+validationProps[i].capitalize();
    var errorProp = 'error'+validationProps[i].capitalize();
    var sourceProp = 'source.'+validationProps[i];
    var idx = i;
    
    invalidProps.push(invalidProp);
    
    Ember.defineProperty(mv, errorProp, Ember.computed(function() {
      var error = [];
      var v = this.get(sourceProp);
      
  
      for(var j=0; j<validations[validationProps[idx]].length; j++) {
        validations[validationProps[idx]][j](error,v, this);
      }
      return error;
      
    }).property(sourceProp));
    
    
    Ember.defineProperty(mv, invalidProp, Ember.computed(function() {
      return this.get(errorProp+'.length') > 0;
    }).property(errorProp));
    
    Ember.addObserver(mv, invalidProp, mv.evaluateValid);
    
    if(!Ember.isEmpty(dependencies)) {
      
      var observerf = function(a,b,c) {
        mv.notifyPropertyChange(errorProp);
      };
      
      for(var x=0; x<dependencies.length; x++) {
        Ember.addObserver(mv, 'source.'+dependencies[x], observerf);
      }
    }
    
  }
   
P8UI.InputValidator = Ember.Mixin.create({
    
    init: function() {
      var invalidProps = [];
      if(!Ember.isEmpty(this.get('validations'))) {
        var validationProps = Ember.keys(this.get('validations'));
        for(var i=0; i<validationProps.length; i++) {
          if(validationProps[i] !== '_dependencies') {            
            defineProperty(this, i, invalidProps, this.get('validations._dependencies.'+validationProps[i]));
          }
        }
      }
      
      this._super();
      this.evaluateValid();
    },
    
    isValid: true,
    
    evaluateValid: function() {
      var validationProps = Ember.keys(this);
      for(var i=0; i<validationProps.length; i++) {
        if(validationProps[i].indexOf('invalid') === 0 && this.get(validationProps[i]) === true) {
          this.set('isValid', false);
          return;
        }
      }
      
      this.set('isValid', true);
    },    
    
    
    
    source: null,
    invalid: function(field) {
      return this.get('error'+field.capitalize()+".length") > 0;
    },
    error: function(field) {
      return this.get('error'+field.capitalize());
    },
    
    singleErrorMessage: function(field) {
      if(this.get('error'+field.capitalize()+'.length') > 0) {
        return this.get('error'+field.capitalize())[0].message;
      } else {
        return null;
      }
    }
  });
  
  
  
  
  P8UI.ValidTextField = Ember.TextField.extend({
    //field:null,
    validator: null,
    _updateId: null,
    _updateValidation: function() {
      var self = this;
      this.$().data('bs.tooltip').options.title = this.get('validator').singleErrorMessage(self.get('name'));
      Ember.run.cancel(this.get('updateId'));
      var a = Ember.run.later( function(){
        if(!Ember.isEmpty(self.get('validator'))) {
          if(self.get('validator').invalid(self.get('name'))) {
            self.$().tooltip('show');
          } else {
        if(!Ember.isEmpty(self.$())) {
          self.$().tooltip('hide');
        }
          }
        }
      },300);
      this.set('updateId', a);
    },
    hasErrors: function() {
      return !this.get('validator').invalid(this.get('name')); 
    },
    init: function() {
      this.addObserver('validator.invalid'+this.get('name').capitalize(), this, this._updateValidation);
      this._super();
    },
    didInsertElement: function() {
      var self = this;  
      
      Ember.run( function(){
        self.$().tooltip({
          html: true,
          trigger: 'focus',
          width : '420',
          placement : 'bottom',
          delay: { show: 0, hide: 0}
        });
      });
      
    },

    willDestroyElement : function() {
      this.removeObserver('validator.invalid'+this.get('name').capitalize(), this, this._updateValidation);
      this.$().tooltip('destroy');
    }
  });
}());




(function() {
  
P8UI.DatetimePickerField = Ember.View.extend({
  defaultClass: 'span12',
  format: "dd.MM.yyyy hh:mm",
  picker: null,
  templateName: 'datetimepicker',
  validator: null,
  didInsertElement: function() {
    var onChangeDate, self;
    self = this;
    onChangeDate = function(ev) {
      return self.set("value", ev.date);
    };
    var r = this.$('.datetimepicker').datetimepicker({
      format: self.get('format'),
      language: 'de',
      collapse: true
    }).on("changeDate", onChangeDate);
    this.set('picker', r);
    this.suspendValueChange(function() {
      r.datetimepicker('setValue', self.get('value'));
    });
    return r;
  },
  suspendValueChange: function(cb) {
    this._suspendValueChange = true;
    cb();
    this._suspendValueChange = false;
  },
  valueChanged: function() {
    if (this._suspendValueChange) { return; }
    var content = this.get("value");
    if(Ember.isEmpty(content)) {
      //this.get("picker").setContent(null);
    } else {
      this.$('.datetimepicker').datetimepicker('setValue', this.get('value'));
    }
  }.observes("value")
});
}());



(function() {
P8UI.TinymceView = Ember.TextArea.extend({
  editor: null,
  theme: "modern",
  skin: 'light',
  menubar:false,
  statusbar: false,
  height: 300,
  plugins: [
            "autolink link lists hr ",
            "contextmenu paste"
 ],
 content_css: "res/tinymce/content.css",
 toolbar: "link | bold italic underline | bullist numlist outdent indent",
 valid_elements : "a[href|target=_blank],strong/b,em/i,strike,u,-ol[type|compact],-ul[type|compact],-li,br,-span,div[align],br,#p[style],ol,ul,li",
  _suspendValueChange: false,
  didInsertElement: function(){
      var id = "#" + this.get("elementId");        
      var view = this;
      tinymce.init({
         selector: id,
         theme: this.get('theme'),
         skin: this.get('skin'),
         menubar:this.get('theme'),
         statusbar: this.get('menubar'),
         height: this.get('height'),
         plugins: this.get('plugins'),
         content_css: this.get('content_css'),
         toolbar: this.get('toolbar'),
         valid_elements: this.get('valid_elements'),
         setup : function(ed) {                
              view.set("editor", ed);
              ed.on("keyup change", function() {
                  view.suspendValueChange(function() {
                      view.set("value", ed.getContent());
                  });
              });
         }
      });
  },
  suspendValueChange: function(cb) {
      this._suspendValueChange = true;
      cb();
      this._suspendValueChange = false;
  },
  valueChanged: function() {
      if (this._suspendValueChange) { return; }
      var content = this.get("value");
      if(Ember.isEmpty(content)) {
        this.get("editor").setContent("");
      } else {
        this.get("editor").setContent(content);
      }
  }.observes("value"),
  willClearRender: function() {        
    /*var id = "#" + this.get("elementId");        
    tinyMCE.execCommand('mceFocus', false, id);                    
    tinyMCE.execCommand('mceRemoveControl', id);
    
    this.get("editor").remove();*/
  }
});

}());
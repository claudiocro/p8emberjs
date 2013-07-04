/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($, Ember) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  
  var obj, view, viewTime;
  var template, templateTime;
  
  var templateFor = function(template) {
    return Ember.Handlebars.compile(template);
  };

  var originalLookup = Ember.lookup, lookup;

  /*module("the p8formatDate helper", {
    setup: function() {
      Ember.lookup = lookup = { Ember: Ember };

      template = templateFor('{{p8formatDate obj.dateOne}}');
      var dateOne = new Date();
      dateOne.setTime(0); 
      obj = { dateOne:  dateOne};

      view = Ember.View.create({
        template: template,
        obj: obj
      });
      append(view);


      templateTime = templateFor('{{p8formatDate obj.dateOne time="true"}}');
      viewTime = Ember.View.create({
          template: templateTime,
          obj: obj
      });
      append(viewTime);
    },

    teardown: function() {
      Ember.run(function(){
        view.destroy();
        view = null;
        
        viewTime.destroy();
        viewTime = null;
      });
    }
  });


  var append = function(view) {
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  };

  var assertHTML = function(view, expectedHTML) {
    var html = view.$().html();

    // IE 8 (and prior?) adds the \r\n
    html = html.replace(/<script[^>]*><\/script>/ig, '').replace(/[\r\n]/g, '');

    equal(html, expectedHTML);
  };

  var assertText = function(view, expectedText) {
    equal(view.$().text(), expectedText);
  };

  test("it renders the date with the default locale", 2, function() {
    assertHTML(view, "01.01.1970");
    assertHTML(viewTime, "01.01.1970 00:00");
  });*/

}(jQuery, Ember));

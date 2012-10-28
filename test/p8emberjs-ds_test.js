/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

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

  module('P8DS.Model');
  
  var P8TESTDS = Ember.Namespace.create();
  window.P8TESTDS = P8TESTDS;

  P8TESTDS.PersonModel = P8DS.Model.extend({
    properties : [ 'id', 'name', 'lastname', 'date'],
    fullname:function() {
      return this.get('name') + " " + this.get('lastname'); 
    }.property('name', 'firstname').cacheable()
  });
  
  
  P8TESTDS.PersonGroupModel = P8DS.Model.extend({
    properties : [ 'tags[]', 'persons[P8TESTDS.PersonModel]', 'fake', 'chief{P8TESTDS.PersonModel}']
  });
  
  
  test('create', 15, function() {

    var personGroupModel = P8TESTDS.PersonGroupModel.create();
    personGroupModel.updateFrom({"tags":['tagA', 'tagB'],'persons':[
      {"name":"Hans","lastname":"Muster", "date":"2012-12-11 00:00:00","fake":"nope"},
      {"name":"Beppe","lastname":"Rossi", "date":"2012-01-10 00:00:00"}],
      "chief":{"name":"Beppea","lastname":"Rossia", "date":"2012-01-15 00:00:00"}
    });
    var personModel = P8TESTDS.PersonModel.create({"ID":"1","name":"Hans","lastname":"Muster", "date":"2012-12-11 00:00:00", "fake":"nope"});
    
    equal(personModel.get('name'), "Hans", 'get name');
    equal(personModel.get('lastname'), "Muster", 'get lastname');
    equal(personModel.get('fullname'), "Hans Muster", 'get fullname');
    equal(personModel.get('fake'), "nope", 'not defined property');
    ok(personGroupModel.get('chief') instanceof P8TESTDS.PersonModel, 'child object instance of P8TESTDS.PersonModel');
    equal(personGroupModel.get('chief.lastname'), "Rossia", 'child object lastname');
    
    ok(personGroupModel.get('persons') instanceof Ember.ArrayProxy, 'objectarray instance of Ember.ArrayProxy');
    equal(personGroupModel.get('persons.length'), 2, 'objectarray length');
    ok(personGroupModel.get('persons').objectAt(0) instanceof P8TESTDS.PersonModel, 'objectarray instance of member');
    equal(personGroupModel.get('persons').objectAt(1).get('fullname'), "Beppe Rossi", 'objectarray object member compare');
    equal(personGroupModel.get('persons').objectAt(1).get('fake'), undefined, 'objectarray object member compare undefined');
    
    ok(personGroupModel.get('tags') instanceof Ember.ArrayProxy, 'array instance of Ember.ArrayProxy');
    equal(personGroupModel.get('tags.length'), 2, 'array length');
    equal(personGroupModel.get('tags').objectAt(1), "tagB", 'objectarray object member compare');
    
    
    ok(personGroupModel.get('persons') instanceof Ember.ArrayProxy, 'objectarray instance of Ember.ArrayProxy');
  });
  
  test('appendProperty', 2, function() {
    P8TESTDS.PersonModel.reopen({
      additionalPropMyTags: "myTags[]"
    });
    var personModel = P8TESTDS.PersonModel.create({"ID":"1","name":"Hans","lastname":"Muster", "date":"2012-12-11 00:00:00"});
    
    equal(personModel.get('myTags.length'), 0);
    
    personModel.get('myTags').addObject('a');
    equal(personModel.get('myTags.length'), 1);
    
  });

  module('P8DS.Store');
  test('put-get', 4, function() {
    var store = P8DS.Store.create({});
    store.put({id:3,value:'Value3'});
    store.put({id:1,value:'Value1'});
    store.put({id:2,value:'Value2'});
    
    equal(store.indexOfId(3), 0, 'indexOfId');
    equal(store.indexOfId(10), undefined, 'indexOfId not existent');
    equal(store.find(2).value, 'Value2', 'find');
    
    store.put({id:3,value:'Value3a'});
    equal(store.find(3).value, 'Value3a', 'find aber overwriting the object');
    
  });
  

}(jQuery));

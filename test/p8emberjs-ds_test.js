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

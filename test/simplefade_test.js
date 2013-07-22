(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
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
      throws(block, [expected], [message])
  */

  module('simpleFade basics', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.simpleFade(), this.elems, 'should be chainable');
  });

  module('simpleFade state', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is correct state', function() {
    expect(2);
    strictEqual(this.elems.simpleFade().children().css('position'), 'absolute', 'should be absolute');
    strictEqual(this.elems.simpleFade().children().first().css('opacity'), '1', 'should be 1');
  });

  // module(':awesome selector', {
  //   // This will run before each test in this module.
  //   setup: function() {
  //     this.elems = $('#qunit-fixture').children();
  //   }
  // });

  // test('is awesome', function() {
  //   expect(1);
  //   Use deepEqual & .get() when comparing jQuery objects.
  //   deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  // });

}(jQuery));

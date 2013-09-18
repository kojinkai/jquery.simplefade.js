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

  module('simplefade basics', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.simplefade(), this.elems, 'should be chainable');
  });

  module('simplefade state', {
    setup: function() {
      this.fixture = $('#qunit-fixture').children('.fade').simplefade();
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('has active class', function() {
    expect(1);
    strictEqual(this.fixture.find('.active').length, 1, 'should not be 0');
  });


}(jQuery));

const bookmarkleter = require('../bookmarkleter');

if (!bookmarkleter) {
  throw new Error('Failed to require bookmarkleter module');
}

exports.injectJQuery = test => {
  /**
   * Checks if the output of bookmarkleter contains 'loadBookmarklet'
   * @param {string} input - The input string to pass to bookmarkleter
   * @param {object} options - Options to pass to bookmarkleter
   * @returns {boolean} True if 'loadBookmarklet' is in the output, false otherwise
   */
  const hasJQuery = (input, options = {}) =>
    bookmarkleter(input, options).includes('loadBookmarklet');

  const data = ['var test;', 'console.log("test");'];

  test.comment('Testing with jQuery: true');
  data.forEach(input => test.ok(hasJQuery(input, { jQuery: true }), 'should include loadBookmarklet'));

  test.comment('Testing with jQuery: false (default) and not specified');
  data.forEach(input => test.ok(!hasJQuery(input, { jQuery: false }), 'should not include loadBookmarklet'));
  data.forEach(input => test.ok(!hasJQuery(input), 'should not include loadBookmarklet'));

  test.comment('Testing with jquery: true and false (legacy options)');
  data.forEach(input => test.ok(hasJQuery(input, { jquery: true }), 'should include loadBookmarklet'));
  data.forEach(input => test.ok(!hasJQuery(input, { jquery: false }), 'should not include loadBookmarklet'));

  test.done();
};

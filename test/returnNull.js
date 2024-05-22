const bookmarkleter = require( '../bookmarkleter' );

exports.returnNull = test => {
  const data = [
    '',
    ';',
    ';;',
    '[]',
    '{}',
    '({})',
    'true',
    '12345',
    'function',
    'var',
    'let',
    'const',
    'null',
    'undefined',
    'this',
    'class',
    'export',
    'import',
  ];

  test.each(data)(`bookmarkleter(%p) should return null`, (input) => {
    test.equal(bookmarkleter(input, { mangleVars: true }), null);
  });

  test.done();
};

const bookmarkleter = require('../bookmarkleter');

exports.encodeSpecialCharacters = () => {
  const testCases = [
    ['Test case 1: Encoding special characters in a string',
      'var test = ''%"<>#@&?';,
      'javascript:var%20test=%22%25\\%22%3C%3E%23%40%26%3F%22;'
    ],
    ['Test case 2: Encoding special characters in an internationalized string',
      'var test = \'Iñtërnâtiônàlizætiøn\';',
      'javascript:var%20test=%22I\\xF1t\\xEBrn\\xE2ti\\xF4n\\xE0liz\\xE6ti\\xF8n%22;'
    ],
  ];

  testCases.forEach(([description, input, expectedOutput]) => {
    test(description, () => {
      const output = bookmarkleter(input);
      expect(output).toEqual(expectedOutput);
    });
  });

  // If you are using Jest, you can use `test.each` instead of `forEach`
  // test.each(testCases)(description, (input, expectedOutput) => {
  //   const output = bookmarkleter(input);
  //   expect(output).toEqual(expectedOutput);
  // });
};

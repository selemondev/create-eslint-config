import { deepMerge } from '../utils/deepMerge'; // Replace with the actual path
import { expect, it } from 'vitest';

const testCases = [
  {
    name: 'Merge two objects with nested structure',
    input: {
      a: {
        foo: 'bar',
        nested: { a: 1, b: 2 },
      },
      b: {
        bar: 'baz',
        nested: { b: 3, c: 4 },
      },
    },
    expected: {
      a: {
        foo: 'bar',
        nested: { a: 1, b: 2 },
      },
      b: {
        bar: 'baz',
        nested: { b: 3, c: 4 },
      },
    },
  },
  // Add more test cases as needed
];

testCases.forEach(({ name, input, expected }) => {
  it(name, () => {
    const result = deepMerge({}, input);
    expect(result).toEqual(expected);
  });
});

const longestKDiffSubsequence = require("./longestKDiffSubsequence");

const tests = [
  { arr: [1, 5, 3, 4, 2], k: 2, expected: 4 },
  { arr: [5, 5, 5, 5, 5], k: 0, expected: 5 },
  { arr: [1, 2, 3, 4, 5, 6], k: 1, expected: 6 },
  { arr: [1, 10, 20, 30, 40], k: 5, expected: 1 },
  { arr: [-10, -8, -5, -3, 0, 2, 5], k: 3, expected: 7 },
  { arr: [10, 1, 4, 7, 13, 6, 9, 11], k: 3, expected: 6 },
  { arr: [100, -100, 200, -200, 0], k: 1e9, expected: 5 },
  { arr: [9, 7, 5, 3, 1], k: 2, expected: 5 },
];

console.log("🧪 Running Test Cases...\n");

tests.forEach(({ arr, k, expected }, idx) => {
  const result = longestKDiffSubsequence(arr, k);
  console.log(
    `Test ${idx + 1}: arr=${JSON.stringify(arr)}, k=${k}\n` +
      `→ Output: ${result} | Expected: ${expected} ${
        result === expected ? "***Passed***" : "***Failed***"
      }\n`
  );
});

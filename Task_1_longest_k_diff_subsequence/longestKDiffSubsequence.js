/**
 * Longest K-Difference Subsequence
 * --------------------------------
 * Problem:
 * Given an array of integers, find the length of the longest subsequence
 * such that the absolute difference between consecutive elements is ≤ k.
 *
 * Example:
 * Input:  arr = [1, 5, 3, 4, 2], k = 2
 * Output: 4   → subsequence [1, 3, 4, 2]
 *
 * Constraints:
 *  1 ≤ n ≤ 10^5
 *  -10^9 ≤ arr[i] ≤ 10^9
 *  1 ≤ k ≤ 10^9
 *
 * Approach:
 * ----------
 * We use Dynamic Programming + Segment Tree + Coordinate Compression.
 *
 * Let dp[i] = length of longest valid subsequence ending with arr[i].
 *
 * For each arr[i], we need:
 *   dp[i] = 1 + max(dp[j]) for all j < i where |arr[i] - arr[j]| ≤ k
 *
 * To efficiently find max(dp[j]) in range [arr[i]-k, arr[i]+k],
 * we use a Segment Tree (range max queries) over compressed indices.
 *
 * Time Complexity:  O(n log n)
 * Space Complexity: O(n)
 */

function longestKDiffSubsequence(arr, k) {
  if (!arr || arr.length === 0) return 0;

  // Step 1 : Coordinate Compression
  const sortedUnique = Array.from(new Set(arr)).sort((a, b) => a - b);
  const indexMap = new Map(sortedUnique.map((val, i) => [val, i]));
  const n = sortedUnique.length;

  // Step 2 : Segment Tree Class
  class SegmentTree {
    constructor(size) {
      this.size = size;
      this.tree = new Array(4 * size).fill(0);
    }

    update(index, value, node = 1, l = 0, r = this.size - 1) {
      if (l === r) {
        this.tree[node] = Math.max(this.tree[node], value);
        return;
      }
      const mid = Math.floor((l + r) / 2);
      if (index <= mid) this.update(index, value, node * 2, l, mid);
      else this.update(index, value, node * 2 + 1, mid + 1, r);
      this.tree[node] = Math.max(this.tree[node * 2], this.tree[node * 2 + 1]);
    }

    query(qL, qR, node = 1, l = 0, r = this.size - 1) {
      if (qR < l || qL > r) return 0;
      if (qL <= l && r <= qR) return this.tree[node];
      const mid = Math.floor((l + r) / 2);
      return Math.max(
        this.query(qL, qR, node * 2, l, mid),
        this.query(qL, qR, node * 2 + 1, mid + 1, r)
      );
    }
  }

  // Step 3 : Binary Search helpers for compression lookup
  function lowerBound(arr, target) {
    let l = 0,
      r = arr.length;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (arr[mid] < target) l = mid + 1;
      else r = mid;
    }
    return l;
  }

  function upperBound(arr, target) {
    let l = 0,
      r = arr.length;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (arr[mid] <= target) l = mid + 1;
      else r = mid;
    }
    return l;
  }

  // Step 4 : Core DP logic
  const segTree = new SegmentTree(n);
  let maxLen = 0;

  for (const num of arr) {
    const leftVal = num - k;
    const rightVal = num + k;

    const leftIndex = lowerBound(sortedUnique, leftVal);
    const rightIndex = upperBound(sortedUnique, rightVal) - 1;

    const bestPrev = segTree.query(leftIndex, rightIndex);
    const currIndex = indexMap.get(num);
    const currLen = bestPrev + 1;
    segTree.update(currIndex, currLen);

    maxLen = Math.max(maxLen, currLen);
  }
  return maxLen;
}

// Export for testing
module.exports = longestKDiffSubsequence;

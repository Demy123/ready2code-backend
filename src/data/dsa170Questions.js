// Curated 170 DSA Sheet for CSE Placement Preparation
// Covering 14 Core Topics with boilerplates, examples, visible test cases, and hidden test cases

export const dsa170Questions = [
  // 1. ARRAYS & HASHING (15)
  {
    title: 'Two Sum',
    slug: 'two-sum',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    order: 1,
    isPremium: false,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' }
    ],
    boilerplates: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (mp.find(comp) != mp.end()) return {mp[comp], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`
    },
    visibleTestCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' }
    ],
    hiddenTestCases: [
      { input: '[1,5,8,12,19,25]\n37', expectedOutput: '[3,5]' },
      { input: '[-3,4,3,90]\n0', expectedOutput: '[0,2]' }
    ],
    hints: ['A brute force approach checks all pairs in O(n^2).', 'Can we use a Hash Table to look up the complement in O(1) time?'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
    totalSubmissions: 420,
    acceptedSubmissions: 360,
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    order: 2,
    isPremium: false,
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: '1 appears at indices 0 and 3.' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct.' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  const set = new Set();\n  for (const n of nums) {\n    if (set.has(n)) return true;\n    set.add(n);\n  }\n  return false;\n}`,
      python: `def solve(nums):\n    return len(nums) != len(set(nums))`,
      cpp: `#include <vector>\n#include <unordered_set>\nusing namespace std;\nbool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    return s.size() < nums.size();\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int n : nums) if (!set.add(n)) return true;\n        return false;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true' },
      { input: '[1,2,3,4]', expectedOutput: 'false' }
    ],
    hiddenTestCases: [
      { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true' },
      { input: '[1000000000, -1000000000, 0]', expectedOutput: 'false' }
    ],
    hints: ['Use a HashSet to keep track of seen elements.'],
    companyTags: ['Amazon', 'Adobe', 'Apple'],
    totalSubmissions: 310,
    acceptedSubmissions: 280,
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    order: 3,
    isPremium: true,
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    boilerplates: {
      javascript: `function solve(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let c of s) count[c] = (count[c] || 0) + 1;\n  for (let c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}`,
      python: `def solve(s, t):\n    if len(s) != len(t): return False\n    from collections import Counter\n    return Counter(s) == Counter(t)`,
      cpp: `#include <string>\n#include <vector>\nusing namespace std;\nbool isAnagram(string s, string t) {\n    if (s.length() != t.length()) return false;\n    vector<int> c(26, 0);\n    for (char ch : s) c[ch - 'a']++;\n    for (char ch : t) if (--c[ch - 'a'] < 0) return false;\n    return true;\n}`,
      java: `public class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (char c : s.toCharArray()) count[c - 'a']++;\n        for (char c : t.toCharArray()) if (--count[c - 'a'] < 0) return false;\n        return true;\n    }\n}`
    },
    visibleTestCases: [
      { input: '"anagram"\n"nagaram"', expectedOutput: 'true' },
      { input: '"rat"\n"car"', expectedOutput: 'false' }
    ],
    hiddenTestCases: [
      { input: '"aacc"\n"ccac"', expectedOutput: 'false' },
      { input: '"listen"\n"silent"', expectedOutput: 'true' }
    ],
    hints: ['Count frequency of each character or sort strings.'],
    companyTags: ['Uber', 'Google', 'Bloomberg'],
    totalSubmissions: 290,
    acceptedSubmissions: 250,
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 4,
    isPremium: true,
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' }
    ],
    boilerplates: {
      javascript: `function solve(strs) {\n  const map = new Map();\n  for (let str of strs) {\n    const key = str.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n  return Array.from(map.values());\n}`,
      python: `def solve(strs):\n    from collections import defaultdict\n    res = defaultdict(list)\n    for s in strs:\n        res["".join(sorted(s))].append(s)\n    return list(res.values())`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string s : strs) {\n        string k = s;\n        sort(k.begin(), k.end());\n        mp[k].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& p : mp) res.push_back(p.second);\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}`
    },
    visibleTestCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }
    ],
    hiddenTestCases: [
      { input: '["a"]', expectedOutput: '[["a"]]' },
      { input: '[""]', expectedOutput: '[[""]]' }
    ],
    hints: ['Map each sorted string to its list of anagrams.'],
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    totalSubmissions: 240,
    acceptedSubmissions: 180,
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 5,
    isPremium: true,
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' }
    ],
    boilerplates: {
      javascript: `function solve(nums, k) {\n  const map = new Map();\n  for (let n of nums) map.set(n, (map.get(n) || 0) + 1);\n  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, k).map(e => e[0]);\n}`,
      python: `def solve(nums, k):\n    from collections import Counter\n    return [item for item, count in Counter(nums).most_common(k)]`,
      cpp: `#include <vector>\n#include <unordered_map>\n#include <queue>\nusing namespace std;\nvector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int, int> count;\n    for (int n : nums) count[n]++;\n    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;\n    for (auto& [val, freq] : count) {\n        pq.push({freq, val});\n        if (pq.size() > k) pq.pop();\n    }\n    vector<int> res;\n    while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int n : nums) map.put(n, map.getOrDefault(n, 0) + 1);\n        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> map.get(a) - map.get(b));\n        for (int key : map.keySet()) {\n            pq.add(key);\n            if (pq.size() > k) pq.poll();\n        }\n        int[] res = new int[k];\n        for (int i = k - 1; i >= 0; i--) res[i] = pq.poll();\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,1,1,2,2,3]\n2', expectedOutput: '[1,2]' },
      { input: '[1]\n1', expectedOutput: '[1]' }
    ],
    hiddenTestCases: [
      { input: '[4,1,-1,2,-1,2,3]\n2', expectedOutput: '[-1,2]' }
    ],
    hints: ['Use bucket sort or a min-heap of size k.'],
    companyTags: ['Amazon', 'Facebook', 'Microsoft'],
    totalSubmissions: 210,
    acceptedSubmissions: 155,
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 6,
    isPremium: true,
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.'],
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  const res = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let postfix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    res[i] *= postfix;\n    postfix *= nums[i];\n  }\n  return res;\n}`,
      python: `def solve(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res`,
      cpp: `#include <vector>\nusing namespace std;\nvector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];\n    int r = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        res[i] *= r;\n        r *= nums[i];\n    }\n    return res;\n}`,
      java: `public class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        res[0] = 1;\n        for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= right;\n            right *= nums[i];\n        }\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' }
    ],
    hiddenTestCases: [
      { input: '[2,3,5,0]', expectedOutput: '[0,0,0,30]' }
    ],
    hints: ['Compute prefix products and suffix products.'],
    companyTags: ['Amazon', 'Apple', 'Meta', 'Microsoft'],
    totalSubmissions: 280,
    acceptedSubmissions: 210,
  },
  {
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 7,
    isPremium: true,
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.`,
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  const set = new Set(nums);\n  let longest = 0;\n  for (let n of set) {\n    if (!set.has(n - 1)) {\n      let length = 1;\n      while (set.has(n + length)) length++;\n      longest = Math.max(longest, length);\n    }\n  }\n  return longest;\n}`,
      python: `def solve(nums):\n    num_set = set(nums)\n    longest = 0\n    for n in num_set:\n        if (n - 1) not in num_set:\n            length = 1\n            while (n + length) in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest`,
      cpp: `#include <vector>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    int res = 0;\n    for (int n : s) {\n        if (!s.count(n - 1)) {\n            int len = 1;\n            while (s.count(n + len)) len++;\n            res = max(res, len);\n        }\n    }\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int n : nums) set.add(n);\n        int longest = 0;\n        for (int n : set) {\n            if (!set.contains(n - 1)) {\n                int len = 1;\n                while (set.contains(n + len)) len++;\n                longest = Math.max(longest, len);\n            }\n        }\n        return longest;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[100,4,200,1,3,2]', expectedOutput: '4' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', expectedOutput: '9' }
    ],
    hiddenTestCases: [
      { input: '[]', expectedOutput: '0' },
      { input: '[9,1,4,7,3,-1,0,5,8,-1,6]', expectedOutput: '7' }
    ],
    hints: ['Only start counting from the beginning of a streak (when n-1 is not in set).'],
    companyTags: ['Google', 'Amazon', 'Spotify'],
    totalSubmissions: 190,
    acceptedSubmissions: 140,
  },
  {
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    slug: 'maximum-subarray',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 8,
    isPremium: true,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  let curSum = 0;\n  let maxSum = nums[0];\n  for (let n of nums) {\n    if (curSum < 0) curSum = 0;\n    curSum += n;\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}`,
      python: `def solve(nums):\n    cur = 0\n    max_sum = nums[0]\n    for n in nums:\n        cur = max(n, cur + n)\n        max_sum = max(max_sum, cur)\n    return max_sum`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxSubArray(vector<int>& nums) {\n    int cur = 0, mx = nums[0];\n    for (int n : nums) {\n        cur = max(n, cur + n);\n        mx = max(mx, cur);\n    }\n    return mx;\n}`,
      java: `public class Solution {\n    public int maxSubArray(int[] nums) {\n        int cur = 0, max = nums[0];\n        for (int n : nums) {\n            cur = Math.max(n, cur + n);\n            max = Math.max(max, cur);\n        }\n        return max;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' }
    ],
    hiddenTestCases: [
      { input: '[-1]', expectedOutput: '-1' },
      { input: '[-5,-2,-8,-1]', expectedOutput: '-1' }
    ],
    hints: ['If current running sum becomes negative, reset it to 0.'],
    companyTags: ['Amazon', 'Microsoft', 'LinkedIn', 'Cisco'],
    totalSubmissions: 380,
    acceptedSubmissions: 310,
  },
  {
    title: 'Majority Element (Boyer-Moore Voting)',
    slug: 'majority-element',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    order: 9,
    isPremium: false,
    description: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.`,
    constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [3,2,3]', output: '3' },
      { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  let candidate = nums[0], count = 0;\n  for (let n of nums) {\n    if (count === 0) candidate = n;\n    count += (n === candidate ? 1 : -1);\n  }\n  return candidate;\n}`,
      python: `def solve(nums):\n    res, count = 0, 0\n    for n in nums:\n        if count == 0:\n            res = n\n        count += (1 if n == res else -1)\n    return res`,
      cpp: `#include <vector>\nusing namespace std;\nint majorityElement(vector<int>& nums) {\n    int cand = 0, count = 0;\n    for (int n : nums) {\n        if (count == 0) cand = n;\n        count += (n == cand ? 1 : -1);\n    }\n    return cand;\n}`,
      java: `public class Solution {\n    public int majorityElement(int[] nums) {\n        int candidate = nums[0], count = 0;\n        for (int n : nums) {\n            if (count == 0) candidate = n;\n            count += (n == candidate ? 1 : -1);\n        }\n        return candidate;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[3,2,3]', expectedOutput: '3' },
      { input: '[2,2,1,1,1,2,2]', expectedOutput: '2' }
    ],
    hiddenTestCases: [
      { input: '[6,5,5]', expectedOutput: '5' }
    ],
    hints: ['Boyer-Moore Voting Algorithm solves it in O(n) time and O(1) space.'],
    companyTags: ['Amazon', 'Google', 'Adobe'],
    totalSubmissions: 310,
    acceptedSubmissions: 275,
  },
  {
    title: 'Next Permutation',
    slug: 'next-permutation',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 10,
    isPremium: true,
    description: `A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

Given an array of integers \`nums\`, find the next lexicographical permutation of \`nums\`. If such an arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).`,
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 100'],
    examples: [
      { input: 'nums = [1,2,3]', output: '[1,3,2]' },
      { input: 'nums = [3,2,1]', output: '[1,2,3]' },
      { input: 'nums = [1,1,5]', output: '[1,5,1]' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  let i = nums.length - 2;\n  while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n  if (i >= 0) {\n    let j = nums.length - 1;\n    while (nums[j] <= nums[i]) j--;\n    [nums[i], nums[j]] = [nums[j], nums[i]];\n  }\n  let left = i + 1, right = nums.length - 1;\n  while (left < right) {\n    [nums[left], nums[right]] = [nums[right], nums[left]];\n    left++; right--;\n  }\n  return nums;\n}`,
      python: `def solve(nums):\n    i = len(nums) - 2\n    while i >= 0 and nums[i] >= nums[i + 1]: i -= 1\n    if i >= 0:\n        j = len(nums) - 1\n        while nums[j] <= nums[i]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i+1:] = reversed(nums[i+1:])\n    return nums`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> nextPermutation(vector<int>& nums) {\n    next_permutation(nums.begin(), nums.end());\n    return nums;\n}`,
      java: `public class Solution {\n    public void nextPermutation(int[] nums) {\n        int i = nums.length - 2;\n        while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n        if (i >= 0) {\n            int j = nums.length - 1;\n            while (nums[j] <= nums[i]) j--;\n            int t = nums[i]; nums[i] = nums[j]; nums[j] = t;\n        }\n        int l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t;\n        }\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,2,3]', expectedOutput: '[1,3,2]' },
      { input: '[3,2,1]', expectedOutput: '[1,2,3]' }
    ],
    hiddenTestCases: [
      { input: '[1,1,5]', expectedOutput: '[1,5,1]' }
    ],
    hints: ['Find the first decreasing element from the right.'],
    companyTags: ['Google', 'Meta', 'Microsoft'],
    totalSubmissions: 220,
    acceptedSubmissions: 145,
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 11,
    isPremium: true,
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.`,
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' }
    ],
    boilerplates: {
      javascript: `function solve(nums, k) {\n  k = k % nums.length;\n  const reverse = (l, r) => {\n    while (l < r) {\n      [nums[l], nums[r]] = [nums[r], nums[l]];\n      l++; r--;\n    }\n  };\n  reverse(0, nums.length - 1);\n  reverse(0, k - 1);\n  reverse(k, nums.length - 1);\n  return nums;\n}`,
      python: `def solve(nums, k):\n    k = k % len(nums)\n    nums[:] = nums[-k:] + nums[:-k]\n    return nums`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> rotate(vector<int>& nums, int k) {\n    k %= nums.size();\n    std::reverse(nums.begin(), nums.end());\n    std::reverse(nums.begin(), nums.begin() + k);\n    std::reverse(nums.begin() + k, nums.end());\n    return nums;\n}`,
      java: `public class Solution {\n    public void rotate(int[] nums, int k) {\n        k %= nums.length;\n        reverse(nums, 0, nums.length - 1);\n        reverse(nums, 0, k - 1);\n        reverse(nums, k, nums.length - 1);\n    }\n    private void reverse(int[] nums, int l, int r) {\n        while (l < r) {\n            int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t;\n        }\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,2,3,4,5,6,7]\n3', expectedOutput: '[5,6,7,1,2,3,4]' },
      { input: '[-1,-100,3,99]\n2', expectedOutput: '[3,99,-1,-100]' }
    ],
    hiddenTestCases: [
      { input: '[1,2]\n3', expectedOutput: '[2,1]' }
    ],
    hints: ['Reverse entire array, then reverse first k elements, then reverse the rest.'],
    companyTags: ['Amazon', 'Microsoft'],
    totalSubmissions: 250,
    acceptedSubmissions: 170,
  },
  {
    title: 'Spiral Matrix',
    slug: 'spiral-matrix',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 12,
    isPremium: true,
    description: `Given an \`m x n\` matrix, return all elements of the matrix in spiral order.`,
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' }
    ],
    boilerplates: {
      javascript: `function solve(matrix) {\n  const res = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let i = left; i <= right; i++) res.push(matrix[top][i]);\n    top++;\n    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);\n    right--;\n    if (top <= bottom) {\n      for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);\n      left++;\n    }\n  }\n  return res;\n}`,
      python: `def solve(matrix):\n    res = []\n    while matrix:\n        res += matrix.pop(0)\n        if matrix and matrix[0]:\n            for row in matrix: res.append(row.pop())\n        if matrix:\n            res += matrix.pop()[::-1]\n        if matrix and matrix[0]:\n            for row in matrix[::-1]: res.append(row.pop(0))\n    return res`,
      cpp: `#include <vector>\nusing namespace std;\nvector<int> spiralOrder(vector<vector<int>>& matrix) {\n    vector<int> res;\n    int top = 0, bottom = matrix.size() - 1, left = 0, right = matrix[0].size() - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res.push_back(matrix[top][i]);\n        top++;\n        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);\n        right--;\n        if (top <= bottom) for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]);\n        bottom--;\n        if (left <= right) for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);\n        left++;\n    }\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        List<Integer> res = new ArrayList<>();\n        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n        while (top <= bottom && left <= right) {\n            for (int i = left; i <= right; i++) res.add(matrix[top][i]);\n            top++;\n            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);\n            right--;\n            if (top <= bottom) for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);\n            bottom--;\n            if (left <= right) for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);\n            left++;\n        }\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]' }
    ],
    hiddenTestCases: [
      { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expectedOutput: '[1,2,3,4,8,12,11,10,9,5,6,7]' }
    ],
    hints: ['Simulate the 4 boundary walls closing in: top, right, bottom, left.'],
    companyTags: ['Microsoft', 'Amazon', 'Apple', 'Oracle'],
    totalSubmissions: 215,
    acceptedSubmissions: 160,
  },
  {
    title: 'Set Matrix Zeroes',
    slug: 'set-matrix-zeroes',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 13,
    isPremium: true,
    description: `Given an \`m x n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`'s in place.`,
    constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    examples: [
      { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' },
      { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' }
    ],
    boilerplates: {
      javascript: `function solve(matrix) {\n  let firstRowZero = false, firstColZero = false;\n  const m = matrix.length, n = matrix[0].length;\n  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true;\n  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true;\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][c] === 0) { matrix[r][0] = 0; matrix[0][c] = 0; }\n    }\n  }\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;\n    }\n  }\n  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;\n  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;\n  return matrix;\n}`,
      python: `def solve(matrix):\n  # in-place modification\n  m, n = len(matrix), len(matrix[0])\n  row_zero = any(matrix[0][c] == 0 for c in range(n))\n  col_zero = any(matrix[r][0] == 0 for r in range(m))\n  for r in range(1, m):\n    for c in range(1, n):\n      if matrix[r][c] == 0:\n        matrix[r][0] = matrix[0][c] = 0\n  for r in range(1, m):\n    for c in range(1, n):\n      if matrix[r][0] == 0 or matrix[0][c] == 0:\n        matrix[r][c] = 0\n  if row_zero: \n    for c in range(n): matrix[0][c] = 0\n  if col_zero:\n    for r in range(m): matrix[r][0] = 0\n  return matrix`,
      cpp: `#include <vector>\nusing namespace std;\nvector<vector<int>> setZeroes(vector<vector<int>>& matrix) {\n  // solve logic\n  return matrix;\n}`,
      java: `public class Solution {\n    public void setZeroes(int[][] matrix) {\n        // solve logic\n    }\n}`
    },
    visibleTestCases: [
      { input: '[[1,1,1],[1,0,1],[1,1,1]]', expectedOutput: '[[1,0,1],[0,0,0],[1,0,1]]' }
    ],
    hiddenTestCases: [
      { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]', expectedOutput: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' }
    ],
    hints: ['Use the first row and first column as markers.'],
    companyTags: ['Facebook', 'Amazon', 'Bloomberg'],
    totalSubmissions: 230,
    acceptedSubmissions: 175,
  },
  {
    title: 'Pascal\'s Triangle',
    slug: 'pascals-triangle',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    order: 14,
    isPremium: false,
    description: `Given an integer \`numRows\`, return the first \`numRows\` of **Pascal's triangle**.`,
    constraints: ['1 <= numRows <= 30'],
    examples: [
      { input: 'numRows = 5', output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' },
      { input: 'numRows = 1', output: '[[1]]' }
    ],
    boilerplates: {
      javascript: `function solve(numRows) {\n  const res = [];\n  for (let i = 0; i < numRows; i++) {\n    const row = new Array(i + 1).fill(1);\n    for (let j = 1; j < i; j++) {\n      row[j] = res[i - 1][j - 1] + res[i - 1][j];\n    }\n    res.push(row);\n  }\n  return res;\n}`,
      python: `def solve(numRows):\n    res = []\n    for i in range(numRows):\n        row = [1] * (i + 1)\n        for j in range(1, i):\n            row[j] = res[i-1][j-1] + res[i-1][j]\n        res.append(row)\n    return res`,
      cpp: `#include <vector>\nusing namespace std;\nvector<vector<int>> generate(int numRows) {\n    vector<vector<int>> res;\n    for (int i = 0; i < numRows; i++) {\n        vector<int> row(i + 1, 1);\n        for (int j = 1; j < i; j++) row[j] = res[i - 1][j - 1] + res[i - 1][j];\n        res.push_back(row);\n    }\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<List<Integer>> generate(int numRows) {\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < numRows; i++) {\n            List<Integer> row = new ArrayList<>();\n            for (int j = 0; j <= i; j++) {\n                if (j == 0 || j == i) row.add(1);\n                else row.add(res.get(i - 1).get(j - 1) + res.get(i - 1).get(j));\n            }\n            res.add(row);\n        }\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '5', expectedOutput: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' },
      { input: '1', expectedOutput: '[[1]]' }
    ],
    hiddenTestCases: [
      { input: '3', expectedOutput: '[[1],[1,1],[1,2,1]]' }
    ],
    hints: ['Each number is the sum of the two directly above it.'],
    companyTags: ['Goldman Sachs', 'Twitter', 'Apple'],
    totalSubmissions: 310,
    acceptedSubmissions: 280,
  },
  {
    title: 'Encode and Decode Strings',
    slug: 'encode-and-decode-strings',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    order: 15,
    isPremium: true,
    description: `Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and is decoded back to the original list of strings.`,
    constraints: ['0 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] contains any possible characters.'],
    examples: [
      { input: 'strs = ["lint","code","love","you"]', output: '["lint","code","love","you"]' }
    ],
    boilerplates: {
      javascript: `function solve(strs) {\n  // Encode: length + '#' + string\n  let encoded = strs.map(s => s.length + '#' + s).join('');\n  // Decode\n  const decoded = [];\n  let i = 0;\n  while (i < encoded.length) {\n    let j = encoded.indexOf('#', i);\n    let len = parseInt(encoded.substring(i, j));\n    decoded.push(encoded.substring(j + 1, j + 1 + len));\n    i = j + 1 + len;\n  }\n  return decoded;\n}`,
      python: `def solve(strs):\n    encoded = "".join(f"{len(s)}#{s}" for s in strs)\n    res, i = [], 0\n    while i < len(encoded):\n        j = encoded.find('#', i)\n        length = int(encoded[i:j])\n        res.append(encoded[j + 1 : j + 1 + length])\n        i = j + 1 + length\n    return res`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n// Encode & decode implementation`,
      java: `import java.util.*;\npublic class Solution {\n    // Encode & decode\n}`
    },
    visibleTestCases: [
      { input: '["lint","code","love","you"]', expectedOutput: '["lint","code","love","you"]' }
    ],
    hiddenTestCases: [
      { input: '["we","say",":","yes","!@#$%^&*"]', expectedOutput: '["we","say",":","yes","!@#$%^&*"]' }
    ],
    hints: ['Prefix each word with its length and a delimiter like #.'],
    companyTags: ['Google', 'Meta', 'Netflix'],
    totalSubmissions: 175,
    acceptedSubmissions: 130,
  },

  // 2. TWO POINTERS (12)
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    topic: 'Two Pointers',
    difficulty: 'Easy',
    order: 16,
    isPremium: false,
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    boilerplates: {
      javascript: `function solve(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l] !== clean[r]) return false;\n    l++; r--;\n  }\n  return true;\n}`,
      python: `def solve(s):\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\nbool isPalindrome(string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
      java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}`
    },
    visibleTestCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' }
    ],
    hiddenTestCases: [
      { input: '" "', expectedOutput: 'true' },
      { input: '"0P"', expectedOutput: 'false' }
    ],
    hints: ['Use two pointers moving inward from both ends.'],
    companyTags: ['Meta', 'Microsoft', 'Spotify'],
    totalSubmissions: 390,
    acceptedSubmissions: 340,
  },
  {
    title: '3Sum',
    slug: '3sum',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    order: 17,
    isPremium: true,
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' }
    ],
    boilerplates: {
      javascript: `function solve(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}`,
      python: `def solve(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> res;\n    for (int i = 0; i < nums.size(); i++) {\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n        int l = i + 1, r = nums.size() - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum == 0) {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l + 1]) l++;\n                while (l < r && nums[r] == nums[r - 1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++; else r--;\n        }\n    }\n    return res;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++; else r--;\n            }\n        }\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expectedOutput: '[]' }
    ],
    hiddenTestCases: [
      { input: '[0,0,0,0]', expectedOutput: '[[0,0,0]]' }
    ],
    hints: ['Sort array, fix one element and use 2 pointers for the remaining pair.'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Uber'],
    totalSubmissions: 310,
    acceptedSubmissions: 195,
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    order: 18,
    isPremium: true,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, max area of water is 49.' },
      { input: 'height = [1,1]', output: '1' }
    ],
    boilerplates: {
      javascript: `function solve(height) {\n  let l = 0, r = height.length - 1, maxArea = 0;\n  while (l < r) {\n    const area = Math.min(height[l], height[r]) * (r - l);\n    maxArea = Math.max(maxArea, area);\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return maxArea;\n}`,
      python: `def solve(height):\n    l, r, max_area = 0, len(height) - 1, 0\n    while l < r:\n        area = min(height[l], height[r]) * (r - l)\n        max_area = max(max_area, area)\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_area`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxArea(vector<int>& height) {\n    int l = 0, r = height.size() - 1, mx = 0;\n    while (l < r) {\n        mx = max(mx, min(height[l], height[r]) * (r - l));\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return mx;\n}`,
      java: `public class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, max = 0;\n        while (l < r) {\n            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++; else r--;\n        }\n        return max;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { input: '[1,1]', expectedOutput: '1' }
    ],
    hiddenTestCases: [
      { input: '[4,3,2,1,4]', expectedOutput: '16' }
    ],
    hints: ['Shrink the window by moving the pointer with smaller height.'],
    companyTags: ['Amazon', 'Bloomberg', 'Goldman Sachs'],
    totalSubmissions: 270,
    acceptedSubmissions: 205,
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    topic: 'Two Pointers',
    difficulty: 'Hard',
    order: 19,
    isPremium: true,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    boilerplates: {
      javascript: `function solve(height) {\n  let l = 0, r = height.length - 1;\n  let leftMax = height[l], rightMax = height[r];\n  let water = 0;\n  while (l < r) {\n    if (leftMax < rightMax) {\n      l++;\n      leftMax = Math.max(leftMax, height[l]);\n      water += leftMax - height[l];\n    } else {\n      r--;\n      rightMax = Math.max(rightMax, height[r]);\n      water += rightMax - height[r];\n    }\n  }\n  return water;\n}`,
      python: `def solve(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint trap(vector<int>& height) {\n    int l = 0, r = height.size() - 1, lmax = height[0], rmax = height[r], ans = 0;\n    while (l < r) {\n        if (lmax < rmax) { l++; lmax = max(lmax, height[l]); ans += lmax - height[l]; }\n        else { r--; rmax = max(rmax, height[r]); ans += rmax - height[r]; }\n    }\n    return ans;\n}`,
      java: `public class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lmax) lmax = height[l];\n                else res += lmax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rmax) rmax = height[r];\n                else res += rmax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}`
    },
    visibleTestCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
    ],
    hiddenTestCases: [
      { input: '[3,0,2,0,4]', expectedOutput: '7' }
    ],
    hints: ['Water trapped above any index is min(left_max, right_max) - height[i].'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs'],
    totalSubmissions: 310,
    acceptedSubmissions: 180,
  },
  {
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii-input-array-is-sorted',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    order: 20,
    isPremium: true,
    description: `Given a **1-indexed** array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number.`,
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order.'],
    examples: [
      { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
      { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' }
    ],
    boilerplates: {
      javascript: `function solve(numbers, target) {\n  let l = 0, r = numbers.length - 1;\n  while (l < r) {\n    const sum = numbers[l] + numbers[r];\n    if (sum === target) return [l + 1, r + 1];\n    if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}`,
      python: `def solve(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target: return [l + 1, r + 1]\n        elif s < target: l += 1\n        else: r -= 1\n    return []`,
      cpp: `#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& numbers, int target) {\n    int l = 0, r = numbers.size() - 1;\n    while (l < r) {\n        int s = numbers[l] + numbers[r];\n        if (s == target) return {l + 1, r + 1};\n        if (s < target) l++; else r--;\n    }\n    return {};\n}`,
      java: `public class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int l = 0, r = numbers.length - 1;\n        while (l < r) {\n            int sum = numbers[l] + numbers[r];\n            if (sum == target) return new int[]{l + 1, r + 1};\n            if (sum < target) l++; else r--;\n        }\n        return new int[]{};\n    }\n}`
    },
    visibleTestCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[1,2]' },
      { input: '[2,3,4]\n6', expectedOutput: '[1,3]' }
    ],
    hiddenTestCases: [
      { input: '[-1,0]\n-1', expectedOutput: '[1,2]' }
    ],
    hints: ['Leverage the sorted property with left and right pointers.'],
    companyTags: ['Amazon', 'Apple'],
    totalSubmissions: 240,
    acceptedSubmissions: 195,
  }
];

// Helper to generate the remaining structured questions up to 170
export const generateFull170Questions = () => {
  const allTopics = [
    {
      name: 'Arrays & Hashing',
      problems: [
        'Two Sum', 'Contains Duplicate', 'Valid Anagram', 'Group Anagrams', 'Top K Frequent Elements',
        'Product of Array Except Self', 'Longest Consecutive Sequence', 'Maximum Subarray (Kadane\'s Algorithm)',
        'Majority Element (Boyer-Moore Voting)', 'Next Permutation', 'Rotate Array', 'Spiral Matrix',
        'Set Matrix Zeroes', 'Pascal\'s Triangle', 'Encode and Decode Strings'
      ]
    },
    {
      name: 'Two Pointers',
      problems: [
        'Valid Palindrome', '3Sum', 'Container With Most Water', 'Trapping Rain Water',
        'Two Sum II - Input Array Is Sorted', '4Sum', 'Remove Duplicates from Sorted Array',
        'Move Zeroes', 'Sort Colors (Dutch National Flag)', 'Squares of a Sorted Array',
        'Boats to Save People', '3Sum Closest'
      ]
    },
    {
      name: 'Sliding Window',
      problems: [
        'Best Time to Buy And Sell Stock', 'Longest Substring Without Repeating Characters',
        'Longest Repeating Character Replacement', 'Permutation in String', 'Minimum Window Substring',
        'Sliding Window Maximum', 'Fruit Into Baskets', 'Max Consecutive Ones III',
        'Minimum Size Subarray Sum', 'Subarray Product Less Than K'
      ]
    },
    {
      name: 'Stack & Queues',
      problems: [
        'Valid Parentheses', 'Min Stack', 'Evaluate Reverse Polish Notation', 'Daily Temperatures',
        'Car Fleet', 'Largest Rectangle in Histogram', 'Implement Queue using Stacks',
        'Next Greater Element I', 'Online Stock Span', 'Asteroid Collision',
        'Sliding Window Maximum via Deque', 'Simplify Path'
      ]
    },
    {
      name: 'Binary Search',
      problems: [
        'Binary Search', 'Search a 2D Matrix', 'Koko Eating Bananas',
        'Find Minimum in Rotated Sorted Array', 'Search in Rotated Sorted Array',
        'Time Based Key-Value Store', 'Median of Two Sorted Arrays', 'Search Insert Position',
        'Find First and Last Position in Sorted Array', 'Find Peak Element',
        'Capacity To Ship Packages Within D Days', 'Single Element in a Sorted Array'
      ]
    },
    {
      name: 'Linked List',
      problems: [
        'Reverse Linked List', 'Merge Two Sorted Lists', 'Reorder List',
        'Remove Nth Node From End of List', 'Copy List with Random Pointer',
        'Add Two Numbers', 'Linked List Cycle', 'Find the Duplicate Number',
        'LRU Cache', 'Merge K Sorted Lists', 'Reverse Nodes in k-Group',
        'Intersection of Two Linked Lists', 'Palindrome Linked List', 'Flatten a Multilevel Doubly Linked List'
      ]
    },
    {
      name: 'Trees & Binary Trees',
      problems: [
        'Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Diameter of Binary Tree',
        'Balanced Binary Tree', 'Same Tree', 'Subtree of Another Tree',
        'Lowest Common Ancestor of a BST', 'Binary Tree Level Order Traversal',
        'Binary Tree Right Side View', 'Count Good Nodes in Binary Tree',
        'Binary Tree Maximum Path Sum', 'Serialize and Deserialize Binary Tree',
        'Construct Tree from Preorder and Inorder', 'Populating Next Right Pointers in Each Node',
        'Binary Tree Zigzag Level Order Traversal'
      ]
    },
    {
      name: 'Binary Search Tree',
      problems: [
        'Validate Binary Search Tree', 'Kth Smallest Element in a BST', 'Lowest Common Ancestor in BST',
        'Insert into a BST', 'Delete Node in a BST', 'BST Iterator',
        'Convert Sorted Array to BST', 'Range Sum of BST', 'Recover Binary Search Tree', 'Inorder Successor in BST'
      ]
    },
    {
      name: 'Heap / Priority Queue',
      problems: [
        'Kth Largest Element in a Stream', 'Last Stone Weight', 'K Closest Points to Origin',
        'Kth Largest Element in an Array', 'Task Scheduler', 'Design Twitter',
        'Find Median from Data Stream', 'Reorganize String', 'Top K Frequent Words', 'Merge K Sorted Lists using Heap'
      ]
    },
    {
      name: 'Backtracking & Recursion',
      problems: [
        'Subsets', 'Combination Sum', 'Permutations', 'Subsets II', 'Combination Sum II',
        'Word Search', 'Palindrome Partitioning', 'Letter Combinations of a Phone Number',
        'N-Queens', 'Sudoku Solver', 'Generate Parentheses', 'Restore IP Addresses'
      ]
    },
    {
      name: 'Graphs',
      problems: [
        'Number of Islands', 'Max Area of Island', 'Clone Graph', 'Walls and Gates',
        'Rotting Oranges', 'Pacific Atlantic Water Flow', 'Surrounded Regions',
        'Course Schedule', 'Course Schedule II', 'Graph Valid Tree',
        'Number of Connected Components', 'Redundant Connection', 'Word Ladder',
        'Network Delay Time (Dijkstra)', 'Cheapest Flights Within K Stops (Bellman-Ford)', 'Alien Dictionary (Topological Sort)'
      ]
    },
    {
      name: 'Dynamic Programming (1D & 2D)',
      problems: [
        'Climbing Stairs', 'Min Cost Climbing Stairs', 'House Robber', 'House Robber II',
        'Longest Palindromic Substring', 'Palindromic Substrings', 'Decode Ways',
        'Coin Change', 'Maximum Product Subarray', 'Word Break',
        'Longest Increasing Subsequence (LIS)', 'Partition Equal Subset Sum',
        'Unique Paths', 'Longest Common Subsequence (LCS)',
        'Best Time to Buy and Sell Stock with Cooldown', 'Coin Change II', 'Target Sum', 'Edit Distance'
      ]
    },
    {
      name: 'Greedy Algorithms',
      problems: [
        'Maximum Subarray', 'Jump Game', 'Jump Game II', 'Gas Station', 'Hand of Straights',
        'Merge Intervals', 'Non-overlapping Intervals', 'Meeting Rooms', 'Meeting Rooms II', 'Insert Interval'
      ]
    },
    {
      name: 'Trie, Bit Manipulation & Math',
      problems: [
        'Implement Trie (Prefix Tree)', 'Design Add and Search Words Data Structure', 'Word Search II',
        'Single Number', 'Number of 1 Bits (Hamming Weight)', 'Counting Bits', 'Reverse Bits',
        'Missing Number', 'Sum of Two Integers', 'Reverse Integer', 'Pow(x, n)',
        'Multiply Strings', 'Roman to Integer', 'Integer to English Words'
      ]
    }
  ];

  const fullList = [];
  let globalOrder = 1;
  const companiesPool = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Goldman Sachs', 'Adobe', 'Flipkart', 'Oracle', 'Salesforce'];

  for (const t of allTopics) {
    for (let pIdx = 0; pIdx < t.problems.length; pIdx++) {
      const pName = t.problems[pIdx];
      const existing = dsa170Questions.find(q => q.title === pName || q.title.startsWith(pName));

      if (existing) {
        fullList.push({
          ...existing,
          order: globalOrder++,
        });
      } else {
        const slug = pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const diff = pIdx % 3 === 0 ? 'Easy' : pIdx % 3 === 1 ? 'Medium' : 'Hard';
        const assignedCompanies = [
          companiesPool[(pIdx + globalOrder) % companiesPool.length],
          companiesPool[(pIdx + globalOrder + 3) % companiesPool.length],
        ];

        fullList.push({
          title: pName,
          slug,
          topic: t.name,
          difficulty: diff,
          order: globalOrder++,
          isPremium: globalOrder > 3, // first 3 are free demo, rest require subscription
          description: `### Problem Description\n\nGiven the input requirements for **${pName}**, implement an optimal algorithm to solve the problem with appropriate time and space complexities.\n\n### Input Format\n- Standard input representing problem parameters.\n\n### Output Format\n- The computed result formatted as expected.`,
          constraints: [
            '1 <= N <= 10^5',
            'Time Limit: 2.0s',
            'Memory Limit: 256MB'
          ],
          examples: [
            {
              input: 'nums = [1, 2, 3]',
              output: 'true',
              explanation: `Standard sample case for ${pName}.`
            }
          ],
          boilerplates: {
            javascript: `function solve(input) {\n  // Implement solution for ${pName}\n  return true;\n}`,
            python: `def solve(input_data):\n    # Implement solution for ${pName}\n    return True`,
            cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Solution for ${pName}\n    return 0;\n}`,
            java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Solution for ${pName}\n    }\n}`
          },
          visibleTestCases: [
            { input: '[1, 2, 3]', expectedOutput: 'true' },
            { input: '[4, 5, 6]', expectedOutput: 'true' }
          ],
          hiddenTestCases: [
            { input: '[7, 8, 9, 10]', expectedOutput: 'true' },
            { input: '[]', expectedOutput: 'true' }
          ],
          hints: [
            `Analyze the problem using pattern matching for ${t.name}.`,
            'Consider trade-offs between Time Complexity and Space Complexity.'
          ],
          companyTags: assignedCompanies,
          totalSubmissions: Math.floor(Math.random() * 200) + 50,
          acceptedSubmissions: Math.floor(Math.random() * 40) + 30,
        });
      }
    }
  }

  return fullList;
};

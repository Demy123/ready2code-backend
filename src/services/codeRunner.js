import vm from 'vm';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const TIME_LIMIT_MS = 3500; // 3.5 seconds per test case

/**
 * Normalizes output string for comparing results (trimming whitespace, newlines, extra spaces)
 */
export const normalizeOutput = (str) => {
  if (str === null || str === undefined) return '';
  if (typeof str === 'object') {
    try {
      return JSON.stringify(str).trim();
    } catch {
      return String(str).trim();
    }
  }
  return String(str)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim()
    .toLowerCase();
};

/**
 * Executes JavaScript code in an isolated VM sandbox
 */
const executeJavaScript = async (code, input) => {
  const startTime = process.hrtime();
  let capturedLogs = [];

  const sandbox = {
    console: {
      log: (...args) => {
        capturedLogs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args) => {
        capturedLogs.push(args.map(a => String(a)).join(' '));
      },
    },
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Set,
    Map,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    JSON,
  };

  const context = vm.createContext(sandbox);

  // Wrapper that allows both standard input or function calls
  const wrappedCode = `
    let __output__;
    try {
      ${code}

      // If user defined solve or solution or function name
      const fnNames = ['solve', 'solution', 'containsDuplicate', 'twoSum', 'isAnagram', 'groupAnagrams', 'topKFrequent', 'productExceptSelf', 'longestConsecutive', 'maxSubArray', 'majorityElement'];
      let targetFn = null;
      for (const fn of fnNames) {
        if (typeof eval('typeof ' + fn) !== 'undefined' && typeof eval(fn) === 'function') {
          targetFn = eval(fn);
          break;
        }
      }

      if (targetFn) {
        const rawInput = ${JSON.stringify(input)};
        const res = targetFn(rawInput);
        if (res !== undefined) {
          __output__ = typeof res === 'object' ? JSON.stringify(res) : String(res);
        }
      }
    } catch(err) {
      __error__ = err.message || String(err);
    }
  `;

  try {
    const script = new vm.Script(wrappedCode);
    sandbox.__error__ = null;

    script.runInContext(context, { timeout: TIME_LIMIT_MS });

    const diff = process.hrtime(startTime);
    const executionTimeMs = Math.round((diff[0] * 1000 + diff[1] / 1e6) * 100) / 100;

    if (sandbox.__error__) {
      return {
        success: false,
        error: sandbox.__error__,
        executionTime: executionTimeMs,
        actualOutput: capturedLogs.join('\n'),
      };
    }

    const output = sandbox.__output__ !== undefined ? sandbox.__output__ : capturedLogs.join('\n');

    return {
      success: true,
      actualOutput: output,
      executionTime: executionTimeMs,
      memory: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10,
    };
  } catch (err) {
    const isTimeout = err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err.message.includes('timed out');
    return {
      success: false,
      isTimeout,
      error: isTimeout ? 'Time Limit Exceeded (3.5s)' : err.message,
      executionTime: TIME_LIMIT_MS,
    };
  }
};

/**
 * Executes Python / C++ / Java code using temp files or sandboxed child_process
 */
const executeExternal = async (language, code, input) => {
  const tmpDir = path.join(os.tmpdir(), `dss_run_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  await fs.mkdir(tmpDir, { recursive: true });

  const startTime = Date.now();
  let filename = '';
  let cmd = '';

  try {
    if (language === 'python') {
      filename = path.join(tmpDir, 'solution.py');
      const pythonWrapper = `
import sys
import json

${code}

if __name__ == '__main__':
    try:
        raw_in = sys.stdin.read()
        if not raw_in:
            raw_in = """${input.replace(/"""/g, '\\"\\"\\"') }"""
        if 'solve' in globals():
            res = solve(raw_in)
            if res is not None:
                if isinstance(res, (list, dict, bool)):
                    print(json.dumps(res).lower() if isinstance(res, bool) else json.dumps(res))
                else:
                    print(res)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
`;
      await fs.writeFile(filename, pythonWrapper);
      cmd = `python3 "${filename}"`;
    } else if (language === 'cpp') {
      filename = path.join(tmpDir, 'solution.cpp');
      const binPath = path.join(tmpDir, 'solution.out');
      await fs.writeFile(filename, code);
      cmd = `g++ -O2 "${filename}" -o "${binPath}" && "${binPath}"`;
    } else if (language === 'java') {
      filename = path.join(tmpDir, 'Solution.java');
      await fs.writeFile(filename, code);
      cmd = `javac "${filename}" && java -cp "${tmpDir}" Solution`;
    }

    return await new Promise((resolve) => {
      const child = exec(
        cmd,
        {
          timeout: TIME_LIMIT_MS,
          maxBuffer: 1024 * 1024,
        },
        (error, stdout, stderr) => {
          const executionTime = Date.now() - startTime;
          if (error) {
            if (error.killed || error.signal === 'SIGTERM') {
              resolve({
                success: false,
                isTimeout: true,
                error: 'Time Limit Exceeded (3.5s)',
                executionTime: TIME_LIMIT_MS,
              });
            } else {
              resolve({
                success: false,
                error: stderr || error.message,
                actualOutput: stdout,
                executionTime,
              });
            }
          } else {
            resolve({
              success: true,
              actualOutput: stdout,
              executionTime,
              memory: 24.5,
            });
          }
        }
      );

      if (child.stdin) {
        child.stdin.write(input);
        child.stdin.end();
      }
    });
  } catch (err) {
    return {
      success: false,
      error: err.message,
      executionTime: Date.now() - startTime,
    };
  } finally {
    fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
};

/**
 * Unified Code Runner across test cases
 */
export const runCodeAgainstTestCases = async (code, language, testCases, isFullSubmission = false) => {
  const results = [];
  let allPassed = true;
  let totalExecutionTime = 0;
  let peakMemory = 12.0;
  let overallStatus = 'Accepted';
  let firstErrorMessage = '';

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let execResult;

    if (language === 'javascript') {
      execResult = await executeJavaScript(code, tc.input);
    } else {
      execResult = await executeExternal(language, code, tc.input);
    }

    totalExecutionTime += execResult.executionTime || 10;
    if (execResult.memory && execResult.memory > peakMemory) {
      peakMemory = execResult.memory;
    }

    if (execResult.isTimeout) {
      allPassed = false;
      overallStatus = 'Time Limit Exceeded';
      firstErrorMessage = 'Time limit exceeded on test case ' + (i + 1);
      results.push({
        caseIndex: i + 1,
        input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: 'Time Limit Exceeded',
        passed: false,
        isHidden: !!tc.isHidden,
        executionTime: execResult.executionTime,
        error: 'Execution Timed Out (>3500ms)',
      });
      break;
    }

    if (!execResult.success && execResult.error) {
      allPassed = false;
      overallStatus = execResult.error.includes('SyntaxError') || execResult.error.includes('javac') || execResult.error.includes('g++')
        ? 'Compilation Error'
        : 'Runtime Error';
      firstErrorMessage = execResult.error;
      results.push({
        caseIndex: i + 1,
        input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: execResult.actualOutput || '',
        passed: false,
        isHidden: !!tc.isHidden,
        executionTime: execResult.executionTime,
        error: execResult.error,
      });
      break;
    }

    const normActual = normalizeOutput(execResult.actualOutput);
    const normExpected = normalizeOutput(tc.expectedOutput);
    const passed = normActual === normExpected || (normActual.includes(normExpected) && normExpected.length > 0);

    if (!passed) {
      allPassed = false;
      if (overallStatus === 'Accepted') {
        overallStatus = 'Wrong Answer';
        firstErrorMessage = `Wrong Answer on test case ${i + 1}`;
      }
    }

    results.push({
      caseIndex: i + 1,
      input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
      expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
      actualOutput: tc.isHidden && !passed ? '[Hidden Result]' : execResult.actualOutput,
      passed,
      isHidden: !!tc.isHidden,
      executionTime: execResult.executionTime,
      error: passed ? '' : 'Outputs do not match',
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  const avgTime = results.length > 0 ? Math.round(totalExecutionTime / results.length) : 0;

  return {
    status: allPassed ? 'Accepted' : overallStatus,
    allPassed,
    passedTestCases: passedCount,
    totalTestCases: testCases.length,
    runtime: avgTime,
    memory: Math.round(peakMemory * 10) / 10,
    testCaseResults: results,
    errorMessage: firstErrorMessage,
  };
};

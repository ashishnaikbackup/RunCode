let pyodide = null;
let loading = false;

const editor = document.getElementById('editor');
const stdin = document.getElementById('stdin');
const output = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const status = document.getElementById('status');

async function loadPython() {
  if (pyodide) return pyodide;
  if (loading) {
    while (!pyodide) await new Promise(r => setTimeout(r, 100));
    return pyodide;
  }
  loading = true;
  status.textContent = 'Loading Python…';
  pyodide = await loadPyodide();
  loading = false;
  status.textContent = 'Ready';
  return pyodide;
}

async function runCode() {
  runBtn.disabled = true;
  runBtn.textContent = 'Running…';
  status.textContent = 'Running';
  output.textContent = '';

  try {
    const py = await loadPython();
    const inputLines = stdin.value.split(/\r?\n/);
    let inputIndex = 0;

    py.setStdin({
      stdin: () => inputIndex < inputLines.length ? inputLines[inputIndex++] : ''
    });

    await py.runPythonAsync(`import sys\nfrom io import StringIO\n__runcode_out = StringIO()\n__runcode_old = sys.stdout\nsys.stdout = __runcode_out`);
    await py.runPythonAsync(editor.value);
    const result = await py.runPythonAsync('__runcode_out.getvalue()');
    await py.runPythonAsync('sys.stdout = __runcode_old');

    output.textContent = result || 'Program finished with no output.';
    status.textContent = 'Finished';
  } catch (error) {
    try { await pyodide?.runPythonAsync('sys.stdout = __runcode_old'); } catch (_) {}
    output.textContent = String(error).replace(/^PythonError:\s*/i, '');
    status.textContent = 'Error';
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run';
  }
}

runBtn.addEventListener('click', runCode);
clearBtn.addEventListener('click', () => {
  editor.value = '';
  stdin.value = '';
  output.textContent = 'Press Run to execute your Python program.';
  status.textContent = 'Ready';
  editor.focus();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 1000);
  } catch (_) {}
});

editor.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0, start) + '    ' + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runCode();
  }
});

loadPython().catch(error => {
  status.textContent = 'Load failed';
  output.textContent = 'Could not load Python runtime. Check your internet connection and refresh.';
  console.error(error);
});

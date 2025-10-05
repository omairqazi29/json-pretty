const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const formatBtn = document.getElementById('formatBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const indentSizeEl = document.getElementById('indentSize');
const statusEl = document.getElementById('status');

formatBtn.addEventListener('click', formatJSON);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearInput);

inputEl.addEventListener('input', () => {
    if (outputEl.textContent !== 'Formatted JSON will appear here...') {
        formatJSON();
    }
});

function formatJSON() {
    const input = inputEl.value.trim();

    if (!input) {
        showStatus('Please enter some JSON', 'error');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const indentValue = indentSizeEl.value === 'tab' ? '\t' : parseInt(indentSizeEl.value);
        const formatted = JSON.stringify(parsed, null, indentValue);

        outputEl.textContent = formatted;
        outputEl.classList.remove('empty');
        copyBtn.disabled = false;
        showStatus('Valid JSON', 'success');
    } catch (error) {
        const errorMsg = error.message.replace('JSON.parse: ', '').replace('Unexpected ', '');
        showStatus(`Invalid JSON: ${errorMsg}`, 'error');
        outputEl.textContent = 'Invalid JSON - please check your input';
        outputEl.classList.add('empty');
        copyBtn.disabled = true;
    }
}

function copyToClipboard() {
    const text = outputEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showStatus('Failed to copy', 'error');
    });
}

function clearInput() {
    inputEl.value = '';
    outputEl.textContent = 'Formatted JSON will appear here...';
    outputEl.classList.add('empty');
    copyBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'status';
}

function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

// Sample JSON for demo
const sampleJSON = '{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zip":"10001"},"hobbies":["reading","coding","gaming"]}';

// Auto-load sample on first visit
if (!localStorage.getItem('visited')) {
    inputEl.value = sampleJSON;
    formatJSON();
    localStorage.setItem('visited', 'true');
}

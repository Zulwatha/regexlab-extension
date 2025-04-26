console.log('RegexLab panel script loaded.');
init();
window.window.regexMatches = [];


function init() {
  loadPatternOptions('default');
  loadCustomPatternList();
  const closeBtn = document.getElementById('regexlab-close');
  const highlightBtn = document.getElementById('regexlab-highlight');
  const input = document.getElementById('regexlab-input');
  const resultsBox = document.getElementById('regexlab-results');

  if (!closeBtn || !highlightBtn || !input || !resultsBox) {
    console.warn('RegexLab elements not found. Abort.');
    return;
  }

  closeBtn.addEventListener('click', () => {
    const panel = document.getElementById('regexlab-panel');
    if (panel) panel.remove();
    removeHighlights();
  });

  highlightBtn.addEventListener('click', () => {
    const pattern = input.value;
    resultsBox.innerHTML = '';
    removeHighlights();

    // Clear previous match list
    const matchList = document.getElementById('regexlab-match-list');
    matchList.innerHTML = ''; // Clear previous output
    window.regexMatches = []; // Reset window.regexMatches array


    if (!pattern) return;

    const matchCountRef = { count: 0 };

    try {
      // Build regex flags based on settings
      const flags = [
        document.getElementById('setting-global')?.checked ? 'g' : '',
        document.getElementById('setting-case')?.checked ? '' : 'i', // if unchecked = insensitive
        document.getElementById('setting-multiline')?.checked ? 'm' : ''
      ].join('');

      const regex = new RegExp(pattern, flags);

      const elements = document.querySelectorAll('*');

      elements.forEach((el) => {
        if (el.closest('#regexlab-panel')) return;

        [...el.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            highlightTextNode(node, regex, matchCountRef);
          }
        });
      });

      if (matchCountRef.count === 0) {
        resultsBox.innerHTML = '<i>No matches found.</i>';
      } else {
        resultsBox.innerHTML = `<b>${matchCountRef.count}</b> matches highlighted.`;
      }

    } catch (err) {
      resultsBox.innerHTML = `<span style="color: red;">Invalid regex pattern</span>`;
    }
  });

  // Tab switching logic
  document.querySelectorAll('.regexlab-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.regexlab-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.regexlab-tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      const targetTab = document.getElementById(`tab-${tabId}`);

      if (targetTab) {
        targetTab.classList.add('active');
      } else {
        console.warn('RegexLab: tab panel not found →', `tab-${tabId}`);
      }




    });
  });

  // 📋 Copy to Clipboard
  document.getElementById('regexlab-copy').addEventListener('click', () => {
    if (window.regexMatches.length === 0) return alert("No matches to copy.");
    navigator.clipboard.writeText(window.regexMatches.join('\n'))
      .then(() => alert("Copied to clipboard!"))
      .catch(err => alert("Failed to copy."));
  });

  // ⬇ Export as TXT
  document.getElementById('regexlab-export-txt').addEventListener('click', () => {
    if (window.regexMatches.length === 0) return alert("No matches to export.");
    const blob = new Blob([window.regexMatches.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, 'regexlab-output.txt');
  });

  // ⬇ Export as JSON
  document.getElementById('regexlab-export-json').addEventListener('click', () => {
    if (window.regexMatches.length === 0) return alert("No matches to export.");
    const blob = new Blob([JSON.stringify(window.regexMatches, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, 'regexlab-output.json');
  });

  const defaults = document.getElementById('regexlab-defaults');
  defaults.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value) {
      document.getElementById('regexlab-input').value = value;
    }
  });
  document.querySelectorAll('input[name="pattern-source"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      loadPatternOptions(e.target.value);
    });
  });

}

function removeHighlights() {
  document.querySelectorAll('mark.regexlab-highlight').forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function highlightTextNode(node, regex, matchCountRef) {
  const text = node.textContent;

  // All matches
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) return;

  const parent = node.parentNode;
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  matches.forEach(match => {
    const start = match.index;
    const end = start + match[0].length;

    // Add text before match
    if (start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
    }

    // Add highlighted match
    const mark = document.createElement('mark');
    mark.className = 'regexlab-highlight';
    mark.textContent = match[0];
    
    // Apply dynamic style
    mark.style.backgroundColor = document.getElementById('setting-highlight-color')?.value || '#264f78';
    mark.style.fontWeight = document.getElementById('setting-bold')?.checked ? 'bold' : 'normal';
    mark.style.fontStyle = document.getElementById('setting-italic')?.checked ? 'italic' : 'normal';
    
    fragment.appendChild(mark);

    lastIndex = end;
    matchCountRef.count++;
    window.regexMatches.push(match[0]);
  });

  // Add remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  parent.replaceChild(fragment, node);

  // Update Output tab with matches
  const matchList = document.getElementById('regexlab-match-list');
  matchList.innerHTML = window.regexMatches
    .map((m, i) => `<div>${i + 1}: ${m}</div>`)
    .join('');
  matchList.style.display = 'block';
}

document.getElementById('regexlab-save-pattern').addEventListener('click', () => {
  const currentPattern = document.getElementById('regexlab-input').value.trim();
  if (!currentPattern) return alert("Pattern is empty!");

  // Set pattern value in Library input
  document.getElementById('pattern-value').value = currentPattern;

  // Clear other fields just in case
  document.getElementById('pattern-title').value = '';
  document.getElementById('pattern-desc').value = '';
  document.getElementById('pattern-tags').value = '';

  // Switch tab
  document.querySelectorAll('.regexlab-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.regexlab-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="library"]').classList.add('active');
  document.getElementById('tab-library').classList.add('active');
});

document.getElementById('pattern-save').addEventListener('click', () => {
  const title = document.getElementById('pattern-title').value.trim();
  const desc = document.getElementById('pattern-desc').value.trim();
  const tags = document.getElementById('pattern-tags').value.trim();
  const pattern = document.getElementById('pattern-value').value.trim();

  if (!title || !pattern) return alert("Title and Pattern are required.");

  const saved = JSON.parse(localStorage.getItem('regexlab_custom_patterns') || '[]');
  saved.push({
    id: Date.now(),
    title,
    description: desc,
    tags: tags.split(',').map(t => t.trim()),
    pattern
  });
  localStorage.setItem('regexlab_custom_patterns', JSON.stringify(saved));
  alert("Pattern saved!");
});

function loadCustomPatternList() {
  const list = document.getElementById('pattern-list');
  list.innerHTML = '';
  const items = JSON.parse(localStorage.getItem('regexlab_custom_patterns') || '[]');

  if (items.length === 0) {
    const li = document.createElement('li');
    li.textContent = '(no saved patterns)';
    li.style.color = '#777';
    li.style.padding = '6px';
    list.appendChild(li);
    return;
  }

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item.title;
    li.style.padding = '6px';
    li.style.cursor = 'pointer';
    li.dataset.index = i;

    li.addEventListener('click', () => {
      document.getElementById('pattern-title').value = item.title;
      document.getElementById('pattern-desc').value = item.description;
      document.getElementById('pattern-tags').value = item.tags?.join(', ') || '';
      document.getElementById('pattern-value').value = item.pattern;
      document.getElementById('pattern-save').dataset.editing = i;
    });

    list.appendChild(li);
  });
}

document.getElementById('pattern-update').addEventListener('click', () => {
  const editingIndex = document.getElementById('pattern-save').dataset.editing;
  if (!editingIndex) return alert("Select a pattern to update.");

  const items = JSON.parse(localStorage.getItem('regexlab_custom_patterns') || '[]');
  items[editingIndex] = {
    ...items[editingIndex],
    title: document.getElementById('pattern-title').value.trim(),
    description: document.getElementById('pattern-desc').value.trim(),
    tags: document.getElementById('pattern-tags').value.trim().split(',').map(t => t.trim()),
    pattern: document.getElementById('pattern-value').value.trim()
  };

  localStorage.setItem('regexlab_custom_patterns', JSON.stringify(items));
  alert("Pattern updated.");
  loadCustomPatternList();
});
document.getElementById('pattern-delete').addEventListener('click', () => {
  const editingIndex = document.getElementById('pattern-save').dataset.editing;
  if (!editingIndex) return alert("Select a pattern to delete.");

  const items = JSON.parse(localStorage.getItem('regexlab_custom_patterns') || '[]');
  if (!confirm(`Delete "${items[editingIndex].title}"?`)) return;

  items.splice(editingIndex, 1);
  localStorage.setItem('regexlab_custom_patterns', JSON.stringify(items));

  document.getElementById('pattern-title').value = '';
  document.getElementById('pattern-desc').value = '';
  document.getElementById('pattern-tags').value = '';
  document.getElementById('pattern-value').value = '';
  document.getElementById('pattern-save').dataset.editing = '';
  loadCustomPatternList();
});


function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function loadPatternOptions(source = 'default') {
  const select = document.getElementById('regexlab-defaults');
  select.innerHTML = ''; // clear current

  const optionNone = document.createElement('option');
  optionNone.value = '';
  optionNone.textContent = '-- Select a pattern --';
  select.appendChild(optionNone);

  if (source === 'default') {
    const defaults = [
      { title: 'IPv4 (basic)', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
      { title: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
      { title: 'URL', pattern: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+\\S*' },
    ];

    defaults.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.pattern;
      opt.textContent = p.title;
      select.appendChild(opt);
    });
  } else if (source === 'custom') {
    const custom = JSON.parse(localStorage.getItem('regexlab_custom_patterns') || '[]');
    if (custom.length === 0) {
      const opt = document.createElement('option');
      opt.disabled = true;
      opt.textContent = '(no custom patterns)';
      select.appendChild(opt);
    } else {
      custom.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.pattern;
        opt.textContent = p.title;
        select.appendChild(opt);
      });
    }
  }
}

document.getElementById('setting-clear-storage').addEventListener('click', () => {
  if (!confirm("Are you sure you want to clear all custom saved patterns?")) return;
  localStorage.removeItem('regexlab_custom_patterns');
  alert("All saved patterns have been deleted.");
  loadCustomPatternList?.(); 
});

document.getElementById('setting-export-storage').addEventListener('click', () => {
  const patterns = localStorage.getItem('regexlab_custom_patterns');
  if (!patterns) return alert("No saved patterns found.");
  
  const now = new Date();
  const filename = `regexlab-patterns_${now.toISOString().replace(/[:.]/g, '-')}.json`;

  const blob = new Blob([patterns], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
});



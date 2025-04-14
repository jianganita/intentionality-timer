document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  document.getElementById('add-url').addEventListener('click', addNewUrlField);
  document.getElementById('save-settings').addEventListener('click', saveSettings);
});

function loadSettings() {
  browser.storage.local.get(['settings']).then((result) => {
    const settings = result.settings || {
      blockedUrls: [{ url: "https://www.youtube.com/feed/subscriptions", name: "YouTube Subscriptions" }],
      waitTime: 30
    };

    document.getElementById('wait-time').value = settings.waitTime;

    const urlList = document.getElementById('url-list');
    urlList.innerHTML = '';

    settings.blockedUrls.forEach(blockedUrl => {
      addUrlField(blockedUrl.url, blockedUrl.name);
    });
  });
}

function addUrlField(url = '', name = '') {
  const urlList = document.getElementById('url-list');
  
  const urlEntry = document.createElement('div');
  urlEntry.className = 'url-entry';
  
  const urlNameInput = document.createElement('input');
  urlNameInput.type = 'text';
  urlNameInput.className = 'url-name';
  urlNameInput.placeholder = 'Site Name (e.g., YouTube)';
  urlNameInput.value = name;
  
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.className = 'url-input';
  urlInput.placeholder = 'URL to block (e.g., https://youtube.com)';
  urlInput.value = url;
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'X';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    urlList.removeChild(urlEntry);
  });
  
  urlEntry.appendChild(urlNameInput);
  urlEntry.appendChild(urlInput);
  urlEntry.appendChild(removeBtn);
  
  urlList.appendChild(urlEntry);
}

function addNewUrlField() {
  addUrlField();
}

function saveSettings() {
  const waitTime = parseInt(document.getElementById('wait-time').value, 10) || 30;
  const urlEntries = document.querySelectorAll('.url-entry');
  const blockedUrls = [];
  
  urlEntries.forEach(entry => {
    const name = entry.querySelector('.url-name').value.trim();
    const url = entry.querySelector('.url-input').value.trim();
    
    if (url) {
      blockedUrls.push({ url, name: name || url });
    }
  });

  browser.storage.local.set({
    settings: {
      blockedUrls,
      waitTime
    }
  }).then(() => {
    const saveBtn = document.getElementById('save-settings');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 1500);
  });
}
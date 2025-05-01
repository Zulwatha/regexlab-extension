# 🔍 RegexLab – Browser Extension

RegexLab is a professional-grade browser extension for testing and debugging regular expressions directly on any webpage.  
Designed with a clean interface, tab-based workflow, and exportable results – it brings the power of regex tools into your browser.

## 🛒 Now Available on Chrome Web Store!

👉 [**RegexLab – Real-time Regex Tester & Highlighter**](https://chromewebstore.google.com/detail/regexlab-%E2%80%93-real-time-rege/jmkdpjcpcimhblcbpimjcifegnhcloic?hl=en-GB&authuser=0)

Bring the power of real-time regex testing into your browser – directly from the Chrome Web Store.

---

## 🚀 Features

- 🧪 Real-time regex evaluation on any page
- 🎯 Highlight matches instantly
- 📁 Default & custom pattern library
- 💾 Save, edit, and manage your own regex patterns
- 📤 Export results as `.txt` or `.json`
- 📋 Copy matches to clipboard
- 🛠 Configurable options (case sensitivity, global, multiline)
- 🆘 Built-in Help section and Settings

---

## 🛠 How to Install

1. Clone or download this repository.
2. Open your browser and go to `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the `regexlab-extension/` folder.

---

## 📁 Folder Structure

```
regexlab-extension/
├── manifest.json          # Extension config (Manifest V3)
├── background.js          # Handles icon click → inject panel
├── content.js             # Injects UI into pages
├── panel.html             # Main UI layout
├── panel.js               # Regex logic & interaction
├── panel.css              # Panel styling (VSCode-like)
├── assets/icons/          # Extension icons (16/48/128px)
└── README.md              # You are here
```

---

## 🧪 Sample Use Cases

- Test regex patterns live on websites
- Extract data from page content
- Export matches to integrate with other tools
- Use it as an in-browser regex cheat sheet

---

## 📦 Version

`v1.0.0 BETA`  
Released: **April 2025**

---

## 👨‍💻 Author

Created by [@Zulwatha](https://github.com/Zulwatha)  
Licensed under the [MIT License](LICENSE)

---

## 📌 Roadmap

- [ ] DevTools integration
- [ ] Cloud sync for custom patterns
- [ ] Inline match explanation tooltip
- [ ] Firefox support

---

Made with focus and coffee ☕

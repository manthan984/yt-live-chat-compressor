# YouTube Live Chat Compressor (Chrome Extension)

A lightweight Chrome Extension that improves **YouTube Live Chat readability** by collapsing repeated messages in real time.

Instead of deleting spam or filtering users, this extension **groups identical messages together** and shows a small counter badge (x2, x3, …), making fast chats easier to read for streamers and viewers.

---

## ✨ Demo

Before:

hello  
hello  
hello  
hello  

After:
hello (x4)

---

## 🚀 Features

- Real-time duplicate message detection
- Collapses repeated messages automatically
- Counter appears only from **x2+**
- Smooth popup animation on update
- Zero configuration required
- Lightweight (no backend, no API calls)
- No data collection or tracking

---

## 🧠 How It Works

The extension injects a content script into YouTube Live Chat and:

1. Uses **MutationObserver** to detect new chat messages
2. Normalizes message text for comparison
3. Tracks duplicates within a short time window
4. Removes repeated nodes
5. Updates a small inline counter badge

All processing happens **client-side only**.

No network requests. No storage. No user data.

---

## 🛠 Tech Stack

- JavaScript (Vanilla)
- Chrome Extension (Manifest V3)
- MutationObserver API
- DOM manipulation
- Shadow DOM / iframe handling
- CSS animations

---

## 🧩 Challenges Solved

Working with YouTube Live Chat required handling:

- iframe-based content injection
- Shadow DOM structures
- Dynamic DOM updates
- High-frequency message streams
- Efficient O(1) duplicate detection

This project was built as a **learning-focused MVP** to explore advanced browser and frontend behavior.

---

## 📦 Installation (Developer Mode)

1. Clone this repository
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder

Done.

---

## 📁 Project Structure

yt-chat-compressor/
├── manifest.json
├── content/chatObserver.js
├── styles/chatStyles.css
└── icons/


---

## 🔒 Privacy

This extension:

- Does NOT collect data
- Does NOT track users
- Does NOT send network requests
- Runs entirely locally

---

## 🚧 Status

Current version: MVP / Experimental

Working:
- Duplicate grouping
- Counter badge
- Animation
- Stable performance

Planned improvements:
- Similar-text grouping
- Emoji compression
- On/off toggle
- Custom time window

---

## 🎯 Why I Built This

Large live streams often make chats unreadable due to repeated spam messages.

I wanted to experiment with:
- Chrome extensions
- real-time DOM processing
- performance-safe UI updates

This project helped me understand how modern web apps handle dynamic content at scale.

---

## 👨‍💻 Author

Manthan  
B.Tech CSE | Web Dev | AI & Systems Enthusiast  

---

## ⭐ If you found this interesting

Feel free to star the repo or share feedback!

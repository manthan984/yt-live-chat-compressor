/**
 * YouTube Live Chat Compressor - Content Script
 * Core Logic: MutationObserver detects new chat nodes, normalizes text, 
 * and collapses duplicates within a 15-second window.
 */

(function () {
    'use strict';

    // --- Configuration ---
    const TIME_WINDOW_MS = 15000; // 15 seconds
    const CHAT_ITEM_SELECTOR = 'yt-live-chat-text-message-renderer';
    const CHAT_CONTAINER_SELECTOR = '#items.yt-live-chat-item-list-renderer';
    const MESSAGE_TEXT_SELECTOR = '#message';

    // --- State Management ---
    // Key: normalized_string, Value: { count, node, badgeNode, lastSeen }
    const messageMap = new Map();

    /**
     * Normalizes message text for comparison.
     * Rules: Lowercase, trim whitespace. No regex used per constraints.
     * @param {string} text 
     * @returns {string}
     */
    function normalizeText(text) {
        return text ? text.toLowerCase().trim() : '';
    }

    /**
     * Creates the counter badge element.
     * @param {string} key - The map key to reset on click.
     * @returns {HTMLElement}
     */

    function createBadge(key) {
        const badge = document.createElement('span');
        badge.className = 'yt-chat-compressor-badge';

        badge.innerText = 'x2';   // first visible state
        badge.style.display = 'none'; // hidden initially

        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (messageMap.has(key)) {
            messageMap.delete(key);
            badge.style.display = 'none';
            }
        });

        return badge;
    }


    /**
     * Updates the visible counter on an existing message.
     * @param {HTMLElement} badgeNode 
     * @param {number} count 
     */
    function updateBadgeDisplay(badgeNode, count) {
        if (!badgeNode) return;

        if (count >= 2) {
            badgeNode.innerText = `x${count}`;
            badgeNode.style.display = 'inline-flex';
            badgeNode.classList.add('yt-badge-pop');
            setTimeout(() => {
                badgeNode.classList.remove('yt-badge-pop');
            }, 180);
        }
    }


    /**
     * Processes a single chat node added to the DOM.
     * @param {HTMLElement} node 
     */
    function processNode(node) {
        if (!(node instanceof HTMLElement)) return;

        // Fail safely: Check if node matches expected chat message structure
        if (!node.tagName || node.tagName.toLowerCase() !== CHAT_ITEM_SELECTOR) {
            return;
        }

        const messageEl = node.querySelector(MESSAGE_TEXT_SELECTOR);
        if (!messageEl) return;

        // Store original message text ONCE (never read mutated DOM again)
        if (!messageEl.dataset.originalText) {
        messageEl.dataset.originalText = messageEl.textContent;
        }

        const rawText = messageEl.dataset.originalText;
        const normalizedKey = normalizeText(rawText);


        // Skip empty messages
        if (!normalizedKey) return;

        const now = Date.now();
        const existingEntry = messageMap.get(normalizedKey);

        // Logic: Check if exists AND is within time window
        if (existingEntry && (now - existingEntry.lastSeen < TIME_WINDOW_MS)) {
            // --- DUPLICATE FOUND ---

            // 1. Increment count
            existingEntry.count++;
            existingEntry.lastSeen = now;

            // 2. Update UI on the ORIGINAL node
            updateBadgeDisplay(existingEntry.badgeNode, existingEntry.count);

            // 3. Hide the NEW node (do not delete)
            node.style.display = 'none';

        } else {
            // --- NEW OR EXPIRED ---

            // 1. Create visual badge
            const badge = createBadge(normalizedKey);

            // 2. Insert badge into the DOM. 
            // Appending to the node ensures it sits at the end of the message row.
            node.appendChild(badge);

            // 3. Store/Overwrite in Map
            messageMap.set(normalizedKey, {
                count: 1,
                node: node,
                badgeNode: badge,
                lastSeen: now
            });
        }
    }

    /**
     * Callback for MutationObserver.
     * @param {MutationRecord[]} mutations 
     */
    function handleMutations(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    processNode(node);
                }
            }
        }
    }

    /**
     * Initialize the observer.
     * Retries finding the chat container since YouTube loads dynamically.
     */
    function init() {
        const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);

        if (chatContainer) {
            console.log('[Live Chat Compressor for YouTube] Active');
            const observer = new MutationObserver(handleMutations);
            observer.observe(chatContainer, { childList: true });
        } else {
            // Retry logic: YouTube is a SPA, chat loads lazily.
            // Uses safe timeout polling instead of Intervals (as much as possible),
            // but initial hook requires checking.
            setTimeout(init, 1000);
        }
    }

    // Start execution
    init();

})();
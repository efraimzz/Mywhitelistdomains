// @name Alert test
// @description Displays an alert dialog on google.it
// @author Emanuele Faranda
// @version 1.0
// @match *://*/*

alert("Js works");

(function () {
    const tryInject = () => {
        const docEl = document.documentElement;

        const style = document.createElement('style');
        style.textContent = `
      #kt-loading-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 2147483647 !important;
        font-family: "Segoe UI", sans-serif;
        font-size: 1.5rem;
        color: #1e293b;
        direction: rtl;
        text-align: right;
      }
      .spinner {
        display: inline-block;
        width: 80px;
        height: 80px;
        position: relative;
        margin-bottom: 20px;
      }
      .spinner div {
        position: absolute;
        width: 64px;
        height: 64px;
        border: 6px solid #0ea5e9;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
        docEl.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'kt-loading-overlay';
        overlay.innerHTML = `
      <div class="spinner"><div></div></div>
      <div class="text">טוען...</div>
    `;
        docEl.appendChild(overlay);
    };

    if (document.documentElement) {
        tryInject();
    } else {
        new MutationObserver(() => {
            if (document.documentElement) {
                tryInject();
            }
        }).observe(document, { childList: true });
    }
})();

let משתמש = "";
let blockFiles = {}, blurFiles = {}, extraFiles = {};

fetch(chrome.runtime.getURL("user.txt"))
  
    .then(() => {
        return Promise.all([
           // הסטת_אתרים_ספציפיים(),
            טשטוש_תמונות_לאתרים_ספציפיים(),
            //חסימת_וידאו()
        ]);
    })
    .catch(console.error)
    .finally(() => {
        alert("Js bug");
        document.getElementById('kt-loading-overlay')?.remove();
    });

function fetchFile(filename, store) {
    return fetch("https://ketertorah.co.il/סינון/approved.php?file=" + משתמש + filename)
        .then(res => res.ok ? res.text() : "")
        .then(txt => store[filename] = txt);
}

function isDisabled(fileText) {
    return fileText.trimStart().startsWith("@כבוי#");
}

function checkAccess(url, fileText) {
    const lines = fileText.split('\n').map(x => x.trim()).filter(Boolean);
    const isWhitelist = lines[0] === "@לבנה#";
    const rest = isWhitelist ? lines.slice(1) : lines;
    const match = rest.some(line => url.includes(line));
    return (isWhitelist && match) || (!isWhitelist && match);
}

function הסטת_אתרים_ספציפיים() {
    const url = location.href;
    if (isDisabled(blockFiles["block.txt"])) return;
    const fileText = blockFiles["block_.txt"].startsWith("@לבנה#") ? blockFiles["block_.txt"] : blockFiles["block.txt"];

    const isWhitelist = fileText.startsWith("@לבנה#");
    const inList = checkAccess(url, fileText);
    const allow = isWhitelist ? inList : !inList;
    if (allow) return;

    const blockURL = "https://ketertorah.co.il/Block";
    document.documentElement.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = blockURL;
    iframe.style.cssText = `
        position:fixed;
        top:0;left:0;
        width:100%;
        height:100%;
        border:none;
        z-index:999999;
    `;
    document.body.appendChild(iframe);
}

function טשטוש_תמונות_לאתרים_ספציפיים() {

    const blurAllImages = () => {
        document.querySelectorAll("img:not([data-blurred])").forEach(img => {
            img.style.filter = "blur(50px)";
            img.dataset.blurred = "true";
        });

        document.querySelectorAll("*:not([data-blurred])").forEach(el => {
            const bg = getComputedStyle(el).backgroundImage;
            if (bg && bg.includes("ytimg") && bg !== "none") {
                el.style.filter = "blur(50px)";
                el.dataset.blurred = "true";
            }
        });

        document.querySelectorAll(
            "ytd-thumbnail img, ytd-thumbnail-overlay-image-renderer, .ytp-cued-thumbnail-overlay, .ytp-cued-thumbnail-overlay-image"
        ).forEach(el => {
            el.style.filter = "blur(50px)";
            el.dataset.blurred = "true";
        });

        document.querySelectorAll("ytd-rich-grid-media, ytd-video-renderer").forEach(el => {
            el.style.filter = "blur(50px)";
            el.dataset.blurred = "true";
        });

        document.querySelectorAll(`
            ytd-display-ad-renderer,
            ytd-promoted-video-renderer,
            ytd-companion-slot-renderer,
            ytd-action-companion-ad-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            ytd-search-pyv-renderer,
            ytd-carousel-ad-renderer
        `).forEach(el => {
            el.style.filter = "blur(50px)";
            el.dataset.blurred = "true";
        });

        document.querySelectorAll("ytd-badge-supported-renderer, span, div").forEach(el => {
            if (el.textContent.trim().includes("מודעה")) {
                el.style.filter = "blur(1px)";
                el.dataset.blurred = "true";
            }
        });
    };

    const startObserver = () => {
        blurAllImages();

        new MutationObserver(() => blurAllImages()).observe(document.querySelector("ytd-app") || document.body, {
            childList: true,
            subtree: true
        });

        setInterval(blurAllImages, 1000);
    };

    const waitForBody = () => {
        if (!document.body) {
            requestAnimationFrame(waitForBody);
            return;
        }
        startObserver();
    };

    waitForBody();
}

function חסימת_וידאו() {
    const url = location.href;
    if (isDisabled(extraFiles["extra.txt"])) return;
    const fileText = extraFiles["extra_.txt"].startsWith("@לבנה#") ? extraFiles["extra_.txt"] : extraFiles["extra.txt"];

    const isWhitelist = fileText.startsWith("@לבנה#");
    const inList = checkAccess(url, fileText);
    const allow = isWhitelist ? inList : !inList;
    if (allow) return;

    const approvedList = fileText.split('\n').map(x => x.trim()).filter(Boolean);

    const selectors = [
        "video",
        "iframe[src*='youtube']",
        "iframe[src*='vimeo']",
        "#player",
        "#movie_player",
        "ytd-player",
        ".html5-video-player"
    ];

    function replaceWithBlock(el) {
        if (!el || el.dataset?.blocked) return;

        el.dataset.blocked = "true";
        const rect = el.getBoundingClientRect();
        const width = rect.width || 320;
        const height = rect.height || 180;

        const placeholder = document.createElement("div");
        placeholder.textContent = "🎬 תוכן זה נחסם לצפייה על ידי מערכת הסינון.";
        placeholder.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            background: #f8f8f8;
            border: 2px dashed #999;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            color: #444;
            margin: 10px 0;
            box-sizing: border-box;
        `;

        el.replaceWith(placeholder);
    }

    function scanNewNodes(nodes) {
        for (const node of nodes) {
            if (!(node instanceof HTMLElement)) continue;

            for (const selector of selectors) {
                if (node.matches(selector)) {
                    replaceWithBlock(node);
                    break;
                }
            }

            selectors.forEach(selector => {
                node.querySelectorAll?.(selector).forEach(replaceWithBlock);
            });
        }
    }

    function observeWhenReady() {
        if (!document.body) {
            requestAnimationFrame(observeWhenReady);
            return;
        }

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(replaceWithBlock);
        });

        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    scanNewNodes(mutation.addedNodes);
                }
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    observeWhenReady();
}

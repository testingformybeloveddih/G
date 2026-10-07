(function () {
  function injectScript() {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('content.js');
    s.onload = function () { this.remove(); };
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
  } else {
    injectScript();
  }
})();

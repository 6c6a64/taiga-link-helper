// keep track of the last set of GitHub links found on the page
let lastKnownGithubLinks = new Set();
// reference to the popup element if currently shown
let popup = null;

// scans the page for github pr/issue links and manages the popup
function detectGithubLinks() {
  const foundLinks = new Set();

  // look for all anchor tags that link to github.com
  document.querySelectorAll("a[href*='github.com']").forEach(link => {
    const url = link.href;
    // only match prs or issues (e.g. /pull/123 or /issues/456)
    if (/github\.com\/.+\/(pull|issues)\/\d+/.test(url)) {
      foundLinks.add(url);
    }
  });

  // if no links are found and a popup exists remove and reset
  if (foundLinks.size === 0 && popup) {
    popup.remove();
    popup = null;
    lastKnownGithubLinks.clear();
    return;
  }

  // check if new links or nb links changed
  const newLinks = [...foundLinks].filter(link => !lastKnownGithubLinks.has(link));
  if (newLinks.length > 0 || (popup && foundLinks.size !== lastKnownGithubLinks.size)) {
    lastKnownGithubLinks = foundLinks;
    showFloatingPopup(foundLinks);
  }
}

// formats a github link for display (e.g. user/repo → pull #123)
function formatLinkDisplay(url) {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)\/(pull|issues)\/(\d+)/);
  if (!match) return url;
  const [, repo, type, id] = match;
  return `${repo} → ${type} #${id}`;
}

// creates and displays the floating popup with list of links
function showFloatingPopup(linksSet) {
  // removing any existing popup before
  if (popup) popup.remove();

  popup = document.createElement("div");
  // style
  popup.style.position = "fixed";
  popup.style.top = "12px";
  popup.style.right = "12px";
  popup.style.zIndex = "9999";
  popup.style.maxWidth = "320px";
  popup.style.padding = "12px 14px";
  popup.style.backgroundColor = "#24292f";
  popup.style.color = "#fff";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)";
  popup.style.fontFamily = "sans-serif";
  popup.style.fontSize = "13px";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.gap = "8px";

  // how many links found
  const title = document.createElement("div");
  title.textContent = `🔗 ${linksSet.size} GitHub link(s) found:`;
  title.style.fontWeight = "bold";
  popup.appendChild(title);

  // adding a row for each link
  [...linksSet].forEach(url => {
    const line = document.createElement("div");
    line.style.display = "flex";
    line.style.justifyContent = "space-between";
    line.style.alignItems = "center";
    line.style.gap = "8px";
    line.style.padding = "4px 0";

    const label = document.createElement("span");
    label.textContent = formatLinkDisplay(url);
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    label.style.flex = "1";

    const btn = document.createElement("button");
    btn.textContent = "🡕";
    btn.style.padding = "2px 6px";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.background = "#2ea44f";
    btn.style.color = "white";
    btn.style.cursor = "pointer";

    // opens in a new tab
    btn.onclick = () => chrome.runtime.sendMessage({ action: "openTabs", links: [url] });

    line.appendChild(label);
    line.appendChild(btn);
    popup.appendChild(line);
  });

  document.body.appendChild(popup);
}

// initial scan for links
detectGithubLinks();
// sncan every 500ms
setInterval(detectGithubLinks, 500);

// also scan shortly after click
let clickTimeout;
document.addEventListener("click", () => {
  clearTimeout(clickTimeout);
  clickTimeout = setTimeout(detectGithubLinks, 100);
});

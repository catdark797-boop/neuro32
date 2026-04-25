// Create Yandex Metrika counter via CDP.
// Uses Input.dispatchKeyEvent because React forms (like Metrika's) often ignore
// value set via DOM property — they only trust events that look like real typing.
import { CdpSession, listTargets } from "file:///C:/Users/CatDark/.claude/mcp-servers/comet-browser/cdp.mjs";

const PORT = 9222;

async function pickTab(urlSubstr) {
  const targets = (await listTargets(PORT)).filter(t => t.type === "page");
  return targets.find(t => t.url && t.url.includes(urlSubstr)) ?? targets[0];
}

async function evalInPage(session, expr) {
  const { result, exceptionDetails } = await session.send("Runtime.evaluate", {
    expression: `(async()=>{${expr}})()`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  return result.value;
}

// Type a string using CDP Input.insertText — React forms treat this like
// a real paste/IME event and update their state correctly, no character
// doubling (which happens if you also send keyDown+keyUp around the char).
async function typeString(session, xpath, text) {
  await evalInPage(session, `
    const el = document.evaluate(${JSON.stringify(xpath)}, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!el) throw new Error('input not found at ' + ${JSON.stringify(xpath)});
    el.focus();
    el.select?.();
  `);
  // Backspace to clear any pre-existing value
  for (let i = 0; i < 60; i++) {
    await session.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
    await session.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
  }
  await session.send("Input.insertText", { text });
}

const target = await pickTab("metrika.yandex.ru/add");
if (!target) { console.error("No /add tab"); process.exit(1); }
const session = new CdpSession(target.webSocketDebuggerUrl);
await session.connect();
await session.send("Page.enable");
await session.send("DOM.enable");
await session.send("Runtime.enable");

const action = process.argv[2] ?? "fill";
// Only navigate for "fill" — for "submit" we reuse the tab's current state
// so React form values survive.
if (action === "fill" || action === "fill-and-submit") {
  await session.send("Page.navigate", { url: "https://metrika.yandex.ru/add" });
  await new Promise(r => setTimeout(r, 6000));
}

if (action === "fill" || action === "fill-and-submit") {
  await typeString(
    session,
    `//input[@placeholder="Будет использовано в интерфейсе"]`,
    "Нейро 32 prod",
  );
  await typeString(
    session,
    `//input[@placeholder="Домен или путь (без http, https и www)"]`,
    "нейро32.рф",
  );
  // Check ToS
  const tosOut = await evalInPage(session, `
    const tosLink = [...document.querySelectorAll('a')].find(a => /Пользовательского соглашения/i.test(a.innerText));
    if (!tosLink) return { tos: 'link not found' };
    let el = tosLink;
    for (let i = 0; i < 6 && el; i++) {
      el = el.parentElement;
      const cb = el?.querySelector?.('input[type=checkbox]');
      if (cb) {
        if (!cb.checked) cb.click();
        return { tos: 'checked', isChecked: cb.checked };
      }
    }
    return { tos: 'no checkbox near link' };
  `);
  console.log("fill done:", JSON.stringify(tosOut));
  // Verify values stuck
  const values = await evalInPage(session, `
    const inputs = [...document.querySelectorAll('input')].filter(i => i.offsetParent !== null && (i.type === 'text' || i.type === 'search'));
    return inputs.map(i => ({ placeholder: i.placeholder, value: i.value }));
  `);
  console.log("values:", JSON.stringify(values, null, 2));
}

if (action === "submit" || action === "fill-and-submit") {
  await new Promise(r => setTimeout(r, 1500));
  const out = await evalInPage(session, `
    const btn = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).find(b => /^\\s*(продолжить|создать счётчик|добавить)\\s*$/i.test(b.innerText || ''));
    if (btn) { btn.scrollIntoView({block:'center'}); btn.click(); return { clicked: btn.innerText.slice(0, 40) }; }
    return { notFound: true };
  `);
  console.log("submit:", JSON.stringify(out));
  await new Promise(r => setTimeout(r, 10000));
  const after = await evalInPage(session, `return { url: location.href, title: document.title, bodyPreview: document.body.innerText.slice(0, 1500) };`);
  console.log("after:", JSON.stringify(after, null, 2));
}

if (action === "extract") {
  const out = await evalInPage(session, `
    const url = location.href;
    const body = document.body.innerText;
    // Counter id appears in URL path like /stat/?counter_id=NNN or /settings?id=NNN
    const urlMatch = url.match(/(?:counter_id|id)=([0-9]+)/);
    const bodyIdMatch = body.match(/(?:номер счётчика|ID счётчика|counter[^0-9]*id)[^0-9]{0,30}([0-9]{6,10})/i);
    // Page source may include <code>yandex-verification content="abc"</code>
    const src = document.documentElement.outerHTML;
    const verifyMatch = src.match(/yandex-verification[^a-f0-9]*([a-f0-9]{14,24})/i);
    const counterFromSrc = src.match(/counter\\.id['":\\s=]+([0-9]{6,10})/i);
    return {
      url,
      counterFromUrl: urlMatch?.[1] ?? null,
      counterFromBody: bodyIdMatch?.[1] ?? null,
      counterFromSrc: counterFromSrc?.[1] ?? null,
      verification: verifyMatch?.[1] ?? null,
      bodyPreview: body.slice(0, 2000),
    };
  `);
  console.log(JSON.stringify(out, null, 2));
}

session.close();

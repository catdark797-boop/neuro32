// Grab the verification <meta name="yandex-verification"> code for the counter.
// Run after counter is created; counter id is taken from secrets env.
import { CdpSession, listTargets } from "file:///C:/Users/CatDark/.claude/mcp-servers/comet-browser/cdp.mjs";

const COUNTER_ID = "108745795";

async function pickTab(urlSubstr) {
  const targets = (await listTargets(9222)).filter(t => t.type === "page");
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

const target = await pickTab("metrika.yandex.ru");
const session = new CdpSession(target.webSocketDebuggerUrl);
await session.connect();
await session.send("Page.enable");
await session.send("Runtime.enable");

// Counter settings page shows a "Ownership verification" section with meta tag.
await session.send("Page.navigate", { url: `https://metrika.yandex.ru/settings?id=${COUNTER_ID}` });
await new Promise(r => setTimeout(r, 8000));

// Click "Подтверждение прав" tab or whichever contains meta
const out = await evalInPage(session, `
  const src = document.documentElement.outerHTML;
  // Try to find yandex-verification meta anywhere in source
  const metaMatch = src.match(/yandex-verification[^a-fA-F0-9]{1,10}([a-fA-F0-9]{14,24})/);
  // Or in a <code> block
  const codeMatch = src.match(/<code[^>]*>[^<]*yandex-verification[^<]*content=[^a-fA-F0-9]+([a-fA-F0-9]{14,24})/i);
  // Links / tabs available
  const tabs = [...document.querySelectorAll('a,button,[role=tab]')].map(e => (e.innerText || e.ariaLabel || '').trim()).filter(Boolean);
  return {
    url: location.href,
    meta: metaMatch?.[1] ?? null,
    code: codeMatch?.[1] ?? null,
    tabs: tabs.slice(0, 40),
    bodyStart: document.body.innerText.slice(0, 1500),
  };
`);
console.log(JSON.stringify(out, null, 2));
session.close();

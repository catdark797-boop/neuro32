// Register Metrika JS-event goals via the public counter Settings page.
// Each goal needs to be created once so it shows up in funnel reports +
// converts uncaptured events into named goals retroactively.
import { CdpSession, listTargets } from "file:///C:/Users/CatDark/.claude/mcp-servers/comet-browser/cdp.mjs";

const COUNTER = "108745795";
const GOALS = [
  { id: "enroll_click",       label: "Клик «Записаться»" },
  { id: "enroll_submit",      label: "Заявка на занятие отправлена" },
  { id: "business_submit",    label: "Бизнес-заявка отправлена" },
  { id: "register_submit",    label: "Регистрация в ЛК" },
  { id: "login_success",      label: "Успешный логин" },
  { id: "account_delete",     label: "Удаление аккаунта" },
  { id: "contact_submit",     label: "Форма «Контакты» отправлена" },
  { id: "ai_widget_open",     label: "Открыт ИИ-виджет" },
  { id: "telegram_click",     label: "Клик на Telegram CTA" },
  { id: "payment_initiated",  label: "Старт оплаты" },
  { id: "program_click_kids",   label: "Клик на программу «Дети»" },
  { id: "program_click_teens",  label: "Клик на программу «Подростки»" },
  { id: "program_click_adults", label: "Клик на программу «Взрослые»" },
  { id: "program_click_cyber",  label: "Клик на программу «Кибер»" },
];

async function pickTab(urlSubstr) {
  const targets = (await listTargets(9222)).filter(t => t.type === "page");
  return targets.find(t => t.url && t.url.includes(urlSubstr)) ?? targets[0];
}

async function evalIn(session, expr) {
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

await session.send("Page.navigate", { url: `https://metrika.yandex.ru/settings?id=${COUNTER}&tab=goals` });
await new Promise(r => setTimeout(r, 8000));

const out = await evalIn(session, `
  return {
    url: location.href,
    title: document.title,
    inputs: [...document.querySelectorAll('input,textarea')].filter(i=>i.offsetParent!==null).map(i=>({n:i.name,id:i.id,placeholder:i.placeholder,type:i.type,aria:i.getAttribute('aria-label')})),
    buttons: [...document.querySelectorAll('button,a')].filter(b=>b.offsetParent!==null).slice(0,30).map(b=>(b.innerText||b.ariaLabel||'').slice(0,40)).filter(Boolean),
    bodyStart: document.body.innerText.slice(0, 1500),
  };
`);
console.log(JSON.stringify(out, null, 2));
session.close();
console.log("\\n--- goals to create ---");
for (const g of GOALS) console.log(`  ${g.id}\\t${g.label}`);

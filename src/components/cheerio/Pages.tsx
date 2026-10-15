import { useState } from "react";
import {
  CheckCircle2, Clock, FileEdit, MessageCircle, MousePointerClick, Plus, Search, Send, ShoppingBag, Users,
} from "lucide-react";

const tone = {
  good: "bg-success/12 text-success",
  wait: "bg-warning/20 text-warning-ink",
  muted: "bg-muted text-muted-foreground",
};

function PageHead({ title, sub, action }: { title: string; sub: string; action?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div><h1 className="text-2xl font-semibold">{title}</h1><p className="text-sm text-muted-foreground">{sub}</p></div>
      {action && <button className="hidden min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground sm:flex"><Plus className="h-4 w-4" />{action}</button>}
    </div>
  );
}

function Chip({ t, c }: { t: string; c: string }) {
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${c}`}>{t}</span>;
}

const card = "rounded-2xl border bg-card p-4 shadow-soft";

export function HomePage() {
  const stats = [
    { l: "Messages sent", v: "12,480", I: Send },
    { l: "Read rate", v: "68%", I: CheckCircle2 },
    { l: "Replies", v: "1,204", I: MessageCircle },
    { l: "Link clicks", v: "3,912", I: MousePointerClick },
  ];
  const activity = [
    ["Diwali_Offer_v2 was rejected by Meta", "2h ago"],
    ["Festive Sale campaign delivered to 4,210 contacts", "Yesterday"],
    ["Order_Update template approved", "2 days ago"],
    ["Shopify sync added 86 new contacts", "3 days ago"],
  ];
  return (
    <>
      <PageHead title="Good morning, Priya" sub="Here's how your WhatsApp messages did this month." />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ l, v, I }) => (
          <div key={l} className={card}>
            <I className="h-5 w-5 text-primary" />
            <p className="mt-2 text-2xl font-semibold">{v}</p>
            <p className="text-xs text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-semibold">Recent activity</h2>
      <ul className="mt-3 divide-y rounded-2xl border bg-card shadow-soft">
        {activity.map(([t, w]) => (
          <li key={t} className="flex items-center justify-between gap-3 p-4 text-sm"><span>{t}</span><span className="shrink-0 text-xs text-muted-foreground">{w}</span></li>
        ))}
      </ul>
    </>
  );
}

export function CampaignsPage() {
  const rows = [
    { n: "Festive Sale – Sarees", s: "Sent", c: tone.good, a: "4,210 sent · 71% read", d: "Oct 12" },
    { n: "New Arrivals: Kurtis", s: "Scheduled", c: tone.wait, a: "2,980 contacts", d: "Oct 20, 10:00 AM" },
    { n: "Cart recovery – weekly", s: "Sent", c: tone.good, a: "312 sent · 54% read", d: "Oct 9" },
    { n: "Diwali Offer", s: "Draft", c: tone.muted, a: "Waiting on template approval", d: "—" },
  ];
  return (
    <>
      <PageHead title="Campaigns" sub="Send a template to many customers at once." action="New campaign" />
      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li key={r.n} className={`flex items-center gap-4 ${card}`}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{r.n}</p>
              <p className="truncate text-sm text-muted-foreground">{r.a}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.d}</p>
            </div>
            <Chip t={r.s} c={r.c} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function FlowsPage() {
  const [flows, setFlows] = useState([
    { n: "Welcome & catalogue", d: "Greets new chats and shares the latest catalogue", on: true },
    { n: "Order status lookup", d: "Customers type an order ID to get tracking", on: true },
    { n: "Return requests", d: "Collects order ID, reason and photos", on: false },
    { n: "Store hours & location", d: "Answers 'where are you?' and 'are you open?'", on: true },
  ]);
  return (
    <>
      <PageHead title="Chatbot Flows" sub="Automatic replies that run when customers message you." action="New flow" />
      <ul className="mt-5 space-y-3">
        {flows.map((f, i) => (
          <li key={f.n} className={`flex items-center gap-4 ${card}`}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{f.n}</p>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
            <button role="switch" aria-checked={f.on} aria-label={`${f.n} active`}
              onClick={() => setFlows((fs) => fs.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${f.on ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${f.on ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function IntegrationsPage() {
  const [apps, setApps] = useState([
    { n: "Shopify", d: "Sync orders and customers", on: true },
    { n: "WooCommerce", d: "Sync orders from your WordPress store", on: false },
    { n: "Razorpay", d: "Send payment links and receipts", on: true },
    { n: "Google Sheets", d: "Import contacts from a sheet", on: false },
    { n: "Zoho CRM", d: "Keep leads and chats in sync", on: false },
    { n: "Shiprocket", d: "Send shipping updates automatically", on: false },
  ]);
  return (
    <>
      <PageHead title="Integrations" sub="Connect the tools you already use." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {apps.map((a, i) => (
          <div key={a.n} className={`flex items-center gap-3 ${card}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tint"><ShoppingBag className="h-5 w-5 text-primary" /></span>
            <div className="min-w-0 flex-1"><p className="font-semibold">{a.n}</p><p className="text-xs text-muted-foreground">{a.d}</p></div>
            <button onClick={() => setApps((as) => as.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
              className={`min-h-9 shrink-0 rounded-lg px-3 text-xs font-semibold ${a.on ? tone.good : "border bg-card"}`}>
              {a.on ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function InboxPage() {
  const chats = [
    { n: "Anitha R", m: "Is the green silk saree available in size M?", t: "10:42 AM", u: 2 },
    { n: "Karthik S", m: "Thanks, got the tracking link 👍", t: "9:15 AM", u: 0 },
    { n: "Meena", m: "Can I exchange the kurti I bought last week?", t: "Yesterday", u: 1 },
    { n: "Deepa V", m: "What time do you close today?", t: "Yesterday", u: 0 },
    { n: "Rahul K", m: "Payment done, please confirm", t: "Mon", u: 0 },
  ];
  return (
    <>
      <PageHead title="Inbox" sub="Customer chats from your WhatsApp number." />
      <label className="mt-5 flex min-h-11 items-center gap-2 rounded-xl border bg-card px-3 text-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input className="w-full bg-transparent outline-none" placeholder="Search chats" />
      </label>
      <ul className="mt-3 divide-y rounded-2xl border bg-card shadow-soft">
        {chats.map((c) => (
          <li key={c.n} className="flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tint text-sm font-bold text-primary">{c.n[0]}</span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm ${c.u ? "font-semibold" : "font-medium"}`}>{c.n}</p>
              <p className="truncate text-sm text-muted-foreground">{c.m}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">{c.t}</span>
              {c.u > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{c.u}</span>}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SettingsPage() {
  const fields = [
    ["Business name", "Priya's Boutique"],
    ["City", "Chennai"],
    ["WhatsApp number", "+91 98400 12345"],
    ["Business email", "hello@priyasboutique.in"],
  ];
  const team = [
    { n: "Priya", r: "Owner" },
    { n: "Lakshmi", r: "Team member" },
  ];
  return (
    <>
      <PageHead title="Settings" sub="Your business profile and team." />
      <section className={`mt-5 ${card}`}>
        <h2 className="flex items-center gap-2 font-semibold"><FileEdit className="h-4 w-4 text-primary" />Business profile</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {fields.map(([l, v]) => (
            <label key={l} className="text-xs font-medium text-muted-foreground">{l}
              <input defaultValue={v} className="mt-1 block min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none focus:border-primary" />
            </label>
          ))}
        </div>
      </section>
      <section className={`mt-4 ${card}`}>
        <h2 className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-primary" />Team</h2>
        <ul className="mt-2 divide-y">
          {team.map((m) => (
            <li key={m.n} className="flex items-center justify-between py-3 text-sm">
              <span className="font-medium">{m.n}</span><Chip t={m.r} c={m.r === "Owner" ? tone.good : tone.muted} />
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />Meta business verification: pending</p>
    </>
  );
}

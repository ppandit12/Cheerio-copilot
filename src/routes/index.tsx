import { createFileRoute } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import {
  AlertCircle, CheckCircle2, Clock, FlaskConical, GitBranch, Home, Inbox, LayoutTemplate, Megaphone, Plug, Settings, Sparkles, X, XCircle,
} from "lucide-react";
const logo = { url: "/cheerio-logo.png" };
import { initialTemplates, useCopilotEngine, type Scenario, type TemplateStatus } from "@/components/cheerio/engine";
import { CopilotPanel } from "@/components/cheerio/CopilotPanel";
import { AgentView } from "@/components/cheerio/AgentView";
import { CampaignsPage, FlowsPage, HomePage, InboxPage, IntegrationsPage, SettingsPage } from "@/components/cheerio/Pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cheerio Copilot – Templates prototype" },
      { name: "description", content: "Clickable prototype: Cheerio Copilot helps fix a rejected WhatsApp template." },
      { property: "og:title", content: "Cheerio Copilot – Templates prototype" },
      { property: "og:description", content: "Clickable prototype: Cheerio Copilot helps fix a rejected WhatsApp template." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

const nav = [
  { l: "Home", i: Home }, { l: "Campaigns", i: Megaphone }, { l: "Templates", i: LayoutTemplate }, { l: "Chatbot Flows", i: GitBranch },
  { l: "Integrations", i: Plug }, { l: "Inbox", i: Inbox }, { l: "Settings", i: Settings },
];

const pages: Record<string, ComponentType> = {
  Home: HomePage, Campaigns: CampaignsPage, "Chatbot Flows": FlowsPage, Integrations: IntegrationsPage, Inbox: InboxPage, Settings: SettingsPage,
};

const chip: Record<TemplateStatus, { t: string; c: string; I: typeof CheckCircle2 }> = {
  approved: { t: "Approved", c: "bg-success/12 text-success", I: CheckCircle2 },
  rejected: { t: "Rejected", c: "bg-destructive/12 text-destructive", I: XCircle },
  review: { t: "In review", c: "bg-warning/20 text-warning-ink", I: Clock },
};

const scenarios: [Scenario, string][] = [
  ["main", "Main: fix rejected template"],
  ["verification", "1. Meta verification pending"],
  ["lowconf", "2. Low confidence"],
  ["human", "3. Frustrated / wants a human"],
  ["billing", "4. Billing / refund"],
  ["failagain", "5. Fix fails again"],
  ["hinglish", "6. Hinglish"],
  ["nopermission", "7. No permission (team member)"],
  ["unavailable", "8. AI unavailable"],
];

function App() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [banner, setBanner] = useState(true);
  const [agent, setAgent] = useState(false);
  const [ctrl, setCtrl] = useState(false);
  const [page, setPage] = useState("Templates");
  const [pulseKey, setPulseKey] = useState(0);
  const setStatus = (s: TemplateStatus) => setTemplates((ts) => ts.map((t) => (t.name === "Diwali_Offer_v2" ? { ...t, status: s } : t)));
  const e = useCopilotEngine(setStatus);
  const Page = pages[page];
  const rejected = templates.some((t) => t.status === "rejected");

  const restart = () => { e.fullReset(); setTemplates(initialTemplates); setBanner(true); setAgent(false); setCtrl(false); setPage("Templates"); setPulseKey((k) => k + 1); };

  const controls = (
    <div className="fixed bottom-20 left-3 z-[55] lg:bottom-4">
      {ctrl && (
        <div className="mb-2 w-64 animate-rise rounded-2xl border-2 border-dashed border-proto-foreground/30 bg-proto p-3 text-proto-foreground shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">Demo scenarios</p>
          <div className="mt-1 max-h-[55vh] space-y-0.5 overflow-y-auto">
            {scenarios.map(([k, l]) => (
              <button key={k} className="block min-h-9 w-full rounded-lg px-2 text-left text-sm hover:bg-proto-foreground/10" onClick={() => { setAgent(false); setPage("Templates"); setTemplates(initialTemplates); e.start(k); setCtrl(false); }}>{l}</button>
            ))}
          </div>
          <div className="mt-2 grid gap-1 border-t border-proto-foreground/20 pt-2">
            <button className="min-h-9 rounded-lg px-2 text-left text-sm font-semibold hover:bg-proto-foreground/10" onClick={() => { setAgent(!agent); e.setOpen(false); setCtrl(false); }}>{agent ? "View as customer" : "View as support agent"}</button>
            <button className="min-h-9 rounded-lg px-2 text-left text-sm font-semibold hover:bg-proto-foreground/10" onClick={restart}>Restart demo</button>
          </div>
        </div>
      )}
      <button aria-expanded={ctrl} onClick={() => setCtrl(!ctrl)} className="flex min-h-11 items-center gap-2 rounded-full border-2 border-dashed border-proto-foreground/40 bg-proto px-4 text-sm font-semibold text-proto-foreground shadow-soft">
        <FlaskConical className="h-4 w-4" />Prototype controls
      </button>
    </div>
  );

  if (agent) return <>{<AgentView onExit={() => setAgent(false)} />}{controls}</>;

  return (
    <div className="min-h-screen pb-20 lg:pb-0 lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-card p-4 lg:block">
        <img src={logo.url} alt="Cheerio AI" className="h-8 w-auto" />
        <nav className="mt-8 space-y-1" aria-label="Main">
          {nav.map(({ l, i: I }) => (
            <a key={l} href="#" onClick={(ev) => { ev.preventDefault(); setPage(l); }} aria-current={l === page ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${l === page ? "bg-tint text-secondary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <I className="h-4.5 w-4.5" />{l}
            </a>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur">
        <img src={logo.url} alt="Cheerio AI" className="h-6 w-auto lg:hidden" />
        <p className="ml-auto truncate text-sm font-medium text-muted-foreground lg:ml-0">Priya's Boutique, Chennai</p>
        <span className="ml-auto hidden lg:block" />
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-foreground" aria-label="Profile: Priya">P</span>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {Page ? <Page /> : (<>
        <div className="flex items-end justify-between gap-3">
          <div><h1 className="text-2xl font-semibold">Templates</h1><p className="text-sm text-muted-foreground">Messages Meta has to approve before you can send them.</p></div>
          <button className="hidden min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground sm:block">New template</button>
        </div>

        {banner && rejected && (
          <div className="mt-5 flex animate-rise flex-col gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center">
            <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />
            <p className="flex-1 text-sm font-medium">One of your templates was rejected. Want Copilot to help fix it?</p>
            <div className="flex gap-2">
              <button className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" onClick={e.openPanel}><Sparkles className="h-4 w-4" />Fix with Copilot</button>
              <button className="min-h-11 rounded-xl border bg-card px-4 text-sm font-semibold" onClick={() => setBanner(false)}>Dismiss</button>
            </div>
          </div>
        )}

        <ul className="mt-5 space-y-3">
          {templates.map((t) => {
            const s = chip[t.status];
            return (
              <li key={t.name} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft transition">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{t.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{t.preview}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.category}</p>
                </div>
                <span key={t.status} className={`flex shrink-0 animate-rise items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${s.c}`}><s.I className="h-3.5 w-3.5" />{s.t}</span>
              </li>
            );
          })}
        </ul>
        </>)}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t bg-card lg:hidden" aria-label="Main">
        {nav.map(({ l, i: I }) => (
          <a key={l} href="#" onClick={(ev) => { ev.preventDefault(); setPage(l); }} aria-current={l === page ? "page" : undefined}
            className={`flex min-h-16 min-w-[72px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${l === page ? "text-primary" : "text-muted-foreground"}`}>
            <I className="h-5 w-5" />{l}
          </a>
        ))}
      </nav>

      {!e.open && (
        <button key={pulseKey} onClick={e.openPanel} className="fixed bottom-20 right-4 z-40 flex min-h-12 animate-pulse-once items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-float lg:bottom-6">
          <Sparkles className="h-5 w-5" />Ask Copilot
        </button>
      )}
      <CopilotPanel e={e} />
      {controls}
      <span className="sr-only"><X /></span>
    </div>
  );
}

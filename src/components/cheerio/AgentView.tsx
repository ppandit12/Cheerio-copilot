import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronDown, RefreshCw, Sparkles } from "lucide-react";

const tickets = [
  { name: "Priya's Boutique", sub: "Template rejected twice", tag: true, pri: "High", time: "2m", sel: true },
  { name: "Ravi Electronics", sub: "Can't connect number", tag: false, pri: "Normal", time: "18m" },
  { name: "Green Leaf Cafe", sub: "Campaign scheduling", tag: false, pri: "Low", time: "1h" },
];
const DRAFT =
  "Hi Priya, thanks for your patience! I've checked your Diwali_Offer_v2 template. Copilot's fix (sample name + Marketing category + opt-out line) looks right. If Meta rejects it again, I'll help you update it right away.";

export function AgentView({ onExit }: { onExit: () => void }) {
  const [hist, setHist] = useState(false);
  const [reply, setReply] = useState("");
  const [draft, setDraft] = useState(DRAFT);
  const [editDraft, setEditDraft] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [fb, setFb] = useState<null | "ask" | "no" | "done">(null);
  const say = (t: string) => { setToast(t); setTimeout(() => setToast(null), 2200); };
  const sec = "rounded-xl border bg-card p-3";
  const h = "text-xs font-bold uppercase tracking-wide text-muted-foreground";
  const sbtn = "min-h-10 rounded-lg border px-3 text-xs font-semibold hover:bg-tint";

  return (
    <div className="min-h-screen bg-muted">
      <header className="flex items-center gap-3 border-b bg-card px-4 py-3">
        <button onClick={onExit} aria-label="Back to customer view" className="grid h-11 w-11 place-items-center rounded-xl hover:bg-tint"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-semibold">Cheerio Support Inbox</h1>
        <span className="ml-auto rounded-full bg-tint px-3 py-1 text-xs font-semibold text-secondary-foreground">Agent: Arjun</span>
      </header>
      <div className="grid gap-3 p-3 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        <nav aria-label="Tickets" className="space-y-2">
          {tickets.map((t) => (
            <div key={t.name} className={`rounded-xl border p-3 ${t.sel ? "border-primary bg-tint" : "bg-card"}`}>
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">{t.name}</p><span className="text-xs text-muted-foreground">{t.time}</span></div>
              <p className="text-xs text-muted-foreground">{t.sub}</p>
              <div className="mt-2 flex gap-1.5">
                {t.tag && <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground"><Sparkles className="h-3 w-3" />From Copilot</span>}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.pri === "High" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>{t.pri} priority</span>
              </div>
            </div>
          ))}
        </nav>

        <main className="flex flex-col rounded-xl border bg-card">
          <div className="border-b p-4"><p className="font-semibold">Priya's Boutique, Chennai</p><p className="text-xs text-muted-foreground">Template rejected twice · Templates queue</p></div>
          <div className="flex-1 space-y-3 p-4">
            <button aria-expanded={hist} onClick={() => setHist(!hist)} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-tint px-3 text-sm font-semibold">
              Copilot conversation (9 messages)<ChevronDown className={`h-4 w-4 transition ${hist ? "rotate-180" : ""}`} />
            </button>
            {hist && (
              <ul className="space-y-1.5 rounded-xl border p-3 text-sm text-muted-foreground">
                <li><b>Copilot:</b> Diwali_Offer_v2 was rejected: missing {"{{1}}"} sample, wrong category.</li>
                <li><b>Priya:</b> Fix it for me</li>
                <li><b>Copilot:</b> Showed fix, Priya approved resubmission.</li>
                <li><b>Priya:</b> No, I still need help</li>
              </ul>
            )}
            <p className="w-fit max-w-[80%] rounded-2xl bg-muted px-3.5 py-2 text-sm">I've already tried twice, please help before Diwali!</p>
          </div>
          <div className="border-t p-3">
            <label htmlFor="ag-r" className="sr-only">Reply</label>
            <textarea id="ag-r" rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." className="w-full rounded-xl border p-3 text-sm" />
            <button className="mt-2 min-h-11 rounded-xl bg-primary px-5 font-semibold text-primary-foreground" onClick={() => { if (reply) { setReply(""); say("Sent"); setFb("ask"); } }}>Send</button>
          </div>
        </main>

        <aside aria-label="Agent Copilot" className="space-y-3">
          <p className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-primary" />Agent Copilot</p>
          <div className={sec}><p className={h}>Summary</p>
            <p className="mt-1 text-sm">Diwali_Offer_v2 rejected twice. Copilot fixed sample + category and resubmitted. Customer still wants help before Diwali.</p></div>
          <div className={sec}><p className={h}>Likely cause</p>
            <p className="mt-1 text-sm">Promotional offer without end date.</p>
            <p className="mt-1 text-xs"><span className="rounded-full bg-warning/20 px-2 py-0.5 font-bold text-warning-ink">Medium confidence</span> · <a href="#" onClick={(e) => e.preventDefault()} className="underline">Meta rejection note</a></p></div>
          <div className={sec}><p className={h}>Suggested fix</p><p className="mt-1 text-sm">Add "Offer valid till 3 Nov" and resubmit as Marketing.</p></div>
          <div className={sec}><p className={h}>Draft reply</p>
            {editDraft ? <textarea rows={5} value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-1 w-full rounded-lg border p-2 text-sm" aria-label="Edit draft" />
              : <p className="mt-1 rounded-lg bg-tint p-2 text-sm">{draft}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="min-h-10 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground" onClick={() => { setReply(draft); setEditDraft(false); }}>Use draft</button>
              <button className={sbtn} onClick={() => setEditDraft(!editDraft)}>{editDraft ? "Done" : "Edit"}</button>
              <button className={`${sbtn} flex items-center gap-1`} onClick={() => setDraft("Hi Priya! I'm on it. I'll add an end date to your Diwali offer and resubmit it for you within the hour.")}><RefreshCw className="h-3 w-3" />Regenerate</button>
            </div></div>
          <div className={`${sec} grid grid-cols-2 gap-2 text-xs`}>
            <p className={`${h} col-span-2`}>Account</p>
            <span>Plan: <b>Growth</b></span><span>Number: <b className="text-success">Connected</b></span>
            <span>Quality: <b className="text-success">High</b></span><span>Balance: <b>₹1,240</b></span></div>
          <div className={`${sec} text-xs`}><p className={h}>Suggested</p>
            <p className="mt-1">Macro: <b>Template – offer end date</b> · Queue: <b>Templates</b> · Priority: <b>High</b></p></div>
          <button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-card text-sm font-semibold text-secondary-foreground hover:bg-tint" onClick={() => say("Draft article created")}>
            <BookOpen className="h-4 w-4" />Save as knowledge-base article</button>
          {fb && (
            <div className={`${sec} animate-rise`}>
              {fb === "done" ? <p className="text-sm">Thanks, noted.</p> : (
                <>
                  <p className="text-sm font-semibold">Was this suggestion useful?</p>
                  <div className="mt-2 flex gap-2">
                    <button className={sbtn} onClick={() => setFb("done")}>Yes</button>
                    <button className={sbtn} onClick={() => setFb("no")}>No</button>
                  </div>
                  {fb === "no" && (<><textarea rows={2} placeholder="What was wrong?" aria-label="What was wrong" className="mt-2 w-full rounded-lg border p-2 text-sm" />
                    <button className={`${sbtn} mt-1`} onClick={() => setFb("done")}>Send</button></>)}
                </>
              )}
            </div>
          )}
        </aside>
      </div>
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-rise rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft">{toast}</div>}
    </div>
  );
}

import { useState } from "react";
import {
  AlertTriangle, Check, CheckCircle2, ChevronDown, Clock, Copy, FileText, Loader2, MessageCircle, ShieldCheck, Star, Users, XCircle,
} from "lucide-react";
import type { Card } from "./engine";
import type { Engine } from "./engine";

const box = "rounded-2xl border bg-card p-4 shadow-soft animate-rise";
const btnP = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50";
const btnS = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-card px-4 text-sm font-semibold text-secondary-foreground transition hover:bg-tint disabled:opacity-50";

function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button role="switch" aria-checked={on} onClick={() => setOn(!on)} className="flex min-h-11 w-full items-center justify-between gap-3 text-sm font-medium">
      <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-success" />{label}</span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-success" : "bg-input"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-5.5" : "left-0.5"}`} />
      </span>
    </button>
  );
}

function Explain({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-xl bg-tint px-3">
      <button aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-11 w-full items-center justify-between text-sm font-semibold text-secondary-foreground">
        {q}<ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-3 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}

export function Diagnosis({ lang }: { lang: "en" | "hi" }) {
  const hi = lang === "hi";
  return (
    <div className={box}>
      <h3 className="font-semibold">{hi ? "Meta ne reject kyun kiya" : "Why Meta rejected it"}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {hi
          ? "Aapke message mein ek khaali jagah {{1}} hai (customer ka naam), par uska example nahi diya. Aur message offer jaisa hai, par 'Utility' mein daala gaya hai."
          : "Your message has a blank spot {{1}} (where the customer's name goes), but you did not give an example for it. Also, it reads like a promotion but is labelled as a 'Utility' message."}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        <li className="flex items-start gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{hi ? "{{1}} ka example missing hai" : "Missing example for {{1}}"}</li>
        <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" />{hi ? "Galat category: Utility, Marketing honi chahiye" : "Wrong category: Utility, should be Marketing"}</li>
      </ul>
      <Explain
        q={hi ? "Iska matlab kya hai?" : "Why does this matter?"}
        a={hi ? "Meta har message bhejne se pehle check karta hai. Marketing aur Utility messages ke rules alag hote hain." : "Meta checks every message before it can be sent. Marketing messages and utility messages follow different rules."}
      />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />
        <a href="#" onClick={(e) => e.preventDefault()} className="underline underline-offset-2">Based on Meta's rejection message and your template</a>
      </p>
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return <span className="ml-1 rounded-full bg-warning/20 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-warning-ink">{children}</span>;
}

export function FixPreview({ version, e }: { version: 1 | 2; e: Engine }) {
  const base = "Hi {{1}}, enjoy flat 30% off this Diwali on all sarees. Shop now!";
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState<string | null>(null);
  const done = e.submitted.includes(version);
  const plain = `${base}${version === 2 ? " Offer valid till 3 Nov." : ""} Reply STOP to unsubscribe`;
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-dashed p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Before</p>
          <p className="mt-1.5 text-sm">{base}</p>
          <p className="mt-2 text-xs text-muted-foreground">Category: Utility</p>
        </div>
        <div className="rounded-xl border-2 border-success/40 bg-success/5 p-3">
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-success"><Check className="h-3.5 w-3.5" />After</p>
          {editing ? (
            <>
              <label className="sr-only" htmlFor={`edit-${version}`}>Edit message</label>
              <textarea id={`edit-${version}`} defaultValue={custom ?? plain} rows={5} className="mt-1.5 w-full rounded-lg border bg-card p-2 text-sm" onChange={(ev) => setCustom(ev.target.value)} />
              <button className={`${btnP} mt-2 w-full`} onClick={() => setEditing(false)}>Save and continue</button>
            </>
          ) : custom ? (
            <p className="mt-1.5 text-sm">{custom}<Tag>Edited</Tag></p>
          ) : (
            <p className="mt-1.5 text-sm">
              {base}
              {version === 2 && <> <span className="marker">Offer valid till 3 Nov.</span><Tag>Added</Tag></>}{" "}
              <span className="marker">Reply STOP to unsubscribe</span><Tag>Added</Tag>
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Sample for {"{{1}}"}: <span className="marker font-semibold text-foreground">Priya</span><Tag>Added</Tag></p>
          <p className="mt-1 text-xs text-muted-foreground">Category: <span className="marker font-semibold text-foreground">Marketing</span><Tag>Changed</Tag></p>
        </div>
      </div>
      {done ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-success"><CheckCircle2 className="h-4 w-4" />Submitted</p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className={btnP} onClick={() => e.setConfirm(version)} disabled={editing}>Submit this fix</button>
          {!editing && <button className={btnS} onClick={() => setEditing(true)}>Edit first</button>}
          <button className="min-h-11 px-2 text-sm font-semibold text-primary underline-offset-2 hover:underline" onClick={() => e.act("explain", "Explain more")}>Explain more</button>
        </div>
      )}
    </div>
  );
}

export function Progress({ done }: { done: boolean }) {
  return (
    <div className={`${box} flex items-center gap-3`} role="status" aria-live="polite">
      {done ? <CheckCircle2 className="h-6 w-6 text-success" /> : <Loader2 className="h-6 w-6 animate-spin text-primary" />}
      <span className="text-sm font-medium">{done ? "Sent to Meta" : "Sending to Meta..."}</span>
    </div>
  );
}

export function Status() {
  return (
    <div className={box}>
      <p className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-warning-ink" />Submitted, now in review</p>
      <p className="mt-1.5 text-sm text-muted-foreground">I'll notify you here and on WhatsApp as soon as Meta responds.</p>
      <div className="mt-2 border-t pt-1"><Toggle label="Notify me on WhatsApp" /></div>
      <button className={`${btnS} mt-2 w-full`}>Create a campaign when approved</button>
    </div>
  );
}

export function RejectedAgain() {
  return (
    <div className={`${box} border-destructive/30`}>
      <p className="flex items-center gap-2 font-semibold text-destructive"><XCircle className="h-4 w-4" />Meta rejected it again</p>
      <p className="mt-1.5 text-sm text-muted-foreground">New reason: the offer "flat 30% off" doesn't say when it ends.</p>
    </div>
  );
}

export function Tracker() {
  const steps = ["Submitted", "In review by Meta", "Approved"];
  return (
    <div className={box}>
      <ol className="flex items-start justify-between gap-2" aria-label="Verification progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center text-center" aria-current={i === 1 ? "step" : undefined}>
            <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${i === 0 ? "bg-success text-primary-foreground" : i === 1 ? "bg-warning text-primary-foreground ring-4 ring-warning/25" : "bg-muted text-muted-foreground"}`}>
              {i === 0 ? <Check className="h-4 w-4" /> : i === 1 ? <Clock className="h-4 w-4" /> : 3}
            </span>
            <span className={`mt-1.5 text-xs ${i === 1 ? "font-bold" : "text-muted-foreground"}`}>{s}{i === 1 && " (now)"}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted-foreground">This part is handled by Meta, and I can't speed it up. It usually takes 1 to 3 working days.</p>
      <div className="mt-2 border-t pt-1"><Toggle label="Notify me when it's done" /></div>
    </div>
  );
}

export function Handoff({ c }: { c: Extract<Card, { type: "handoff" }> }) {
  const [ch, setCh] = useState<"chat" | "wa">("chat");
  return (
    <div className={box}>
      <p className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-primary" />Passing this to a teammate</p>
      <dl className="mt-3 space-y-2.5 text-sm">
        <div><dt className="text-xs font-semibold text-muted-foreground">Issue</dt><dd>{c.issue}</dd></div>
        <div><dt className="text-xs font-semibold text-muted-foreground">What we already tried</dt>
          <dd><ul className="list-disc pl-5">{c.tried.map((t) => <li key={t}>{t}</li>)}</ul></dd></div>
        <div className="flex gap-6">
          <div><dt className="text-xs font-semibold text-muted-foreground">Account</dt><dd>Priya's Boutique</dd></div>
          <div><dt className="text-xs font-semibold text-muted-foreground">Team</dt><dd>{c.queue}</dd></div>
        </div>
        {c.queue === "Templates" && (
          <div><dt className="text-xs font-semibold text-muted-foreground">Screenshot</dt>
            <dd className="mt-1 w-44 rounded-lg bg-success/10 p-2 text-[11px] leading-snug" aria-label="Screenshot of Diwali_Offer_v2">
              <span className="block rounded-md bg-card p-1.5 shadow-sm">Hi {"{{1}}"}, enjoy flat 30% off this Diwali on all sarees...</span>
            </dd></div>
        )}
        <div className="flex items-center gap-1.5 text-success"><Clock className="h-4 w-4" />{c.reply}</div>
      </dl>
      <fieldset className="mt-3">
        <legend className="text-xs font-semibold text-muted-foreground">Where should they reply?</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {([["chat", "Stay in this chat"], ["wa", "On WhatsApp"]] as const).map(([k, l]) => (
            <button key={k} aria-pressed={ch === k} onClick={() => setCh(k)} className={`min-h-11 rounded-xl border text-sm font-semibold transition ${ch === k ? "border-primary bg-tint text-secondary-foreground" : ""}`}>{l}</button>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 flex items-center gap-1.5 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-primary" />You won't need to explain this again.</p>
    </div>
  );
}

export function AdminMsg() {
  const text = "Hi! Copilot found why our Diwali_Offer_v2 template was rejected and has a fix ready. Could you open Templates and approve the resubmission? Thanks, Priya";
  const [copied, setCopied] = useState(false);
  return (
    <div className={box}>
      <p className="text-xs font-semibold text-muted-foreground">Message for your admin</p>
      <p className="mt-1.5 rounded-xl bg-tint p-3 text-sm">{text}</p>
      <button className={`${btnP} mt-3`} onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); }}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function Diy() {
  return (
    <div className={box}>
      <p className="font-semibold">Fix it yourself in 3 steps</p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
        <li>Open Diwali_Offer_v2 and tap <b>Edit</b>.</li>
        <li>Under "Sample values", type a name like <b>Priya</b> for {"{{1}}"}.</li>
        <li>Change Category to <b>Marketing</b>, add "Reply STOP to unsubscribe", then <b>Submit</b>.</li>
      </ol>
    </div>
  );
}

export function Feedback({ onDone }: { onDone: () => void }) {
  const [stars, setStars] = useState(0);
  const [sent, setSent] = useState(false);
  if (sent) return <div className={box}><p className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-success" />Thanks for the feedback!</p></div>;
  return (
    <div className={box}>
      <div className="flex gap-1" role="radiogroup" aria-label="Rate Copilot">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} role="radio" aria-checked={stars === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setStars(n)} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-tint">
            <Star className={`h-6 w-6 ${n <= stars ? "fill-warning text-warning" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
      <label className="mt-2 block text-xs font-semibold text-muted-foreground" htmlFor="fb">Anything to add? (optional)</label>
      <textarea id="fb" rows={2} className="mt-1 w-full rounded-lg border p-2 text-sm" />
      <button className={`${btnP} mt-2 w-full`} onClick={() => { setSent(true); setTimeout(onDone, 1200); }}>Send</button>
    </div>
  );
}

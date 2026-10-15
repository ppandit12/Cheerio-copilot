import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ListChecks, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Engine } from "./engine";
import { AdminMsg, Diagnosis, Diy, Feedback, FixPreview, Handoff, Progress, RejectedAgain, Status, Tracker } from "./Cards";

export function CopilotAvatar({ size = "h-8 w-8" }: { size?: string }) {
  return (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-primary text-primary-foreground`} aria-hidden>
      <Sparkles className="h-4 w-4" />
    </span>
  );
}

function Unavailable({ e }: { e: Engine }) {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="animate-rise rounded-2xl border bg-card p-5 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <p className="mt-2 font-semibold">Got it, thank you</p>
        <p className="mt-1 text-sm text-muted-foreground">Our team will reply on WhatsApp, usually within 30 minutes during working hours.</p>
      </div>
    );
  const f = "mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm";
  return (
    <form className="animate-rise space-y-3 rounded-2xl border bg-card p-4 shadow-soft" onSubmit={(ev) => { ev.preventDefault(); setSent(true); }}>
      <p className="font-semibold">I'm having trouble right now.</p>
      <p className="text-sm text-muted-foreground">You can leave your question here and our team will reply.</p>
      <label className="block text-sm font-medium">What's it about?
        <select className={f}><option>Templates</option><option>WhatsApp connection</option><option>Billing</option><option>Something else</option></select>
      </label>
      <label className="block text-sm font-medium">Your message
        <textarea required rows={3} className={`${f} py-2`} defaultValue="My Diwali template keeps getting rejected." />
      </label>
      <label className="block text-sm font-medium">Phone number
        <input required className={f} defaultValue="+91 98765 43210" inputMode="tel" />
      </label>
      <button className="min-h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground">Submit</button>
      <button type="button" className="w-full text-xs text-muted-foreground underline" onClick={() => e.setMode("chat")}>Try Copilot again</button>
    </form>
  );
}

export function CopilotPanel({ e }: { e: Engine }) {
  const [text, setText] = useState("");
  const [showLog, setShowLog] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [e.msgs, e.typing, e.chips]);
  useEffect(() => { if (e.open) setTimeout(() => input.current?.focus(), 260); }, [e.open]);

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-foreground/30 transition-opacity lg:hidden ${e.open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => e.setOpen(false)} />
      <aside
        aria-label="Cheerio Copilot"
        aria-hidden={!e.open}
        inert={!e.open}
        className={`fixed z-50 flex flex-col bg-background shadow-soft transition-transform duration-250 ease-out
          inset-x-0 bottom-0 top-6 rounded-t-3xl lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:w-[420px] lg:rounded-none lg:border-l
          ${e.open ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"}`}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-input lg:hidden" />
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <CopilotAvatar size="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold leading-tight">Cheerio Copilot</h2>
            <p className="truncate text-xs text-muted-foreground">Can see your templates and connection status (read-only)</p>
          </div>
          <button aria-label="Close Copilot" onClick={() => e.setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-tint">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <p className="flex items-start gap-2 rounded-xl border border-primary/20 bg-tint px-3 py-2 text-xs text-secondary-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Copilot can only read your account. It will always ask before changing anything.
          </p>
          {e.mode === "unavailable" ? (
            <Unavailable e={e} />
          ) : (
            <>
              {e.msgs.map((m) =>
                m.from === "user" ? (
                  <div key={m.id} className="flex justify-end animate-rise">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">{m.text}</p>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-2">
                    <CopilotAvatar size="h-7 w-7" />
                    <div className="min-w-0 flex-1">
                      {m.text && <p className="w-fit max-w-[92%] animate-rise rounded-2xl rounded-tl-md bg-tint px-3.5 py-2 text-sm">{m.text}</p>}
                      {m.card && <CardView e={e} card={m.card} />}
                    </div>
                  </div>
                ),
              )}
              {e.typing && (
                <div className="flex items-center gap-2" aria-label="Copilot is typing">
                  <CopilotAvatar size="h-7 w-7" />
                  <span className="flex gap-1 rounded-2xl bg-tint px-4 py-3">
                    {[0, 150, 300].map((d) => <span key={d} className="typing-dot h-2 w-2 rounded-full bg-primary-soft" style={{ animationDelay: `${d}ms` }} />)}
                  </span>
                </div>
              )}
            </>
          )}
          <div ref={end} />
        </div>

        <div className="border-t bg-card px-4 pb-3 pt-3">
          {e.chips.length > 0 && e.mode === "chat" && (
            <div className="mb-2 flex flex-wrap gap-2">
              {e.chips.map((c) => (
                <button key={c.label} onClick={() => e.act(c.action, c.label)} className="min-h-11 rounded-full border border-primary/40 bg-card px-4 text-sm font-semibold text-secondary-foreground transition hover:bg-tint animate-rise">
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {e.notice && <p className="mb-2 text-xs text-muted-foreground" role="status">{e.notice}</p>}
          {e.mode === "chat" && (
            <form className="flex gap-2" onSubmit={(ev) => { ev.preventDefault(); if (text.trim()) { e.typed(text.trim()); setText(""); } }}>
              <label htmlFor="cp-in" className="sr-only">Message Copilot</label>
              <input id="cp-in" ref={input} value={text} onChange={(ev) => setText(ev.target.value)} placeholder="Type your question..." className="min-h-11 flex-1 rounded-xl border bg-background px-3 text-sm" />
              <button aria-label="Send" className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          )}
          <div className="relative mt-2 flex items-center justify-between text-xs">
            <button className="min-h-9 font-semibold text-primary underline-offset-2 hover:underline" onClick={() => e.act("talk", "Talk to a person")}>Talk to a person</button>
            <button className="flex min-h-9 items-center gap-1 text-muted-foreground hover:text-foreground" aria-expanded={showLog} onClick={() => setShowLog(!showLog)}>
              <ListChecks className="h-3.5 w-3.5" />Actions Copilot took
            </button>
            {showLog && (
              <div className="absolute bottom-10 right-0 w-64 animate-rise rounded-xl border bg-popover p-3 shadow-soft">
                <p className="text-xs font-semibold">Actions Copilot took</p>
                {e.log.length === 0 ? <p className="mt-1 text-xs text-muted-foreground">Nothing yet.</p> : (
                  <ul className="mt-1 space-y-1">{e.log.map((l) => <li key={l} className="flex gap-1.5 text-xs"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />{l}</li>)}</ul>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {e.confirm && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-labelledby="cf-t">
          <div className="w-full max-w-sm animate-rise rounded-2xl bg-card p-5 shadow-soft">
            <h3 id="cf-t" className="text-lg font-semibold">Resubmit Diwali_Offer_v2 to Meta?</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Category will change to Marketing</li>
              <li>You can't edit it while it's being reviewed</li>
              <li>Review usually takes a few hours</li>
            </ul>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button autoFocus className="min-h-11 rounded-xl border px-4 font-semibold" onClick={() => e.setConfirm(null)}>Cancel</button>
              <button className="min-h-11 rounded-xl bg-primary px-4 font-semibold text-primary-foreground" onClick={() => e.doSubmit(e.confirm!)}>Yes, resubmit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CardView({ e, card }: { e: Engine; card: NonNullable<Engine["msgs"][number]["card"]> }) {
  switch (card.type) {
    case "diagnosis": return <Diagnosis lang={card.lang} />;
    case "fix": return <FixPreview version={card.version} e={e} />;
    case "progress": return <Progress done={card.done} />;
    case "status": return <Status />;
    case "rejectedAgain": return <RejectedAgain />;
    case "tracker": return <Tracker />;
    case "handoff": return <Handoff c={card} />;
    case "adminMsg": return <AdminMsg />;
    case "diy": return <Diy />;
    case "feedback": return <Feedback onDone={() => e.setOpen(false)} />;
  }
}

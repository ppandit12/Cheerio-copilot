import { useCallback, useRef, useState } from "react";

export type TemplateStatus = "approved" | "rejected" | "review";
export type Template = { name: string; category: string; status: TemplateStatus; preview: string };

export const initialTemplates: Template[] = [
  { name: "Welcome_Msg", category: "Utility", status: "approved", preview: "Hi {{1}}, welcome to Priya's Boutique!" },
  { name: "Order_Update", category: "Utility", status: "approved", preview: "Your order {{1}} is on its way." },
  { name: "Diwali_Offer_v2", category: "Utility", status: "rejected", preview: "Hi {{1}}, enjoy flat 30% off this Diwali on all sarees. Shop now!" },
  { name: "Cart_Reminder", category: "Marketing", status: "review", preview: "You left something in your cart, {{1}}." },
];

export type Card =
  | { type: "diagnosis"; lang: "en" | "hi" }
  | { type: "fix"; version: 1 | 2 }
  | { type: "progress"; done: boolean; failed?: boolean }
  | { type: "status" }
  | { type: "rejectedAgain" }
  | { type: "tracker" }
  | { type: "handoff"; queue: "Templates" | "Billing" | "General"; issue: string; tried: string[]; reply: string }
  | { type: "adminMsg" }
  | { type: "feedback" }
  | { type: "diy" };

export type Msg = { id: number; from: "bot" | "user"; text?: string; card?: Card };
export type Chip = { label: string; action: string };
export type Scenario =
  | "main"
  | "verification"
  | "lowconf"
  | "human"
  | "billing"
  | "failagain"
  | "hinglish"
  | "nopermission"
  | "unavailable";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const TALK: Chip = { label: "Talk to a person", action: "talk" };

export function useCopilotEngine(setStatus: (s: TemplateStatus) => void) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<"chat" | "unavailable">("chat");
  const [confirm, setConfirm] = useState<null | 1 | 2>(null);
  const [log, setLog] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const flags = useRef({ role: "admin" as "admin" | "member", fail: false, attempts: 0, started: false, lang: "en" as "en" | "hi" });
  const runId = useRef(0);
  const idc = useRef(0);

  const push = useCallback((m: Omit<Msg, "id">) => {
    const id = ++idc.current;
    setMsgs((x) => [...x, { ...m, id }]);
    return id;
  }, []);

  const addLog = (s: string) => setLog((l) => (l.includes(s) ? l : [...l, s]));

  const bot = useCallback(
    async (items: Omit<Msg, "id" | "from">[], next: Chip[] = []) => {
      const my = runId.current;
      setChips([]);
      setNotice(null);
      for (const it of items) {
        setTyping(true);
        await sleep(800);
        if (my !== runId.current) return false;
        setTyping(false);
        push({ from: "bot", ...it });
        await sleep(180);
      }
      setChips(next);
      return true;
    },
    [push],
  );

  const triedBase = () => {
    const t = ["Checked why Meta rejected the template", "Suggested adding a sample name and switching to Marketing"];
    if (flags.current.attempts > 0) t.push(`Resubmitted the fixed template (${flags.current.attempts}x), with your approval`);
    return t;
  };

  const handoff = (text = "Of course. Connecting you with a teammate now.", card?: Partial<Extract<Card, { type: "handoff" }>>) =>
    bot(
      [
        { text },
        {
          card: {
            type: "handoff",
            queue: "Templates",
            issue: flags.current.attempts > 1 ? "Template rejected 3 times" : "Template rejected twice",
            tried: triedBase(),
            reply: "Usually within 30 minutes during working hours",
            ...card,
          },
        },
      ],
      [],
    );

  const diagnosis = (lang: "en" | "hi") => {
    flags.current.lang = lang;
    addLog("Read template status");
    if (lang === "hi")
      return bot(
        [{ text: "Koi baat nahi Priya! Diwali_Offer_v2 reject kyun hua, yeh dekhiye:" }, { card: { type: "diagnosis", lang: "hi" } }],
        [
          { label: "Mere liye theek karo", action: "fix" },
          { label: "Main khud karungi", action: "diy" },
          { label: "English", action: "english" },
          TALK,
        ],
      );
    return bot(
      [{ text: "Hi Priya, I can see Diwali_Offer_v2 was rejected. Let me look at why." }, { card: { type: "diagnosis", lang: "en" } }],
      [
        { label: "Fix it for me", action: "fix" },
        { label: "Show me how to do it myself", action: "diy" },
        { label: "Hinglish", action: "hinglish" },
        TALK,
      ],
    );
  };

  const reset = () => {
    runId.current++;
    setMsgs([]);
    setChips([]);
    setTyping(false);
    setConfirm(null);
    setMode("chat");
    setSubmitted([]);
    setNotice(null);
    flags.current = { role: "admin", fail: false, attempts: 0, started: false, lang: "en" };
  };

  const fullReset = () => {
    reset();
    setLog([]);
    setOpen(false);
  };

  const start = (s: Scenario) => {
    reset();
    setOpen(true);
    flags.current.started = true;
    setStatus("rejected");
    switch (s) {
      case "main":
        return diagnosis("en");
      case "failagain":
        flags.current.fail = true;
        return diagnosis("en");
      case "nopermission":
        flags.current.role = "member";
        return diagnosis("en");
      case "hinglish":
        push({ from: "user", text: "mera template reject ho gaya" });
        return diagnosis("hi");
      case "verification":
        addLog("Read WhatsApp number status");
        return bot(
          [
            { text: "Hi Priya, your WhatsApp business account is waiting for Meta to verify it." },
            { card: { type: "tracker" } },
          ],
          [TALK],
        );
      case "lowconf":
        push({ from: "user", text: "Customers say my messages never arrive, but I see a tick" });
        return handoff(
          "I'm not sure about this one. I'll bring in a teammate and share everything we've discussed so you don't have to repeat yourself.",
          { issue: "Messages not reaching some customers", tried: ["Checked your WhatsApp number status (connected)", "Checked recent campaign delivery"], queue: "General" },
        );
      case "human":
        push({ from: "user", text: "This is useless, I just want to talk to someone" });
        return handoff();
      case "billing":
        push({ from: "user", text: "I was charged twice this month. I want a refund." });
        return handoff("Billing questions are handled by our billing team, and I'll pass this on right away.", {
          queue: "Billing",
          issue: "Possible double charge this month",
          tried: ["Noted the charge you mentioned", "Shared your plan details with the billing team"],
          reply: "Usually within 4 working hours",
        });
      case "unavailable":
        setMode("unavailable");
        return;
    }
  };

  const openPanel = () => {
    setOpen(true);
    if (!flags.current.started) {
      flags.current.started = true;
      diagnosis("en");
    }
  };

  const doSubmit = async (version: 1 | 2) => {
    setConfirm(null);
    setChips([]);
    setSubmitted((s) => [...s, version]);
    const my = runId.current;
    push({ from: "user", text: "Yes, resubmit" });
    const pid = push({ from: "bot", card: { type: "progress", done: false } });
    await sleep(1600);
    if (my !== runId.current) return;
    flags.current.attempts++;
    setMsgs((m) => m.map((x) => (x.id === pid ? { ...x, card: { type: "progress", done: true } } : x)));
    setStatus("review");
    addLog("Resubmitted Diwali_Offer_v2, with your approval");
    await bot([{ card: { type: "status" } }]);
    if (my !== runId.current) return;
    if (flags.current.fail) {
      await sleep(1400);
      if (my !== runId.current) return;
      setStatus("rejected");
      if (flags.current.attempts === 1) {
        bot(
          [
            { card: { type: "rejectedAgain" } },
            { text: "Let's try one more change. Meta wants offers to show when they end. I can add an end date." },
          ],
          [{ label: "Show the new fix", action: "fix2" }, TALK],
        );
      } else {
        handoff("That didn't work either. I'm bringing in a teammate with everything we tried, so you don't have to explain again.");
      }
      return;
    }
    bot([{ text: "Did this solve your problem?" }], [
      { label: "Yes, thanks", action: "yes" },
      { label: "No, I still need help", action: "no" },
    ]);
  };

  const act = (action: string, label?: string) => {
    if (label) push({ from: "user", text: label });
    const hi = flags.current.lang === "hi";
    switch (action) {
      case "fix":
        if (flags.current.role === "member")
          return bot(
            [{ text: "Only an admin can resubmit templates. Want me to write a message to your admin?" }, { card: { type: "adminMsg" } }],
            [TALK],
          );
        return bot(
          [{ text: hi ? "Yeh badlav karungi. Aapki permission ke bina kuch nahi jayega." : "Here is what I'll change. Nothing is sent until you approve." }, { card: { type: "fix", version: 1 } }],
          [{ label: "Explain more", action: "explain" }, TALK],
        );
      case "fix2":
        return bot([{ text: "Here's the updated fix. Nothing is sent until you approve." }, { card: { type: "fix", version: 2 } }], [TALK]);
      case "diy":
        return bot([{ card: { type: "diy" } }], [{ label: "Actually, fix it for me", action: "fix" }, TALK]);
      case "hinglish":
        return diagnosis("hi");
      case "english":
        return diagnosis("en");
      case "explain":
        return bot(
          [
            { text: "{{1}} is a blank that gets filled with each customer's name when you send." },
            { text: "Meta wants a sample, like \"Priya\", so they can check how it reads. Offers also count as Marketing." },
          ],
          [{ label: "Fix it for me", action: "fix" }, TALK],
        );
      case "talk":
      case "no":
        return handoff();
      case "yes":
        return bot([{ text: "Happy to help, Priya! How was this?" }, { card: { type: "feedback" } }]);
      default:
        return undefined;
    }
  };

  const typed = (raw: string) => {
    const t = raw.toLowerCase();
    push({ from: "user", text: raw });
    if (/useless|worst|angry|stupid|human|person|agent|someone/.test(t)) return act("talk");
    if (/refund|billing|invoice|charge|payment/.test(t))
      return handoff("Billing questions are handled by our billing team, and I'll pass this on right away.", {
        queue: "Billing",
        issue: "Billing question",
        tried: ["Noted your billing question"],
        reply: "Usually within 4 working hours",
      });
    if (/mera|ho gaya|kya|kyun|hai\b|nahi/.test(t)) return diagnosis("hi");
    if (/fix|repair|correct/.test(t)) return act("fix");
    if (/why|reject/.test(t)) return diagnosis("en");
    setNotice("In this demo, tap one of the options above.");
    return undefined;
  };

  return {
    open, setOpen, openPanel, msgs, chips, typing, mode, setMode, confirm, setConfirm, log, submitted, notice,
    start, act, typed, doSubmit, fullReset, push,
  };
}

export type Engine = ReturnType<typeof useCopilotEngine>;

"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General feedback");
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`[OST] ${topic}: ${name || "Visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name || "(not provided)"}`,
        `Email: ${email || "(not provided)"}`,
        `Topic: ${topic}`,
        "",
        message.trim(),
        "",
        "— Sent from onlinesciencetools.com/contact",
      ].join("\n"),
    );

    setPrepared(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="not-prose rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-[var(--foreground)]">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-[var(--foreground)]">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
            placeholder="you@university.edu"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium text-[var(--foreground)]">
          Topic
        </span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
        >
          <option>General feedback</option>
          <option>Bug report / tool issue</option>
          <option>Classroom / syllabus question</option>
          <option>Academic / classroom use</option>
          <option>Partnership or media</option>
          <option>Privacy request</option>
        </select>
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium text-[var(--foreground)]">
          Message
        </span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          placeholder="Tell us what you need — URLs, screenshots descriptions, and course context help a lot."
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Send className="h-4 w-4" />
        Open email draft
      </button>

      {prepared && (
        <p className="mt-3 inline-flex items-start gap-2 text-sm text-[var(--muted)]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          Your mail app should open with a prefilled message to {CONTACT_EMAIL}.
          If nothing opens, email us directly.
        </p>
      )}
    </form>
  );
}

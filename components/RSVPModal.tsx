"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarBlank, Minus, Paperclip, Plus, X } from "@phosphor-icons/react";
import { wedding } from "@/data/wedding";

type Errors = Partial<Record<"name" | "whatsappNumber" | "guestCount", string>>;
type TicketUpload = { path: string };

const maxTicketUploadBytes = 3.5 * 1024 * 1024;

async function prepareTicketUpload(file: File): Promise<File> {
  if (file.size <= maxTicketUploadBytes || !file.type.startsWith("image/")) {
    if (file.size > maxTicketUploadBytes) throw new Error("Please choose a ticket file smaller than 3.5 MB.");
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error("The ticket image could not be prepared.")), "image/jpeg", 0.8);
  });
  if (blob.size > maxTicketUploadBytes) throw new Error("Please choose a ticket image smaller than 3.5 MB.");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
}

function downloadCalendar() {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Prachi and Pratik//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:prachi-pratik-20261024@wedding",
    "DTSTAMP:20260821T120000Z",
    "DTSTART;VALUE=DATE:20261024",
    "DTEND;VALUE=DATE:20261025",
    "SUMMARY:Prachi and Pratik's Wedding",
    "DESCRIPTION:Come celebrate with Prachi and Pratik.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "prachi-pratik-wedding.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function RSVPModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [ticket, setTicket] = useState<TicketUpload | null>(null);
  const [ticketStatus, setTicketStatus] = useState<"idle" | "uploading" | "ready" | "error">("idle");
  const [ticketMessage, setTicketMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    if (!root.current) return;
    root.current.inert = !open;
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => nameInput.current?.focus(), 520);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !root.current) return;
      const focusable = Array.from(root.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]"
      )).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  const validate = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    const whatsappDigits = whatsappNumber.replace(/\D/g, "");
    if (!/^\+?[0-9\s().-]+$/.test(whatsappNumber.trim()) || ![10, 12].includes(whatsappDigits.length)) {
      next.whatsappNumber = "Enter a 10- or 12-digit WhatsApp number.";
    }
    if (guestCount < 1 || guestCount > 10) next.guestCount = "Choose between 1 and 10 guests.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const uploadTicket = async (file: File | undefined) => {
    if (!file) return;
    setTicketStatus("uploading");
    setTicketMessage("Preparing your ticket…");
    setTicket(null);
    try {
      setTicketMessage("Saving your ticket…");
      const uploadFile = await prepareTicketUpload(file);
      const formData = new FormData();
      formData.append("ticket", uploadFile);
      const response = await fetch("/api/ticket", { method: "POST", body: formData });
      const payload = await response.json() as {
        message?: string;
        ticketPath?: string;
      };
      if (!response.ok || !payload.ticketPath) throw new Error(payload.message || "We could not process that ticket.");
      setTicket({ path: payload.ticketPath });
      setTicketStatus("ready");
      setTicketMessage("Ticket saved. Thank you.");
    } catch (error) {
      setTicketStatus("error");
      setTicketMessage(error instanceof Error ? error.message : "We could not process that ticket.");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading" || ticketStatus === "uploading" || !validate()) return;
    setStatus("loading");
    setServerMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsappNumber: whatsappNumber.trim(),
          guestCount,
          ticketPath: ticket?.path,
        }),
      });
      const payload = await response.json() as { message?: string; fields?: Record<string, string[]> };
      if (!response.ok) {
        if (payload.fields) {
          setErrors({
            name: payload.fields.name?.[0],
            whatsappNumber: payload.fields.whatsappNumber?.[0],
            guestCount: payload.fields.guestCount?.[0],
          });
        }
        throw new Error(payload.message || "We could not save your RSVP.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setServerMessage(error instanceof Error ? error.message : "We could not save your RSVP.");
    }
  };

  return (
    <div
      ref={root}
      className={`rsvp-overlay${open ? " is-open" : ""}`}
      aria-hidden={!open}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section className="rsvp-panel" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
        <div className="rsvp-draw-border" aria-hidden="true"><i /><i /><i /><i /></div>
        <button type="button" className="rsvp-close" onClick={onClose} aria-label="Close RSVP">
          <X size={22} weight="light" />
        </button>

        {status === "success" ? (
          <div className="rsvp-success" aria-live="polite">
            <div className="success-mark" aria-hidden="true"><i /><i /><i /><i /></div>
            <p className="rsvp-indic" lang="hi">मिलते हैं</p>
            <h2 id="rsvp-title">We cannot wait<br />to celebrate with you.</h2>
            <p>Your RSVP has been received for {guestCount} {guestCount === 1 ? "guest" : "guests"}.</p>
            <div className="success-actions">
              <button type="button" className="outline-button" onClick={downloadCalendar}>
                <CalendarBlank size={18} weight="light" /> Add to calendar
              </button>
              <button type="button" className="text-button" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <div className="rsvp-form-wrap">
            <header className="rsvp-heading">
              <p className="rsvp-indic" lang="hi">आइए</p>
              <h2 id="rsvp-title">Can’t wait<br />to see you!</h2>
              <p>Tell us who is coming. We will save you a place.</p>
            </header>

            <form onSubmit={submit} noValidate>
              <div className={`form-field${errors.name ? " has-error" : ""}`}>
                <label htmlFor="rsvp-name">Your name</label>
                <input
                  ref={nameInput}
                  id="rsvp-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <p id="rsvp-name-error" className="field-error">{errors.name}</p> : null}
              </div>

              <div className={`form-field counter-field${errors.guestCount ? " has-error" : ""}`}>
                <label id="guest-count-label">How many of you will be joining us?</label>
                <div className="guest-counter" role="group" aria-labelledby="guest-count-label">
                  <button type="button" onClick={() => setGuestCount((count) => Math.max(1, count - 1))} disabled={guestCount === 1} aria-label="Remove one guest">
                    <Minus size={20} weight="light" />
                  </button>
                  <output aria-live="polite">{guestCount}</output>
                  <button type="button" onClick={() => setGuestCount((count) => Math.min(10, count + 1))} disabled={guestCount === 10} aria-label="Add one guest">
                    <Plus size={20} weight="light" />
                  </button>
                </div>
                {errors.guestCount ? <p className="field-error">{errors.guestCount}</p> : null}
              </div>

              <div className={`form-field${errors.whatsappNumber ? " has-error" : ""}`}>
                <label htmlFor="rsvp-whatsapp">WhatsApp number</label>
                <input
                  id="rsvp-whatsapp"
                  name="whatsapp-number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  aria-describedby={errors.whatsappNumber ? "rsvp-whatsapp-error" : undefined}
                  aria-invalid={Boolean(errors.whatsappNumber)}
                />
                {errors.whatsappNumber ? <p id="rsvp-whatsapp-error" className="field-error">{errors.whatsappNumber}</p> : null}
              </div>

              <div className="form-field ticket-field">
                <label htmlFor="travel-ticket">Travel ticket <span>(optional)</span></label>
                <input
                  id="travel-ticket"
                  className="ticket-input"
                  name="travel-ticket"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) => void uploadTicket(event.target.files?.[0])}
                  disabled={ticketStatus === "uploading"}
                />
                <p className="ticket-help"><Paperclip size={15} weight="light" /> Attach a PDF or photo if you would like to share your travel ticket. It will be saved privately with your RSVP.</p>
                {ticketStatus !== "idle" ? <p className={`ticket-status is-${ticketStatus}`} role="status">{ticketMessage}</p> : null}
              </div>

              <p className="form-status" role="status" aria-live="polite">
                {status === "error" ? serverMessage : status === "loading" ? "Saving your place..." : ""}
              </p>
              <button type="submit" className="submit-rsvp" disabled={status === "loading" || ticketStatus === "uploading"}>
                <span>{status === "loading" ? "Sending" : ticketStatus === "uploading" ? "Saving ticket" : "Yes, we will be there"}</span>
                <ArrowRight size={20} weight="light" />
              </button>
            </form>
            <p className="rsvp-footnote">{wedding.city}</p>
          </div>
        )}
      </section>
    </div>
  );
}

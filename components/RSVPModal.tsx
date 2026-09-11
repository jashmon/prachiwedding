"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarBlank, Minus, Paperclip, Plus, X } from "@phosphor-icons/react";
import { wedding } from "@/data/wedding";
import { extractTicketDetails, type TicketDetails } from "@/lib/ticket-details";

type Errors = Partial<Record<"name" | "whatsappNumber" | "guestCount" | "arrivalDate" | "arrivalTime", string>>;
type TicketUpload = { path: string; text?: string };

async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The ticket image could not be prepared.")), "image/png");
  });
}

async function recognizeText(input: File | Blob): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const result = await worker.recognize(input);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

async function readTicketOnDevice(file: File): Promise<TicketDetails> {
  if (file.type !== "application/pdf") {
    return extractTicketDetails(await recognizeText(file));
  }

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfDocument = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const page = await pdfDocument.getPage(1);
  const content = await page.getTextContent();
  const nativeText = content.items
    .map((item) => "str" in item ? item.str : "")
    .join(" ")
    .trim();

  if (nativeText.length > 20) return extractTicketDetails(nativeText);

  const initialViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(1.5, 1600 / Math.max(initialViewport.width, initialViewport.height));
  const viewport = page.getViewport({ scale: Math.max(scale, 1) });
  const canvas = window.document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare that PDF.");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return extractTicketDetails(await recognizeText(await canvasToBlob(canvas)));
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
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
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
    if (!/^\+?[0-9\s().-]{7,20}$/.test(whatsappNumber.trim())) {
      next.whatsappNumber = "Enter a valid WhatsApp number, including the country code if needed.";
    }
    if (guestCount < 1 || guestCount > 10) next.guestCount = "Choose between 1 and 10 guests.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) next.arrivalDate = "Choose your arrival date.";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime)) next.arrivalTime = "Choose your arrival time.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const uploadTicket = async (file: File | undefined) => {
    if (!file) return;
    setTicketStatus("uploading");
    setTicketMessage("Reading your ticket…");
    setTicket(null);
    try {
      let localExtraction: TicketDetails = {};
      try {
        localExtraction = await readTicketOnDevice(file);
      } catch {
        // A ticket that cannot be read can still be privately saved and entered manually.
      }
      setTicketMessage("Saving your ticket…");
      const formData = new FormData();
      formData.append("ticket", file);
      const response = await fetch("/api/ticket", { method: "POST", body: formData });
      const payload = await response.json() as {
        message?: string;
        ticketPath?: string;
        extraction?: { text?: string; arrivalDate?: string; arrivalTime?: string };
      };
      if (!response.ok || !payload.ticketPath) throw new Error(payload.message || "We could not process that ticket.");
      const extraction = {
        text: localExtraction.text || payload.extraction?.text,
        arrivalDate: localExtraction.arrivalDate || payload.extraction?.arrivalDate,
        arrivalTime: localExtraction.arrivalTime || payload.extraction?.arrivalTime,
      };
      setTicket({ path: payload.ticketPath, text: extraction.text });
      if (extraction.arrivalDate) setArrivalDate(extraction.arrivalDate);
      if (extraction.arrivalTime) setArrivalTime(extraction.arrivalTime);
      setTicketStatus("ready");
      setTicketMessage(extraction.arrivalDate || extraction.arrivalTime
        ? "Arrival details found. Please check and confirm them below."
        : "Ticket saved. Please enter your arrival details below.");
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
          arrivalDate,
          arrivalTime,
          ticketPath: ticket?.path,
          ticketOcrText: ticket?.text,
        }),
      });
      const payload = await response.json() as { message?: string; fields?: Record<string, string[]> };
      if (!response.ok) {
        if (payload.fields) {
          setErrors({
            name: payload.fields.name?.[0],
            whatsappNumber: payload.fields.whatsappNumber?.[0],
            guestCount: payload.fields.guestCount?.[0],
            arrivalDate: payload.fields.arrivalDate?.[0],
            arrivalTime: payload.fields.arrivalTime?.[0],
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

              <div className={`form-field${errors.arrivalDate ? " has-error" : ""}`}>
                <label htmlFor="arrival-date">When do you arrive?</label>
                <input
                  id="arrival-date"
                  name="arrival-date"
                  type="date"
                  value={arrivalDate}
                  onChange={(event) => setArrivalDate(event.target.value)}
                  aria-describedby={errors.arrivalDate ? "arrival-date-error" : "arrival-help"}
                  aria-invalid={Boolean(errors.arrivalDate)}
                />
                {errors.arrivalDate ? <p id="arrival-date-error" className="field-error">{errors.arrivalDate}</p> : null}
              </div>

              <div className={`form-field${errors.arrivalTime ? " has-error" : ""}`}>
                <label htmlFor="arrival-time">What&apos;s your arrival time?</label>
                <input
                  id="arrival-time"
                  name="arrival-time"
                  type="time"
                  value={arrivalTime}
                  onChange={(event) => setArrivalTime(event.target.value)}
                  aria-describedby={errors.arrivalTime ? "arrival-time-error" : "arrival-help"}
                  aria-invalid={Boolean(errors.arrivalTime)}
                />
                {errors.arrivalTime ? <p id="arrival-time-error" className="field-error">{errors.arrivalTime}</p> : null}
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
                <p id="arrival-help" className="ticket-help"><Paperclip size={15} weight="light" /> We read the ticket on your device, then save it privately. Please confirm the arrival details before sending.</p>
                {ticketStatus !== "idle" ? <p className={`ticket-status is-${ticketStatus}`} role="status">{ticketMessage}</p> : null}
              </div>

              <p className="form-status" role="status" aria-live="polite">
                {status === "error" ? serverMessage : status === "loading" ? "Saving your place..." : ""}
              </p>
              <button type="submit" className="submit-rsvp" disabled={status === "loading" || ticketStatus === "uploading"}>
                <span>{status === "loading" ? "Sending" : ticketStatus === "uploading" ? "Reading ticket" : "Yes, we will be there"}</span>
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

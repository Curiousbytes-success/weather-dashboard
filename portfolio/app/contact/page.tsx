import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact — Sunidhi Nayak",
};

export default function ContactPage() {
  return (
    <main>
      <section className="wrap page-hero">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>contact.sh
          </div>
          <h1>Got something to build? I&apos;d like to hear about it.</h1>
          <p>
            Reach out directly, or send a note below — I read every message
            myself.
          </p>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="contact-links">
            <a href="mailto:nayaksunidhi642@gmail.com">
              → nayaksunidhi642@gmail.com
            </a>
            <a href="tel:+919179042404">→ +91 91790 42404</a>
            <a
              href="https://linkedin.com/in/sunidhi-nayak-6563803a8"
              target="_blank"
              rel="noopener"
            >
              → linkedin.com/in/sunidhi-nayak
            </a>
          </div>
        </Reveal>

        <Reveal>
          {/* No backend — mailto form submit, per the "no API needed" brief */}
          <form
            className="contact-form"
            action="mailto:nayaksunidhi642@gmail.com"
            method="post"
            encType="text/plain"
          >
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary">
              Send message →
            </button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}

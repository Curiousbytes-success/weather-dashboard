import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Sunidhi Nayak",
};

export default function WorkPage() {
  return (
    <main>
      <section className="wrap page-hero">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>projects.json
          </div>
          <h1>Two projects, built end to end.</h1>
          <p>
            Solo builds — frontend, backend and database, no shortcuts.
            Click through for the full breakdown of each one.
          </p>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="work-list">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <Link href={`/work/${p.slug}`} className="work-item">
                <div className="work-head">
                  <div>
                    <h3>{p.title}</h3>
                    <div className="work-file">{p.fileName}</div>
                    <div className="work-tags">
                      {p.tags.map((t) => (
                        <span className="work-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="work-arrow">→</div>
                </div>
                <p className="work-summary">{p.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="wrap" id="about-teaser">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>about.md
          </div>
          <h2 className="section-title">
            A BCA graduate who'd rather ship than talk about shipping.
          </h2>
          <p className="section-sub">
            Full-stack basics, real projects, and a Full Stack Development
            internship at CodeAlpha — currently learning by building.
          </p>
          <Link
            href="/about"
            className="btn btn-secondary"
            style={{ marginTop: "28px" }}
          >
            More about me →
          </Link>
        </Reveal>
      </section>

      <section className="wrap" id="work-teaser">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>projects.json
          </div>
          <h2 className="section-title">Featured work</h2>
        </Reveal>

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

      <section className="wrap" id="contact-cta">
        <Reveal>
          <div className="contact-box">
            <h2>Got something to build? I'd like to hear about it.</h2>
            <Link href="/contact" className="btn btn-primary">
              Get in touch →
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

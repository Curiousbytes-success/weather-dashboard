import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Sunidhi Nayak",
};

export default function AboutPage() {
  return (
    <main>
      <section className="wrap page-hero">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>about.md
          </div>
          <h1>A quick systems check on who I am.</h1>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="about-grid">
          <Reveal>
            <div className="about-text">
              <p>
                I&apos;m a <strong>BCA graduate</strong> (CGPA 8.25) who likes
                taking a problem — payroll, billing, whatever&apos;s messy
                and manual — and turning it into a working application,
                database and all. I&apos;m not chasing flashy for its own
                sake; I care about things that actually run.
              </p>
              <p>
                Right now I&apos;m interning as a{" "}
                <strong>Full Stack Development Intern at CodeAlpha</strong>,
                getting hands-on with real-world projects, version control
                and debugging alongside people who&apos;ve shipped more than
                I have. I&apos;m early in my career and genuinely excited
                about it — quick to learn, and I&apos;d rather ask a
                question than fake an answer.
              </p>
              <p>
                Based in Damoh, Madhya Pradesh — open to remote and
                relocation for the right team.
              </p>

              <div className="edu-card">
                <div className="school">
                  Bachelor of Computer Applications — Space Computer
                  Institute
                </div>
                <div className="meta">2023 – 2026</div>
                <div className="cgpa">CGPA: 8.25</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="skills-block">
              <h3>// languages & backend</h3>
              <div className="chip-row">
                <span className="chip">C</span>
                <span className="chip">C++</span>
                <span className="chip">Python</span>
                <span className="chip">PHP</span>
                <span className="chip">SQL / MySQL</span>
              </div>

              <h3>// web</h3>
              <div className="chip-row">
                <span className="chip">HTML</span>
                <span className="chip">CSS</span>
                <span className="chip">JavaScript</span>
              </div>

              <h3>// tools & concepts</h3>
              <div className="chip-row">
                <span className="chip">Git</span>
                <span className="chip">XAMPP</span>
                <span className="chip">VS Code</span>
                <span className="chip">OOP</span>
                <span className="chip">DBMS</span>
                <span className="chip">Data Structures</span>
              </div>

              <h3>// certifications</h3>
              <ul className="cert-list">
                <li>
                  <span>Deloitte — Cyber Job Simulation</span>
                  <span className="date">Dec 2025</span>
                </li>
                <li>
                  <span>TCS iON — YUVA AI for All</span>
                  <span className="date">Jan 2026</span>
                </li>
                <li>
                  <span>TCS iON — Solutions Architecture Job Simulation</span>
                  <span className="date">Jan 2026</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wrap" id="experience">
        <Reveal>
          <div className="eyebrow">
            <span className="path">~/</span>experience.log
          </div>
          <h2 className="section-title">Where I&apos;m learning right now.</h2>
        </Reveal>

        <Reveal>
          <div className="exp-strip">
            <div className="role">Full Stack Development Intern</div>
            <div className="org">CodeAlpha</div>
            <div className="date">Aug 2026</div>
            <p>
              Selected for a full stack development internship, working on
              real-world projects with modern web technologies. Getting
              hands-on experience across front-end and back-end development,
              version control and debugging — the parts that don&apos;t show
              up in a classroom.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

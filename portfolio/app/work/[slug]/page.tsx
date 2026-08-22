import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  return { title: project ? `${project.title} — Sunidhi Nayak` : "Not found" };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <main>
      <section className="wrap page-hero">
        <Reveal>
          <Link href="/work" className="case-back">
            ← back to work
          </Link>
          <div className="eyebrow">
            <span className="path">~/work/</span>
            {project.slug}
          </div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="work-tags" style={{ marginTop: "18px" }}>
            {project.tags.map((t) => (
              <span className="work-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="case-body">
            <div>
              <h4>What it does</h4>
              <ul>
                {project.whatItDoes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>How it&apos;s built</h4>
              <ul>
                {project.howItsBuilt.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

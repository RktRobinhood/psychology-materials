import { StrictMode, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Compass,
  FlaskConical,
  Flag,
  Gamepad2,
  ListChecks,
  Map as MapIcon,
  PenLine,
  RotateCcw,
  Users,
} from 'lucide-react';
import './styles.css';

type Material = {
  path: string;
  title: string;
  description: string;
  category: string;
  covers: number[];
};

type Section = {
  id: string;
  folder: string;
  kind: 'tools' | 'unit' | 'unsorted';
  number: number | null;
  year: string | null;
  title: string;
  short: string;
  question: string;
  context: string;
  practical: string | null;
  guide: string | null;
  checklist: string | null;
  materials: Material[];
};

const BASE = import.meta.env.BASE_URL;

const materialHref = (folder: string) =>
  `${BASE}materials/${folder.split('/').map(encodeURIComponent).join('/')}/`;

const pad = (value: number) => String(value).padStart(2, '0');

function categoryIcon(category: string) {
  const name = category.toLowerCase();
  const size = 15;
  if (name.includes('map')) return <MapIcon aria-hidden="true" size={size} />;
  if (name.includes('checklist')) return <ListChecks aria-hidden="true" size={size} />;
  if (name.includes('exam')) return <PenLine aria-hidden="true" size={size} />;
  if (name.includes('review')) return <RotateCcw aria-hidden="true" size={size} />;
  if (name.includes('lab')) return <FlaskConical aria-hidden="true" size={size} />;
  if (name.includes('group')) return <Users aria-hidden="true" size={size} />;
  if (name.includes('escape') || name.includes('practice')) return <Gamepad2 aria-hidden="true" size={size} />;
  return <BookOpen aria-hidden="true" size={size} />;
}

function MaterialCard({ material, unit }: { material: Material; unit: number | null }) {
  const others = material.covers.filter((number) => number !== unit);
  return (
    <a className="material-card" href={materialHref(material.path)}>
      <div className="card-top">
        <p className="category">
          {categoryIcon(material.category)} {material.category}
        </p>
        <ArrowUpRight aria-hidden="true" size={20} />
      </div>
      <h3>{material.title}</h3>
      <p>{material.description}</p>
      {others.length > 0 && (
        <p className="covers">
          Also covers {others.length === 1 ? 'Unit' : 'Units'} {others.join(', ')}
        </p>
      )}
    </a>
  );
}

function App() {
  const [sections, setSections] = useState<Section[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [active, setActive] = useState('');

  useEffect(() => {
    fetch(`${BASE}materials.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Catalog unavailable');
        return response.json() as Promise<{ sections: Section[] }>;
      })
      .then((data) => {
        setSections(data.sections);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  // Jump to #unit-3 etc. once the sections exist (the hash arrives before the data).
  useEffect(() => {
    if (status !== 'ready' || !location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [status]);

  // Highlight the section being read in the unit rail.
  useEffect(() => {
    if (status !== 'ready') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [status, sections]);

  const tools = sections.find((section) => section.kind === 'tools');
  const findTool = (name: string) =>
    tools?.materials.find((material) => material.path.endsWith(`/${name}`));
  const guide = findTool('Course Guide');
  const checklist = findTool('Syllabus Checklist');

  const units = sections.filter((section) => section.kind === 'unit');
  const years = useMemo(() => {
    const grouped: { year: string; units: Section[] }[] = [];
    for (const unit of units) {
      const year = unit.year || 'Units';
      const last = grouped.at(-1);
      if (last && last.year === year) last.units.push(unit);
      else grouped.push({ year, units: [unit] });
    }
    return grouped;
  }, [units]);
  const unsorted = sections.find((section) => section.kind === 'unsorted');
  const lessonCount = units.reduce((total, unit) => total + unit.materials.length, 0);

  const railLink = (section: Section, label: ReactNode) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      className={`rail-link${active === section.id ? ' is-active' : ''}${
        section.materials.length === 0 ? ' is-empty' : ''
      }`}
      aria-current={active === section.id ? 'location' : undefined}
    >
      {label}
      <span className="rail-count" aria-label={`${section.materials.length} materials`}>
        {section.materials.length}
      </span>
    </a>
  );

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href={BASE} aria-label="Mindfield home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>Mindfield</span>
          </a>
          <div className="nav-links">
            {guide && <a className="nav-link" href={materialHref(guide.path)}>Course guide</a>}
            {checklist && (
              <a className="nav-link" href={materialHref(checklist.path)}>Syllabus checklist</a>
            )}
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow"><span /> IB Psychology · First assessment 2027</p>
          <h1 id="page-title">Ideas that help us understand the mind.</h1>
          <p className="hero-copy">
            Interactive lessons, labs and review games for our two-year course, sorted into the
            six units we study.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#course-tools">
              Start with the course <ArrowDown aria-hidden="true" size={18} />
            </a>
            {status === 'ready' && (
              <p className="hero-count">
                {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} across {units.length} units
              </p>
            )}
          </div>
        </div>
      </section>

      {status === 'ready' && (
        <nav className="unit-rail" aria-label="Units">
          <div className="rail-inner">
            {tools && railLink(tools, <><Compass aria-hidden="true" size={15} /> Course tools</>)}
            {years.map(({ year, units: yearUnits }) => (
              <div className="rail-year" key={year}>
                <span className="rail-year-label">{year}</span>
                {yearUnits.map((unit) =>
                  railLink(unit, <><b>{pad(unit.number ?? 0)}</b> {unit.short}</>),
                )}
              </div>
            ))}
            {unsorted && railLink(unsorted, <><Flag aria-hidden="true" size={15} /> New</>)}
          </div>
        </nav>
      )}

      <div className="library" id="materials">
        {status === 'loading' && <output className="state-card">Gathering the materials…</output>}

        {status === 'error' && (
          <div className="state-card" role="alert">
            The library could not be loaded. Please try again shortly.
          </div>
        )}

        {status === 'ready' && tools && (
          <section className="tools-section" id={tools.id} aria-labelledby={`${tools.id}-title`}>
            <header className="tools-header">
              <div>
                <p className="section-kicker">Course overview and tools</p>
                <h2 id={`${tools.id}-title`}>Start here</h2>
              </div>
              <p className="tools-lede">
                The map of the whole course, every examinable term in one checklist, and the tools
                we use across all units.
              </p>
            </header>
            <div className="material-grid tools-grid">
              {tools.materials.map((material) => (
                <MaterialCard key={material.path} material={material} unit={null} />
              ))}
            </div>
          </section>
        )}

        {status === 'ready' &&
          years.map(({ year, units: yearUnits }) => (
            <div className="year-block" key={year}>
              <p className="year-label"><span>{year}</span></p>
              {yearUnits.map((unit) => (
                <section className="unit" id={unit.id} key={unit.id} aria-labelledby={`${unit.id}-title`}>
                  <header className="unit-aside">
                    <p className="unit-number" aria-hidden="true">{pad(unit.number ?? 0)}</p>
                    <p className="section-kicker">Unit {unit.number} · {unit.short}</p>
                    <h2 id={`${unit.id}-title`}>{unit.title}</h2>
                    {unit.question && <p className="unit-question">{unit.question}</p>}
                    {unit.context && <p className="unit-context">{unit.context}</p>}
                    {unit.practical && (
                      <p className="unit-practical">
                        <FlaskConical aria-hidden="true" size={15} /> Ends with the {unit.practical.toLowerCase()}
                      </p>
                    )}
                    {(guide || checklist) && (
                      <p className="unit-links">
                        {guide && unit.guide && (
                          <a href={`${materialHref(guide.path)}#${unit.guide}`}>
                            <MapIcon aria-hidden="true" size={15} /> What this unit covers
                          </a>
                        )}
                        {checklist && unit.checklist && (
                          <a href={`${materialHref(checklist.path)}#${unit.checklist}`}>
                            <ListChecks aria-hidden="true" size={15} /> Unit checklist
                          </a>
                        )}
                      </p>
                    )}
                  </header>

                  {unit.materials.length > 0 ? (
                    <div className="material-grid">
                      {unit.materials.map((material) => (
                        <MaterialCard key={material.path} material={material} unit={unit.number} />
                      ))}
                    </div>
                  ) : (
                    <div className="unit-empty">
                      <p className="empty-label">Coming up</p>
                      <p>
                        Lessons for this unit will appear here as they are published. Until then,
                        the unit overview and checklist show what you will study.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          ))}

        {status === 'ready' && unsorted && (
          <section className="unit" id={unsorted.id} aria-labelledby="unsorted-title">
            <header className="unit-aside">
              <p className="section-kicker">Recently added</p>
              <h2 id="unsorted-title">{unsorted.title}</h2>
              <p className="unit-question">{unsorted.question}</p>
            </header>
            <div className="material-grid">
              {unsorted.materials.map((material) => (
                <MaterialCard key={material.path} material={material} unit={null} />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer>
        <a className="brand footer-brand" href={BASE}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Mindfield</span>
        </a>
        <p>IB Psychology lessons for curious minds.</p>
        <a
          className="footer-report"
          href="https://github.com/RktRobinhood/psychology-materials/issues/new/choose"
          target="_blank"
          rel="noopener"
        >
          Found a problem in a lesson? Report it
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

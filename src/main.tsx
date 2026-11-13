import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Item = { href: string; title: string; description: string; tag: string };
type Group = {
  folder: string;
  kind: 'guide' | 'unit' | 'extra';
  title: string;
  number?: number;
  year?: number;
  short?: string;
  question?: string;
  items: Item[];
};

const BASE = import.meta.env.BASE_URL;
const PLAN = `${BASE}materials/Course%20Guide/Two%20Year%20Plan/`;
const CHECKLIST = `${BASE}materials/Course%20Guide/Syllabus%20Checklist/`;
const REPORT = 'https://github.com/RktRobinhood/psychology-materials/issues/new/choose';
const two = (value: number) => String(value).padStart(2, '0');

function Cards({ items }: { items: Item[] }) {
  return (
    <div className="cards">
      {items.map((item) => (
        <a className="card" href={BASE + item.href} key={item.href}>
          {item.tag && <span className="tag">{item.tag}</span>}
          <h4>{item.title}</h4>
          {item.description && <p>{item.description}</p>}
        </a>
      ))}
    </div>
  );
}

function Unit({ unit }: { unit: Group }) {
  const number = unit.number ?? 0;
  return (
    <section className="unit" id={`unit-${number}`} aria-labelledby={`unit-${number}-title`}>
      <header className="unit-head">
        <p className="kicker">Unit {two(number)}</p>
        <h3 id={`unit-${number}-title`}>{unit.title}</h3>
        {unit.question && <p className="question">{unit.question}</p>}
        <p className="unit-links">
          <a href={`${PLAN}#guide-U${number}`}>Unit plan</a>
          <a href={`${CHECKLIST}#check-U${number}`}>Checklist</a>
        </p>
      </header>
      {unit.items.length > 0 ? <Cards items={unit.items} /> : <p className="empty">Lessons will appear here.</p>}
    </section>
  );
}

function App() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${BASE}materials.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Catalog unavailable');
        return response.json() as Promise<Group[]>;
      })
      .then(setGroups)
      .catch(() => setFailed(true));
  }, []);

  // Honour links such as /#unit-3 once the units have rendered.
  useEffect(() => {
    if (groups && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [groups]);

  const units = groups?.filter((group) => group.kind === 'unit') ?? [];
  const extras = groups?.filter((group) => group.kind === 'extra' && group.items.length > 0) ?? [];
  const guide = groups?.filter((group) => group.kind === 'guide').flatMap((group) => group.items) ?? [];
  const years = [...new Set(units.map((unit) => unit.year ?? 1))].sort((a, b) => a - b);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <p className="eyebrow">Mindfield · IB Psychology · First assessment 2027</p>
          <h1>Our psychology course</h1>
          {units.length > 0 && (
            <nav className="jump" aria-label="Units">
              {units.map((unit) => (
                <a href={`#unit-${unit.number}`} key={unit.folder}>
                  <b>{two(unit.number ?? 0)}</b> {unit.short ?? unit.title}
                </a>
              ))}
              {extras.map((group, index) => (
                <a href={`#extra-${index}`} key={group.folder}>{group.title}</a>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="wrap">
        {failed && <p className="state" role="alert">The lessons could not be loaded. Please try again shortly.</p>}
        {!groups && !failed && <p className="state">Loading…</p>}

        {guide.length > 0 && (
          <section className="guide" aria-label="Course guide">
            {guide.map((item) => (
              <a className="card guide-card" href={BASE + item.href} key={item.href}>
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
              </a>
            ))}
          </section>
        )}

        {years.map((year) => (
          <div key={year}>
            <h2 className="year">Year {year}</h2>
            {units.filter((unit) => (unit.year ?? 1) === year).map((unit) => <Unit unit={unit} key={unit.folder} />)}
          </div>
        ))}

        {extras.map((group, index) => (
          <div key={group.folder || group.title}>
            <h2 className="year">{group.title}</h2>
            <section className="unit" id={`extra-${index}`}>
              <header className="unit-head">
                {group.question && <p className="question">{group.question}</p>}
              </header>
              <Cards items={group.items} />
            </section>
          </div>
        ))}
      </main>

      <footer className="wrap">
        <a href={REPORT} target="_blank" rel="noopener">Found a problem in a lesson? Report it</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);

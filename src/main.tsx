import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, BookOpen, LibraryBig } from 'lucide-react';
import './styles.css';

type Material = {
  slug: string;
  title: string;
  description: string;
  category: string;
};

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}materials.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Catalog unavailable');
        return response.json() as Promise<Material[]>;
      })
      .then((data: Material[]) => {
        setMaterials(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const materialLabel = useMemo(
    () => `${materials.length} ${materials.length === 1 ? 'resource' : 'resources'}`,
    [materials.length],
  );

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href={import.meta.env.BASE_URL} aria-label="Mindfield home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>Mindfield</span>
          </a>
          <a className="nav-link" href="#materials">Browse materials</a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow"><span /> Psychology materials</p>
          <h1 id="page-title">Ideas that help us understand the mind.</h1>
          <p className="hero-copy">
            A growing library of thoughtful resources for learning, reflection,
            and psychological practice.
          </p>
          <a className="primary-action" href="#materials">
            Explore the library <ArrowDown aria-hidden="true" size={18} />
          </a>
        </div>

        <p className="hero-note">Curated with care · Open for learning</p>
      </section>

      <section className="library" id="materials" aria-labelledby="materials-heading">
        <header className="library-header">
          <div>
            <p className="section-kicker">The library</p>
            <h2 id="materials-heading">Psychology, made approachable.</h2>
          </div>
          {status === 'ready' && <p className="count">{materialLabel}</p>}
        </header>

        {status === 'loading' && (
          <output className="state-card">Gathering the materials…</output>
        )}

        {status === 'error' && (
          <div className="state-card" role="alert">
            The library could not be loaded. Please try again shortly.
          </div>
        )}

        {status === 'ready' && materials.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true"><LibraryBig size={30} /></div>
            <p className="empty-label">The first collection is taking shape</p>
            <h3>Materials will appear here as they are published.</h3>
            <p>Each new resource is added to this library automatically.</p>
          </div>
        )}

        {status === 'ready' && materials.length > 0 && (
          <div className="material-grid">
            {materials.map((material, index) => (
              <a
                className="material-card"
                href={`${import.meta.env.BASE_URL}materials/${material.slug}/`}
                key={material.slug}
              >
                <div className="card-top">
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                  <ArrowUpRight aria-hidden="true" size={22} />
                </div>
                <p className="category"><BookOpen aria-hidden="true" size={15} /> {material.category}</p>
                <h3>{material.title}</h3>
                <p>{material.description}</p>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer>
        <a className="brand footer-brand" href={import.meta.env.BASE_URL}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Mindfield</span>
        </a>
        <p>Psychology resources for curious minds.</p>
        <a className="footer-report" href="https://github.com/RktRobinhood/psychology-materials/issues/new/choose" target="_blank" rel="noopener">
          Found a problem in a lesson? Report it
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);

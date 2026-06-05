import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

const trustItems = [
  'NFPA-aligned programs',
  '24/7 emergency response',
  'Factory and warehouse coverage',
  'Hospital and data-center readiness',
  'Maintenance and audits'
];

const industryHoverInfo = {
  Manufacturing: {
    name: 'Manufacturing',
    description:
      'Fire suppression systems, alarm networks, hydrants, and compliance support for factories and industrial production areas.',
    capability: 'Designed for process floors, heavy equipment zones, and coordinated plant-wide response.'
  },
  Healthcare: {
    name: 'Healthcare',
    description:
      'Life-safety planning for hospitals, clinics, and care environments where patient movement, uptime, and documentation matter.',
    capability: 'Supports phased evacuation, sensitive equipment protection, and care-area readiness.'
  },
  Warehousing: {
    name: 'Warehousing',
    description:
      'Sprinkler design, smoke management, and response planning for storage facilities, logistics hubs, and high-bay environments.',
    capability: 'Built around racking layouts, aisle access, and dependable inventory protection.'
  },
  'Data Centers': {
    name: 'Data Centers',
    description:
      'Clean-agent suppression, early detection, and resilience-focused protection for critical infrastructure and uptime-heavy operations.',
    capability: 'Optimized for server rooms, network rooms, and uninterrupted service continuity.'
  },
  Hospitality: {
    name: 'Hospitality',
    description:
      'Guest-safe fire protection solutions for hotels, resorts, and event spaces that balance comfort, visibility, and compliance.',
    capability: 'Supports discreet coverage, clear evacuation paths, and 24/7 occupancy environments.'
  },
  Education: {
    name: 'Education',
    description:
      'Campus fire safety programs for schools, colleges, and training facilities with layered occupancy and movement patterns.',
    capability: 'Helps with drills, alarm clarity, and safe circulation across shared spaces.'
  },
  Government: {
    name: 'Government',
    description:
      'Risk-aware protection for public buildings, administrative centers, and civic facilities with formal compliance requirements.',
    capability: 'Balances public access, documentation, and dependable emergency response.'
  },
  'Commercial Buildings': {
    name: 'Commercial Buildings',
    description:
      'Integrated fire safety planning for offices, mixed-use towers, and tenant spaces where continuity and clear egress are essential.',
    capability: 'Supports multi-floor coordination, occupant safety, and code-aligned system design.'
  },
  Retail: {
    name: 'Retail',
    description:
      'Dependable protection for retail spaces, showrooms, and customer-facing environments with high foot traffic and merchandise exposure.',
    capability: 'Keeps evacuation clarity, asset protection, and fast response top of mind.'
  },
  Logistics: {
    name: 'Logistics',
    description:
      'Protection planning for distribution centers, transit hubs, and logistics operations where speed and visibility are critical.',
    capability: 'Prioritizes vehicle access, storage flow, and dependable site-wide control.'
  }
};

const heroVideoSrc = '/hero-background.mp4';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteShell />
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function revealStyle(index, step = 80) {
  return { '--reveal-delay': `${index * step}ms` };
}

function useInViewOnce({ threshold = 0.4, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, isVisible];
}

function useTweenNumber({ from = 0, to = 0, active = false, duration = 900, decimals = 0 } = {}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) {
      setValue(from);
      return undefined;
    }

    let rafId = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = from + (to - from) * eased;
      setValue(Number(nextValue.toFixed(decimals + 2)));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(rafId);
  }, [active, decimals, duration, from, to]);

  return value;
}

function formatTweenValue(value, decimals = 0) {
  const rounded = decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(rounded);
}

function parseMetricValue(value) {
  const raw = String(value).trim();
  if (raw.includes('/')) {
    return { static: true, value: raw };
  }

  const match = raw.match(/^([\d,]+(?:\.\d+)?)([+%]?)$/);
  if (!match) {
    return { static: true, value: raw };
  }

  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
  return {
    static: false,
    from: 0,
    to: Number(match[1].replace(/,/g, '')),
    suffix: match[2],
    decimals
  };
}

function StaggeredWords({ text, className = '', tag: Tag = 'span', step = 70, startDelay = 0 }) {
  const words = String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    <Tag className={`staggered-text ${className}`.trim()} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="staggered-word"
          style={{ '--word-delay': `${startDelay + index * step}ms` }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}

function AnimatedMetricCard({ metric, index }) {
  const [ref, isVisible] = useInViewOnce({ threshold: 0.45 });

  return (
    <article ref={ref} className="metric-card metric-card-animated" data-reveal style={revealStyle(index, 70)}>
      <strong>
        <AnimatedMetricValue value={metric.value} active={isVisible} />
      </strong>
      <span>{metric.label}</span>
    </article>
  );
}

function AnimatedMetricValue({ value, active, duration = 1000 }) {
  const parsed = useMemo(() => parseMetricValue(value), [value]);
  const tweenValue = useTweenNumber({
    from: parsed.static ? 0 : parsed.from,
    to: parsed.static ? 0 : parsed.to,
    active: active && !parsed.static,
    duration: parsed.to >= 1000 ? 1200 : duration,
    decimals: parsed.decimals || 0
  });

  return parsed.static ? parsed.value : `${formatTweenValue(tweenValue, parsed.decimals || 0)}${parsed.suffix}`;
}

function DispatchCountdown({ active }) {
  const tweenValue = useTweenNumber({ from: 60, to: 18, active, duration: 1100, decimals: 0 });
  const progress = Math.max(0, Math.min(1, (60 - tweenValue) / 42));

  return (
    <div className="dispatch-clock" style={{ '--dispatch-progress': progress }}>
      <div className="dispatch-ring" aria-hidden="true">
        <span>{Math.round(tweenValue)}</span>
        <small>min</small>
      </div>
      <div className="dispatch-copy">
        <strong>24/7 emergency response</strong>
        <span>Average dispatch target: 18 minutes</span>
      </div>
    </div>
  );
}

function buildItemDetailCopy(item) {
  const applicationList = item.applications?.length ? item.applications.slice(0, 3).join(', ') : item.deployment;
  const featureList = item.features?.length ? item.features.slice(0, 2).join(' and ').toLowerCase() : 'practical site-specific controls';

  return {
    detailIntro: `${item.title} is configured for sites such as ${applicationList} and similar operating environments. The specification is tuned around ${item.deployment.toLowerCase()}, with ${item.compliance} compliance and a typical lead time of ${item.leadTime}. That gives teams a clearer path from survey to installation, testing, and handoff.`,
    detailFit: `${item.title} is typically paired with ${featureList} so the system stays easy to operate, monitor, and maintain during day-to-day use. It is a strong fit when the project needs predictable rollout, clear documentation, and a clean commissioning process.`,
    detailOutcome: `For facilities that need dependable performance under pressure, ${item.title} helps reduce uncertainty by tying the layout, compliance path, and delivery timeline into one structured deployment plan.`
  };
}

function DetailIntroSection({ item }) {
  const detailCopy = buildItemDetailCopy(item);

  return (
    <section className="detail-section" data-reveal>
      <h2>Detailed description</h2>
      <p>{item.overview}</p>
      <p>{detailCopy.detailIntro}</p>
      <p>{detailCopy.detailFit}</p>
      <p>{detailCopy.detailOutcome}</p>
    </section>
  );
}

const COLLECTION_BRAND = {
  name: 'FIREGUARD',
  tagline: 'Safety Solutions',
  phone: '+9122-40457000',
  email: 'sales@nitinfire.com',
  address: 'C-801, Neelkanth Business Park, Vidyavihar West, Vidyavihar, Mumbai, Maharashtra 400086.',
  certifications: ['NFPA 72', 'IS 15683', 'ISO-ready documentation']
};

const CONTACT_MAP_URL = `https://www.google.com/maps?q=${encodeURIComponent(COLLECTION_BRAND.address)}&output=embed`;

function getCollectionShowcaseMeta(item, index) {
  const text = [item.title, item.summary, ...(item.specs || []), ...(item.features || []), ...(item.applications || [])]
    .join(' ')
    .toLowerCase();
  const type = /portable|extinguisher/.test(text) ? 'portable' : 'fixed';
  const agentType = /foam/.test(text)
    ? 'foam'
    : /hydrant|sprinkler|hose|water/.test(text)
      ? 'water'
      : 'clean-agent';

  const theme =
    type === 'portable'
      ? {
          start: '#c1121f',
          end: '#780000',
          accent: '#fdf0d5'
        }
      : agentType === 'water'
        ? {
            start: '#003049',
            end: '#669bbc',
            accent: '#fdf0d5'
          }
        : {
            start: '#003049',
            end: '#780000',
            accent: '#fdf0d5'
          };

  return {
    type,
    typeLabel: type === 'portable' ? 'Portable' : 'Fixed',
    agentType,
    agentLabel: agentType === 'water' ? 'Water' : agentType === 'foam' ? 'Foam' : 'Clean agent',
    standardLabel: item.standards?.[0] || item.compliance || 'Site standard',
    coverageLabel: item.deployment || 'Site coverage',
    dischargeLabel:
      type === 'portable' ? 'Manual' : agentType === 'water' ? 'Water spray' : agentType === 'foam' ? 'Foam discharge' : 'Clean-agent',
    installLabel: item.leadTime || 'TBC',
    theme,
    recommended: index === 0,
    tags: Array.from(
      new Set([
        ...(item.specs || []).slice(0, 3),
        type === 'portable' ? 'Portable response' : 'Fixed deployment',
        agentType === 'water' ? 'Water-based' : agentType === 'foam' ? 'Foam-based' : 'Clean-agent'
      ])
    ).slice(0, 4)
  };
}

function CollectionProductCard({ item, collectionSlug, meta, index, isVisible, onQuickView }) {
  return (
    <article
      className={`collection-dark-card ${isVisible ? '' : 'is-hidden'}`}
      data-reveal
      data-tags={meta.tags.join(' ')}
      style={{
        '--reveal-delay': `${50 + index * 100}ms`,
        '--card-start': meta.theme.start,
        '--card-end': meta.theme.end,
        '--card-accent': meta.theme.accent
      }}
    >
      <div className="collection-dark-card-visual">
        <img className="collection-dark-card-image" src={item.image} alt={item.title} />
        <div className="collection-dark-card-overlay">
          <button type="button" className="collection-dark-overlay-btn" onClick={() => onQuickView(item.slug)}>
            Quick view
          </button>
          <Link className="collection-dark-overlay-btn" to={`/products/${collectionSlug}/${item.slug}`}>
            Datasheet
          </Link>
        </div>
        {meta.recommended ? <span className="collection-dark-recommended">Recommended</span> : null}
      </div>

      <div className="collection-dark-card-body">
        <p className="collection-dark-kicker">{item.collectionTitle}</p>
        <h3>{item.title}</h3>
        <p className="collection-dark-summary">{item.summary}</p>
        <div className="collection-dark-tags">
          {meta.tags.map((tag) => (
            <span key={tag} className="collection-dark-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="collection-dark-actions">
        <Link className="collection-dark-open-btn" to={`/products/${collectionSlug}/${item.slug}`}>
          Open item page
        </Link>
      </div>
    </article>
  );
}

function CollectionQuickViewModal({ item, collectionSlug, meta, onClose }) {
  if (!item) return null;
  const detailCopy = buildItemDetailCopy(item);
  const highlights = [
    { label: 'Type', value: meta.typeLabel },
    { label: 'Agent', value: meta.agentLabel },
    { label: 'Compliance', value: item.compliance },
    { label: 'Lead time', value: item.leadTime }
  ];

  return (
    <div className="modal-backdrop collection-modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-card collection-quickview-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close quick view">
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="collection-quickview-body">
          <div className="collection-quickview-header">
            <div className="collection-quickview-heading">
              <p className="eyebrow">Quick view</p>
              <h3>{item.title}</h3>
              <p className="collection-quickview-summary">{item.summary}</p>
              <p className="collection-quickview-lead">{detailCopy.detailIntro}</p>
            </div>
            <div className="collection-quickview-highlights">
              {highlights.map((highlight) => (
                <div key={highlight.label} className="collection-quickview-highlight">
                  <span>{highlight.label}</span>
                  <strong>{highlight.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="collection-quickview-grid">
            <div className="collection-quickview-panel collection-quickview-panel--hero" style={{ '--card-start': meta.theme.start, '--card-end': meta.theme.end }}>
              <p className="panel-label">Product profile</p>
              <strong>
                {meta.typeLabel} / {meta.agentLabel}
              </strong>
              <span>{detailCopy.detailFit}</span>
            </div>
            <div className="collection-quickview-panel">
              <p className="panel-label">Specifications</p>
              <div className="pill-row">
                {item.specs.map((spec) => (
                  <span key={spec} className="pill">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div className="collection-quickview-panel">
              <p className="panel-label">Applications</p>
              <div className="pill-row">
                {item.applications.map((application) => (
                  <span key={application} className="pill">
                    {application}
                  </span>
                ))}
              </div>
            </div>
            <div className="collection-quickview-panel">
              <p className="panel-label">Standards & rollout</p>
              <div className="collection-quickview-list">
                <div>
                  <span>Standards</span>
                  <strong>{item.standards.join(' / ')}</strong>
                </div>
                <div>
                  <span>Deployment</span>
                  <strong>{item.deployment}</strong>
                </div>
                <div>
                  <span>Compliance</span>
                  <strong>{item.compliance}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="collection-quickview-note">
            <p>{detailCopy.detailOutcome}</p>
          </div>
          <div className="collection-quickview-actions">
            <Link className="btn btn-primary" to={`/products/${collectionSlug}/${item.slug}`} onClick={onClose}>
              Open datasheet
            </Link>
            <Link className="btn btn-ghost" to="/#contact" onClick={onClose}>
              Request a quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionCompareModal({ items, collectionSlug, onClose }) {
  if (!items.length) return null;

  const rows = [
    { label: 'Type', key: 'typeLabel' },
    { label: 'Agent', key: 'agentLabel' },
    { label: 'Standard', key: 'standardLabel' },
    { label: 'Coverage', key: 'coverageLabel' },
    { label: 'Discharge', key: 'dischargeLabel' },
    { label: 'Installation required', key: 'installLabel' }
  ];

  return (
    <div className="modal-backdrop collection-modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-card collection-compare-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close comparison">
          <i className="fa-solid fa-xmark" />
        </button>
        <p className="eyebrow">Comparison</p>
        <h3>Compare Products</h3>
        <div className="collection-compare-table-wrap">
          <table className="collection-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                {items.map((item) => (
                  <th key={item.slug}>
                    <span>{item.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  {items.map((item, index) => {
                    const meta = getCollectionShowcaseMeta(item, index);
                    return <td key={`${item.slug}-${row.key}`}>{meta[row.key]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function HeroPanel() {
  const [ref, isVisible] = useInViewOnce({ threshold: 0.35 });

  return (
    <div className="hero-panel-stack snapshot-dashboard" ref={ref}>
      <div className="panel glass snapshot-card snapshot-card--rapid" data-reveal style={revealStyle(0, 120)}>
        <p className="panel-label">Rapid readiness</p>
        <DispatchCountdown active={isVisible} />
      </div>
      <div className="panel accent snapshot-card snapshot-card--compliance" data-reveal style={revealStyle(1, 120)}>
        <p className="panel-label">Compliance score</p>
        <strong>
          <AnimatedMetricValue value="99.9%" active={isVisible} />
        </strong>
        <span>Audit and documentation support</span>
      </div>
      <div className="panel large snapshot-card snapshot-card--health" data-reveal style={revealStyle(2, 120)}>
        <p className="panel-label">System health</p>
        <div className="ring">
          <span>High reliability</span>
        </div>
      </div>
    </div>
  );
}

function HeroSnapshotSection({ metrics }) {
  return (
    <section className="section hero-snapshot" id="snapshot">
      <div className="container">
        <div className="snapshot-shell">
          <div className="snapshot-left">
            <div className="section-head hero-snapshot-head" data-reveal>
              <p className="eyebrow">Operational snapshot</p>
              <h2>Signals that support a fast, compliant response.</h2>
              <p>
                The readiness cards, compliance summary, dispatch target, and system health view now live below the hero so the
                opening section stays focused on the core message.
              </p>
            </div>
            <div className="snapshot-metrics metric-grid">
              {metrics.map((metric, index) => (
                <AnimatedMetricCard key={metric.label} metric={metric} index={index} />
              ))}
            </div>
            <div className="snapshot-reliability panel glass" data-reveal style={revealStyle(5, 120)}>
              <p className="panel-label">Reliability</p>
              <strong>Enterprise uptime, response, and compliance stay aligned.</strong>
              <span>
                A clean operating view keeps readiness, documentation, and system health visible in one place, so teams can move
                faster with less uncertainty.
              </span>
            </div>
          </div>
          <div className="snapshot-panel snapshot-right">
            <HeroPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideFooter = false;
  const topbarRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [serviceCollections, setServiceCollections] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [industryCollections, setIndustryCollections] = useState([]);
  const [industryItems, setIndustryItems] = useState([]);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [industriesMenuOpen, setIndustriesMenuOpen] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState('');
  const [emergencyStatus, setEmergencyStatus] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessment, setAssessment] = useState({
    buildingType: 'Factory',
    areaSize: 12000,
    floors: 4,
    occupancy: 450,
    riskCategory: 'Moderate'
  });
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const contentReady =
    collections.length &&
    products.length &&
    serviceCollections.length &&
    serviceItems.length &&
    industryCollections.length &&
    industryItems.length;

  useEffect(() => {
    const load = async () => {
      const [metaRes, catalogRes, testRes, faqRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/catalog'),
        fetch('/api/testimonials'),
        fetch('/api/faqs')
      ]);
      const meta = await metaRes.json();
      const catalog = await catalogRes.json();
      const test = await testRes.json();
      const faq = await faqRes.json();
      setMetrics(meta.metrics);
      setServices(meta.services);
      setIndustries(meta.industries);
      setCollections(catalog.collections);
      setProducts(catalog.products);
      setServiceCollections(catalog.serviceCollections || []);
      setServiceItems(catalog.serviceItems || []);
      setIndustryCollections(catalog.industryCollections || []);
      setIndustryItems(catalog.industryItems || []);
      setTestimonials(test.testimonials);
      setFaqs(faq.faqs);
    };
    load();
  }, []);

  const closeAllMenus = () => {
    setNavOpen(false);
    setProductsMenuOpen(false);
    setServicesMenuOpen(false);
    setIndustriesMenuOpen(false);
  };

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname, location.hash, contentReady]);

  useEffect(() => {
    const handleScroll = () => {
      const nextValue = window.scrollY > 16;
      setIsScrolled((current) => (current === nextValue ? current : nextValue));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      if (topbarRef.current && !topbarRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };

    document.addEventListener('pointerdown', handleOutsideInteraction);
    document.addEventListener('click', handleOutsideInteraction);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideInteraction);
      document.removeEventListener('click', handleOutsideInteraction);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    elements.forEach((element) => observer.observe(element));

    const fallbackReveal = window.setTimeout(() => {
      elements.forEach((element) => element.classList.add('is-visible'));
    }, 120);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackReveal);
    };
  }, [location.pathname, location.hash, contentReady]);

  const collectionsWithProducts = useMemo(() => {
    return collections.map((collection) => ({
      ...collection,
      items: products.filter((product) => product.collectionSlug === collection.slug)
    }));
  }, [collections, products]);

  const serviceCollectionsWithItems = useMemo(() => {
    return serviceCollections.map((collection) => ({
      ...collection,
      items: serviceItems.filter((item) => item.collectionSlug === collection.slug)
    }));
  }, [serviceCollections, serviceItems]);

  const industryCollectionsWithItems = useMemo(() => {
    return industryCollections.map((collection) => ({
      ...collection,
      items: industryItems.filter((item) => item.collectionSlug === collection.slug)
    }));
  }, [industryCollections, industryItems]);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  const catalogSuggestions = useMemo(() => {
    const query = catalogQuery.trim().toLowerCase();
    if (!query) return [];

    const scored = products
      .map((product) => {
        const searchText = [
          product.title,
          product.collectionTitle,
          product.category,
        ]
          .join(' ')
          .toLowerCase();

        let score = 99;
        const title = (product.title || '').toLowerCase();
        const collection = (product.collectionTitle || '').toLowerCase();

        if (title === query) score = 0;
        else if (title.startsWith(query)) score = 1;
        else if (collection.startsWith(query)) score = 2;
        else if (title.includes(query)) score = 3;
        else if (collection.includes(query)) score = 4;
        else if (searchText.includes(query)) score = 5;

        return score < 99 ? { ...product, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title));

    return scored.slice(0, 6);
  }, [catalogQuery, products]);

  const getCollection = (slug) => collectionsWithProducts.find((item) => item.slug === slug);
  const getProduct = (slug) => products.find((item) => item.slug === slug);
  const getServiceCollection = (slug) => serviceCollectionsWithItems.find((item) => item.slug === slug);
  const getService = (slug) => serviceItems.find((item) => item.slug === slug);
  const getIndustryCollection = (slug) => industryCollectionsWithItems.find((item) => item.slug === slug);
  const getIndustry = (slug) => industryItems.find((item) => item.slug === slug);

  const handleProductsToggle = () => {
    setServicesMenuOpen(false);
    setIndustriesMenuOpen(false);
    setProductsMenuOpen((open) => !open);
  };

  const handleProductsEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setServicesMenuOpen(false);
      setIndustriesMenuOpen(false);
      setProductsMenuOpen(true);
    }
  };

  const handleProductsLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setProductsMenuOpen(false);
    }
  };

  const handleServicesToggle = () => {
    setProductsMenuOpen(false);
    setIndustriesMenuOpen(false);
    setServicesMenuOpen((open) => !open);
  };

  const handleServicesEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setProductsMenuOpen(false);
      setIndustriesMenuOpen(false);
      setServicesMenuOpen(true);
    }
  };

  const handleServicesLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setServicesMenuOpen(false);
    }
  };

  const handleIndustriesToggle = () => {
    setProductsMenuOpen(false);
    setServicesMenuOpen(false);
    setIndustriesMenuOpen((open) => !open);
  };

  const handleIndustriesEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setProductsMenuOpen(false);
      setServicesMenuOpen(false);
      setIndustriesMenuOpen(true);
    }
  };

  const handleIndustriesLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIndustriesMenuOpen(false);
    }
  };

  const handleTopNavClick = () => {
    closeAllMenus();
  };

  const handleCatalogNavigate = () => {
    closeAllMenus();
    setNavOpen(false);
  };

  const handleCatalogKeyDown = (event) => {
    if (event.key === 'Enter' && catalogQuery.trim()) {
      navigate('/products');
    }
  };

  const handleAssessmentSubmit = async (event) => {
    event.preventDefault();
    setAssessmentLoading(true);
    setAssessmentResult(null);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 620));
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });
      setAssessmentResult(await res.json());
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteForm)
    });
    const data = await res.json();
    setQuoteStatus(data.message);
    setQuoteForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleEmergencySubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setEmergencyStatus(data.message);
    event.currentTarget.reset();
  };

  if (
    !collections.length ||
    !products.length ||
    !serviceCollections.length ||
    !serviceItems.length ||
    !industryCollections.length ||
    !industryItems.length
  ) {
    return <div className="loading-shell">Loading catalog...</div>;
  }

  return (
    <div className="app-shell">
      <header className={`topbar ${isScrolled ? 'is-scrolled' : ''}`} ref={topbarRef}>
        <div className="container nav-wrap">
          <Link className={`brand ${location.pathname === '/' ? 'is-active' : ''}`} to="/#home" onClick={handleTopNavClick}>
            <span className="brand-mark">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <span>
              <strong>FIREGUARD</strong>
              <small>Safety Solutions</small>
            </span>
          </Link>
          <button className="menu-toggle" onClick={() => setNavOpen((open) => !open)} aria-label="Toggle navigation">
            <i className="fa-solid fa-bars" />
          </button>
          <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
            <a href="/#about" className={location.hash === '#about' ? 'is-active' : ''} onClick={handleTopNavClick}>
              About
            </a>
            <CatalogDropdown
              label="Products"
              basePath="/products"
              collections={collectionsWithProducts}
              open={productsMenuOpen}
              active={location.pathname.startsWith('/products')}
              onToggle={handleProductsToggle}
              onEnter={handleProductsEnter}
              onLeave={handleProductsLeave}
              onClose={() => setProductsMenuOpen(false)}
              onNavigate={() => setNavOpen(false)}
            />
            <CatalogDropdown
              label="Services"
              basePath="/services"
              collections={serviceCollectionsWithItems}
              open={servicesMenuOpen}
              active={location.pathname.startsWith('/services')}
              onToggle={handleServicesToggle}
              onEnter={handleServicesEnter}
              onLeave={handleServicesLeave}
              onClose={() => setServicesMenuOpen(false)}
              onNavigate={() => setNavOpen(false)}
            />
            <CatalogDropdown
              label="Industries"
              basePath="/industries"
              collections={industryCollectionsWithItems}
              open={industriesMenuOpen}
              active={location.pathname.startsWith('/industries')}
              onToggle={handleIndustriesToggle}
              onEnter={handleIndustriesEnter}
              onLeave={handleIndustriesLeave}
              onClose={() => setIndustriesMenuOpen(false)}
              onNavigate={() => setNavOpen(false)}
              showItemPreviews={true}
            />
            <a href="/#assessment" className={location.hash === '#assessment' ? 'is-active' : ''} onClick={handleTopNavClick}>
              Assessment
            </a>
            <a href="/#contact" className={location.hash === '#contact' ? 'is-active' : ''} onClick={handleTopNavClick}>
              Contact
            </a>
          </nav>
          <div className="nav-actions">
            <div className="catalog-search-shell">
              <input
                type="search"
                placeholder="Browse the catalog"
                value={catalogQuery}
                onChange={(event) => setCatalogQuery(event.target.value)}
                onKeyDown={handleCatalogKeyDown}
                aria-label="Search products"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-expanded={catalogSuggestions.length > 0}
              />
              {catalogQuery.trim() ? (
                <div className="catalog-search-dropdown" role="listbox" aria-label="Catalog search suggestions">
                  <div className="catalog-search-header">
                    <strong>Matching products</strong>
                    <span>{catalogSuggestions.length} shown</span>
                  </div>
                  <div className="catalog-search-results">
                    {catalogSuggestions.length ? (
                      catalogSuggestions.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.collectionSlug}/${product.slug}`}
                          className="catalog-search-result"
                          onClick={handleCatalogNavigate}
                        >
                          <span className="catalog-search-result-title">{product.title}</span>
                          <span className="catalog-search-result-meta">
                            {product.collectionTitle || product.category}
                          </span>
                          <span className="catalog-search-result-summary">{product.summary}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="catalog-search-empty">
                        <strong>No products found.</strong>
                        <span>Try another search term or clear filters.</span>
                      </div>
                    )}
                  </div>
                  <div className="catalog-search-footer">
                    <Link className="btn btn-ghost" to="/products" onClick={handleCatalogNavigate}>
                      View all results
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
            <a className="btn btn-ghost" href="tel:+919876543210">
              Call
            </a>
            <a className="btn btn-primary" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                metrics={metrics}
                collections={collectionsWithProducts}
                products={featuredProducts}
                services={services}
                industries={industries}
                testimonials={testimonials}
                faqs={faqs}
                assessment={assessment}
                setAssessment={setAssessment}
                handleAssessmentSubmit={handleAssessmentSubmit}
                assessmentResult={assessmentResult}
                assessmentLoading={assessmentLoading}
                quoteForm={quoteForm}
                setQuoteForm={setQuoteForm}
                handleQuoteSubmit={handleQuoteSubmit}
                quoteStatus={quoteStatus}
              />
            }
          />
          <Route
            path="/products"
            element={<ProductsIndexPage collections={collectionsWithProducts} catalogQuery={catalogQuery} />}
          />
          <Route
            path="/products/:collectionSlug"
            element={<CollectionPage getCollection={getCollection} />}
          />
          <Route
            path="/products/:collectionSlug/:productSlug"
            element={<ProductPage getCollection={getCollection} getProduct={getProduct} />}
          />
          <Route
            path="/product/:productSlug"
            element={<ProductPage getCollection={getCollection} getProduct={getProduct} canonical={true} />}
          />
          <Route
            path="/services"
            element={<ServicesIndexPage collections={serviceCollectionsWithItems} />}
          />
          <Route
            path="/services/:collectionSlug"
            element={<ServiceCollectionPage getCollection={getServiceCollection} />}
          />
          <Route
            path="/services/:collectionSlug/:serviceSlug"
            element={<ServicePage getCollection={getServiceCollection} getService={getService} />}
          />
          <Route
            path="/industries"
            element={<IndustriesIndexPage collections={industryCollectionsWithItems} />}
          />
          <Route
            path="/industries/:collectionSlug"
            element={<IndustryCollectionPage getCollection={getIndustryCollection} />}
          />
          <Route
            path="/industries/:collectionSlug/:industrySlug"
            element={<IndustryPage getCollection={getIndustryCollection} getIndustry={getIndustry} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {hideFooter ? null : <Footer />}
    </div>
  );
}

function CatalogDropdown({ label, basePath, collections, open, active, onToggle, onEnter, onLeave, onClose, onNavigate }) {
  const closeTimerRef = useRef(null);

  const handleSelect = () => {
    onClose();
    onNavigate();
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handlePointerEnter = () => {
    clearCloseTimer();
    onEnter?.();
  };

  const handlePointerLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      onLeave?.();
    }, 140);
  };

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div className={`product-dropdown ${open ? 'open' : ''}`} onMouseEnter={handlePointerEnter} onMouseLeave={handlePointerLeave}>
      <button
        type="button"
        className={`product-dropdown-trigger ${active ? 'is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {label}
        <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" />
      </button>
      {open ? (
        <div className="dropdown-panel">
          <div className="dropdown-grid">
            {collections.map((collection) => (
              <section key={collection.slug} className="dropdown-collection">
                <Link className="dropdown-collection-title" to={`${basePath}/${collection.slug}`} onClick={handleSelect}>
                  {collection.title}
                </Link>
                <p>{collection.summary}</p>
                <div className="dropdown-items">
                  {collection.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`${basePath}/${collection.slug}/${item.slug}`}
                      onClick={handleSelect}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="dropdown-footer">
            <Link className="btn btn-primary" to={basePath} onClick={handleSelect}>
              View all collections
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HomePage({
  metrics,
  collections,
  products,
  services,
  industries,
  testimonials,
  faqs,
  assessment,
  setAssessment,
  handleAssessmentSubmit,
  assessmentResult,
  assessmentLoading,
  quoteForm,
  setQuoteForm,
  handleQuoteSubmit,
  quoteStatus
}) {
  const location = useLocation();
  const assessmentResultRef = useRef(null);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [activeIndustryAlign, setActiveIndustryAlign] = useState('center');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const node = document.getElementById(id);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  useEffect(() => {
    if ((assessmentLoading || assessmentResult) && assessmentResultRef.current) {
      assessmentResultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [assessmentLoading, assessmentResult]);

  return (
    <>
      <section className="hero section" id="home">
        <div className="hero-video" aria-hidden="true">
          <video className="hero-video-element" autoPlay muted loop playsInline preload="metadata">
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
        </div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-particles" aria-hidden="true">
          <span className="hero-particle hero-particle-1" />
          <span className="hero-particle hero-particle-2" />
          <span className="hero-particle hero-particle-3" />
          <span className="hero-particle hero-particle-4" />
          <span className="hero-particle hero-particle-5" />
          <span className="hero-particle hero-particle-6" />
          <span className="hero-particle hero-particle-7" />
          <span className="hero-particle hero-particle-8" />
        </div>
        <div className="hero-sparks" aria-hidden="true">
          <span className="hero-spark hero-spark-1" />
          <span className="hero-spark hero-spark-2" />
          <span className="hero-spark hero-spark-3" />
          <span className="hero-spark hero-spark-4" />
          <span className="hero-spark hero-spark-5" />
          <span className="hero-spark hero-spark-6" />
        </div>
        <div className="container">
          <div className="hero-stage">
            <div className="hero-grid">
              <div className="hero-copy" data-reveal>
                <p className="hero-badge" data-reveal>
                  Premium Fire Protection Solutions
                </p>
                <h1>
                  <span className="hero-line">
                    <StaggeredWords text="Protecting Lives" step={78} startDelay={120} />
                  </span>
                  <span className="hero-line">
                    <StaggeredWords text="Through Intelligent" step={78} startDelay={260} />
                  </span>
                  <span className="hero-line">
                    <StaggeredWords text="Fire Safety Engineering" step={78} startDelay={400} />
                  </span>
                </h1>
                <p className="lead" data-reveal style={revealStyle(1, 120)}>
                  Industrial, commercial, healthcare, and residential fire protection services built around compliance, reliability, and rapid
                  response.
                </p>
                <div className="hero-buttons" data-reveal style={revealStyle(2, 120)}>
                  <Link className="btn btn-primary" to="/products">
                    Browse Products
                  </Link>
                  <a className="btn btn-glass" href="#assessment">
                    Schedule Inspection
                  </a>
                </div>
                <div className="hero-proof">
                  <span className="hero-proof-chip" data-reveal style={revealStyle(0, 100)}>
                    ISO-ready documentation
                  </span>
                  <span className="hero-proof-chip" data-reveal style={revealStyle(1, 100)}>
                    Site surveys within 24 hours
                  </span>
                  <span className="hero-proof-chip" data-reveal style={revealStyle(2, 100)}>
                    Maintenance and SLA planning
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-scroll-indicator" aria-hidden="true">
            <span className="hero-scroll-dot" />
            <small>Scroll</small>
          </div>
        </div>
      </section>

      <div className="trust-strip" aria-label="Trusted capabilities">
        <div className="trust-strip-track">
          {[...trustItems, ...trustItems].map((item, index) => (
            <span key={`${item}-${index}`} className="trust-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      <HeroSnapshotSection metrics={metrics} />

      <section className="section light-section" id="about">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">About the company</p>
            <h2>Light, premium, and built for trust.</h2>
            <p>
              We deliver fire safety programs for organizations that need engineering precision, compliance discipline, and reliable service.
            </p>
          </div>
          <div className="info-grid">
            <article className="info-card" data-reveal style={revealStyle(0, 100)}>
              <h3>Mission</h3>
              <p>Protect lives and assets with intelligent systems and measurable outcomes.</p>
            </article>
            <article className="info-card" data-reveal style={revealStyle(1, 100)}>
              <h3>Vision</h3>
              <p>Become the most trusted fire safety partner for enterprise campuses and critical infrastructure.</p>
            </article>
            <article className="info-card" data-reveal style={revealStyle(2, 100)}>
              <h3>Values</h3>
              <p>Integrity, precision, speed, accountability, and continuous improvement.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="collections">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Product collections</p>
            <h2>Browse every collection, then open each item as its own page.</h2>
          </div>
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <article key={collection.slug} className="collection-card" data-reveal style={revealStyle(index, 100)}>
                <div>
                  <p className="collection-label">{collection.title}</p>
                  <h3>{collection.summary}</h3>
                </div>
                <div className="collection-items">
                  {collection.items.map((item) => (
                    <Link key={item.slug} to={`/products/${collection.slug}/${item.slug}`} className="collection-item-link">
                      <span>{item.title}</span>
                      <i className="fa-solid fa-arrow-right" />
                    </Link>
                  ))}
                </div>
                <Link className="btn btn-ghost" to={`/products/${collection.slug}`}>
                  Open collection
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-section" id="featured-products">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Featured products</p>
            <h2>Each item has its own page, image, and detailed content.</h2>
          </div>
          <div className="product-grid">
            {products.map((product, index) => (
              <article key={product.id} className="product-card" data-reveal style={revealStyle(index, 100)}>
                <div className="product-top">
                  <span className="product-icon">
                    <i className={`fa-solid ${product.icon}`} />
                  </span>
                  <span className="product-collection">{product.collectionTitle}</span>
                </div>
                <div className="product-media">
                  <img className="product-thumb" src={product.image} alt={product.title} />
                  <div className="product-media-overlay" aria-hidden="true">
                    <span>View product details</span>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </div>
                <h3>{product.title}</h3>
                <p>{product.summary}</p>
                <div className="specs">
                  {product.specs.map((spec, specIndex) => (
                    <span key={spec} className="spec-chip" style={{ '--spec-index': specIndex }}>
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="product-actions">
                  <Link className="btn btn-primary product-link" to={`/products/${product.collectionSlug}/${product.slug}`}>
                    <span>View page</span>
                    <i className="fa-solid fa-arrow-right product-link-arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="assessment">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">AI fire safety assessment</p>
            <h2>Instantly translate facility inputs into a practical risk picture.</h2>
          </div>
          <div className="assessment-grid">
            <form className={`form-card assessment-form ${assessmentLoading ? 'is-calculating' : ''}`} onSubmit={handleAssessmentSubmit}>
              <label>
                Building Type
                <select value={assessment.buildingType} onChange={(e) => setAssessment({ ...assessment, buildingType: e.target.value })}>
                  <option>Factory</option>
                  <option>Hospital</option>
                  <option>Warehouse</option>
                  <option>Hotel</option>
                  <option>School</option>
                  <option>Data Center</option>
                  <option>Commercial Building</option>
                </select>
              </label>
              <div className="two-col">
                <label>
                  Area Size (sqm)
                  <input type="number" value={assessment.areaSize} onChange={(e) => setAssessment({ ...assessment, areaSize: Number(e.target.value) })} />
                </label>
                <label>
                  Number of Floors
                  <input type="number" value={assessment.floors} onChange={(e) => setAssessment({ ...assessment, floors: Number(e.target.value) })} />
                </label>
              </div>
              <div className="two-col">
                <label>
                  Occupancy
                  <input type="number" value={assessment.occupancy} onChange={(e) => setAssessment({ ...assessment, occupancy: Number(e.target.value) })} />
                </label>
                <label>
                  Risk Category
                  <select value={assessment.riskCategory} onChange={(e) => setAssessment({ ...assessment, riskCategory: e.target.value })}>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>
              </div>
              <button className="btn btn-primary wide assessment-submit" type="submit" disabled={assessmentLoading}>
                {assessmentLoading ? 'Calculating...' : 'Generate Assessment'}
              </button>
            </form>

            <div
              className={`result-card assessment-result ${assessmentLoading ? 'is-loading' : assessmentResult ? 'is-ready' : ''}`}
              style={revealStyle(1)}
              ref={assessmentResultRef}
            >
              {assessmentLoading ? (
                <div className="assessment-loader">
                  <div className="assessment-loader-line" />
                  <p className="score-label">Calculating response path</p>
                  <p className="muted">
                    Scanning facility inputs, cross-checking standards, and building the response plan.
                  </p>
                </div>
              ) : assessmentResult ? (
                <div className="assessment-sequence">
                  <div className="assessment-step" style={{ '--step-delay': '0ms' }}>
                    <div className="score-ring">
                      <strong>{assessmentResult.score}</strong>
                      <span>Risk score</span>
                    </div>
                    <p className="score-label">{assessmentResult.label}</p>
                  </div>
                  <div className="assessment-step" style={{ '--step-delay': '140ms' }}>
                    <h3>Recommended equipment</h3>
                    <div className="pill-row">
                      {assessmentResult.equipment.map((item) => (
                        <span key={item} className="pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="assessment-step" style={{ '--step-delay': '280ms' }}>
                    <h3>Suggested standards</h3>
                    <div className="pill-row">
                      {assessmentResult.standards.map((item) => (
                        <span key={item} className="pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="assessment-step" style={{ '--step-delay': '420ms' }}>
                    <p className="muted">{assessmentResult.note}</p>
                  </div>
                </div>
              ) : (
                <p className="muted">Complete the assessment form to see a tailored fire safety recommendation set.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section light-section" id="services">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Services</p>
            <h2>End-to-end fire safety services built for enterprise continuity.</h2>
          </div>
          <div className="card-grid services-grid">
            {services.map((service, index) => (
              <article key={service} className="service-card" data-reveal style={revealStyle(index, 50)}>
                <i className="fa-solid fa-shield-halved" />
                <h3>{service}</h3>
                <p>Professional execution with disciplined project delivery and compliance support.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="industries">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Industries served</p>
            <h2>Protection systems tailored to each operating environment.</h2>
          </div>
          <div className="industry-chip-cloud" aria-label="Industries served">
            {industries.map((item, index) => (
              <div
                key={item}
                className="industry-chip-item"
                data-reveal
                style={revealStyle(index, 50)}
                onMouseEnter={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
                  const nearLeftEdge = rect.left < 360;
                  const nearRightEdge = rect.right > viewportWidth - 360;
                  const nextAlign = nearRightEdge ? 'end' : nearLeftEdge ? 'start' : 'center';
                  setActiveIndustryAlign(nextAlign);
                  setActiveIndustry(item);
                }}
                onMouseLeave={() => {
                  setActiveIndustry((current) => (current === item ? null : current));
                  setActiveIndustryAlign('center');
                }}
              >
                <button
                  type="button"
                  className={`chip industry-served-chip ${activeIndustry === item ? 'is-active' : ''}`}
                  aria-expanded={activeIndustry === item}
                  aria-label={`${item} industry details`}
                  onFocus={() => setActiveIndustry(item)}
                  onBlur={(event) => {
                    if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                      setActiveIndustry((current) => (current === item ? null : current));
                    }
                  }}
                >
                  {item}
                </button>
                {activeIndustry === item ? (
                  <div
                    className="industry-chip-popover"
                    role="status"
                    aria-live="polite"
                    style={{
                      '--popover-x': activeIndustryAlign === 'center' ? '-50%' : '0',
                      left: activeIndustryAlign === 'end' ? 'auto' : activeIndustryAlign === 'start' ? 0 : '50%',
                      right: activeIndustryAlign === 'end' ? 0 : 'auto'
                    }}
                  >
                    <strong>{industryHoverInfo[item]?.name || item}</strong>
                    <p>{industryHoverInfo[item]?.description || 'Fire safety planning tailored for this operating environment.'}</p>
                    {industryHoverInfo[item]?.capability ? <span>{industryHoverInfo[item].capability}</span> : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-section" id="testimonials">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Testimonials</p>
            <h2>Client confidence from high-stakes environments.</h2>
          </div>
          <div className="card-grid three">
            {testimonials.map((item, index) => (
              <article key={item.author} className="testimonial-card" data-reveal style={revealStyle(index)}>
                <div className="stars">★★★★★</div>
                <p>"{item.quote}"</p>
                <strong>{item.author}</strong>
                <span>{item.company}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">FAQ</p>
            <h2>Answers to common procurement and safety questions.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <details key={item.question} className="faq-item" data-reveal style={revealStyle(index)}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-section contact-section" id="contact">
        <div className="container">
          <div className="section-head contact-section-head" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2>We'd love to hear from you.</h2>
            <p>
              Whether you have a question, a proposal, or need urgent support, our team is here to help with clear guidance
              and fast follow-up.
            </p>
          </div>

          <div className="contact-split">
            <aside className="contact-info-panel" data-reveal style={revealStyle(0, 100)}>
              <p className="contact-panel-kicker">Contact Us</p>
              <strong>FireGuard Safety Solutions</strong>
              <div className="contact-info-stack">
                <div className="contact-info-item" style={{ '--item-index': 0 }}>
                  <span className="contact-info-icon" aria-hidden="true">
                    <i className="fa-solid fa-phone-volume" />
                  </span>
                  <div>
                    <span>Phone</span>
                    <a href={`tel:${COLLECTION_BRAND.phone.replace(/\s+/g, '')}`}>{COLLECTION_BRAND.phone}</a>
                  </div>
                </div>
                <div className="contact-info-item" style={{ '--item-index': 1 }}>
                  <span className="contact-info-icon" aria-hidden="true">
                    <i className="fa-solid fa-envelope" />
                  </span>
                  <div>
                    <span>Email address</span>
                    <a href={`mailto:${COLLECTION_BRAND.email}`}>{COLLECTION_BRAND.email}</a>
                  </div>
                </div>
                <div className="contact-info-item" style={{ '--item-index': 2 }}>
                  <span className="contact-info-icon" aria-hidden="true">
                    <i className="fa-solid fa-building" />
                  </span>
                  <div>
                    <span>Office location</span>
                    <p>{COLLECTION_BRAND.address}</p>
                  </div>
                </div>
                <div className="contact-info-item" style={{ '--item-index': 3 }}>
                  <span className="contact-info-icon" aria-hidden="true">
                    <i className="fa-brands fa-linkedin-in" />
                  </span>
                  <div>
                    <span>Follow us</span>
                    <p>in</p>
                  </div>
                </div>
              </div>
            </aside>

            <form className="contact-form-panel" onSubmit={handleQuoteSubmit} data-reveal style={revealStyle(1, 100)}>
              <div className="contact-form-heading">
                <p className="panel-label">Contact form</p>
                <h3>Contact Me</h3>
              </div>
              <div className="contact-form-grid">
                <label>
                  First Name *
                  <input
                    value={quoteForm.firstName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, firstName: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Last Name *
                  <input
                    value={quoteForm.lastName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, lastName: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Phone Number *
                  <input
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email *
                  <input
                    type="email"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    required
                  />
                </label>
              </div>
              <label>
                Write Your Message *
                <textarea
                  rows="7"
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  required
                />
              </label>
              <button className="btn btn-primary wide contact-submit" type="submit">
                Submit Now
              </button>
              {quoteStatus ? <p className="success">{quoteStatus}</p> : null}
            </form>
          </div>

          <section className="map-shell contact-map-shell" data-reveal style={revealStyle(2, 100)}>
            <div className="map-frame-wrap">
              <iframe
                className="map-frame"
                src={CONTACT_MAP_URL}
                title="FireGuard Safety Solutions map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function ProductsIndexPage({ collections, catalogQuery }) {
  const itemCount = collections.reduce((sum, collection) => sum + collection.items.length, 0);

  const normalizedQuery = catalogQuery.trim().toLowerCase();

  const visibleCollections = useMemo(() => {
    const matchesQuery = (item, collection) => {
      if (!normalizedQuery) return true;

      const searchText = [
        item.title,
        item.collectionTitle || collection.title,
        collection.title,
        item.category
      ]
        .join(' ')
        .toLowerCase();

      return searchText.includes(normalizedQuery);
    };

    return collections
      .map((collection) => {
        const visibleItems = collection.items.filter((item) => matchesQuery(item, collection));
        return {
          ...collection,
          visibleItems
        };
      })
      .filter((collection) => collection.visibleItems.length > 0);
  }, [collections, normalizedQuery]);

  const collectionCount = collections.length;

  return (
    <section className="section page-section">
      <div className="container">
        <div className="index-hero">
          <div className="page-banner index-hero-copy" data-reveal>
            <p className="eyebrow">Products</p>
            <h1>Every collection and every item, organized as a browsable catalog.</h1>
            <p>Open a collection to see all items inside it, then open an individual item page for full image and content detail.</p>
          </div>
          <aside className="index-summary-card" data-reveal style={revealStyle(1)}>
            <p className="panel-label">Catalog at a glance</p>
            <strong>{collectionCount} collections</strong>
            <span>{itemCount} item pages across the product catalog.</span>
            <div className="index-summary-stats">
              <div>
                <strong>{collectionCount}</strong>
                <span>Collections</span>
              </div>
              <div>
                <strong>{itemCount}</strong>
                <span>Item pages</span>
              </div>
            </div>
            <ul className="index-summary-list">
              <li>Collection overviews for faster browsing.</li>
              <li>Dedicated item pages for visuals and specs.</li>
              <li>Consistent structure across the catalog.</li>
            </ul>
          </aside>
        </div>

        <div className="collection-grid">
          {visibleCollections.map((collection, index) => (
            <article key={collection.slug} className="collection-card" data-reveal style={revealStyle(index)}>
              <div className="collection-card-head">
                <div>
                  <p className="collection-label">{collection.title}</p>
                  <h3>{collection.summary}</h3>
                </div>
                <span className="collection-count">{collection.visibleItems.length} items</span>
              </div>
              <Link className="btn btn-primary" to={`/products/${collection.slug}`}>
                Open collection
              </Link>
            </article>
          ))}
        </div>

        {normalizedQuery && !visibleCollections.length ? (
          <div className="collection-empty-state catalog-empty-state" data-reveal style={revealStyle(0)}>
            <strong>No products found.</strong>
            <span>Try another search term or clear filters.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ServicesIndexPage({ collections }) {
  const itemCount = collections.reduce((sum, collection) => sum + collection.items.length, 0);

  return (
    <section className="section page-section">
      <div className="container">
        <div className="index-hero">
          <div className="page-banner index-hero-copy" data-reveal>
            <p className="eyebrow">Services</p>
            <h1>Browse every service collection, then open a full item page for details.</h1>
            <p>Each service item has its own page with a visual, summary, overview, applications, and technical snapshot.</p>
          </div>
          <aside className="index-summary-card" data-reveal style={revealStyle(1)}>
            <p className="panel-label">Service catalog</p>
            <strong>{collections.length} collections</strong>
            <span>{itemCount} item pages across the service catalog.</span>
            <div className="index-summary-stats">
              <div>
                <strong>{collections.length}</strong>
                <span>Collections</span>
              </div>
              <div>
                <strong>{itemCount}</strong>
                <span>Item pages</span>
              </div>
            </div>
            <ul className="index-summary-list">
              <li>Structured for quick comparison and review.</li>
              <li>Simple paths from collection to item detail.</li>
              <li>Consistent layout with the products catalog.</li>
            </ul>
          </aside>
        </div>
        <div className="collection-grid">
            {collections.map((collection, index) => (
              <article key={collection.slug} className="collection-card" data-reveal style={revealStyle(index)}>
              <div className="collection-card-head">
                <div>
                  <p className="collection-label">{collection.title}</p>
                  <h3>{collection.summary}</h3>
                </div>
                <span className="collection-count">{collection.items.length} items</span>
              </div>
              <div className="collection-items">
                {collection.items.map((item) => (
                  <Link key={item.slug} to={`/services/${collection.slug}/${item.slug}`} className="collection-item-link">
                    <span>{item.title}</span>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                ))}
              </div>
              <Link className="btn btn-primary" to={`/services/${collection.slug}`}>
                Open collection
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionPage({ getCollection }) {
  const { collectionSlug } = useParams();
  const collection = getCollection(collectionSlug);
  const [query, setQuery] = useState('');
  const [quickViewSlug, setQuickViewSlug] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    setQuery('');
    setQuickViewSlug(null);
    setCompareIds([]);
    setCompareOpen(false);
  }, [collectionSlug]);

  const showcaseItems = useMemo(() => {
    if (!collection) return [];
    return collection.items.map((item, index) => ({
      ...item,
      ...getCollectionShowcaseMeta(item, index)
    }));
  }, [collection]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return showcaseItems.filter((item) => {
      const searchText = [
        item.title,
        item.summary,
        item.overview,
        item.collectionTitle,
        item.collectionSlug,
        item.deployment,
        item.compliance,
        ...(item.tags || []),
        ...(item.specs || []),
        ...(item.features || []),
        ...(item.applications || []),
        ...(item.standards || [])
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !normalizedQuery || searchText.includes(normalizedQuery);
      return matchesQuery;
    });
  }, [query, showcaseItems]);

  const visibleCount = visibleItems.length;
  const totalCount = showcaseItems.length;
  const activeQuery = query.trim();
  const quickViewItem = useMemo(() => showcaseItems.find((item) => item.slug === quickViewSlug) || null, [quickViewSlug, showcaseItems]);
  const compareItems = useMemo(() => showcaseItems.filter((item) => compareIds.includes(item.slug)), [compareIds, showcaseItems]);
  const comparisonItems = useMemo(() => showcaseItems.slice(0, 3), [showcaseItems]);
  const canCompare = compareItems.length >= 2;

  useEffect(() => {
    setCompareIds((current) => current.filter((slug) => showcaseItems.some((item) => item.slug === slug)));
  }, [showcaseItems]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!compareOpen && !quickViewItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [compareOpen, quickViewItem]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (compareOpen) {
          setCompareOpen(false);
        } else if (quickViewItem) {
          setQuickViewSlug(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [compareOpen, quickViewItem]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('.collection-dark-grid [data-reveal], .collection-dark-empty[data-reveal]')
    );
    if (!elements.length) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      elements.forEach((element) => element.classList.add('is-visible'));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [visibleItems, query, collectionSlug]);

  const handleQuickView = (slug) => setQuickViewSlug(slug);
  const handleToggleCompare = (slug) => {
    setCompareIds((current) => {
      if (current.includes(slug)) {
        return current.filter((id) => id !== slug);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, slug];
    });
  };

  if (!collection) return <Navigate to="/products" replace />;

  return (
    <section className="section page-section collection-page-dark">
      <div className="container collection-page-shell">
        <div className="breadcrumb collection-dark-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Collections</Link>
          <span>›</span>
          <span className="is-current">{collection.title}</span>
        </div>

        <div className="collection-dark-hero">
          <div className="collection-dark-hero-copy" data-reveal>
            <p className="collection-dark-eyebrow">Collection</p>
            <h1>{collection.title.toUpperCase()}</h1>
            <p className="collection-dark-description">{collection.summary}</p>
            <Link className="collection-dark-back" to="/products">
              ← Back to all collections
            </Link>
          </div>

          <aside className="collection-dark-hero-aside" data-reveal style={revealStyle(1)}>
            <div className="collection-dark-count-card">
              <p className="panel-label">Collection count</p>
              <strong>{collection.items.length}</strong>
              <span>items in this collection</span>
            </div>
          </aside>
        </div>

        <div className="collection-dark-toolbar" data-reveal style={revealStyle(2)}>
          <label className="collection-dark-search">
            <span>Search items...</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onInput={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search items..."
            />
          </label>
          <div className="collection-dark-toolbar-meta">
            <div className="collection-dark-filter-count" aria-live="polite">
              <strong>{visibleCount}</strong>
              <span>of {totalCount} items</span>
            </div>
            {activeQuery ? (
              <button type="button" className="btn btn-ghost collection-dark-clear" onClick={() => setQuery('')}>
                Clear search
              </button>
            ) : null}
          </div>
        </div>
        <div className="collection-dark-compare-row" data-reveal style={revealStyle(3)}>
          <div className="collection-dark-compare-list">
            {comparisonItems.map((item) => (
              <label key={item.slug} className="collection-dark-compare-chip">
                <input type="checkbox" checked={compareIds.includes(item.slug)} onChange={() => handleToggleCompare(item.slug)} />
                <span>
                  <strong>{item.title}</strong>
                </span>
              </label>
            ))}
          </div>
          {canCompare ? (
            <button className="btn collection-dark-compare-btn" type="button" onClick={() => setCompareOpen((open) => !open)}>
              {compareOpen ? 'Close compare' : 'Compare selected'}
            </button>
          ) : null}
        </div>

        {visibleItems.length ? (
          <div className="collection-dark-grid">
            {visibleItems.map((item, index) => (
              <CollectionProductCard
                key={item.slug}
                item={item}
                collectionSlug={collection.slug}
                meta={item}
                index={index}
                isVisible
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="collection-dark-empty" data-reveal style={revealStyle(0)}>
            <strong>No products found.</strong>
            <span>Try another search term or clear filters.</span>
          </div>
        )}

      </div>

      <CollectionQuickViewModal
        item={quickViewItem}
        collectionSlug={collection.slug}
        meta={quickViewItem}
        onClose={() => setQuickViewSlug(null)}
      />
      {compareOpen ? (
        <CollectionCompareModal
          items={compareItems}
          collectionSlug={collection.slug}
          onClose={() => setCompareOpen(false)}
        />
      ) : null}
    </section>
  );
}
function ServiceCollectionPage({ getCollection }) {
  const { collectionSlug } = useParams();
  const collection = getCollection(collectionSlug);

  if (!collection) return <Navigate to="/services" replace />;

  return (
    <section className="section page-section">
      <div className="container">
        <div className="detail-hero">
          <div data-reveal>
            <p className="eyebrow">Service collection</p>
            <h1>{collection.title}</h1>
            <p>{collection.summary}</p>
            <Link className="btn btn-ghost" to="/services">
              Back to all collections
            </Link>
          </div>
          <div className="detail-card" data-reveal style={revealStyle(1)}>
            <p className="panel-label">Collection count</p>
            <strong>{collection.items.length} item{collection.items.length === 1 ? '' : 's'}</strong>
            <span>Open any service item to see the image, scope, standards, and delivery detail.</span>
          </div>
        </div>
        <div className="product-grid page-product-grid">
          {collection.items.map((item, index) => (
            <article key={item.slug} className="product-card" data-reveal style={revealStyle(index)}>
              <img className="product-thumb" src={item.image} alt={item.title} />
              <div className="product-top">
                <span className="product-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </span>
                <span className="product-collection">{collection.title}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="specs">
                {item.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
              <Link className="btn btn-primary" to={`/services/${collection.slug}/${item.slug}`}>
                Open item page
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPage({ getCollection, getProduct, canonical }) {
  const { collectionSlug, productSlug } = useParams();
  const product = getProduct(productSlug);
  const collection = product ? getCollection(product.collectionSlug) : null;

  if (!product) return <Navigate to="/products" replace />;
  if (canonical && collection && collection.slug !== collectionSlug) {
    return <Navigate to={`/products/${collection.slug}/${product.slug}`} replace />;
  }

  const activeCollection = collection || getCollection(collectionSlug);

  return (
    <section className="section page-section">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products/${activeCollection.slug}`}>{activeCollection.title}</Link>
          <span>/</span>
          <span>{product.title}</span>
        </div>
        <div className="detail-hero">
          <div className="detail-image-wrap" data-reveal>
            <img className="detail-image" src={product.image} alt={product.title} />
          </div>
          <div className="detail-copy detail-copy--item" data-reveal style={revealStyle(1)}>
            <p className="eyebrow">Item page</p>
            <h1>{product.title}</h1>
            <p className="lead">{product.summary}</p>
            <div className="pill-row">
              {product.specs.map((spec) => (
                <span key={spec} className="pill">
                  {spec}
                </span>
              ))}
            </div>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/#contact">
                Request quote
              </Link>
              <Link className="btn btn-ghost" to={`/products/${activeCollection.slug}`}>
                More in this collection
              </Link>
            </div>
          </div>
        </div>

        <div className="detail-sections">
          <DetailIntroSection item={product} />
          <section className="detail-section" data-reveal>
            <h2>Overview</h2>
            <p>{product.overview}</p>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(1)}>
            <h2>Key features</h2>
            <div className="pill-row">
              {product.features.map((feature) => (
                <span key={feature} className="pill">
                  {feature}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(2)}>
            <h2>Applications</h2>
            <div className="pill-row">
              {product.applications.map((application) => (
                <span key={application} className="pill">
                  {application}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(3)}>
            <h2>Standards and compliance</h2>
            <div className="pill-row">
              {product.standards.map((standard) => (
                <span key={standard} className="pill">
                  {standard}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(4)}>
            <h2>Technical snapshot</h2>
            <div className="spec-rows">
              <div>
                <span>Deployment</span>
                <strong>{product.deployment}</strong>
              </div>
              <div>
                <span>Compliance</span>
                <strong>{product.compliance}</strong>
              </div>
              <div>
                <span>Lead time</span>
                <strong>{product.leadTime}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function ServicePage({ getCollection, getService }) {
  const { collectionSlug, serviceSlug } = useParams();
  const service = getService(serviceSlug);
  const collection = service ? getCollection(service.collectionSlug) : null;

  if (!service) return <Navigate to="/services" replace />;

  const activeCollection = collection || getCollection(collectionSlug);

  return (
    <section className="section page-section">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/services">Services</Link>
          <span>/</span>
          <Link to={`/services/${activeCollection.slug}`}>{activeCollection.title}</Link>
          <span>/</span>
          <span>{service.title}</span>
        </div>
        <div className="detail-hero">
          <div className="detail-image-wrap" data-reveal>
            <img className="detail-image" src={service.image} alt={service.title} />
          </div>
          <div className="detail-copy detail-copy--item" data-reveal style={revealStyle(1)}>
            <p className="eyebrow">Service page</p>
            <h1>{service.title}</h1>
            <p className="lead">{service.summary}</p>
            <div className="pill-row">
              {service.specs.map((spec) => (
                <span key={spec} className="pill">
                  {spec}
                </span>
              ))}
            </div>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/#contact">
                Request quote
              </Link>
              <Link className="btn btn-ghost" to={`/services/${activeCollection.slug}`}>
                More in this collection
              </Link>
            </div>
          </div>
        </div>

        <div className="detail-sections">
          <DetailIntroSection item={service} />
          <section className="detail-section" data-reveal>
            <h2>Overview</h2>
            <p>{service.overview}</p>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(1)}>
            <h2>Key features</h2>
            <div className="pill-row">
              {service.features.map((feature) => (
                <span key={feature} className="pill">
                  {feature}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(2)}>
            <h2>Applications</h2>
            <div className="pill-row">
              {service.applications.map((application) => (
                <span key={application} className="pill">
                  {application}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(3)}>
            <h2>Standards and compliance</h2>
            <div className="pill-row">
              {service.standards.map((standard) => (
                <span key={standard} className="pill">
                  {standard}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(4)}>
            <h2>Technical snapshot</h2>
            <div className="spec-rows">
              <div>
                <span>Deployment</span>
                <strong>{service.deployment}</strong>
              </div>
              <div>
                <span>Compliance</span>
                <strong>{service.compliance}</strong>
              </div>
              <div>
                <span>Lead time</span>
                <strong>{service.leadTime}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function IndustryPage({ getCollection, getIndustry }) {
  const { collectionSlug, industrySlug } = useParams();
  const industry = getIndustry(industrySlug);
  const collection = industry ? getCollection(industry.collectionSlug) : null;

  if (!industry) return <Navigate to="/industries" replace />;

  const activeCollection = collection || getCollection(collectionSlug);

  return (
    <section className="section page-section">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/industries">Industries</Link>
          <span>/</span>
          <Link to={`/industries/${activeCollection.slug}`}>{activeCollection.title}</Link>
          <span>/</span>
          <span>{industry.title}</span>
        </div>
        <div className="detail-hero">
          <div className="detail-image-wrap" data-reveal>
            <img className="detail-image" src={industry.image} alt={industry.title} />
          </div>
          <div className="detail-copy detail-copy--item" data-reveal style={revealStyle(1)}>
            <p className="eyebrow">Industry page</p>
            <h1>{industry.title}</h1>
            <p className="lead">{industry.summary}</p>
            <div className="pill-row">
              {industry.specs.map((spec) => (
                <span key={spec} className="pill">
                  {spec}
                </span>
              ))}
            </div>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/#contact">
                Request quote
              </Link>
              <Link className="btn btn-ghost" to={`/industries/${activeCollection.slug}`}>
                More in this collection
              </Link>
            </div>
          </div>
        </div>

        <div className="detail-sections">
          <DetailIntroSection item={industry} />
          <section className="detail-section" data-reveal>
            <h2>Overview</h2>
            <p>{industry.overview}</p>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(1)}>
            <h2>Key features</h2>
            <div className="pill-row">
              {industry.features.map((feature) => (
                <span key={feature} className="pill">
                  {feature}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(2)}>
            <h2>Applications</h2>
            <div className="pill-row">
              {industry.applications.map((application) => (
                <span key={application} className="pill">
                  {application}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(3)}>
            <h2>Standards and compliance</h2>
            <div className="pill-row">
              {industry.standards.map((standard) => (
                <span key={standard} className="pill">
                  {standard}
                </span>
              ))}
            </div>
          </section>
          <section className="detail-section" data-reveal style={revealStyle(4)}>
            <h2>Technical snapshot</h2>
            <div className="spec-rows">
              <div>
                <span>Deployment</span>
                <strong>{industry.deployment}</strong>
              </div>
              <div>
                <span>Compliance</span>
                <strong>{industry.compliance}</strong>
              </div>
              <div>
                <span>Lead time</span>
                <strong>{industry.leadTime}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function IndustriesIndexPage({ collections }) {
  return (
    <section className="section page-section">
      <div className="container">
        <div className="page-banner" data-reveal>
          <p className="eyebrow">Industries</p>
          <h1>Browse every industry collection, then open an item page for detailed guidance.</h1>
          <p>Each industry item includes an image, overview, features, standards, applications, and deployment notes.</p>
        </div>
        <div className="collection-grid">
          {collections.map((collection, index) => (
            <article key={collection.slug} className="collection-card" data-reveal style={revealStyle(index)}>
              <div>
                <p className="collection-label">{collection.title}</p>
                <h3>{collection.summary}</h3>
              </div>
              <div className="collection-items">
                {collection.items.map((item) => (
                  <Link key={item.slug} to={`/industries/${collection.slug}/${item.slug}`} className="collection-item-link">
                    <span>{item.title}</span>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                ))}
              </div>
              <Link className="btn btn-primary" to={`/industries/${collection.slug}`}>
                Open collection
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCollectionPage({ getCollection }) {
  const { collectionSlug } = useParams();
  const collection = getCollection(collectionSlug);

  if (!collection) return <Navigate to="/industries" replace />;

  return (
    <section className="section page-section">
      <div className="container">
        <div className="detail-hero">
          <div data-reveal>
            <p className="eyebrow">Industry collection</p>
            <h1>{collection.title}</h1>
            <p>{collection.summary}</p>
            <Link className="btn btn-ghost" to="/industries">
              Back to all collections
            </Link>
          </div>
          <div className="detail-card" data-reveal style={revealStyle(1)}>
            <p className="panel-label">Collection count</p>
            <strong>{collection.items.length} item{collection.items.length === 1 ? '' : 's'}</strong>
            <span>Open any industry item to see the image, workflow, standards, and deployment context.</span>
          </div>
        </div>
        <div className="product-grid page-product-grid">
          {collection.items.map((item, index) => (
            <article key={item.slug} className="product-card" data-reveal style={revealStyle(index)}>
              <img className="product-thumb" src={item.image} alt={item.title} />
              <div className="product-top">
                <span className="product-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </span>
                <span className="product-collection">{collection.title}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="specs">
                {item.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
              <Link className="btn btn-primary" to={`/industries/${collection.slug}/${item.slug}`}>
                Open item page
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">
                <i className="fa-solid fa-shield-halved" />
              </span>
              <span>
                <strong>FIREGUARD</strong>
                <small>Safety Solutions</small>
              </span>
            </Link>
            <p>
              Premium fire protection systems, industrial safety equipment, and emergency response for mission-critical
              facilities.
            </p>
            <div className="footer-badges" aria-label="Capabilities">
              <span>24/7 emergency response</span>
              <span>Compliance-ready support</span>
              <span>Critical infrastructure focus</span>
            </div>
            <div className="footer-actions">
              <Link className="btn btn-primary" to="/products">
                Browse products
              </Link>
              <Link className="btn btn-ghost" to="/#contact">
                Contact us
              </Link>
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <h4>Explore</h4>
            <Link to="/products">Products</Link>
            <Link to="/services">Services</Link>
            <Link to="/industries">Industries</Link>
            <Link to="/#assessment">Assessment</Link>
            <Link to="/#contact">Contact</Link>
          </nav>

          <div className="footer-contact">
            <h4>Contact</h4>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:contact@fireguardsafetysolutions.example.com">contact@fireguardsafetysolutions.example.com</a>
            <p>C-801, Neelkanth Business Park, Vidyavihar West, Mumbai, Maharashtra 400086.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2026 FireGuard Safety Solutions. All rights reserved.</p>
          <div className="footer-meta">
            <span>Enterprise-ready</span>
            <span>Fast response</span>
            <span>Trusted protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;

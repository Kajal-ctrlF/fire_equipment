const svgImage = (title, subtitle, from, to) => {
  const palette = ['#780000', '#c1121f', '#fdf0d5', '#003049', '#669bbc'];
  const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const paletteIndex = hash % (palette.length - 1);
  const start = palette[paletteIndex];
  const end = palette[paletteIndex + 1];
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${title}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${start}" />
        <stop offset="100%" stop-color="${end}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#fdf0d5" stop-opacity="0.96" />
        <stop offset="100%" stop-color="#fdf0d5" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" rx="48" />
    <circle cx="930" cy="180" r="200" fill="url(#glow)" opacity="0.18" />
    <circle cx="250" cy="640" r="260" fill="#fdf0d5" opacity="0.08" />
    <path d="M110 585 C 250 440, 360 430, 500 520 S 810 690, 1010 480" fill="none" stroke="#fdf0d5" stroke-opacity="0.28" stroke-width="26" stroke-linecap="round" />
    <path d="M160 260 C 280 170, 430 160, 560 250 S 820 420, 1040 260" fill="none" stroke="#669bbc" stroke-opacity="0.2" stroke-width="18" stroke-linecap="round" />
    <g transform="translate(84 88)">
      <rect width="240" height="240" rx="52" fill="#fdf0d5" fill-opacity="0.14" stroke="#fdf0d5" stroke-opacity="0.18" />
      <text x="120" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="84" font-weight="700" fill="#fdf0d5">${title
        .split(' ')
        .map((word) => word[0])
        .join('')}</text>
    </g>
    <text x="84" y="710" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#fdf0d5">${title}</text>
    <text x="84" y="756" font-family="Arial, sans-serif" font-size="24" fill="#fdf0d5" fill-opacity="0.88">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const metrics = [
  { label: 'Years experience', value: '25+' },
  { label: 'Projects completed', value: '10,000+' },
  { label: 'Clients served', value: '5,000+' },
  { label: 'Safety compliance', value: '99.9%' },
  { label: 'Emergency support', value: '24/7' }
];

export const collections = [
  {
    slug: 'fire-detection',
    title: 'Fire Detection',
    summary: 'Fire alarm panels, detectors, and notification devices built for early warning and clear control.'
  },
  {
    slug: 'fire-suppression',
    title: 'Fire Suppression',
    summary: 'Portable and fixed suppression systems designed to stop fire fast across mixed-risk spaces.'
  },
  {
    slug: 'hydrant-systems',
    title: 'Hydrant Systems',
    summary: 'Hydrants, hose reels, and water delivery systems arranged for dependable manual response.'
  },
  {
    slug: 'life-safety',
    title: 'Life Safety',
    summary: 'Exit lighting and safety signage that guide evacuation with clear, visible direction.'
  },
  {
    slug: 'ppe-safety',
    title: 'PPE & Safety Gear',
    summary: 'Protective equipment for maintenance teams, responders, and controlled site operations.'
  }
];

export const products = [
  {
    id: 'fire-extinguishers',
    slug: 'fire-extinguishers',
    collectionSlug: 'fire-suppression',
    collectionTitle: 'Fire Suppression',
    title: 'Fire Extinguishers',
    icon: 'fa-fire-extinguisher',
    summary: 'Portable extinguishers sized for first-response use in offices, plants, and service areas.',
    overview:
      'Portable extinguishers are the first line of defense in many facilities. We supply commercial-grade units selected for the right hazard class, response time, and maintenance cycle.',
    specs: ['IS 15683', 'Portable', 'Service-ready'],
    features: ['Quick deployment', 'Multiple agent types', 'Inspection-friendly design', 'Commercial and industrial use'],
    applications: ['Offices', 'Warehouses', 'Manufacturing lines', 'Service corridors'],
    standards: ['IS / NFPA aligned', 'Local fire code ready'],
    deployment: 'Offices, warehouses, plants',
    compliance: 'IS / NFPA aligned',
    leadTime: '2-4 days',
    image: 'https://www.kanexfire.com/images/home/extinguisher-accessories.webp'
  },
  {
    id: 'fire-alarm-systems',
    slug: 'fire-alarm-systems',
    collectionSlug: 'fire-detection',
    collectionTitle: 'Fire Detection',
    title: 'Fire Alarm Systems',
    icon: 'fa-satellite-dish',
    summary: 'Alarm panels, call points, sounders, and strobes for early-warning building protection.',
    overview:
      'Microprocessor-based fire alarm systems from economical multi-zone conventional panels to expandable addressable FACPs with LCD diagnostics, event logging and network integration capability. Systems are configured for compliance with IS 2189 and NFPA 72 topologies. FireShield supplies panels, manual call points, sounders, strobes and interface modules with commissioning support and annual maintenance contracts.',
    specs: ['Addressable', 'Zone mapping', 'Panel integration'],
    features: ['Addressable & conventional FACPs', 'Manual call points & sounders', 'LCD event display', 'BMS integration ready', 'Strobe beacons for noisy areas', 'Commissioning & AMC'],
    applications: ['Smart buildings', 'Hospitals & clinics', 'Shopping malls', 'IT parks & data centres', 'Hotels & airports', 'Educational campuses'],
    standards: ['IS 2189', 'NFPA 72', 'EN 54', 'CE options'],
    deployment: 'Smart buildings, hospitals, campuses',
    compliance: 'NFPA 72',
    leadTime: '1-3 weeks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fire_alarm_control_panel_VERS-PK_2.jpg/960px-Fire_alarm_control_panel_VERS-PK_2.jpg'
  },
  {
    id: 'smoke-detectors',
    slug: 'smoke-detectors',
    collectionSlug: 'fire-detection',
    collectionTitle: 'Fire Detection',
    title: 'Smoke Detectors',
    icon: 'fa-wind',
    summary: 'Ceiling-mounted smoke detectors chosen for fast warning and low false-alarm performance.',
    overview:
      'Spot-type fire detectors for ceiling-mounted automatic detection - photoelectric units for smouldering fires, ionization models for fast-flaming events, and multi-sensor devices combining smoke and heat sensing with false-alarm immunity. Correct detector selection is critical for each space type. FireShield supplies compatible mounting bases, sounder bases, isolator bases and test equipment for new builds, retrofits and phased upgrades.',
    specs: ['Photoelectric', 'Multi-sensor', 'Low false alarms'],
    features: ['Photoelectric & ionization types', 'Multi-sensor smoke + heat', 'Addressable bases with isolator', 'Drift compensation', 'Low-profile ceiling mount', 'Reduced false-alarm design'],
    applications: ['Server rooms', 'Office floors', 'Hotel guest rooms', 'Kitchen-adjacent areas', 'Warehouse aisles', 'Clean room facilities'],
    standards: ['IS 2175', 'UL 268', 'EN 54-7', 'EN 54-5'],
    deployment: 'Server rooms, office floors, critical spaces',
    compliance: 'IS 2175 / UL 268',
    leadTime: '1-2 weeks',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Schneider_Electric_smoke_detector.JPG/960px-Schneider_Electric_smoke_detector.JPG'
  },
  {
    id: 'fire-hydrants',
    slug: 'fire-hydrants',
    collectionSlug: 'hydrant-systems',
    collectionTitle: 'Hydrant Systems',
    title: 'Fire Hydrants',
    icon: 'fa-faucet-drip',
    summary: 'Hydrant points, hose cabinets, and valves set up for dependable water-based response.',
    overview:
      'Hydrant systems create a dependable water-based response layer around your campus. We engineer the layout, pressure planning, and support accessories for reliability under pressure.',
    specs: ['Pressure-rated', 'Campus scale', 'Durable'],
    features: ['High-pressure response', 'Outdoor durability', 'Networked coverage', 'Maintenance planning'],
    applications: ['Industrial campuses', 'Logistics hubs', 'Plant perimeters', 'Utility blocks'],
    standards: ['Local fire code', 'Authority approvals'],
    deployment: 'Industrial campuses, logistics hubs',
    compliance: 'Local fire code',
    leadTime: '2-6 weeks',
    image: 'https://www.kanexfire.com/images/home/Fire_1.jpg'
  },
  {
    id: 'sprinkler-systems',
    slug: 'sprinkler-systems',
    collectionSlug: 'fire-suppression',
    collectionTitle: 'Fire Suppression',
    title: 'Sprinkler Systems',
    icon: 'fa-spray-can-sparkles',
    summary: 'Sprinkler layouts designed for automatic discharge across warehouses and production areas.',
    overview:
      'Sprinkler systems are designed for automatic response and broad-area suppression. We tailor layouts and flow logic for the building risk profile and occupancy pattern.',
    specs: ['Wet / Dry', 'Pre-action', 'Risk-based'],
    features: ['Automatic discharge', 'Zone-specific design', 'Scalable coverage', 'Risk-driven engineering'],
    applications: ['Warehouses', 'High-rise buildings', 'Factories', 'Storage yards'],
    standards: ['NFPA 13', 'Fire authority guidelines'],
    deployment: 'Warehouses, high-rise, factories',
    compliance: 'NFPA 13',
    leadTime: '3-8 weeks',
    image: 'https://www.kanexfire.com/images/home/Fire_2.jpg'
  },
  {
    id: 'hose-reels',
    slug: 'hose-reels',
    collectionSlug: 'hydrant-systems',
    collectionTitle: 'Hydrant Systems',
    title: 'Fire Hose Reels',
    icon: 'fa-braille',
    summary: 'Wall-mounted hose reels placed for quick manual suppression and easy access.',
    overview:
      'Hose reels provide a quick manual water response for growing incidents. We place them for reach, accessibility, and easy maintenance in high-traffic environments.',
    specs: ['Wall-mounted', 'Easy access', 'Long reach'],
    features: ['Immediate access', 'Compact footprint', 'Durable hose assembly', 'Facility coverage support'],
    applications: ['Commercial buildings', 'Lobbies', 'Service floors', 'Hallways'],
    standards: ['Site standard', 'Fire authority recommendations'],
    deployment: 'Commercial buildings, lobbies',
    compliance: 'Site standard',
    leadTime: '1-2 weeks',
    image: 'https://www.kanexfire.com/images/home/Fire_3.webp'
  },
  {
    id: 'emergency-exit-lights',
    slug: 'emergency-exit-lights',
    collectionSlug: 'life-safety',
    collectionTitle: 'Life Safety',
    title: 'Emergency Exit Lights',
    icon: 'fa-person-walking-arrow-right',
    summary: 'Exit lights and directional units that keep evacuation routes visible in low light.',
    overview:
      'Exit lights support safe evacuation under low visibility conditions. We pair the right form factor with standby runtime, mounting strategy, and route planning.',
    specs: ['Battery backup', 'LED', 'Low-maintenance'],
    features: ['Long battery life', 'High visibility', 'Directional guidance', 'Low power use'],
    applications: ['All occupancy types', 'Staircases', 'Corridors', 'Exit routes'],
    standards: ['Life safety code', 'Emergency preparedness guidelines'],
    deployment: 'All occupancy types',
    compliance: 'Life safety code',
    leadTime: '1 week',
    image: 'https://www.kanexfire.com/images/home/Office-new.webp'
  },
  {
    id: 'safety-signage',
    slug: 'safety-signage',
    collectionSlug: 'life-safety',
    collectionTitle: 'Life Safety',
    title: 'Safety Signage',
    icon: 'fa-signs-post',
    summary: 'Durable safety signs built for clear hazard communication and route marking.',
    overview:
      'Safety signage helps occupants navigate hazards and evacuation routes with confidence. Our signage plans balance durability, compliance, and clear communication.',
    specs: ['Photoluminescent', 'Durable', 'Customizable'],
    features: ['Clear hazard communication', 'Custom placement', 'Long-life material', 'Easy installation'],
    applications: ['Workplaces', 'Corridors', 'Exits', 'Hazard zones'],
    standards: ['OSHA / local code', 'Facility safety procedures'],
    deployment: 'Workplaces, corridors, exits',
    compliance: 'OSHA / local code',
    leadTime: '1-2 weeks',
    image: 'https://www.kanexfire.com/images/home/Home-new.webp'
  },
  {
    id: 'ppe-equipment',
    slug: 'ppe-equipment',
    collectionSlug: 'ppe-safety',
    collectionTitle: 'PPE & Safety Gear',
    title: 'PPE Equipment',
    icon: 'fa-helmet-safety',
    summary: 'Helmets, gloves, and protective gear selected for maintenance and response teams.',
    overview:
      'PPE is the operational shield for maintenance crews and emergency response teams. We supply gear chosen for comfort, compliance, and real-world workability.',
    specs: ['Industrial grade', 'Fit tested', 'Protocol ready'],
    features: ['Team protection', 'Worksite-ready', 'Protocol-compliant', 'Comfort-focused'],
    applications: ['Maintenance teams', 'Responders', 'Safety drills', 'High-risk work zones'],
    standards: ['OSHA', 'Site safety protocol'],
    deployment: 'Maintenance teams, responders',
    compliance: 'OSHA',
    leadTime: '2-4 days',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  },
  {
    id: 'gas-suppression-systems',
    slug: 'gas-suppression-systems',
    collectionSlug: 'fire-suppression',
    collectionTitle: 'Fire Suppression',
    title: 'Gas Suppression Systems',
    icon: 'fa-gas-pump',
    summary: 'Clean-agent systems for server rooms, archives, and other sensitive assets.',
    overview:
      'Gas suppression protects high-value assets where water-based response is risky. We design clean-agent systems for rapid discharge, safe occupancy recovery, and equipment preservation.',
    specs: ['Clean agent', 'Critical assets', 'Fast discharge'],
    features: ['Asset protection', 'Low residue', 'Rapid discharge', 'Mission-critical fit'],
    applications: ['Data centers', 'Control rooms', 'Archives', 'Telecom spaces'],
    standards: ['NFPA 2001', 'Authority approval'],
    deployment: 'Data centers, control rooms',
    compliance: 'NFPA 2001',
    leadTime: '3-8 weeks',
    image: 'https://www.kanexfire.com/images/home/Server-room-new.jpg'
  }
];

export const serviceCollections = [
  {
    slug: 'consulting-planning',
    title: 'Consulting & Planning',
    summary: 'Site surveys, risk reviews, and response planning that shape the safety strategy.'
  },
  {
    slug: 'engineering-design',
    title: 'Engineering & Design',
    summary: 'System layouts and technical documentation for new builds, upgrades, and approvals.'
  },
  {
    slug: 'delivery-compliance',
    title: 'Delivery & Compliance',
    summary: 'Installation, audits, and certification steps that keep delivery moving cleanly.'
  },
  {
    slug: 'maintenance-readiness',
    title: 'Maintenance & Readiness',
    summary: 'Service contracts, drills, and training that keep systems ready every day.'
  }
];

export const serviceItems = [
  {
    id: 'fire-safety-consultation',
    slug: 'fire-safety-consultation',
    collectionSlug: 'consulting-planning',
    collectionTitle: 'Consulting & Planning',
    title: 'Fire Safety Consultation',
    icon: 'fa-comments',
    summary: 'On-site risk mapping and planning that shape a practical fire protection strategy.',
    overview:
      'Fire safety consultation helps leadership teams understand the current safety posture of a building or campus. We assess occupancy, hazards, response pathways, and improvement priorities before any major investment is made.',
    specs: ['Site survey', 'Risk mapping', 'Action plan'],
    features: ['Inspection-led review', 'Code-aware recommendations', 'Budget prioritization', 'Executive summary deliverables'],
    applications: ['Factories', 'Hospitals', 'Hotels', 'Campuses'],
    standards: ['NFPA 101', 'Local fire code'],
    deployment: 'On-site review and reporting',
    compliance: 'Code aligned',
    leadTime: '2-5 days',
    image: 'https://www.kanexfire.com/images/home/Office-new.webp'
  },
  {
    id: 'emergency-planning',
    slug: 'emergency-planning',
    collectionSlug: 'consulting-planning',
    collectionTitle: 'Consulting & Planning',
    title: 'Emergency Planning',
    icon: 'fa-route',
    summary: 'Evacuation planning and incident response playbooks for occupied facilities.',
    overview:
      'Emergency planning creates a clear response structure for fire, evacuation, and post-incident coordination. We define routes, responsibilities, communication flow, and drill requirements for each facility type.',
    specs: ['Evacuation routes', 'Drill plan', 'Crisis roles'],
    features: ['Clear response playbooks', 'Floor-wise route mapping', 'Communication hierarchy', 'Drill documentation'],
    applications: ['Offices', 'Schools', 'Retail spaces', 'Multi-floor sites'],
    standards: ['Life safety code', 'Preparedness procedures'],
    deployment: 'Floor-wise planning package',
    compliance: 'Life safety aligned',
    leadTime: '3-7 days',
    image: 'https://www.kanexfire.com/images/home/Home-new.webp'
  },
  {
    id: 'fire-system-design',
    slug: 'fire-system-design',
    collectionSlug: 'engineering-design',
    collectionTitle: 'Engineering & Design',
    title: 'Fire System Design',
    icon: 'fa-drafting-compass',
    summary: 'Detailed system layouts prepared for approval, coordination, and execution.',
    overview:
      'Fire system design turns risk findings into engineered layouts for detection, suppression, and evacuation coverage. We prepare system plans, device placement logic, and technical notes that support approvals and execution.',
    specs: ['Layouts', 'Calculations', 'Approvals'],
    features: ['Risk-driven layouts', 'Device zoning', 'Documentation support', 'Implementation-ready plans'],
    applications: ['New builds', 'Retrofits', 'Mep coordination', 'Capital projects'],
    standards: ['NFPA 13', 'NFPA 72'],
    deployment: 'Design package and documentation',
    compliance: 'Approval ready',
    leadTime: '1-3 weeks',
    image: 'https://www.kanexfire.com/images/home/Electical-Panel-new.jpg'
  },
  {
    id: 'fire-audits',
    slug: 'fire-audits',
    collectionSlug: 'engineering-design',
    collectionTitle: 'Engineering & Design',
    title: 'Fire Audits',
    icon: 'fa-clipboard-check',
    summary: 'Inspection and gap analysis that turn findings into a corrective action plan.',
    overview:
      'Fire audits review the current installation and operating status of a facility against the expected safety standard. We identify gaps, document corrective actions, and prepare leadership teams for the next phase of remediation.',
    specs: ['Inspection', 'Gap analysis', 'Action list'],
    features: ['Evidence-backed findings', 'Remediation priorities', 'Compliance notes', 'Management reporting'],
    applications: ['Plants', 'Warehouses', 'Hospitals', 'Commercial towers'],
    standards: ['NFPA review', 'Authority checklist'],
    deployment: 'Audit report and corrective roadmap',
    compliance: 'Review ready',
    leadTime: '2-4 days',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  },
  {
    id: 'equipment-installation',
    slug: 'equipment-installation',
    collectionSlug: 'delivery-compliance',
    collectionTitle: 'Delivery & Compliance',
    title: 'Equipment Installation',
    icon: 'fa-screwdriver-wrench',
    summary: 'Professional installation and commissioning of fire safety equipment on site.',
    overview:
      'Equipment installation covers the physical setup, testing, and commissioning of fire safety equipment. We coordinate execution to ensure systems are installed cleanly, verified properly, and handed over in working condition.',
    specs: ['Install', 'Test', 'Commission'],
    features: ['Controlled execution', 'Commissioning checks', 'Site coordination', 'Handover support'],
    applications: ['Fresh installations', 'System upgrades', 'Tenant fit-outs', 'Refits'],
    standards: ['Manufacturer spec', 'Authority inspection'],
    deployment: 'Project-based installation',
    compliance: 'Commissioned and documented',
    leadTime: '1-4 weeks',
    image: 'https://www.kanexfire.com/images/home/Fire_4.webp'
  },
  {
    id: 'compliance-certification',
    slug: 'compliance-certification',
    collectionSlug: 'delivery-compliance',
    collectionTitle: 'Delivery & Compliance',
    title: 'Compliance Certification',
    icon: 'fa-certificate',
    summary: 'Testing and documentation support prepared for authority review and sign-off.',
    overview:
      'Compliance certification organizes the records, test results, and approvals needed to demonstrate that the system meets the required standard. We prepare the paperwork and evidence trail so audits and authority reviews are smoother.',
    specs: ['Documentation', 'Test records', 'Certification'],
    features: ['Authority-ready packs', 'Testing evidence', 'Clear record keeping', 'Closure support'],
    applications: ['New assets', 'Renewals', 'Audit closures', 'Regulatory filings'],
    standards: ['Local authority', 'Fire safety code'],
    deployment: 'Documentation and approvals workflow',
    compliance: 'Certification support',
    leadTime: '3-10 days',
    image: 'https://www.kanexfire.com/images/home/Office-new.webp'
  },
  {
    id: 'annual-maintenance-contracts',
    slug: 'annual-maintenance-contracts',
    collectionSlug: 'maintenance-readiness',
    collectionTitle: 'Maintenance & Readiness',
    title: 'Annual Maintenance Contracts',
    icon: 'fa-calendar-check',
    summary: 'Scheduled service programs that preserve reliability and reduce surprises.',
    overview:
      'Annual maintenance contracts keep safety systems functional and ready across the year. We schedule inspections, replacements, and reporting so owners can track service history and reduce surprise failures.',
    specs: ['Scheduled visits', 'Spare parts', 'Reports'],
    features: ['Preventive service', 'Service logs', 'Priority support', 'Lifecycle planning'],
    applications: ['All facility types', 'Critical systems', 'Distributed sites', 'Managed campuses'],
    standards: ['Maintenance protocol', 'Vendor schedule'],
    deployment: 'Monthly or quarterly service plan',
    compliance: 'Service documented',
    leadTime: 'Immediate setup',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  },
  {
    id: 'fire-safety-training',
    slug: 'fire-safety-training',
    collectionSlug: 'maintenance-readiness',
    collectionTitle: 'Maintenance & Readiness',
    title: 'Fire Safety Training',
    icon: 'fa-person-chalkboard',
    summary: 'Drills and role-based training for occupants, wardens, and response teams.',
    overview:
      'Fire safety training teaches teams how to identify risks, use first-response equipment, and move calmly during an emergency. We tailor the content for occupants, wardens, and operational staff.',
    specs: ['Drills', 'Team training', 'Response roles'],
    features: ['Interactive sessions', 'Role-based guidance', 'Practical drills', 'Training records'],
    applications: ['Offices', 'Schools', 'Warehouses', 'Corporate campuses'],
    standards: ['Site safety policy', 'Preparedness plan'],
    deployment: 'On-site training program',
    compliance: 'Training documented',
    leadTime: '2-7 days',
    image: 'https://www.kanexfire.com/images/home/School-new.webp'
  }
];

export const industryCollections = [
  {
    slug: 'industrial-manufacturing',
    title: 'Industrial & Manufacturing',
    summary: 'Production floors, plants, and process areas that need dependable fire protection.'
  },
  {
    slug: 'healthcare-critical-care',
    title: 'Healthcare & Critical Care',
    summary: 'Hospitals, clinics, and care environments with strict life-safety requirements.'
  },
  {
    slug: 'commercial-public-spaces',
    title: 'Commercial & Public Spaces',
    summary: 'Offices, retail, hospitality, and education spaces with high-occupancy risk.'
  },
  {
    slug: 'technology-logistics',
    title: 'Technology & Logistics',
    summary: 'Data centers, warehouses, and logistics hubs that depend on uptime and control.'
  }
];

export const industryItems = [
  {
    id: 'factories',
    slug: 'factories',
    collectionSlug: 'industrial-manufacturing',
    collectionTitle: 'Industrial & Manufacturing',
    title: 'Factories',
    icon: 'fa-industry',
    summary: 'Protection tailored for production floors, machinery zones, and process spaces.',
    overview:
      'Factories need robust fire detection, suppression, and evacuation planning because ignition sources, fuel loads, and machinery risks often sit close together. We tailor layouts for production flow and maintenance access.',
    specs: ['Process risk', 'Heavy equipment', 'Shift based'],
    features: ['Zone-specific coverage', 'Equipment-safe suppression options', 'Maintenance access planning', 'Operational continuity support'],
    applications: ['Assembly lines', 'Process plants', 'Machine rooms', 'Workshops'],
    standards: ['NFPA 13', 'NFPA 72'],
    deployment: 'Plant-wide fire safety planning',
    compliance: 'Industrial code aligned',
    leadTime: '1-4 weeks',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  },
  {
    id: 'warehouses',
    slug: 'warehouses',
    collectionSlug: 'industrial-manufacturing',
    collectionTitle: 'Industrial & Manufacturing',
    title: 'Warehouses',
    icon: 'fa-warehouse',
    summary: 'Storage-area protection shaped around racking, inventory, and open spans.',
    overview:
      'Warehouses require careful sprinkler design, access planning, and smoke management because of high ceilings and large combustible volumes. We engineer systems around racking layouts and stored goods profile.',
    specs: ['High rack storage', 'Large span', 'Inventory risk'],
    features: ['Sprinkler zoning', 'Aisle and rack planning', 'Response access support', 'Stored commodity analysis'],
    applications: ['Distribution centers', 'Storage yards', 'Fulfilment hubs', 'Cold stores'],
    standards: ['NFPA 13', 'Authority warehouse guidelines'],
    deployment: 'Storage-focused protection plan',
    compliance: 'Warehouse ready',
    leadTime: '2-6 weeks',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  },
  {
    id: 'hospitals',
    slug: 'hospitals',
    collectionSlug: 'healthcare-critical-care',
    collectionTitle: 'Healthcare & Critical Care',
    title: 'Hospitals',
    icon: 'fa-hospital',
    summary: 'Life-safety systems that support patient care, evacuation, and continuity.',
    overview:
      'Hospitals combine occupancy risk, patient mobility concerns, and critical equipment dependencies. We plan detection and evacuation systems to support phased response and sensitive care zones.',
    specs: ['Patient safety', 'Phased evacuation', 'Critical systems'],
    features: ['Low-disruption planning', 'Alarm zoning', 'Critical room protection', 'Operational continuity emphasis'],
    applications: ['Hospitals', 'Medical centers', 'Clinics', 'Recovery wards'],
    standards: ['NFPA 101', 'Healthcare fire code'],
    deployment: 'Care-area tailored planning',
    compliance: 'Healthcare aligned',
    leadTime: '2-5 weeks',
    image: 'https://www.kanexfire.com/images/home/Hospital-new.webp'
  },
  {
    id: 'clinics',
    slug: 'clinics',
    collectionSlug: 'healthcare-critical-care',
    collectionTitle: 'Healthcare & Critical Care',
    title: 'Clinics',
    icon: 'fa-stethoscope',
    summary: 'Compact medical environments with simple, efficient evacuation support.',
    overview:
      'Clinics need practical systems that are easy to maintain yet rigorous enough to protect patients and staff. We design simple, reliable protection packages for smaller healthcare facilities.',
    specs: ['Compact spaces', 'Patient flow', 'Easy maintenance'],
    features: ['Simple zoning', 'Clear exit paths', 'Low-disruption installs', 'Service-friendly design'],
    applications: ['Outpatient centers', 'Dental clinics', 'Physiotherapy units', 'Diagnostic suites'],
    standards: ['Local health code', 'Life safety basics'],
    deployment: 'Small facility protection package',
    compliance: 'Clinic ready',
    leadTime: '1-3 weeks',
    image: 'https://www.kanexfire.com/images/home/Office-new.webp'
  },
  {
    id: 'offices',
    slug: 'offices',
    collectionSlug: 'commercial-public-spaces',
    collectionTitle: 'Commercial & Public Spaces',
    title: 'Offices',
    icon: 'fa-building',
    summary: 'Balanced fire safety for workplaces, meeting rooms, and shared amenities.',
    overview:
      'Office buildings need well-planned alarm, exit, and suppression coverage that supports daily work without becoming operationally intrusive. We balance aesthetics, compliance, and occupant safety.',
    specs: ['Shared workspaces', 'Multi-floor', 'Occupant focused'],
    features: ['Aesthetic integration', 'Reliable evacuation', 'Audit support', 'Tenant-friendly delivery'],
    applications: ['Corporate offices', 'Co-working hubs', 'Business parks', 'Admin blocks'],
    standards: ['Life safety code', 'Local fire code'],
    deployment: 'Office tower planning',
    compliance: 'Commercial ready',
    leadTime: '1-4 weeks',
    image: 'https://www.kanexfire.com/images/home/Office-new.webp'
  },
  {
    id: 'retail-spaces',
    slug: 'retail-spaces',
    collectionSlug: 'commercial-public-spaces',
    collectionTitle: 'Commercial & Public Spaces',
    title: 'Retail Spaces',
    icon: 'fa-store',
    summary: 'Customer-facing safety systems built for open floors and foot traffic.',
    overview:
      'Retail spaces require discreet but dependable protection because customer experience and evacuation clarity both matter. We configure systems to protect merchandise and support safe movement.',
    specs: ['Foot traffic', 'Visible exits', 'Merchandise risk'],
    features: ['Customer-friendly placement', 'Clear escape routes', 'Retail inventory protection', 'Fast response coverage'],
    applications: ['Malls', 'Showrooms', 'Standalone stores', 'Shopping complexes'],
    standards: ['NFPA 101', 'Retail safety rules'],
    deployment: 'Customer-facing protection plan',
    compliance: 'Retail aligned',
    leadTime: '1-3 weeks',
    image: 'https://www.kanexfire.com/images/home/Hotel-new.webp'
  },
  {
    id: 'data-centers',
    slug: 'data-centers',
    collectionSlug: 'technology-logistics',
    collectionTitle: 'Technology & Logistics',
    title: 'Data Centers',
    icon: 'fa-server',
    summary: 'Clean-agent and monitoring protection for uptime-critical server rooms.',
    overview:
      'Data centers require rapid detection and low-residue suppression because even minor downtime can be expensive. We design around airflow, clean-agent response, and operational continuity.',
    specs: ['Clean agent', 'Uptime critical', 'Precision cooling'],
    features: ['Asset-preserving suppression', 'Fast detection', 'Monitoring ready', 'Rack-aware planning'],
    applications: ['Server rooms', 'Network hubs', 'NOC spaces', 'IT vaults'],
    standards: ['NFPA 2001', 'Data center best practice'],
    deployment: 'Mission-critical room protection',
    compliance: 'Critical asset aligned',
    leadTime: '2-6 weeks',
    image: 'https://www.kanexfire.com/images/home/Server-room-new.jpg'
  },
  {
    id: 'logistics-hubs',
    slug: 'logistics-hubs',
    collectionSlug: 'technology-logistics',
    collectionTitle: 'Technology & Logistics',
    title: 'Logistics Hubs',
    icon: 'fa-truck-fast',
    summary: 'Large-scale fire protection for dispatch, storage, and transport areas.',
    overview:
      'Logistics hubs need coordinated detection and suppression across storage, loading, and vehicle movement zones. We build fire safety plans that support throughput without losing control of risk.',
    specs: ['Dispatch zones', 'Traffic flow', 'Large footprint'],
    features: ['Loading bay coverage', 'Movement-zone planning', 'Storage risk control', 'Throughput-friendly layouts'],
    applications: ['Distribution hubs', 'Transport yards', 'Cross-docks', 'Fulfilment centers'],
    standards: ['NFPA 13', 'Warehouse logistics code'],
    deployment: 'Operations-aware safety plan',
    compliance: 'Logistics ready',
    leadTime: '2-6 weeks',
    image: 'https://www.kanexfire.com/images/home/Factory-new.webp'
  }
];

export const services = [
  'Fire Safety Consultation',
  'Fire System Design',
  'Equipment Installation',
  'Annual Maintenance Contracts',
  'Fire Audits',
  'Compliance Certification',
  'Fire Safety Training',
  'Emergency Planning'
];

export const industries = [
  'Manufacturing',
  'Healthcare',
  'Warehousing',
  'Data Centers',
  'Hospitality',
  'Education',
  'Government',
  'Commercial Buildings',
  'Retail',
  'Logistics'
];

export const testimonials = [
  {
    quote: 'Their team transformed our audit readiness and gave our leadership immediate confidence in the site safety posture.',
    author: 'Facilities Director',
    company: 'Healthcare campus'
  },
  {
    quote: 'The installation timeline was disciplined, the communication was excellent, and the reports were board-ready.',
    author: 'Operations Head',
    company: 'Manufacturing plant'
  },
  {
    quote: 'A premium partner with real engineering depth. They solved issues before they became risks.',
    author: 'Chief Administrator',
    company: 'International hotel'
  }
];

export const faqs = [
  {
    question: 'Which facilities do you support?',
    answer: 'Factories, warehouses, hospitals, schools, hotels, offices, data centers, logistics hubs, and other commercial or industrial facilities.'
  },
  {
    question: 'Do you provide 24/7 emergency support?',
    answer: 'Yes. Our emergency workflow is designed for rapid dispatch, hotline access, and priority escalation.'
  },
  {
    question: 'Can you handle compliance audits and certifications?',
    answer: 'Yes. We deliver audits, documentation support, certification readiness, and corrective action planning.'
  },
  {
    question: 'Do you install and maintain complete fire systems?',
    answer: 'Absolutely. We design, install, commission, maintain, and optimize complete fire protection ecosystems.'
  }
];





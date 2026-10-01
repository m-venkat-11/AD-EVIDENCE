import type { 
  ClaimPassport, 
  Product, 
  ConsumerObservation, 
  BrandKnowledgeRule, 
  GraphNode, 
  GraphEdge,
  TimelineEvent,
  SystemNotification,
  VerificationProject
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-xyz-headset-pro',
    brandId: 'brand-soundcore',
    brandName: 'Sony Corporation',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    modelNumber: 'WH-1000XM5',
    gtin: '0840123984712',
    category: 'Audio & Electronics',
    verifiedByGS1: true,
    officialDocUrl: 'https://specs.soundwave-audio.com/docs/WH-1000XM5-spec.pdf',
    specSummary: 'Over-ear hybrid ANC headphones with custom 40mm graphene drivers, Bluetooth 5.4, multipoint connection.',
    claimsCount: 6,
    activeConflicts: 2,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-ultraglow-serum',
    brandId: 'brand-derma-pure',
    brandName: 'DermaPure Laboratories',
    productName: 'UltraGlow Super C Radiance Serum',
    modelNumber: 'UG-SER-30ML',
    gtin: '0890104278192',
    category: 'Skincare & Cosmetics',
    verifiedByGS1: true,
    officialDocUrl: 'https://clinical.dermapure-labs.org/clinical/UG-SER-study.pdf',
    specSummary: '15% Ethyl Ascorbic Acid serum with Ferulic acid and Hyaluronic complex for hyperpigmentation.',
    claimsCount: 4,
    activeConflicts: 3,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-voltdrive-scooter',
    brandId: 'brand-voltdrive',
    brandName: 'VoltDrive Mobility',
    productName: 'VoltDrive City S-100 Electric Scooter',
    modelNumber: 'VD-S100-2026',
    gtin: '0890601248102',
    category: 'Electric Mobility & Vehicles',
    verifiedByGS1: true,
    officialDocUrl: 'https://homologation.voltdrive-mobility.in/homologation/VD-S100-cert.pdf',
    specSummary: '3.2 kWh LFP swappable battery pack, 4.5 kW peak hub motor, regenerative braking system.',
    claimsCount: 8,
    activeConflicts: 2,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-aurapure-air',
    brandId: 'brand-auratech',
    brandName: 'AuraTech Clean Systems',
    productName: 'AuraPure H14 Smart Air Purifier',
    modelNumber: 'AP-H14-MAX',
    gtin: '0840552190812',
    category: 'Home Appliances',
    verifiedByGS1: true,
    officialDocUrl: 'https://cert.auratech-clean.com/lab/AP-H14-filtration.pdf',
    specSummary: 'Medical grade True HEPA H14 filter with activated carbon honeycomb and laser PM2.5 sensor.',
    claimsCount: 5,
    activeConflicts: 1,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_CLAIM_PASSPORTS: ClaimPassport[] = [
  {
    id: 'CLM-82917',
    productId: 'prod-xyz-headset-pro',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    brandName: 'Sony Corporation',
    attribute: 'battery_duration',
    advertisedWording: 'Guaranteed 50-hour battery life on a single charge',
    normalizedValue: 50,
    unit: 'hours',
    claimType: 'numeric_spec',
    conditions: ['Unconditional Guarantee', 'Single Charge', 'Continuous Playback'],
    status: 'CONTRADICTED',
    statusExplanation: 'Advertisement claims 50 hours. Current official specification states up to 40 hours. Independent evidence reports 38.4 hours under different conditions.',
    fourQuestions: {
      whatClaimed: '50-hour battery life on a single charge without qualifying usage conditions.',
      whatEvidenceChecked: 'Manufacturer User Manual WH-1000XM5 (pg 18), Retailer listings on Amazon & Flipkart, Independent IEC 60268 lab benchmark report, and 127 verified consumer reports.',
      whatEvidenceSaid: 'Official specification states "Up to 40 hours with ANC Off" and only "30 hours with ANC On". Independent lab measured 38.4 hours at 75dB SPL. Retailer copied 50h claim without qualification.',
      whyStatusChosen: 'Marked CONTRADICTED because advertised duration (50h) exceeds official max rating (40h) by 25% and presents an upper bound as an unconditional guarantee.'
    },
    firstSeenDate: '2026-07-10',
    lastVerifiedDate: '2026-09-29',
    freshnessPolicy: 'Re-verify every 90 days or when lab/retailer telemetry exceeds 15% delta.',
    evidenceCoverage: {
      productIdentity: true,
      officialSpec: true,
      currentPrice: true,
      independentLab: true,
      consumerReports: true,
      c2paProvenance: true,
    },
    sources: [
      {
        id: 'src-official-xyz',
        claimId: 'CLM-82917',
        sourceType: 'OFFICIAL_BRAND',
        sourceName: 'Official Product Specification',
        publisher: 'Sony Corporation Engineering Documentation',
        observedValue: '40 hours',
        normalizedValue: 40,
        unit: 'hours',
        conditions: 'ANC Off, 50% volume, standard lab temperature 22°C, AAC codec',
        retrievedDate: '2026-07-12',
        citation: 'User Manual WH-1000XM5, Page 18, Section 4.2 "Battery Runtime Specifications"',
        documentName: 'WH-1000XM5-spec.pdf',
        relevantSection: 'Section 4.2 - Runtime & Power Management',
        url: 'https://specs.soundwave-audio.com/docs/WH-1000XM5-spec.pdf#page=18',
        hash: 'sha256-8a9f24c017d23a9b',
        reliability: 'Authoritative',
        conflictFlag: true
      },
      {
        id: 'src-retailer-xyz',
        claimId: 'CLM-82917',
        sourceType: 'RETAILER',
        sourceName: 'Retailer Listing',
        publisher: 'Amazon Marketplace & MegaMart Retail',
        observedValue: '40 hours',
        normalizedValue: 40,
        unit: 'hours',
        conditions: 'Promotional bullet point without footnotes or volume qualifiers',
        retrievedDate: '2026-08-03',
        citation: 'Amazon ASIN B0C8XYZ950 Product Feature Bullets',
        documentName: 'Amazon Product Catalog Feed',
        relevantSection: 'Primary Feature Bullets',
        url: 'https://amazon.com/dp/B0C8XYZ950',
        reliability: 'Market Observation',
        conflictFlag: false
      },
      {
        id: 'src-lab-xyz',
        claimId: 'CLM-82917',
        sourceType: 'INDEPENDENT_LAB',
        sourceName: 'Independent Test',
        publisher: 'AcousticLab Independent Certification Institute',
        observedValue: '38.4 hours',
        normalizedValue: 38.4,
        unit: 'hours',
        conditions: 'IEC 60268 standard pink noise loop at 75dB SPL, ANC Disabled, Room Temp 21.5°C',
        retrievedDate: '2026-09-14',
        citation: 'AcousticLab Benchmark Report #TAL-2026-0891',
        documentName: 'Acoustic Runtime Evaluation Report',
        relevantSection: 'Table 3 - Continuous Discharge Test',
        url: 'https://reports.acousticlab-global.org/reports/TAL-2026-0891',
        hash: 'sha256-e91b8a472910c223',
        reliability: 'Independent Benchmark',
        conflictFlag: true
      },
      {
        id: 'src-consumer-xyz',
        claimId: 'CLM-82917',
        sourceType: 'CONSUMER_OBSERVATION',
        sourceName: 'Consumer Observations',
        publisher: 'AD-EVIDENCE Verified Consumer Log DB',
        observedValue: '27–42 hours',
        normalizedValue: 34.2,
        unit: 'hours',
        conditions: 'Aggregated real-world logs across commuters, office workers and travel (n=127 reports)',
        retrievedDate: '2026-09-28',
        citation: '127 Verified Consumer Invoices & Hardware Telemetry Logs',
        documentName: 'Consumer Cluster Report #CC-82917',
        relevantSection: 'Cluster Distribution Curve',
        reliability: 'Crowdsourced Signal'
      },
      {
        id: 'src-provenance-xyz',
        claimId: 'CLM-82917',
        sourceType: 'PROVENANCE',
        sourceName: 'Content Provenance Signal',
        publisher: 'C2PA Content Credentials Manifest & SynthID',
        observedValue: 'Synthetic Background Detected; Hardware CAD Verified',
        conditions: 'Content Credentials signed by SoundWave Studio (Adobe Firefly generation tag detected)',
        retrievedDate: '2026-09-26',
        citation: 'C2PA Manifest JUMBF Box #0981-c2pa-asset-wh950',
        documentName: 'C2PA Manifest #0981',
        relevantSection: 'Assertions / Actions / c2pa.created',
        reliability: 'Cryptographic Watermark'
      }
    ],
    conflicts: [
      {
        id: 'conf-018',
        sourceA: 'Advertisement',
        valueA: '50 hours',
        sourceB: 'Official Specification',
        valueB: '40 hours',
        nature: 'The advertisement claims 50 hours, while the current official specification states up to 40 hours. Independent evidence reports 38.4 hours under stated conditions.',
        impactLevel: 'CRITICAL',
        missingCondition: 'ANC OFF condition omitted',
        recommendedAction: 'Align ad copy with official rating "Up to 40 hours with ANC off"'
      },
      {
        id: 'conf-019',
        sourceA: 'Official Specification',
        valueA: '40 hours (ANC Off)',
        sourceB: 'Independent Test',
        valueB: '38.4 hours',
        nature: 'Independent lab test reports a 4% lower figure under standardized acoustic output (75dB SPL).',
        impactLevel: 'INFORMATIONAL',
        recommendedAction: 'Preserve both test benchmarks in Claim Passport'
      }
    ],
    travelOccurrences: [
      {
        platform: 'Instagram',
        adTitle: 'Sony WH-1000XM5: "Forget Your Charger for 50 Hours"',
        date: '2026-09-22',
        url: 'https://instagram.com/p/C9xL2094Kz',
        reachEstimate: '420,000 impressions',
        format: 'Video Reel'
      },
      {
        platform: 'YouTube',
        adTitle: 'X5 Pre-roll Ad 15s: "Guaranteed 50-hour Playback"',
        date: '2026-09-15',
        url: 'https://youtube.com/watch?v=ad_wh950_preroll',
        reachEstimate: '1,200,000 views',
        format: 'Video Reel'
      },
      {
        platform: 'Amazon',
        adTitle: 'Amazon Sponsored Brand Headline: "Best in Class 50-Hour Wireless Battery"',
        date: '2026-09-18',
        url: 'https://amazon.com/sb/soundwave-pro',
        reachEstimate: '85,000 clicks',
        format: 'Product Listing'
      },
      {
        platform: 'Influencer Post',
        adTitle: '@TechGamerDaily Sponsored Unboxing: "Literally lasts 50 continuous hours"',
        date: '2026-09-24',
        url: 'https://instagram.com/reel/C89xKl892',
        reachEstimate: '310,000 views',
        format: 'Sponsored Post'
      }
    ],
    provenanceDetails: {
      c2paDetected: true,
      synthIdDetected: true,
      aiModifiedVisual: true,
      tamperEvidentHash: '0x9482fba82c9183ec289a01',
      details: 'C2PA Content Credentials verified. Synthetic neon cyberpunk background generated with Generative AI (Firefly model). The physical headphone hardware render matches verified CAD geometry. Non-deceptive aesthetic AI use.'
    },
    regulatoryNotes: [
      'Violates Advertising Disclosure Rules: Omission of condition that 40h is attainable only with Active Noise Cancellation turned OFF.',
      'Advertising Standards Compliance: Claim strengthened beyond engineering clearance without internal review sign-off.'
    ],
    brandDisputeResponse: {
      author: 'SoundWave Regulatory Compliance Team',
      date: '2026-09-28T14:30:00Z',
      responseContent: 'Our official test uses ANC OFF under standardized conditions (50% volume, AAC codec). We have issued a creative update to ensure all outward media explicitly cites "Up to 40 hours with ANC off / 30 hours with ANC on".',
      reviewedByPlatform: true
    }
  },
  {
    id: 'CLM-41029',
    productId: 'prod-ultraglow-serum',
    productName: 'UltraGlow Super C Radiance Serum',
    brandName: 'DermaPure Laboratories',
    attribute: 'wrinkle_reduction',
    advertisedWording: '100% wrinkle elimination in just 7 days',
    normalizedValue: 100,
    unit: '%',
    claimType: 'superlative',
    conditions: ['Dermatologist approved', '7-day timeframe', 'Complete elimination'],
    status: 'CONTRADICTED',
    statusExplanation: 'Official clinical trial only measured a 92% improvement in the appearance of fine lines over 8 weeks (56 days), not 100% complete elimination in 7 days.',
    fourQuestions: {
      whatClaimed: '100% complete wrinkle elimination achieved within 7 calendar days.',
      whatEvidenceChecked: 'DermaPure Clinical Study Report #DP-2025-CS-09 (34 female participants), Medical Advertising Guidelines, and Independent Dermatological Review.',
      whatEvidenceSaid: 'Official clinical trial showed 92% of subjects noticed improvement in superficial fine line appearance after 8 weeks (56 days) of twice-daily application. Zero subjects experienced "100% elimination".',
      whyStatusChosen: 'Marked CONTRADICTED because the claim introduces false certainty ("100% elimination") and compresses an 8-week clinical timeline down to 7 days.'
    },
    firstSeenDate: '2026-09-01',
    lastVerifiedDate: '2026-09-26',
    freshnessPolicy: 'Clinical claims require peer review and verified study methodology documentation.',
    evidenceCoverage: {
      productIdentity: true,
      officialSpec: true,
      currentPrice: true,
      independentLab: true,
      consumerReports: true,
      c2paProvenance: false,
    },
    sources: [
      {
        id: 'src-official-serum',
        claimId: 'CLM-41029',
        sourceType: 'OFFICIAL_BRAND',
        sourceName: 'Clinical Trial Study #DP-2025-CS-09',
        publisher: 'DermaPure Laboratories Clinical Research Wing',
        observedValue: '92% observed fine line improvement at 8 weeks',
        normalizedValue: 92,
        unit: '%',
        conditions: 'Twice daily application, n=34 healthy volunteers aged 35-55, 8-week duration',
        retrievedDate: '2026-09-26',
        citation: 'Clinical Trial Registry Registration #CTRI/2025/08/04291',
        documentName: 'UG-SER-study.pdf',
        relevantSection: 'Results & Efficacy Summary',
        url: 'https://clinical.dermapure-labs.org/clinical/UG-SER-study.pdf',
        reliability: 'Authoritative',
        conflictFlag: true
      },
      {
        id: 'src-lab-serum',
        claimId: 'CLM-41029',
        sourceType: 'INDEPENDENT_LAB',
        sourceName: 'Independent Skin Testing Institute',
        publisher: 'BioDerm Research Labs',
        observedValue: '18.4% hydration increase; no wrinkle elimination',
        conditions: 'Corneometer & Visioscan 3D profilometry analysis, n=20',
        retrievedDate: '2026-09-12',
        citation: 'BioDerm Analytical Report #BD-9821-2026',
        documentName: 'BioDerm Profilometry Report',
        reliability: 'Independent Benchmark',
        conflictFlag: true
      }
    ],
    conflicts: [
      {
        id: 'conf-022',
        sourceA: 'Ad Claim',
        valueA: '100% elimination in 7 days',
        sourceB: 'Clinical Study DP-2025',
        valueB: '92% appearance improvement in 56 days',
        nature: 'Timeline compressed by 800% (7 days vs 56 days); outcome exaggerated from reduction to absolute elimination.',
        impactLevel: 'CRITICAL',
        recommendedAction: 'Revise copy to cite certified 8-week clinical observation'
      }
    ],
    travelOccurrences: [
      {
        platform: 'Instagram',
        adTitle: 'Sponsored Story: "Zero Wrinkles in 7 Days? Dermatologists Shocked"',
        date: '2026-09-25',
        url: 'https://instagram.com/stories/dermapure_skin/98210',
        format: 'Image Ad'
      }
    ]
  },
  {
    id: 'CLM-90312',
    productId: 'prod-voltdrive-scooter',
    productName: 'VoltDrive City S-100 Electric Scooter',
    brandName: 'VoltDrive Mobility',
    attribute: 'price_and_range',
    advertisedWording: 'Starting at ₹44,999 with up to 120km certified range',
    normalizedValue: 44999,
    unit: 'INR',
    claimType: 'price',
    conditions: ['Introductory Price', 'Eco Mode', 'Ideal Test Track'],
    status: 'OUTDATED',
    statusExplanation: 'The advertised price of ₹44,999 expired on July 31, 2026. Current showroom price is ₹54,999. The 120km range claim also requires Eco mode at 20km/h with a 60kg rider.',
    fourQuestions: {
      whatClaimed: 'Purchase price starting at ₹44,999 with 120km single-charge travel range.',
      whatEvidenceChecked: 'VoltDrive Official Price Schedule (Updated Sept 2026), ARAI/ICAT Homologation Certificate #HOM-2026-4412, and 84 verified rider commute records.',
      whatEvidenceSaid: 'Official showroom price increased to ₹54,999 following expiration of the festive subsidy on July 31. The 120km range is certified under ARAI IDC test conditions (Eco mode, 20km/h, no headwind). Real-world mixed commuting yields 72km.',
      whyStatusChosen: 'Marked OUTDATED for price (time elapsed > 60 days post-expiration) and CONTEXT_MISSING for range under normal city traffic conditions.'
    },
    firstSeenDate: '2026-06-15',
    lastVerifiedDate: '2026-09-29',
    freshnessPolicy: 'Prices expire after 14 days or upon published revision.',
    evidenceCoverage: {
      productIdentity: true,
      officialSpec: true,
      currentPrice: true,
      independentLab: true,
      consumerReports: true,
      c2paProvenance: true,
    },
    sources: [
      {
        id: 'src-official-price',
        claimId: 'CLM-90312',
        sourceType: 'OFFICIAL_BRAND',
        sourceName: 'Official Dealer Price Schedule',
        publisher: 'VoltDrive Corporate Pricing Memo',
        observedValue: 'Current Ex-Showroom Price: ₹54,999',
        normalizedValue: 54999,
        unit: 'INR',
        conditions: 'Post-subsidy standard consumer pricing, Pan-India',
        retrievedDate: '2026-09-28',
        citation: 'VoltDrive Corporate Pricing Memo #VD-PR-2026-08',
        documentName: 'VD-PR-2026-08.pdf',
        url: 'https://homologation.voltdrive-mobility.in/pricing',
        reliability: 'Authoritative',
        conflictFlag: true
      },
      {
        id: 'src-consumer-voltdrive',
        claimId: 'CLM-90312',
        sourceType: 'CONSUMER_OBSERVATION',
        sourceName: 'Rider Telemetry Cluster (n=84)',
        publisher: 'AD-EVIDENCE Verified Fleet Telemetry',
        observedValue: '68km – 79km (Avg: 72.3km)',
        normalizedValue: 72.3,
        unit: 'km',
        conditions: 'City traffic, regenerative braking medium, rider weight 70-85kg, city mode (35-45km/h)',
        retrievedDate: '2026-09-27',
        citation: 'AD-EVIDENCE Verified Telemetry & GPS commute logs',
        documentName: 'Fleet Telemetry Aggregation',
        reliability: 'Crowdsourced Signal'
      }
    ],
    conflicts: [
      {
        id: 'conf-025',
        sourceA: 'Ad Price Claim',
        valueA: '₹44,999',
        sourceB: 'Current Showroom Price',
        valueB: '₹54,999',
        nature: 'Price is outdated by ₹10,000 (+22.2%) due to expired introductory promotional window.',
        impactLevel: 'CRITICAL',
        recommendedAction: 'Update creative to current MSRP ₹54,999'
      }
    ],
    travelOccurrences: [
      {
        platform: 'YouTube',
        adTitle: 'VoltDrive S100 - "Ride the Future for ₹44,999"',
        date: '2026-09-10',
        url: 'https://youtube.com/watch?v=voltdrive_s100_ad',
        reachEstimate: '850,000 views',
        format: 'Video Reel'
      }
    ]
  },
  {
    id: 'CLM-73204',
    productId: 'prod-aurapure-air',
    productName: 'AuraPure H14 Smart Air Purifier',
    brandName: 'AuraTech Clean Systems',
    attribute: 'pathogen_filtration',
    advertisedWording: 'Eliminates 99.99% of airborne viruses and allergens instantly',
    normalizedValue: 99.99,
    unit: '%',
    claimType: 'performance',
    conditions: ['Instantly', 'Closed 10m³ chamber', 'Highest Fan Speed'],
    status: 'CONTEXT_MISSING',
    statusExplanation: 'The word "instantly" is misleading. Official certified lab test achieved 99.97% removal over 45 minutes of continuous circulation in a sealed 10m³ test chamber.',
    fourQuestions: {
      whatClaimed: 'Eliminates 99.99% of airborne viruses and allergens instantly upon turning on.',
      whatEvidenceChecked: 'AHAM AC-1 Certified CADR Test Report and Manufacturer Engineering Documentation.',
      whatEvidenceSaid: '99.97% reduction of MS2 virus bacteriophage achieved after 45 minutes in a closed 10 cubic meter testing room at maximum Turbo speed (450 m³/h CADR).',
      whyStatusChosen: 'Marked CONTEXT MISSING because "instantly" contradicts fluid dynamics and required 45-minute continuous recirculation.'
    },
    firstSeenDate: '2026-07-20',
    lastVerifiedDate: '2026-09-25',
    freshnessPolicy: 'Filter lab certifications valid for 24 months from test date.',
    evidenceCoverage: {
      productIdentity: true,
      officialSpec: true,
      currentPrice: true,
      independentLab: true,
      consumerReports: false,
      c2paProvenance: true,
    },
    sources: [
      {
        id: 'src-aham-lab',
        claimId: 'CLM-73204',
        sourceType: 'INDEPENDENT_LAB',
        sourceName: 'Certified Environmental Testing Lab',
        publisher: 'AHAM Testing Institute',
        observedValue: '99.97% aerosol reduction at 45 minutes',
        normalizedValue: 99.97,
        unit: '%',
        conditions: '10m³ airtight room, Max Turbo airflow 450 m³/h, test organism MS2 bacteriophage',
        retrievedDate: '2026-09-25',
        citation: 'AHAM Test Document #AHAM-2026-V-1029',
        documentName: 'AHAM-2026-V-1029.pdf',
        reliability: 'Independent Benchmark',
        conflictFlag: true
      }
    ],
    conflicts: [
      {
        id: 'conf-031',
        sourceA: 'Ad Claim',
        valueA: 'Instantly eliminates 99.99%',
        sourceB: 'AHAM Lab Benchmark',
        valueB: '99.97% after 45 minutes',
        nature: 'Temporal distortion: Claim implies instantaneous sterilization, whereas physics requires multiple air exchange cycles.',
        impactLevel: 'CRITICAL',
        missingCondition: 'Requires 45 minutes continuous recirculation in 10m³ chamber',
        recommendedAction: 'Remove "instantly" and add recirculation duration footnote'
      }
    ],
    travelOccurrences: [
      {
        platform: 'Company Website',
        adTitle: 'Homepage Banner: "Instant Pathogen Defense"',
        date: '2026-08-01',
        url: 'https://cert.auratech-clean.com',
        format: 'Image Ad'
      }
    ]
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-1',
    claimId: 'CLM-82917',
    date: 'Jul 10, 2026',
    title: 'Claim First Observed',
    description: 'Claim "50-hour battery life" first indexed from external creative agency campaign brief.',
    sourceType: 'HISTORICAL_RECORD',
    eventType: 'CREATED',
    statusAfter: 'UNDER_REVIEW'
  },
  {
    id: 'tl-2',
    claimId: 'CLM-82917',
    date: 'Jul 12, 2026',
    title: 'Official Specification Ingested',
    description: 'Engineering user manual WH-1000XM5 indexed: states "Up to 40 hours with ANC Off".',
    sourceType: 'OFFICIAL_BRAND',
    eventType: 'OFFICIAL_ADDED',
    statusAfter: 'CONTEXT_MISSING'
  },
  {
    id: 'tl-3',
    claimId: 'CLM-82917',
    date: 'Aug 03, 2026',
    title: 'Retailer Catalog Synced',
    description: 'Amazon product listing indexed citing "40 hours" battery runtime.',
    sourceType: 'RETAILER',
    eventType: 'RETAILER_CHANGE',
    statusAfter: 'CONTEXT_MISSING'
  },
  {
    id: 'tl-4',
    claimId: 'CLM-82917',
    date: 'Aug 20, 2026',
    title: 'Paid Instagram Reel Published',
    description: 'Live advertising campaign launched asserting "50-Hour Nonstop Battery Life".',
    sourceType: 'SYSTEM',
    eventType: 'AD_PUBLISHED',
    statusAfter: 'CONTRADICTED'
  },
  {
    id: 'tl-5',
    claimId: 'CLM-82917',
    date: 'Sep 14, 2026',
    title: 'Independent AcousticLab Test Added',
    description: 'IEC 60268 continuous playback benchmark report indexed showing 38.4 hours @ 75dB SPL.',
    sourceType: 'INDEPENDENT_LAB',
    eventType: 'LAB_ADDED',
    statusAfter: 'CONTRADICTED'
  },
  {
    id: 'tl-6',
    claimId: 'CLM-82917',
    date: 'Sep 28, 2026',
    title: 'Brand Official Response Logged',
    description: 'Sony Regulatory Compliance posted official clarification regarding ANC Off protocol.',
    sourceType: 'OFFICIAL_BRAND',
    eventType: 'DISPUTE_ADDED',
    statusAfter: 'CONTRADICTED'
  },
  {
    id: 'tl-7',
    claimId: 'CLM-82917',
    date: 'Sep 29, 2026',
    title: 'Consumer Telemetry Clustered',
    description: '127 verified real-world reports aggregated showing 27–42 hour distribution.',
    sourceType: 'CONSUMER_OBSERVATION',
    eventType: 'CONSUMER_OBSERVATION',
    statusAfter: 'CONTRADICTED'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    date: '10m ago',
    title: 'Source Conflict Detected',
    message: 'Claim CLM-82917 ("50-hour battery life") has 2 conflicting sources between official specs and ad copy.',
    severity: 'CRITICAL',
    claimId: 'CLM-82917',
    read: false
  },
  {
    id: 'notif-2',
    date: '2h ago',
    title: 'Retailer Price Changed',
    message: 'VoltDrive S-100 ex-showroom price updated to ₹54,999. Ad creative running ₹44,999 is now outdated.',
    severity: 'WARNING',
    claimId: 'CLM-90312',
    read: false
  },
  {
    id: 'notif-3',
    date: '1d ago',
    title: 'Official Specification Updated',
    message: 'AuraPure H14 technical documentation updated with CADR 450 m³/h lab certification.',
    severity: 'INFO',
    claimId: 'CLM-73204',
    read: true
  },
  {
    id: 'notif-4',
    date: '2d ago',
    title: 'New Consumer Observations Clustered',
    message: '14 new verified user battery logs added to Sony WH-1000XM5 telemetry profile.',
    severity: 'INFO',
    claimId: 'CLM-82917',
    read: true
  }
];

export const INITIAL_PROJECTS: VerificationProject[] = [
  {
    id: 'proj-1',
    name: 'Sony 1000X Series Global Launch Campaign',
    brandName: 'Sony Corporation',
    productCount: 2,
    claimsCount: 14,
    conflictsCount: 2,
    status: 'NEEDS_REVIEW',
    lastActivity: 'Today, 06:45'
  },
  {
    id: 'proj-2',
    name: 'DermaPure Clinical Validation 2026',
    brandName: 'DermaPure Laboratories',
    productCount: 3,
    claimsCount: 9,
    conflictsCount: 3,
    status: 'NEEDS_REVIEW',
    lastActivity: 'Yesterday'
  },
  {
    id: 'proj-3',
    name: 'VoltDrive Q3 Price & Homologation Audit',
    brandName: 'VoltDrive Mobility',
    productCount: 1,
    claimsCount: 8,
    conflictsCount: 1,
    status: 'ACTIVE',
    lastActivity: '3 days ago'
  }
];

export const INITIAL_CONSUMER_OBSERVATIONS: ConsumerObservation[] = [
  {
    id: 'obs-001',
    claimId: 'CLM-82917',
    productId: 'prod-xyz-headset-pro',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    userName: 'Karthik S. (Audio Engineer)',
    verifiedPurchase: true,
    observedValue: '31.5 hours',
    conditions: 'ANC ON, 65% volume, LDAC codec enabled, connected to laptop and phone',
    usageDuration: 'Tested continuously over 3 days',
    region: 'Bengaluru, India',
    submissionDate: '2026-09-25',
    notes: 'Nowhere near 50 hours when using ANC. Still strong battery life, but advertising 50h without mentioning ANC off is misleading.',
    proofAttached: true,
    moderationStatus: 'APPROVED'
  },
  {
    id: 'obs-002',
    claimId: 'CLM-82917',
    productId: 'prod-xyz-headset-pro',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    userName: 'Sarah Jenkins',
    verifiedPurchase: true,
    observedValue: '39 hours',
    conditions: 'ANC OFF, 50% volume, AAC codec, office listening',
    usageDuration: '1 full work week',
    region: 'Austin, TX, USA',
    submissionDate: '2026-09-24',
    notes: 'If you turn off ANC and keep volume moderate, it easily hits 39 hours. Matches the 40h official spec, but the 50h claim is exaggerated.',
    proofAttached: true,
    moderationStatus: 'APPROVED'
  },
  {
    id: 'obs-003',
    claimId: 'CLM-90312',
    productId: 'prod-voltdrive-scooter',
    productName: 'VoltDrive City S-100 Electric Scooter',
    userName: 'Rahul Verma (Daily Commuter)',
    verifiedPurchase: true,
    observedValue: '74 km per full charge',
    conditions: 'City Mode (Speed 35-40 km/h), rider weight 74kg, moderate flyover elevation',
    usageDuration: '4 months daily commute (1,800 km logged)',
    region: 'Hyderabad, India',
    submissionDate: '2026-09-20',
    notes: 'You can only reach 120km if you crawl in Eco mode at 20km/h on a flat track. In real city traffic with stop-and-go, expect 70-75km.',
    proofAttached: true,
    moderationStatus: 'APPROVED'
  }
];

export const INITIAL_BRAND_RULES: BrandKnowledgeRule[] = [
  {
    id: 'rule-01',
    brandId: 'brand-soundcore',
    title: 'Mandatory Battery Claim Footnote',
    type: 'MANDATORY_DISCLOSURE',
    ruleText: 'All battery runtime claims must explicitly state "Up to X hours with ANC disabled at 50% volume (AAC codec). Actual runtime may vary by volume and ANC settings."',
    affectedAttributes: ['battery_duration', 'playback_time'],
    severity: 'BLOCKER'
  },
  {
    id: 'rule-02',
    brandId: 'brand-soundcore',
    title: 'Prohibition of Absolute Guarantees',
    type: 'PROHIBITED_CLAIM',
    ruleText: 'Never use terms like "Guaranteed", "Unbreakable", or "Infinite" in marketing copy without legal clearance.',
    affectedAttributes: ['battery_duration', 'durability', 'anc_rating'],
    severity: 'BLOCKER'
  },
  {
    id: 'rule-03',
    brandId: 'brand-soundcore',
    title: 'AI Asset Transparency Labeling',
    type: 'MANDATORY_DISCLOSURE',
    ruleText: 'Any advertising asset containing synthetic background generation or AI digital twins must attach C2PA Content Credentials metadata and indicate AI assistance in platform disclosures.',
    affectedAttributes: ['visual_assets', 'video_creative'],
    severity: 'WARNING'
  }
];

// Clean Graph dataset for the Claim Evidence Graph
export const GRAPH_NODES: GraphNode[] = [
  { id: 'brand-soundcore', label: 'Sony Corporation', subLabel: 'Brand', type: 'brand', color: '#06070A', val: 22 },
  { id: 'prod-xyz-headset-pro', label: 'Sony WH-1000XM5 Headphones', subLabel: 'Product (WH-1000XM5)', type: 'product', color: '#1A1B2E', val: 24 },
  { id: 'CLM-82917', label: 'Claim: 50h Battery', subLabel: 'Attribute: battery_duration', type: 'claim', status: 'CONTRADICTED', color: '#FF2FA3', val: 26 },
  { id: 'ad-instagram-01', label: 'Instagram Reel Ad', subLabel: '"50h Guaranteed"', type: 'ad', color: '#AEB6C2', val: 18 },
  { id: 'ad-youtube-02', label: 'YouTube Pre-roll', subLabel: '"50h Playback"', type: 'ad', color: '#AEB6C2', val: 18 },
  { id: 'ad-retailer-03', label: 'Retailer Listing', subLabel: 'Amazon ASIN B0C8XYZ950', type: 'retailer', color: '#FF2FA3', val: 18 },
  { id: 'src-official-xyz', label: 'Official Spec Doc', subLabel: 'Manual p.18 (40h Official)', type: 'official', color: '#3D5AFE', val: 20 },
  { id: 'src-lab-xyz', label: 'Independent Test', subLabel: 'IEC 60268 (38.4h @ 75dB)', type: 'lab', color: '#1A1B2E', val: 20 },
  { id: 'src-consumer-xyz', label: 'Consumer Observations', subLabel: 'n=127 (27-42h cluster)', type: 'consumer', color: '#AEB6C2', val: 20 },
  { id: 'src-provenance-xyz', label: 'C2PA Manifest', subLabel: 'Content Credentials Verified', type: 'provenance', color: '#F5F7FF', val: 16 },

  // VoltDrive
  { id: 'prod-voltdrive-scooter', label: 'VoltDrive S-100', subLabel: 'Product (EV Scooter)', type: 'product', color: '#1A1B2E', val: 22 },
  { id: 'CLM-90312', label: 'Claim: ₹44,999 / 120km', subLabel: 'Price & Range', type: 'claim', status: 'OUTDATED', color: '#FF2FA3', val: 24 },
  { id: 'src-official-price', label: 'Official Price (₹54,999)', subLabel: 'Current Showroom Price', type: 'official', color: '#3D5AFE', val: 18 },
  { id: 'src-consumer-voltdrive', label: 'Rider Telemetry', subLabel: 'n=84 (72.3km avg)', type: 'consumer', color: '#AEB6C2', val: 18 }
];

export const GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'brand-soundcore', target: 'prod-xyz-headset-pro', label: 'OWNS' },
  { id: 'e2', source: 'prod-xyz-headset-pro', target: 'CLM-82917', label: 'HAS_CLAIM' },
  { id: 'e3', source: 'ad-instagram-01', target: 'CLM-82917', label: 'ASSERTS (50h)' },
  { id: 'e4', source: 'ad-youtube-02', target: 'CLM-82917', label: 'ASSERTS (50h)' },
  { id: 'e5', source: 'ad-retailer-03', target: 'CLM-82917', label: 'LISTS (40h)' },
  { id: 'e6', source: 'src-official-xyz', target: 'CLM-82917', label: 'CONTRADICTS (40h vs 50h)', status: 'conflict' },
  { id: 'e7', source: 'src-lab-xyz', target: 'CLM-82917', label: 'TESTS (38.4h)', status: 'conflict' },
  { id: 'e8', source: 'src-consumer-xyz', target: 'CLM-82917', label: 'OBSERVES (27-42h)', status: 'conflict' },
  { id: 'e9', source: 'ad-instagram-01', target: 'src-provenance-xyz', label: 'HAS_PROVENANCE' },
  { id: 'e10', source: 'prod-voltdrive-scooter', target: 'CLM-90312', label: 'HAS_CLAIM' },
  { id: 'e11', source: 'src-official-price', target: 'CLM-90312', label: 'OUTDATED (₹54,999)', status: 'conflict' },
  { id: 'e12', source: 'src-consumer-voltdrive', target: 'CLM-90312', label: 'OBSERVES_CITY (72.3km)', status: 'conflict' }
];

export const SYSTEM_METRICS = {
  claimsMonitored: 1284,
  evidenceSources: 4892,
  claimsNeedingReview: 37,
  conflictsDetected: 18,
  claimExtractionF1: '94.2%',
  productIdentityAccuracy: '98.1%',
  evidenceRetrievalPrecision: '91.7%',
  citationCoverage: '100%',
  contradictionPrecision: '96.3%',
  falsePositiveRate: '3.1%'
};

export const SYSTEM_BENCHMARK_METRICS = SYSTEM_METRICS;

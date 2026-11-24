// AURA CHRONOS — Complete Catalog, Editorial & Boutique Data

const CURRENCIES = {
    EGP: { code: 'EGP', symbol: 'EGP', rate: 1, prefix: false },
    USD: { code: 'USD', symbol: '$', rate: 0.02, prefix: true },
    EUR: { code: 'EUR', symbol: '€', rate: 0.0185, prefix: true },
    CHF: { code: 'CHF', symbol: 'CHF ', rate: 0.0176, prefix: true }
};

const products = [
    {
        id: 1,
        ref: "AUR-PH-001",
        name: "Phantom Obsidian",
        priceNum: 180000,
        price: "180,000",
        img: "assets/watch1.png",
        brand: "Aura Private",
        category: "Atelier",
        badge: "Signature Piece",
        availability: "In Stock — Ready for Armored Delivery",
        featured: true,
        desc: "Crafted from a single block of obsidian-coated Grade 5 titanium, the Phantom represents the pinnacle of stealth haute horlogerie.",
        story: "Assembled in our Geneva atelier over 420 hours, the Phantom Obsidian pairs micro-blasted DLC titanium with 18k brushed gold baton indices that catch ambient light with understated authority.",
        specs: {
            caliber: "Aura Cal. AC-901 Automatic",
            diameter: "41 mm",
            thickness: "9.8 mm",
            caseMaterial: "DLC Obsidian Grade 5 Titanium",
            waterResistance: "100 m / 10 ATM",
            powerReserve: "72 Hours",
            crystal: "Domed Anti-Reflective Sapphire",
            strap: "Integrated Matte Titanium Bracelet"
        }
    },
    {
        id: 2,
        ref: "AUR-AS-002",
        name: "Arctic Silver",
        priceNum: 95000,
        price: "95,000",
        img: "assets/watch2.png",
        brand: "Aura Heritage",
        category: "Dress",
        badge: "Heritage",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "A tribute to the pioneers of polar exploration, featuring a brushed silver-rhodium dial and sub-zero chronometric durability.",
        story: "Inspired by 1950s expedition instruments, the Arctic Silver combines clean Bauhaus legibility with anti-magnetic soft-iron inner shielding.",
        specs: {
            caliber: "Aura Cal. AC-540 Automatic",
            diameter: "39 mm",
            thickness: "8.9 mm",
            caseMaterial: "904L Brushed Stainless Steel",
            waterResistance: "100 m / 10 ATM",
            powerReserve: "68 Hours",
            crystal: "Scratch-Resistant Sapphire",
            strap: "Hand-Stitched Slate Alligator Leather"
        }
    },
    {
        id: 3,
        ref: "AUR-GH-003",
        name: "Golden Hour",
        priceNum: 250000,
        price: "250,000",
        img: "assets/watch3.png",
        brand: "Aura Royale",
        category: "Dress",
        badge: "Limited Edition",
        availability: "Limited — 3 Pieces Remaining",
        featured: true,
        desc: "Capture the warmth of twilight with solid 18k rose gold, a deep obsidian sunburst dial, and a hand-finished Milanese mesh bracelet.",
        story: "Every Golden Hour case is hand-polished using traditional black-polish techniques, creating an unbroken mirror sheen against the matte charcoal dial.",
        specs: {
            caliber: "Aura Cal. AC-780 Ultra-Thin",
            diameter: "40 mm",
            thickness: "7.6 mm",
            caseMaterial: "18k Solid Rose Gold",
            waterResistance: "50 m / 5 ATM",
            powerReserve: "65 Hours",
            crystal: "Box-Domed Sapphire Front & Back",
            strap: "PVD Noir Milanese Mesh"
        }
    },
    {
        id: 4,
        ref: "OMG-MW-004",
        name: "Moonwatch Master",
        priceNum: 140000,
        price: "140,000",
        img: "assets/watch4.png",
        brand: "Omega",
        category: "Chronograph",
        badge: "Iconic",
        availability: "In Stock — Certified Pre-Curated",
        featured: false,
        desc: "The legendary space-flight chronograph engineered for extreme precision. Master Chronometer certified with manual-wind pedigree.",
        story: "With its asymmetric case, tachymeter bezel, and stepped dial, the Moonwatch remains the ultimate mechanical instrument for collectors.",
        specs: {
            caliber: "Co-Axial Master Chronometer 3861",
            diameter: "42 mm",
            thickness: "13.2 mm",
            caseMaterial: "Brushed & Polished Stainless Steel",
            waterResistance: "50 m / 5 ATM",
            powerReserve: "50 Hours",
            crystal: "Sapphire Sandwich Caseback",
            strap: "Five-Link Arch Steel Bracelet"
        }
    },
    {
        id: 5,
        ref: "CRT-SC-005",
        name: "Santos de Cartier",
        priceNum: 160000,
        price: "160,000",
        img: "assets/watch5.png",
        brand: "Cartier",
        category: "Dress",
        badge: "Bestseller",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "The world's first modern pilot's wristwatch, reimagined with architectural purity, geometric bezel, and signature exposed screws.",
        story: "Created in 1904 for aviation pioneer Alberto Santos-Dumont, its curved lugs hug the wrist with effortless Parisian sophistication.",
        specs: {
            caliber: "Manufacture 1847 MC Automatic",
            diameter: "39.8 mm",
            thickness: "9.08 mm",
            caseMaterial: "Fine-Brushed Steel & Gold Accents",
            waterResistance: "100 m / 10 ATM",
            powerReserve: "42 Hours",
            crystal: "Flat Sapphire Crystal",
            strap: "QuickSwitch Steel & Calfskin Pair"
        }
    },
    {
        id: 6,
        ref: "IWC-PC-006",
        name: "Portugieser Chrono",
        priceNum: 120000,
        price: "120,000",
        img: "assets/watch6.png",
        brand: "IWC",
        category: "Chronograph",
        badge: "Classic",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "Understated maritime precision with vertical recessed totalizers, applied Arabic numerals, and razor-thin feuille hands.",
        story: "Born from a 1939 commission for marine chronometer accuracy on the wrist, the Portugieser balances technical clarity with timeless elegance.",
        specs: {
            caliber: "IWC Manufacture Cal. 69355",
            diameter: "41 mm",
            thickness: "13.0 mm",
            caseMaterial: "316L Polished Stainless Steel",
            waterResistance: "30 m / 3 ATM",
            powerReserve: "46 Hours",
            crystal: "Convex Sapphire, AR Both Sides",
            strap: "Santoni Black Alligator Leather"
        }
    },
    {
        id: 7,
        ref: "TAG-MR-007",
        name: "Monaco Racing",
        priceNum: 110000,
        price: "110,000",
        img: "assets/watch7.png",
        brand: "Tag Heuer",
        category: "Chronograph",
        badge: "Motorsport",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "The rebellious square silhouette of grand prix history. Powered by an in-house column-wheel automatic chronograph caliber.",
        story: "Immortalized on the circuits of Le Mans and Monte Carlo, the Monaco Racing brings unmistakable motorsport adrenaline to formal and casual attire.",
        specs: {
            caliber: "Calibre Heuer 02 Automatic",
            diameter: "39 mm",
            thickness: "14.3 mm",
            caseMaterial: "Fine-Brushed & Polished Steel",
            waterResistance: "100 m / 10 ATM",
            powerReserve: "80 Hours",
            crystal: "Beveled Domed Sapphire",
            strap: "Perforated Racing Calfskin"
        }
    },
    {
        id: 8,
        ref: "RLX-SH-008",
        name: "Submariner Hulk",
        priceNum: 450000,
        price: "450,000",
        img: "assets/watch8.png",
        brand: "Rolex",
        category: "Diver",
        badge: "Collector's Vault",
        availability: "Vault Allocation — 1 Piece Available",
        featured: true,
        desc: "The benchmark of luxury dive watches. Featuring the coveted sunburst emerald green dial and Cerachrom unidirectional bezel.",
        story: "Discontinued and fiercely sought-after worldwide, our authenticated Vault specimen arrives complete with box, papers, and Aura 10-year mechanical guarantee.",
        specs: {
            caliber: "Perpetual Calibre 3135 COSC",
            diameter: "40 mm",
            thickness: "12.5 mm",
            caseMaterial: "Oystersteel 904L & Ceramic Bezel",
            waterResistance: "300 m / 30 ATM",
            powerReserve: "48 Hours",
            crystal: "Sapphire with Cyclops Lens",
            strap: "Oyster Bracelet with Glidelock"
        }
    },
    {
        id: 9,
        ref: "PPK-NB-009",
        name: "Nautilus Blue",
        priceNum: 2500000,
        price: "2,500,000",
        img: "assets/watch9.png",
        brand: "Patek Philippe",
        category: "Iconic",
        badge: "Haute Horlogerie",
        availability: "Private Allocation — By Inquiry or Direct Reserve",
        featured: true,
        desc: "The world's most coveted luxury sports timepiece. Porthole-inspired octagonal bezel paired with a horizontally embossed midnight-blue dial.",
        story: "Designed by Gérald Genta, the Nautilus represents generations of Geneva Seal excellence—a true generational heirloom curated exclusively by Aura.",
        specs: {
            caliber: "Caliber 26-330 S C Self-Winding",
            diameter: "40.5 mm",
            thickness: "8.3 mm",
            caseMaterial: "Hand-Finished Stainless Steel",
            waterResistance: "120 m / 12 ATM",
            powerReserve: "45 Hours",
            crystal: "Sapphire Exhibition Caseback",
            strap: "Integrated Tapered Steel Bracelet"
        }
    },
    {
        id: 10,
        ref: "ADP-RO-010",
        name: "Royal Oak Gold",
        priceNum: 1800000,
        price: "1,800,000",
        img: "assets/watch10.png",
        brand: "Audemars Piguet",
        category: "Iconic",
        badge: "Rare Vault",
        availability: "Vault Allocation — 1 Piece Available",
        featured: false,
        desc: "Architectural audacity cast in solid 18k pink gold, defined by its hexagonal bezel screws and Grande Tapisserie guilloché dial.",
        story: "Every facet of the Royal Oak bracelet is alternately satin-brushed and mirror-chamfered by hand in Le Brassus to create its signature cascade of light.",
        specs: {
            caliber: "Calibre 4302 Self-Winding",
            diameter: "41 mm",
            thickness: "10.5 mm",
            caseMaterial: "18k Solid Pink Gold",
            waterResistance: "50 m / 5 ATM",
            powerReserve: "70 Hours",
            crystal: "Glareproofed Sapphire Front & Back",
            strap: "18k Pink Gold Integrated Bracelet"
        }
    },
    {
        id: 11,
        ref: "BRT-NV-011",
        name: "Navitimer B01",
        priceNum: 130000,
        price: "130,000",
        img: "assets/watch11.png",
        brand: "Breitling",
        category: "Aviation",
        badge: "Aviation",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "The undisputed companion of aviators since 1952, equipped with the iconic circular slide rule bezel and manufacture B01 chronograph.",
        story: "Engineered to calculate airspeed, fuel consumption, and climb rates without electronics, the Navitimer blends cockpit heritage with modern refinement.",
        specs: {
            caliber: "Breitling Manufacture B01 COSC",
            diameter: "43 mm",
            thickness: "13.6 mm",
            caseMaterial: "Polished Stainless Steel",
            waterResistance: "30 m / 3 ATM",
            powerReserve: "70 Hours",
            crystal: "Cambered Sapphire, Glareproofed",
            strap: "Seven-Row Navitimer Bracelet"
        }
    },
    {
        id: 12,
        ref: "HBL-BB-012",
        name: "Big Bang Unico",
        priceNum: 320000,
        price: "320,000",
        img: "assets/watch12.png",
        brand: "Hublot",
        category: "Chronograph",
        badge: "Avant-Garde",
        availability: "In Stock — Ready for Delivery",
        featured: false,
        desc: "The Art of Fusion realized through micro-blasted ceramic, skeletonized flyback chronograph mechanics, and bold industrial architecture.",
        story: "Revealing its column wheel directly through the dial, the Big Bang Unico celebrates modern metallurgy and mechanical transparency.",
        specs: {
            caliber: "HUB1280 UNICO Flyback Chrono",
            diameter: "42 mm",
            thickness: "14.5 mm",
            caseMaterial: "Microblasted Black Ceramic & Titanium",
            waterResistance: "100 m / 10 ATM",
            powerReserve: "72 Hours",
            crystal: "Sapphire with Anti-Reflective Coat",
            strap: "Structured Lined Natural Rubber"
        }
    }
];

const articles = [
    {
        id: 1,
        category: "HISTORY",
        title: "The Evolution of the Tourbillon",
        subtitle: "How a 200-year-old anti-gravity invention continues to define modern watchmaking excellence.",
        author: "Henri Delacroix",
        role: "Chief Horologist, Geneva",
        date: "October 2026",
        readTime: "6 min read",
        img: "assets/magazine1.png",
        featured: true,
        content: [
            "Patented by Abraham-Louis Breguet in 1801, the tourbillon was originally conceived to solve a practical problem of pocket watches: because they rested vertically in a waistcoat pocket for hours on end, Earth's gravity pulled inconsistently on the balance spring, causing rate deviations.",
            "Breguet's solution was audacious—mount the entire escapement and balance wheel inside a lightweight rotating cage completing one revolution every sixty seconds. By continuously averaging out positional errors, the movement achieved unprecedented chronometric stability.",
            "Two centuries later, even though wristwatches constantly shift positions throughout the day, the tourbillon remains the supreme emblem of mechanical mastery. At Aura Chronos, crafting a single titanium tourbillon bridge requires over 45 hours of hand-beveling using gentian wood and diamond paste.",
            "Modern watchmaking has pushed Breguet's vision into breathtaking new dimensions: flying tourbillons suspended without an upper bridge, bi-axial cages spinning across two planes simultaneously, and ultra-thin cages weighing less than 0.29 grams—lighter than a swan's feather."
        ]
    },
    {
        id: 2,
        category: "INTERVIEW",
        title: "A Day with a Master Polisher",
        subtitle: "Inside the quiet Geneva bench where 'Black Polish' transforms raw steel into liquid light.",
        author: "Layla El-Sherif",
        role: "Editorial Director",
        date: "September 2026",
        readTime: "5 min read",
        img: "assets/magazine2.png",
        featured: false,
        content: [
            "In a sunlit corner of our Rue du Rhône atelier, silence is broken only by the soft, rhythmic glide of steel across a zinc lap plate. Here sits Marc-Antoine, a master finisseur with thirty-two years of experience in poli noir—known in English as black polishing.",
            "Despite its name, black polishing uses no dark coating. Instead, it polishes a metal surface to such microscopic flatness that light reflects in only one exact direction. From almost every angle, the component shines like a pristine mirror; tilt it a fraction of a degree, and it turns pure, impenetrable obsidian black.",
            "'A machine can make metal shiny in seconds,' Marc-Antoine smiles, holding a tiny tourbillon bridge with boxwood tweezers. 'Only human fingertips can feel the exact resistance of the diamond paste when flatness becomes perfection. One stray speck of dust means starting over from the beginning.'",
            "Every Aura Private movement conceals dozens of hours of this invisible art on bridges, screw heads, and bevels—finishings few owners will ever see without a loupe, yet every collector immediately feels."
        ]
    },
    {
        id: 3,
        category: "COLLECTOR'S GUIDE",
        title: "Building a Three-Watch Legacy Collection",
        subtitle: "The strategic art of pairing a dress icon, a rugged diver, and a high-complication chronograph.",
        author: "Tarek Mansour",
        role: "Senior Vault Curator, Cairo",
        date: "August 2026",
        readTime: "4 min read",
        img: "assets/watch3.png",
        featured: false,
        content: [
            "Whether you are acquiring your first mechanical timepiece or refining a twenty-piece vault, the timeless three-watch triad remains the foundation of intelligent horological collecting.",
            "First, the Everyday Architectural Piece: a versatile steel or titanium icon with 100 meters of water resistance—such as the Aura Phantom Obsidian or Patek Philippe Nautilus—that transitions seamlessly from boardroom meetings to coastal weekends.",
            "Second, the Formal Dress Companion: an ultra-thin rose gold timepiece like the Golden Hour, slipping effortlessly beneath a tailored French cuff while radiating warmth and restraint.",
            "Third, the Mechanical Storyteller: a legendary chronograph or dive benchmark such as the Moonwatch Master or Submariner Hulk—a watch carrying decades of human achievement and lasting collector liquidity."
        ]
    },
    {
        id: 4,
        category: "CRAFTSMANSHIP",
        title: "Metallurgy of the Future: Obsidian Titanium",
        subtitle: "Why Grade 5 titanium with diamond-like carbon coating is redefining modern luxury comfort.",
        author: "Dr. Stefan Keller",
        role: "Materials Engineer",
        date: "July 2026",
        readTime: "5 min read",
        img: "assets/watch1.png",
        featured: false,
        content: [
            "For decades, heft was equated with luxury. Today's discerning collector demands something far harder to engineer: uncompromising structural strength paired with weightless, ergonomic comfort.",
            "Grade 5 titanium (Ti-6Al-4V) offers nearly half the weight of stainless steel with dramatically higher tensile strength and complete biocompatibility. Unlike lower-grade titanium, Grade 5 can be mirror-polished to rival platinum.",
            "When infused with our proprietary Obsidian DLC (Diamond-Like Carbon) plasma deposition at the molecular level, the resulting case achieves a surface hardness exceeding 1,200 Vickers—resisting everyday micro-scratches while preserving its velvety matte noir finish for decades."
        ]
    }
];

const boutiquesData = [
    {
        id: "cairo",
        city: "Cairo",
        name: "Cairo Flagship Salon",
        address: "Arkan Plaza, Pavilion 4, Sheikh Zayed City, Giza, Egypt",
        phone: "+20 100 884 1924",
        email: "cairo@aurachronos.eg",
        hours: "Sat – Thu: 11:00 AM – 10:00 PM | Fri: 2:00 PM – 11:00 PM",
        timezone: "Africa/Cairo",
        features: ["Private Collector Lounge", "On-Site Master Watchmaker", "Bespoke Strap Atelier", "Valet & Armored Dispatch"],
        badge: "Middle East Flagship",
        mapUrl: "https://maps.google.com/?q=Arkan+Plaza+Sheikh+Zayed+Cairo"
    },
    {
        id: "geneva",
        city: "Geneva",
        name: "Geneva Manufacture & Atelier",
        address: "Rue du Rhône 42, 1204 Genève, Switzerland",
        phone: "+41 22 819 1924",
        email: "geneva@aurachronos.ch",
        hours: "Mon – Sat: 10:00 AM – 6:30 PM",
        timezone: "Europe/Zurich",
        features: ["Heritage Museum Archive", "Complication Restoration Lab", "Private Vault Viewings", "Swiss Espresso & Champagne Bar"],
        badge: "Global Headquarters",
        mapUrl: "https://maps.google.com/?q=Rue+du+Rhone+42+Geneva"
    },
    {
        id: "london",
        city: "London",
        name: "London Mayfair Lounge",
        address: "118 New Bond Street, Mayfair, London W1S 1EN, UK",
        phone: "+44 20 7946 1924",
        email: "london@aurachronos.co.uk",
        hours: "Mon – Sat: 10:00 AM – 7:00 PM | Sun: By Appointment",
        timezone: "Europe/London",
        features: ["Private Mayfair Suite", "Accredited Insurance Valuations", "Rare Vintage Sourcing", "Complimentary Ultrasonic Spa"],
        badge: "European Salon",
        mapUrl: "https://maps.google.com/?q=New+Bond+Street+London"
    }
];

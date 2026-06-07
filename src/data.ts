import { Service, CateringItem, CateringPackage, PortfolioItem, Review } from "./types";

export const SERVICES: Service[] = [
  {
    id: "mandap-decor",
    title: "Shahi Mandap & Spatial Decor",
    description: "Bespoke sacred mandap architecture using fresh jasmine, marigold, custom brass artifacts, Royal carpets, and cinematic warm spot lighting.",
    basePrice: 150000,
    iconName: "Flower",
    details: [
      "Thematic floral backdrops (Marigold, Rose, Orchid cascades)",
      "Traditional brass oil lamps & antique props",
      "Royal stage seating for Bride & Groom",
      "Themed entrance gates and pathway drapery",
      "Ambient warm lighting, fairy-light canopies & chandeliers"
    ]
  },
  {
    id: "shahi-catering",
    title: "Tradition Shahi Caterers",
    description: "Multi-course pure vegetarian and select curated menus capturing MP's rich cultural recipes, royal Indori chaat counters, and traditional Indian hospitality.",
    basePrice: 80000,
    iconName: "Utensils",
    details: [
      "Handcrafted pure brass and copper serving dishes",
      "Traditional attire clad hospitality and service staff",
      "Signature local delicacies (Dal Baati and Indori Sheetal Chaat)",
      "Premium dessert studios with live hot jalebi and kulfi setups",
      "High-grade mineral water & organic mocktail lounges"
    ]
  },
  {
    id: "premium-entry",
    title: "Heritage Barat & Royal Entries",
    description: "Unforgettable entry designs from traditional vintage carriages to floral doli, accompanied by shehnai orchestras and live folk dancers.",
    basePrice: 75000,
    iconName: "Sparkles",
    details: [
      "Decorated premium horse carriage (Bagghi) or vintage cars",
      "Exquisite floral doli/palki for the Bride's entry",
      "Premium cold-fire pyrotechnic sequences & dry-ice clouds",
      "Professional Shehnai troupe, Punjabi dhol, and traditional band",
      "Fresh rose petal shower cannons to welcome the couple"
    ]
  },
  {
    id: "ritual-coordination",
    title: "Haldi & Mehendi Ritual Themes",
    description: "Stunning yellow-hued setups for Haldi and vibrant marigold canopies for Mehendi, keeping age-old customs close to heart.",
    basePrice: 50000,
    iconName: "Heart",
    details: [
      "Giant clay urli pots with water and flower petals for the Haldi dips",
      "Vibrant yellow-orange drape swings for Mehendi photography",
      "Traditional handcrafted puppet hangings and organic color themes",
      "Arrangements of organic, skin-friendly herbal turmeric paste",
      "Sangeet stage setups with premium sound systems and microphones"
    ]
  },
  {
    id: "photography-cinematic",
    title: "Cinematic Heritage Shoots",
    description: "Candid traditional framing, slow-motion drony transitions, and bespoke high-definition family legacy albums.",
    basePrice: 120000,
    iconName: "Camera",
    details: [
      "Continuous wedding and ritual documentation by senior artists",
      "Dramatic drone footage of the venue and royal baraat",
      "Aesthetic cinematic teaser trailer (3-5 minutes) with traditional melodies",
      "Custom velvet-bound layflat paper photo albums (150 pages)",
      "Digital cloud gallery delivered with lifelong private access"
    ]
  }
];

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: "pkg-utsav",
    name: "Utsav Feast (Royal Gold Heritage)",
    pricePerPlate: 650,
    description: "An authentic, pristine vegetarian spread showcasing the beloved traditional dishes of Central and North India.",
    includes: [
      "1 Welcome Drink",
      "2 Hot Starters & Chaats",
      "1 Jabalpur Special Paneer",
      "2 Seasonal Vegetable Dishes",
      "2 Traditional Breads",
      "1 Dal & Authentic Rice",
      "2 Craft Desserts"
    ],
    itemsExample: ["Sheetal Jal", "Hara Bhara Kebab", "Kadhai Paneer Garha", "Aloo Gobhi Adraki", "Amritsari Kulcha", "Dal Fry", "Moong Dal Halwa"]
  },
  {
    id: "pkg-shahi",
    name: "Shahi Rajana (Premium Maharaja Table)",
    pricePerPlate: 1100,
    description: "A luxurious culinary feast with interactive live stations, gourmet MP heritage recipes, and royal confectionery.",
    includes: [
      "2 Artisanal Welcome Mocktails",
      "4 Premium Starters",
      "2 Shahi Main Course Paneer & Kofta",
      "3 Exotic Global & Traditional Curries",
      "4 Live Bread Assortments (Butter, Garlic, Missi)",
      "1 Dal Makhani & Special Saffron Pulao",
      "3 Live Premium Desserts",
      "1 Indori Live Chaat Counter"
    ],
    itemsExample: ["Kesar Badam Thandai", "Paneer Tikka Banarasi", "Beetroot Galouti Kebab", "Shahi Paneer Laziz", "Malai Kofta", "Fresh Naan", "Live Imarti with Rabri"]
  },
  {
    id: "pkg-veda",
    name: "Veda Heritage (Ultra Luxury Platinum)",
    pricePerPlate: 1800,
    description: "Our signature high-end dining masterpiece. Featuring absolute royal-grade brassware, gourmet live action stalls, and international traditional fusion.",
    includes: [
      "3 Welcome Elixirs",
      "6 Luxury Starters (Clay Oven baked live)",
      "3 Master Chef Special Curries",
      "4 Specialty Breads of India",
      "2 Heritage Rice (Shahi Dum Biryani)",
      "4 Heavenly Desserts with Ice Cream Station",
      "2 Live Action Counters (Woodfired Jalebi, Royal Indori Paan Block)"
    ],
    itemsExample: ["Rose Cardamom Lassi", "Charcoal Paneer Tikka", "Lotus Stem Kebabs", "Nizami Dum Paneer", "Special Dal Sultani", "Awadhi Dum Biryani", "Moong Dal Halwa with dry fruits"]
  }
];

export const CATERING_ITEMS: CateringItem[] = [
  // Welcome Drinks
  {
    id: "item-thandai",
    name: "Traditional Kesar Badam Thandai",
    category: "Welcome Drinks",
    description: "Slow-brewed rich almond elixir flavored with premium Kashmiri saffron, cardamom, and rose petals.",
    isPopular: true
  },
  {
    id: "item-panna",
    name: "Royal Raw Mango Aam Panna",
    category: "Welcome Drinks",
    description: "Tangy cooling organic drink prepared with roasted forest green mangoes, mint leaves, and roasted cumin spices."
  },
  {
    id: "item-lassi",
    name: "Rose-water Cardamom Sweet Lassi",
    category: "Welcome Drinks",
    description: "Velvety hand-churned yogurt beverage sweetened with rose syrup and select toasted cardamom seeds."
  },

  // Starters
  {
    id: "item-tikka",
    name: "Achari Paneer Tikka (Live Tandoor)",
    category: "Starters",
    description: "Thick blocks of fresh Jabalpur dairy paneer, marinated in handpicked pickle spices and roasted in coal fire.",
    isPopular: true
  },
  {
    id: "item-kebab",
    name: "Beetroot & Cashew Galouti Kebab",
    category: "Starters",
    description: "Mouth-melting fine beetroot mince infused with royal spices, ghee, and roasted cashew crumbles."
  },
  {
    id: "item-corn",
    name: "Crispy Golden Corn Salt & Pepper",
    category: "Starters",
    description: "Tender local sweet corn kernels tossed with fresh chillies, spring onions, and oriental mountain salt."
  },

  // Main Course
  {
    id: "item-paneer-laziz",
    name: "Heritage Shahi Paneer Laziz",
    category: "Main Course",
    description: "Soft cottage cheese triangles simmered in a majestic golden gravy of onions, cashews, and rich butter ghee.",
    isPopular: true
  },
  {
    id: "item-dal-baati",
    name: "Traditional MP Dal Baati Churma",
    category: "Main Course",
    description: "Smoky mud-oven baked wheat balls dipped in thick ghee, served with panchmel spicy lentils and sweet churma powdery treat."
  },
  {
    id: "item-biryani",
    name: "Royal Dum Pukht Awadhi Biryani",
    category: "Main Course",
    description: "Aromatic long-grain basmati rice layered with seasonal vegetables, hand-ground spices, rose water, cooked under sealed clay dough.",
    isPopular: true
  },
  {
    id: "item-kofta",
    name: "Narmada Valley Malai Kofta",
    category: "Main Course",
    description: "Rich dumplings of paneer and mawa stuffed with walnuts and raisins, served in a mild creamy velvet gravy."
  },

  // Live Counters
  {
    id: "item-chaat",
    name: "Indori Shahi Chaat & Golgappa Tower",
    category: "Live Counters & Stalls",
    description: "Interactive stations with multiple tangy water flavors, crisp Indori dahi vada, papdi chaat, and steaming ragda tikkis.",
    isPopular: true
  },
  {
    id: "item-tandoor-live",
    name: "Clay Oven Indian Hearth Breads",
    category: "Live Counters & Stalls",
    description: "Skilled rotimakers throwing paper-thin Roomali rotis, stuffed butter Kulchas, and smoky Missi rotis on real coal ovens."
  },

  // Desserts
  {
    id: "item-jalebi",
    name: "Live Shahi Jalebi with Creamy Rabri",
    category: "Desserts",
    description: "Crispy golden spirals fried live in pure desi ghee, soaked in saffron syrup and layered with cool thickened slow-reduced milk.",
    isPopular: true
  },
  {
    id: "item-halwa",
    name: "Golden Moong Dal Halwa (Desi Ghee)",
    category: "Desserts",
    description: "Rich traditional sweet luxury made of ground yellow lentils slow cooked with pure clarified butter, almonds, and cardamom."
  },
  {
    id: "item-kulfi",
    name: "Matka Malai Kulfi Falooda with Rose syrup",
    category: "Desserts",
    description: "Traditional dense ice cream set in earthen clay pots, served sliced over vermicelli falooda and sweet chia kernels."
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "port-1",
    category: "Mandap & Decor",
    title: "The Golden Marigold Forest",
    location: "Royal Palace Grounds, Jabalpur",
    description: "A grand scale open-air evening mandap constructed under a canopy of 10,000 hanging marigold flowers with custom brass pillars.",
    imageUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "port-2",
    category: "Royal Reception",
    title: "Grand Ivory Pillars Reception",
    location: "Sanjeevni Palace Banquet, Jabalpur",
    description: "A stately, modern royal reception styled in white roses, dramatic crystal chandeliers, and classical velvet drapes.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "port-3",
    category: "Catering Feast",
    title: "The Maharajah's Culinary Court",
    location: "Mohan Vihar Palace Lawns, Garha",
    description: "Our signature catering presentation styled with pure brass warmers, organic leaf plates, and extensive live chaat setups.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "port-4",
    category: "Traditional Rituals",
    title: "Vibrant Haldi Clay Oasis",
    location: "Anjani Chhaya Gardens, Jabalpur",
    description: "A joyful morning Haldi celebration styled with a massive brass urli pot, yellow drapes, and interactive marigold gunny-bags.",
    imageUrl: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "port-5",
    category: "Mandap & Decor",
    title: "Crimson Royal Dome",
    location: "Narmada Valley Resort, Jabalpur",
    description: "An indoor royal mandap styled on rich red drapes, jasmine floral curtains, and a pristine mirror reflection floor.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "port-6",
    category: "Traditional Rituals",
    title: "Intimate Mehndi Swing Rituals",
    location: "Sanjeevni Colony Vista, Jabalpur",
    description: "A stunning bohemian traditional setup featuring low seating, custom handpainted umbrellas, and fresh organic mehendi stalls.",
    imageUrl: "https://images.unsplash.com/photo-1621616875450-79f224480400?q=80&w=800&auto=format&fit=crop"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Durgesh Patel",
    rating: 5,
    comment: "Simply phenomenal coordination! Traditional Wedding Planner & Caterers made our wedding a monumental memory. The food, especially the Indori Chaat and live Jalebi with Rabri, was talked about by our relatives for months. Our mandap was decorated so beautifully custom tailored to our tastes. Worth every rupee!",
    relationship: "Groom",
    date: "November 24, 2025",
    location: "Jabalpur"
  },
  {
    id: "rev-2",
    author: "Anjali Chouhan",
    rating: 5,
    comment: "The absolute best decorators in Jabalpur! The Haldi set up they created near Budhauliya Hospital with clay pots and marigold curtains was so picturesque. Their team took care of all coordination so calmly. Highly recommended for premium hospitality.",
    relationship: "Bride",
    date: "January 14, 2026",
    location: "Garha, Jabalpur"
  },
  {
    id: "rev-3",
    author: "Ramendra Mishra",
    rating: 5,
    comment: "We booked food catering for 800 guests. The authentic Dal Baati and awesome Awadhi Dum Biryani cooked in pure Desi Ghee exceeded all standard buffet levels. The service staff presented everything in real heavy brass utensils. 5-star experience indeed!",
    relationship: "Father of the Bride",
    date: "February 19, 2026",
    location: "Sanjeevni Nagar"
  }
];

export const FAQ_ITEMS = [
  {
    question: "How far in advance should we book your planning and catering services?",
    answer: "We recommend booking at least 3 to 6 months in advance for peak wedding seasons (October to March) to ensure venue decoration slots and customized menu testing are reserved with complete attention to detail."
  },
  {
    question: "Can we customize the catering items or do we have to stick to packages?",
    answer: "Our booking wizard is fully custom-built! You can choose an initial tier package (Utsav, Shahi Rajana, or Veda Heritage) and then add specific live counters or gourmet dishes of your choice to create a bespoke dining story."
  },
  {
    question: "Do you manage weddings outside Jabalpur, Madhya Pradesh?",
    answer: "Yes! While our primary office is in Sanjeevni Nagar, Jabalpur, we regularly travel to design destination weddings and heritage royal celebrations throughout Madhya Pradesh, including Bhopal, Indore, and Khajuraho."
  },
  {
    question: "Is your food preparation completely vegetarian?",
    answer: "Yes, our central kitchen specializes exclusively in 100% Pure Vegetarian traditional Shahi cuisine. We adhere strictly to absolute purity standards, sourcing organic spices and maintaining hygienic state-of-the-art preparation centers."
  },
  {
    question: "Do you offer food tasting trials before the wedding booking?",
    answer: "Absolutely! Once we finalize a booking draft or quote range, we host an premium private tasting session for the family at our central tasting kitchen to sample and adjust salt, sweetness, and spices."
  }
];

export const WEDDING_TIMINGS = {
  days: "Sunday to Saturday",
  hours: "10:30 am – 8:00 pm",
  phone: "079998 51222",
  address: "Shop No 1, First Floor, Sanjeevni Nagar, Royal Palace, Near Budhauliya Hospital, Anjani Chhaya Sanjeevani Nagar, Mohan Vihar Colony, Garha, Jabalpur, Madhya Pradesh 482001",
  instagram: "https://www.instagram.com/_mr_durgesh_g22?igsh=a2YxYzVrcTYxOGth",
  ratings: "5.0 ★★★★★ (133 reviews verified via Google)"
};

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flower,
  Utensils,
  ChevronDown,
  Check,
  Instagram,
  Phone,
  MapPin,
  Calendar,
  Users,
  Award,
  Star,
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  Heart,
  Plus,
  X,
  ChevronRight
} from "lucide-react";
import {
  SERVICES,
  CATERING_PACKAGES,
  CATERING_ITEMS,
  PORTFOLIO_ITEMS,
  REVIEWS,
  FAQ_ITEMS,
  WEDDING_TIMINGS
} from "./data";
import { Service, CateringItem, CateringPackage, PortfolioItem, Review, Booking } from "./types";

export default function App() {
  // Navigation & Scroll states
  const [activeTab, setActiveTab] = useState<"services" | "catering" | "portfolio" | "booking" | "reviews">("services");
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sectionIds = ["about", "services", "catering", "portfolio", "booking-studio", "faq"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Trigger when the section center is premium viewed
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Detect if we scrolled back to top
    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Interactive Booking & Cost Estimator State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState<number>(300);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("pkg-shahi");
  const [selectedServices, setSelectedServices] = useState<string[]>(["mandap-decor", "shahi-catering"]);
  const [customCateringItems, setCustomCateringItems] = useState<string[]>(["item-thandai", "item-tikka", "item-jalebi"]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Success state for submission
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);

  // Portfolio Filters
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Mandap & Decor" | "Catering Feast" | "Royal Reception" | "Traditional Rituals">("All");

  // Reviews Interactive State
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewRole, setNewReviewRole] = useState("Bride");
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Selected Service Detail Modal/Expand
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>("mandap-decor");

  // Load bookings and custom reviews from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem("traditional_bookings");
    if (savedBookings) {
      try {
        setBookingHistory(JSON.parse(savedBookings));
      } catch (e) {
        console.error(e);
      }
    }

    const savedReviews = localStorage.getItem("traditional_custom_reviews");
    if (savedReviews) {
      try {
        setUserReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Calculate prices dynamically
  const activePackage = useMemo(() => {
    return CATERING_PACKAGES.find(p => p.id === selectedPackageId) || CATERING_PACKAGES[0];
  }, [selectedPackageId]);

  const cateringPriceTotal = useMemo(() => {
    return activePackage.pricePerPlate * guestCount;
  }, [activePackage, guestCount]);

  const servicesPriceTotal = useMemo(() => {
    let total = 0;
    SERVICES.forEach(s => {
      if (selectedServices.includes(s.id)) {
        total += s.basePrice;
      }
    });
    return total;
  }, [selectedServices]);

  // Premium add-on items (each item selected adds ₹40 per plate)
  const customItemsPriceTotal = useMemo(() => {
    return customCateringItems.length * 40 * guestCount;
  }, [customCateringItems, guestCount]);

  const rawTotal = useMemo(() => {
    return cateringPriceTotal + servicesPriceTotal + customItemsPriceTotal;
  }, [cateringPriceTotal, servicesPriceTotal, customItemsPriceTotal]);

  // Apply a discount if guest count > 500 or multiple services are clubbed
  const dynamicDiscount = useMemo(() => {
    let discount = 0;
    if (guestCount >= 600) {
      discount += rawTotal * 0.05; // 5% grand size discount
    }
    if (selectedServices.length >= 3) {
      discount += rawTotal * 0.05; // 5% multi-service package discount
    }
    return Math.round(discount);
  }, [guestCount, selectedServices, rawTotal]);

  const estimatedTotal = useMemo(() => {
    return rawTotal - dynamicDiscount;
  }, [rawTotal, dynamicDiscount]);

  // Handle service toggle
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Handle custom catering item toggle
  const toggleCateringItem = (id: string) => {
    if (customCateringItems.includes(id)) {
      setCustomCateringItems(customCateringItems.filter(item => item !== id));
    } else {
      setCustomCateringItems([...customCateringItems, id]);
    }
  };

  // Portfolio items filter
  const filteredPortfolio = useMemo(() => {
    if (selectedCategory === "All") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Combined standard + custom reviews
  const allReviews = useMemo(() => {
    return [...userReviews, ...REVIEWS];
  }, [userReviews]);

  const totalReviewsCount = useMemo(() => {
    return 133 + userReviews.length;
  }, [userReviews]);

  // Submit booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !eventDate) {
      alert("Please fill in your name, contact phone, and wedding date.");
      return;
    }

    const newBooking: Booking = {
      id: "TWW-" + Math.floor(100000 + Math.random() * 900000),
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      guestCount,
      selectedPackageId,
      selectedServices,
      customCateringItems,
      additionalNotes,
      estimatedTotal,
      createdAt: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      status: "Pending Approval"
    };

    const updated = [newBooking, ...bookingHistory];
    setBookingHistory(updated);
    localStorage.setItem("traditional_bookings", JSON.stringify(updated));
    setCreatedBooking(newBooking);

    // Scroll to invoice view
    const invoiceEl = document.getElementById("booking-dashboard");
    if (invoiceEl) {
      invoiceEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset Booking Wizard
  const handleResetBooking = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setEventDate("");
    setGuestCount(300);
    setSelectedPackageId("pkg-shahi");
    setSelectedServices(["mandap-decor", "shahi-catering"]);
    setCustomCateringItems(["item-thandai", "item-tikka", "item-jalebi"]);
    setAdditionalNotes("");
    setCreatedBooking(null);
  };

  // Submit Review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) {
      alert("Please provide both your name and review details.");
      return;
    }

    const newReview: Review = {
      id: "REV-C-" + Math.floor(1000 + Math.random() * 9000),
      author: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
      relationship: newReviewRole,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      location: "Jabalpur"
    };

    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem("traditional_custom_reviews", JSON.stringify(updated));

    // Reset Form
    setNewReviewAuthor("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setNewReviewRole("Bride");
    setIsAddingReview(false);
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 5000);
  };

  // Formatting helper for Indian Rupee
  const formatRupee = (value: number) => {
    return "₹" + value.toLocaleString("en-IN");
  };

  return (
    <div className="bg-sand-50 text-royal-950 font-sans min-h-screen relative overflow-x-hidden selection:bg-royal-200 selection:text-royal-900 bg-noise">
      
      {/* Decorative floral backgrounds */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-gold-400/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] -right-20 w-96 h-96 bg-royal-100/30 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-10 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-royal-900 via-royal-950 to-royal-900 text-gold-300 py-2.5 px-4 text-center text-xs tracking-wider z-50 relative font-medium border-b border-gold-600/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Now Booking for 2026 Festive Season • Jabalpur Heritage Craftsmen</span>
          </div>
          <div className="flex items-center gap-3 divide-x divide-gold-600/30">
            <span className="pl-3 flex items-center gap-1 text-white">
              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
              <strong>{WEDDING_TIMINGS.ratings.split(" ")[0]} ({totalReviewsCount} Google Reviews)</strong>
            </span>
            <a href="tel:07999851222" className="pl-3 flex items-center gap-1 text-gold-300 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> {WEDDING_TIMINGS.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 w-full z-40 transition-all duration-300 backdrop-blur-md bg-sand-50/80 border-b border-royal-900/5 shadow-xs"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex flex-col group">
            <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-tight text-royal-900 font-extrabold group-hover:text-royal-700 transition-colors">
              Traditional <span className="text-gold-600 font-normal italic">Wedding Planner</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-royal-600 font-bold -mt-1 block">
              &amp; Shahi Caterers
            </span>
          </a>
          
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-semibold uppercase tracking-widest text-royal-900/85">
            {[
              { id: "about", label: "Heritage Vision", href: "#about" },
              { id: "services", label: "Royal Services", href: "#services" },
              { id: "catering", label: "Shahi Catering", href: "#catering" },
              { id: "portfolio", label: "Portfolio Gallery", href: "#portfolio" },
              { id: "booking-studio", label: "Plate Estimator", href: "#booking-studio" },
              { id: "faq", label: "FAQs", href: "#faq" }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative py-2 transition-all text-xs font-semibold tracking-widest uppercase block hover:text-gold-600 ${
                    isActive ? "text-gold-600 font-bold" : "text-royal-900/80"
                  }`}
                >
                  <span className="relative z-10 transition-transform hover:-translate-y-0.5 block">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-600 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#booking-studio"
              className="bg-royal-900 hover:bg-royal-800 text-sand-50 text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-royal-900/15"
            >
              Start Booking
            </a>
            <a
              href={WEDDING_TIMINGS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-royal-900 hover:text-gold-600 border border-royal-900/10 rounded-full hover:bg-white transition-all"
              title="Visit Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-royal-800/10 bg-white/40 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-royal-800">
                Crafting Eternal Memories in Jabalpur
              </span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-royal-950 tracking-tight text-balance">
              Where heritage <br />
              <span className="italic text-gold-500 relative inline-block font-normal">
                meets grandeur
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-gold-400 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 50 18 100 10" stroke="currentColor" strokeWidth="2.5" fill="none"></path>
                </svg>
              </span>
            </h1>

            <p className="text-royal-900/70 text-base sm:text-lg font-light tracking-wide max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the absolute pinnacle of traditional Indian weddings. Built with bespoke mandap decor, flawless royal wedding banquets, and customized shahi catering menus served in heavy brassware.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#booking-studio"
                className="bg-royal-950 hover:bg-royal-900 text-white font-medium text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-royal-950/20 active:translate-y-0.5 flex items-center gap-2"
              >
                Estimate Plate Cost <ArrowRight className="w-4 h-4 text-gold-400" />
              </a>
              <a
                href="#portfolio"
                className="bg-white/90 hover:bg-white text-royal-950 border border-royal-900/15 font-medium text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all hover:scale-102 flex items-center gap-2"
              >
                Browse Gallery
              </a>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0 border-t border-royal-900/5">
              <div className="text-center lg:text-left">
                <span className="block font-serif text-3xl font-extrabold text-royal-950">5.0</span>
                <span className="block text-[10px] text-royal-600/80 uppercase tracking-widest font-semibold mt-1">Google Rating</span>
              </div>
              <div className="text-center lg:text-left border-x border-royal-900/10 px-4">
                <span className="block font-serif text-3xl font-extrabold text-royal-950">133+</span>
                <span className="block text-[10px] text-royal-600/80 uppercase tracking-widest font-semibold mt-1">Happy Couples</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif text-3xl font-extrabold text-gold-600">100%</span>
                <span className="block text-[10px] text-royal-600/80 uppercase tracking-widest font-semibold mt-1">Pure Vegetarian</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Premium Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative mt-6 lg:mt-0"
          >
            <div className="relative mx-auto w-full max-w-[420px] aspect-[4/5] rounded-[3rem] p-4 bg-white/70 backdrop-blur-md shadow-2xl border border-white/80">
              
              {/* Outer decorative arched image container */}
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative group">
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-royal-950/90 via-royal-900/40 to-transparent z-10 p-6 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gold-400">Royal Ceremony</span>
                  <h3 className="font-serif text-xl sm:text-2xl mt-1 text-sand-50">Shahi Mandap Setup</h3>
                  <p className="text-xs text-sand-200/80 font-light mt-1">Sanjeevni Palace Royal Banquet Garden</p>
                </div>
                
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop"
                  alt="Traditional Indian Wedding Setup"
                  className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Decorative floating badges */}
              <div className="absolute -top-4 -right-4 bg-gold-400 text-royal-950 p-4 rounded-full shadow-lg flex items-center justify-center animate-bounce-slow" style={{ animationDuration: "6s" }}>
                <Award className="w-6 h-6" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white border border-royal-900/5 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-royal-100 flex items-center justify-center text-royal-700">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-royal-950">Desi Ghee Sweets</span>
                  <span className="block text-[10px] text-royal-500">Pure traditional preparation</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Traditional wave separator */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden h-20">
          <svg className="w-full h-20 text-white fill-current" viewBox="0 0 1440 74" preserveAspectRatio="none">
            <path d="M0,0 C240,40 480,60 720,40 C960,20 1200,40 1440,0 L1440,74 L0,74 Z"></path>
          </svg>
        </div>
      </motion.header>

      {/* Heritage Concept Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-white relative z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="h-[1px] w-12 bg-gold-500"></span>
              <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">The Heritage Vision</span>
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl text-royal-950 leading-tight">
              Purity of traditional <br />
              <span className="italic text-royal-500">hospitality &amp; art</span>
            </h2>

            <div className="space-y-6 text-royal-900/70 font-light text-base leading-relaxed">
              <p>
                Based at the premium Royal Palace compound in <strong className="font-medium text-royal-950">Sanjeevni Nagar, Jabalpur</strong>, our core philosophy is simple: We treat every wedding as a sacred convergence. We maintain strict vegetarian preparation systems to supply the most delicious regional recipes passed down for generations.
              </p>
              <p>
                From meticulous floor arrangements adorned with auspicious marigolds to clay-pot cooked Awadhi biryani, our expert event directors eliminate the planning chaos, letting you immerse in the prayers and laughter.
              </p>
            </div>

            {/* Quick Features List */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className="text-sm text-royal-900 font-medium">Verified 5.0 Google Rating</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className="text-sm text-royal-900 font-medium">Desi Ghee Only Cooking</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className="text-sm text-royal-900 font-medium">Bespoke Mandap Curators</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className="text-sm text-royal-900 font-medium">On-Site Direct Supervision</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Split Decorative Layout */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg bg-sand-100">
                  <img
                    src="https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=800&auto=format&fit=crop"
                    alt="Authentic rituals fire"
                    className="w-full h-full object-cover grayscale-10 hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="col-span-4 self-end">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-md bg-sand-200 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=400&auto=format&fit=crop"
                    alt="Indian spices and grains"
                    className="w-full h-full object-cover grayscale-10 hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-gradient-to-br from-royal-800 to-royal-950 text-white rounded-2xl p-4 shadow-lg text-center">
                  <span className="block font-serif text-3xl font-bold text-gold-400">133</span>
                  <span className="block text-[8px] uppercase tracking-widest text-sand-300">Reviews &amp; counting</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* Services Showcase (Accordion details matching Spanish inspiration structure but Indian values) */}
      <motion.section
        id="services"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-sand-100/50 relative z-10 border-t border-royal-900/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">Select Offerings</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-royal-950">
              Catering and <span className="italic text-gold-600">Event Excellence</span>
            </h2>
            <p className="text-sm text-royal-900/60 leading-relaxed font-light">
              We specialize in blending the highest grade ingredients with magnificent spatial styling. Click on each service to discover detail checklists.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Service Lists Accordion (Left column) */}
            <div className="lg:col-span-7 space-y-4">
              {SERVICES.map((srv) => {
                const isSelected = expandedServiceId === srv.id;
                const isBookingSelected = selectedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "border-gold-500 shadow-md"
                        : "border-royal-900/5 shadow-xs hover:border-royal-900/10"
                    }`}
                  >
                    <div
                      onClick={() => setExpandedServiceId(isSelected ? null : srv.id)}
                      className="p-6 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? "bg-royal-900 text-gold-400" : "bg-sand-100 text-royal-900"
                        }`}>
                          {srv.id === "mandap-decor" && <Flower className="w-5 h-5" />}
                          {srv.id === "shahi-catering" && <Utensils className="w-5 h-5" />}
                          {srv.id === "premium-entry" && <Sparkles className="w-5 h-5" />}
                          {srv.id === "ritual-coordination" && <Heart className="w-5 h-5" />}
                          {srv.id === "photography-cinematic" && <Camera className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl text-royal-950 font-bold flex items-center gap-2">
                            {srv.title}
                          </h3>
                          <span className="text-[11px] font-medium text-gold-600 tracking-wider">
                            Starts from {formatRupee(srv.basePrice)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {/* Cost Estimator Selection Tick */}
                        <button
                          onClick={() => toggleService(srv.id)}
                          className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold transition-all ${
                            isBookingSelected
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sand-100 text-royal-900 hover:bg-royal-100"
                          }`}
                        >
                          {isBookingSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added to Estimator
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Add to Estimator
                            </>
                          )}
                        </button>
                        
                        <ChevronDown className={`w-5 h-5 text-royal-400 transition-transform duration-300 cursor-pointer ${
                          isSelected ? "rotate-180" : ""
                        }`}
                        onClick={() => setExpandedServiceId(isSelected ? null : srv.id)}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-royal-900/5 bg-sand-50/50"
                        >
                          <div className="p-6 space-y-4">
                            <p className="text-sm text-royal-900/70 font-light leading-relaxed">
                              {srv.description}
                            </p>
                            <div>
                              <h4 className="text-xs uppercase tracking-widest font-bold text-royal-950 mb-2">
                                Service Delirables Checklist:
                              </h4>
                              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-royal-900/80">
                                {srv.details.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Interactive Panel (Right column) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-royal-900/5 shadow-md space-y-6 sticky top-28">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-royal-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-gold-500" />
                Traditional Standard Quality Guarantee
              </span>

              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 bg-royal-100">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
                    alt="Wedding hands close up"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-serif text-2xl text-royal-950">
                  Flawless Event Directorship
                </h3>
                <p className="text-sm text-royal-900/70 leading-relaxed font-light">
                  Traditional Wedding Planner &amp; Caterers operates personally. Lead director Durgesh Patel personally supervises every site construct starting 24 hours prior to the wedding baraat arrival.
                </p>
                <div className="p-4 bg-sand-100/50 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-royal-900 uppercase tracking-wider">
                    Add-ons Selection Summary
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-royal-600/80">Selected Services ({selectedServices.length}):</span>
                      <span className="font-semibold text-royal-950">
                        {formatRupee(servicesPriceTotal)}
                      </span>
                    </div>
                    <p className="text-[10px] text-royal-500 italic">
                      Includes: {selectedServices.length > 0 ? SERVICES.filter(s => selectedServices.includes(s.id)).map(s => s.title.split(" ")[0]).join(", ") : "None"}
                    </p>
                  </div>
                </div>
                
                <a
                  href="#booking-studio"
                  className="block w-full text-center bg-royal-900 hover:bg-royal-800 text-white font-semibold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors shadow-xs"
                >
                  Configure Event Cost Now
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Shahi Catering Section */}
      <motion.section
        id="catering"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-white relative z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">Aromatic Heritage Kitchen</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-royal-950">Traditional <span className="italic text-royal-500">Shahi Catering Tiers</span></h2>
            </div>
            <p className="text-royal-900/60 max-w-md text-sm leading-relaxed font-light">
              Pristinely curated vegetarian tiers representing the highest standards of culinary aesthetics. Heavy brass chafing dishes, clay oven baking counters, and natural clarified butter preparations.
            </p>
          </div>

          {/* Pricing Tiers Carousel */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-16">
            {CATERING_PACKAGES.map((pkg) => {
              const isActive = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`bg-sand-50/50 rounded-3xl p-8 border transition-all duration-300 relative cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "border-royal-900 shadow-xl bg-white scale-[1.02]"
                      : "border-royal-900/10 hover:border-royal-900/20 shadow-xs hover:bg-white"
                  }`}
                >
                  {/* Highlight popular */}
                  {pkg.id === "pkg-shahi" && (
                    <div className="absolute top-4 right-4 bg-gold-400 text-[9px] font-bold uppercase tracking-widest text-royal-950 px-3 py-1 rounded-full">
                      Most Selected
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-royal-950">{pkg.name}</h3>
                      <p className="text-xs text-royal-500 font-medium mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1 py-4 border-y border-royal-900/5">
                      <span className="font-serif text-4xl font-extrabold text-royal-950">{formatRupee(pkg.pricePerPlate)}</span>
                      <span className="text-xs text-royal-500 text-light">/ per plate guest</span>
                    </div>

                    <ul className="space-y-3 text-xs text-royal-900/80">
                      <li className="font-semibold text-royal-950 text-[10px] uppercase tracking-wider mb-2 text-gold-700">
                        Tier Package Inclusions:
                      </li>
                      {pkg.includes.map((incl, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{incl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      className={`w-full py-3 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all ${
                        isActive
                          ? "bg-royal-900 text-white shadow-md shadow-royal-900/10"
                          : "bg-sand-100 text-royal-900 hover:bg-royal-100"
                      }`}
                    >
                      {isActive ? "Selected Tier" : "Select Tier Package"}
                    </button>
                    <p className="text-[10px] text-center text-royal-500/60 font-light mt-3">
                      Example: {pkg.itemsExample.join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Dish Selector Accordion */}
          <div className="bg-sand-100/40 p-6 sm:p-10 rounded-[2.5rem] border border-royal-900/5">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-royal-500">Dynamic Menu Planner</span>
              <h3 className="font-serif text-2xl sm:text-3xl mt-1 text-royal-950">Add Gourmet Delicacies</h3>
              <p className="text-xs text-royal-900/60 mt-1 font-light">
                Add optional elite dishes below to customize your wedding catering menu. Every added custom dish increases the plate cost by ₹40 per guest.
              </p>
            </div>

            {/* Dish tabs filtered */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CATERING_ITEMS.map((item) => {
                const isSelected = customCateringItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCateringItem(item.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-gold-500 shadow-md scale-[1.01]"
                        : "bg-white/60 border-royal-900/5 hover:border-royal-900/10"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full bg-royal-100 text-royal-800 tracking-wider">
                          {item.category}
                        </span>
                        {item.isPopular && (
                          <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full bg-gold-400 text-royal-950 tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-bold text-royal-950 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-royal-500/80 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-royal-900/5 mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-gold-600 font-bold">+₹40 / plate</span>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold transition-colors ${
                        isSelected ? "bg-emerald-100 text-emerald-800" : "bg-sand-100 text-royal-950"
                      }`}>
                        {isSelected ? "Included" : "Add Item"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </motion.section>

      {/* Portfolio Gallery Section */}
      <motion.section
        id="portfolio"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-sand-100/40 relative z-10 border-t border-royal-900/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">The Client Gallery</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-royal-950 mt-1">Our Heritage Portfolio</h2>
            <p className="text-sm text-royal-900/60 leading-relaxed font-light mt-2">
              Glimpse into authentic celebrations crafted beautifully by our team across Sanjeevni Nagar, Royal Palace, and Garha, Jabalpur.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(["All", "Mandap & Decor", "Catering Feast", "Royal Reception", "Traditional Rituals"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-5 py-2.5 rounded-full uppercase tracking-wider font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-royal-900 text-white shadow-md shadow-royal-900/10"
                    : "bg-white hover:bg-sand-100 text-royal-900 border border-royal-900/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-like Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-royal-900/5 shadow-xs group hover:shadow-lg hover:border-royal-950/15 transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-sand-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-royal-850">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gold-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold-500" /> {item.location}
                    </span>
                    <h3 className="font-serif text-lg text-royal-950 font-bold group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-royal-900/60 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </motion.section>

      {/* Cost Estimator & Booking Studio Panel */}
      <motion.section
        id="booking-studio"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-white relative z-10 border-t border-royal-900/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">Pricing Console</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-royal-950">
              Interactive <span className="italic text-royal-500">Cost Estimator</span>
            </h2>
            <p className="text-sm text-royal-900/60 leading-relaxed font-light mt-1">
              Select your packages, customize guest counts, and tick added services. Instantly review an Indian Rupee estimation based on pure Desi Ghee quality ingredients and floral decors.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start" id="booking-dashboard">
            
            {/* Step Selection Form (Left column) */}
            <div className="lg:col-span-7 bg-sand-50/50 p-6 sm:p-10 rounded-[2.5rem] border border-royal-900/10 space-y-8">
              
              {!createdBooking ? (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <h3 className="font-serif text-2xl text-royal-950 pb-4 border-b border-royal-900/5 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-royal-700" /> Event Detail Registry
                  </h3>

                  {/* personal details */}
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900 mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Durgesh Gupta"
                          className="w-full bg-white border border-royal-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-medium text-royal-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="e.g. 079998 51222"
                          className="w-full bg-white border border-royal-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-medium text-royal-950"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900 mb-1.5">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-white border border-royal-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-royal-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900 mb-1.5">
                          Wedding Event Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-white border border-royal-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-royal-950"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Count Range Slider */}
                  <div className="space-y-3 pt-4 border-t border-royal-900/5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] uppercase tracking-widest font-bold text-royal-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-royal-700" /> Expected Guest Count
                      </label>
                      <span className="font-serif text-lg font-bold text-royal-950 bg-royal-100 px-3 py-1 rounded-lg">
                        {guestCount} guests
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-gold-500 h-2 bg-royal-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-royal-500 uppercase tracking-widest">
                      <span>100 mini</span>
                      <span>1,000 royal crowd</span>
                      <span>2,000 maximum scale</span>
                    </div>
                  </div>

                  {/* Package Selector */}
                  <div className="space-y-3 pt-4 border-t border-royal-900/5">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900">
                      Catering Shahi Package
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {CATERING_PACKAGES.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            selectedPackageId === pkg.id
                              ? "bg-white border-gold-500 shadow-sm"
                              : "bg-white/60 border-royal-900/10 hover:border-royal-900/20"
                          }`}
                        >
                          <span className="block text-xs font-bold text-royal-950">{pkg.name.split(" ")[0]}</span>
                          <span className="block text-[11px] text-gold-700 font-extrabold mt-1">{formatRupee(pkg.pricePerPlate)}/Plt</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services Multi Selection */}
                  <div className="space-y-3 pt-4 border-t border-royal-900/5">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900">
                      Include Planning &amp; Decor Services
                    </label>
                    <div className="space-y-2">
                      {SERVICES.map((s) => {
                        const isChecked = selectedServices.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => toggleService(s.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                              isChecked
                                ? "bg-white border-gold-500 shadow-xs"
                                : "bg-white/50 border-royal-900/10 hover:bg-white"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked ? "bg-gold-500 border-gold-600 text-royal-950" : "border-royal-900/20 bg-white"
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                              <span className="block text-xs font-bold text-royal-950">{srvTitleTruncate(s.title)}</span>
                              <span className="block text-[10px] text-royal-500 font-light">{s.description.slice(0, 70)}...</span>
                            </div>
                            <span className="text-xs text-gold-700 font-bold whitespace-nowrap">
                              +{formatRupee(s.basePrice)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional specifications */}
                  <div className="space-y-2 pt-4 border-t border-royal-900/5">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-900">
                      Special Rituals or Dietary Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Jain food preferences, Mehendi sound requirements, specific seating charts near Budhauliya hospital landmark..."
                      className="w-full bg-white border border-royal-900/10 rounded-xl p-3 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-royal-950 hover:bg-royal-900 text-gold-300 font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Confirm Booking Request <Check className="w-4 h-4 text-gold-400" />
                  </button>
                </form>
              ) : (
                /* Success Invoice View */
                <div className="space-y-6">
                  {/* Confirmed Icon animation */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                      <Check className="w-8 h-8 font-bold" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-[0.25em] block">
                      Reservation Created Successfully
                    </span>
                    <h3 className="font-serif text-3xl text-royal-950">
                      Your Traditional Wedding Invoice Draft
                    </h3>
                    <p className="text-xs text-royal-900/60 font-light">
                      A coordinator will reach out to you at {createdBooking.clientPhone} within 12 hours to verify details and arrange food tastings.
                    </p>
                  </div>

                  {/* The Actual printed receipt bill */}
                  <div className="bg-white border-2 border-dashed border-royal-900/10 p-6 sm:p-8 rounded-2xl relative space-y-4">
                    <div className="absolute top-0 right-4 bg-gold-400 text-royal-950 px-3 py-1 rounded-b-lg text-[9px] font-bold tracking-widest uppercase">
                      ID: {createdBooking.id}
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[8px] uppercase tracking-widest text-royal-500 font-bold">Client Copy</span>
                      <h4 className="font-serif text-lg font-bold text-royal-950">{createdBooking.clientName}</h4>
                      <p className="text-[11px] text-royal-600">Event Date: {new Date(createdBooking.eventDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                      <p className="text-[11px] text-royal-600">Expected Gathering: {createdBooking.guestCount} guests</p>
                    </div>

                    <div className="h-[1px] bg-royal-900/5 my-3"></div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-medium">
                        <span>Catering Package - ({activePackage.name.split(" ")[0]}):</span>
                        <span>{formatRupee(cateringPriceTotal)}</span>
                      </div>
                      <div className="text-[11px] text-royal-500/80 -mt-1 pl-2">
                        ₹{activePackage.pricePerPlate} per plate x {guestCount} guests
                      </div>

                      {customCateringItems.length > 0 && (
                        <div className="flex justify-between font-medium pt-1">
                          <span>Custom Gourmet Dishes ({customCateringItems.length}):</span>
                          <span>{formatRupee(customItemsPriceTotal)}</span>
                        </div>
                      )}
                      
                      {selectedServices.length > 0 && (
                        <div className="flex justify-between font-medium pt-1">
                          <span>Thematic Services Fee:</span>
                          <span>{formatRupee(servicesPriceTotal)}</span>
                        </div>
                      )}
                    </div>

                    <div className="h-[1px] bg-royal-900/5 my-3"></div>

                    {dynamicDiscount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600 font-bold">
                        <span>Festive Scale Discounts:</span>
                        <span>-{formatRupee(dynamicDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="font-bold text-royal-950 uppercase text-xs tracking-wider">Estimated Event Invoice:</span>
                      <span className="font-serif text-2xl sm:text-3xl font-extrabold text-royal-950">
                        {formatRupee(createdBooking.estimatedTotal)}
                      </span>
                    </div>

                    <p className="text-[9px] text-royal-500 italic text-center font-light mt-4">
                      Note: Final tax invoices are prepared upon finalizing the live counters array during the physical site visit in Jabalpur office.
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleResetBooking}
                      className="flex-1 bg-royal-900 hover:bg-royal-800 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all"
                    >
                      Plan Another Wedding Cost
                    </button>
                    <a
                      href={`tel:${WEDDING_TIMINGS.phone}`}
                      className="flex-1 text-center border-2 border-royal-900 hover:bg-neutral-50 text-royal-950 font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all block"
                    >
                      Call: {WEDDING_TIMINGS.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Bill (Right column) */}
            <div className="lg:col-span-5 bg-royal-950 text-white p-6 sm:p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl space-y-6">
              
              {/* Gold watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                  Real-Time Calculation Ledger
                </span>
                <h3 className="font-serif text-3xl mt-1 text-sand-50">
                  Estimate Bill
                </h3>
              </div>

              {/* Dynamic Bill Items lists */}
              <div className="space-y-4 my-8 relative z-10">
                
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="block text-xs font-bold text-sand-100">{activePackage.name}</span>
                    <span className="block text-[11px] text-sand-300/80">
                      ₹{activePackage.pricePerPlate} per plate x {guestCount} guests
                    </span>
                  </div>
                  <span className="font-serif text-md font-bold text-gold-400 self-end">
                    {formatRupee(cateringPriceTotal)}
                  </span>
                </div>

                {customCateringItems.length > 0 && (
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <div>
                      <span className="block text-xs font-bold text-sand-100">Gourmet Add-on Dishes</span>
                      <span className="block text-[11px] text-sand-300/80">
                        {customCateringItems.length} custom dishes x ₹40/plt x {guestCount} gts
                      </span>
                    </div>
                    <span className="font-serif text-md font-bold text-gold-400 self-end">
                      {formatRupee(customItemsPriceTotal)}
                    </span>
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <div>
                      <span className="block text-xs font-bold text-sand-100">Planning &amp; Art Decor</span>
                      <span className="block text-[11px] text-sand-300/80">
                        {selectedServices.length} professional elements selected
                      </span>
                    </div>
                    <span className="font-serif text-md font-bold text-gold-400 self-end">
                      {formatRupee(servicesPriceTotal)}
                    </span>
                  </div>
                )}

                {dynamicDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 pb-3 border-b border-white/5">
                    <div>
                      <span className="block text-xs font-bold">Dynamic Scale Discounts</span>
                      <span className="block text-[10px] opacity-80">(Grand scale / multi-services club discount triggered)</span>
                    </div>
                    <span className="font-serif text-md font-bold self-end">
                      -{formatRupee(dynamicDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <span className="font-bold text-sand-100 uppercase text-xs tracking-wider">
                    Grand Estimated Total:
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-3xl font-extrabold text-gold-400 block">
                      {formatRupee(estimatedTotal)}
                    </span>
                    <span className="text-[10px] text-sand-300/60 font-light block">
                      Includes pure ingredients guarantee
                    </span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                  Office Booking Terms
                </span>
                <p className="text-[11px] text-sand-200/80 leading-relaxed font-light">
                  A nominal registration token of 20% secures the wedding calendar date. All leftover plates cooked are cleanly packed in airtight boxes and presented to the bride's family legacy home after the reception.
                </p>
              </div>

              {/* Booking History section if active bookings exist on client profile */}
              {bookingHistory.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold-300 block">
                    Your Saved Application History ({bookingHistory.length}):
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                    {bookingHistory.map((bk) => (
                      <div key={bk.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-sand-50">{bk.id}</p>
                          <p className="text-[10px] text-sand-300">{bk.guestCount} guests • {new Date(bk.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-gold-400">{formatRupee(bk.estimatedTotal)}</p>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{bk.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if(confirm("Do you want to clear your booking history?")) {
                        localStorage.removeItem("traditional_bookings");
                        setBookingHistory([]);
                      }
                    }}
                    className="text-[9px] text-red-300 hover:text-red-400 underline"
                  >
                    Clear history
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </motion.section>

      {/* User Reviews and Real-Time Customer Testimonials */}
      <motion.section
        id="reviews"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-sand-100/30 relative z-10 border-t border-royal-900/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">Verified Google Reviews ({totalReviewsCount})</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-royal-950">
                Stories of <span className="italic text-royal-500">absolute delight</span>
              </h2>
            </div>
            
            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
              className="bg-royal-900 hover:bg-royal-800 text-gold-300 text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              {isAddingReview ? "Close Form" : "Submit Your Story"} <Plus className="w-4 h-4 text-gold-400" />
            </button>
          </div>

          {/* review submission form if open */}
          <AnimatePresence>
            {isAddingReview && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 sm:p-10 rounded-3xl border border-royal-900/10 shadow-lg max-w-2xl mx-auto mb-12"
              >
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <h3 className="font-serif text-2xl text-royal-900 pb-2 border-b border-royal-900/5">
                    Write Your Wedding Review
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-950 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Durgesh Gupta"
                        className="w-full bg-sand-50 border border-royal-900/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-950 mb-1">
                        Your Role
                      </label>
                      <select
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        className="w-full bg-sand-50 border border-royal-900/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                      >
                        <option value="Bride">Bride</option>
                        <option value="Groom">Groom</option>
                        <option value="Father of the Bride">Father of the Bride</option>
                        <option value="Mother of the Groom">Mother of the Groom</option>
                        <option value="Guest">Wedding Guest</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-950 mb-1">
                      Rating (Stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="text-amber-400 focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${newReviewRating >= star ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-royal-950 mb-1">
                      Your Story / Review Experience
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your authentic experience under Traditional Wedding Planner's directorship..."
                      className="w-full bg-sand-50 border border-royal-900/10 rounded-xl p-3 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-royal-950 text-gold-300 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-royal-900 transition-colors"
                  >
                    Post Real Review
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Post successful notification banner */}
          <AnimatePresence>
            {reviewSubmitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl p-4 text-center text-xs font-semibold max-w-2xl mx-auto mb-10"
              >
                Review has been posted! It counts in our Google Reviews tally. Let future couples read your story.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Testimonial slider / Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-royal-900/5 shadow-xs hover:border-royal-900/10 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Stars array display */}
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current text-gold-500" />
                    ))}
                  </div>
                  
                  <p className="text-royal-900/80 text-[13px] font-light italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-royal-900/5 mt-6">
                  {/* First letter representation of author */}
                  <div className="w-10 h-10 rounded-full bg-royal-900 text-gold-400 font-serif flex items-center justify-center font-bold">
                    {rev.author[0]}
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-royal-950">{rev.author}</h4>
                    <span className="text-[9px] uppercase tracking-wider text-royal-500 block">
                      {rev.relationship} • {rev.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* FAQ Accordion Section */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-white relative z-10"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-gold-600 font-bold text-xs tracking-widest uppercase">Answers &amp; Guidelines</span>
            <h2 className="font-serif text-4xl text-royal-950 mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <details
                key={index}
                className="group bg-sand-50/50 rounded-2xl border border-royal-900/5 overflow-hidden transition-all duration-300 hover:shadow-xs open:shadow-xs"
              >
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-royal-950 select-none">
                  <span className="text-sm font-bold pr-4">{faq.question}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180 text-royal-400 shrink-0">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-royal-900/70 text-xs leading-relaxed border-t border-dashed border-royal-900/5 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact & Map Timing Section Card */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 bg-sand-150 relative z-10 border-t border-royal-900/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 bg-royal-950 text-white p-8 sm:p-12 rounded-[3rem] shadow-2xl overflow-hidden relative">
          
          {/* Decorative mandala background watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-900/20 via-transparent to-transparent opacity-80 pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Address & Timings information */}
            <div className="lg:col-span-7 space-y-6">
              <span className="bg-gold-500 text-royal-950 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                Corporate Headquarters &amp; Showroom
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl text-sand-50">
                Traditional Wedding <br />
                <span className="italic text-gold-400">Planner &amp; Caterers</span>
              </h2>

              <p className="text-sand-200/80 text-xs sm:text-sm font-light leading-relaxed">
                Connect with our planning architects below. Our central kitchen operates under absolute traditional hygiene conditions, and our consultation studio is perfectly accessible close to Budhauliya Hospital, Jabalpur.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-sand-100">Consultation Address:</span>
                    <p className="text-sand-300 font-light leading-relaxed mt-0.5 max-w-md">
                      {WEDDING_TIMINGS.address}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-sand-100">Operating Timings:</span>
                      <p className="text-sand-300 font-light mt-0.5 leading-relaxed">
                        Sunday to Saturday<br />
                        <strong>{WEDDING_TIMINGS.hours}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-sand-100">Enquire Hotlines:</span>
                      <a href={`tel:${WEDDING_TIMINGS.phone}`} className="text-gold-400 hover:underline font-bold text-sm block mt-0.5">
                        {WEDDING_TIMINGS.phone}
                      </a>
                      <span className="text-[10px] text-sand-400">(Available for WhatsApp video briefings too)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Instagram link button */}
              <div className="pt-4">
                <a
                  href={WEDDING_TIMINGS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
                >
                  <Instagram className="w-4 h-4 text-white" /> Follow Mr. Durgesh on Instagram
                </a>
              </div>
            </div>

            {/* Quick Consultation Request Form */}
            <div className="lg:col-span-5 bg-white text-royal-950 p-6 sm:p-8 rounded-3xl shadow-lg border border-royal-900/5">
              <h3 className="font-serif text-xl sm:text-2xl mb-4 text-royal-950">
                Talk to Durgesh Patel
              </h3>
              <p className="text-xs text-royal-900/60 font-light leading-relaxed mb-4">
                Need urgent assistance or have detailed customized queries regarding your marriage event? Drop your detail and we call you back.
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Thank you! Request received. Our team will contact you shortly.`);
                (e.target as HTMLFormElement).reset();
              }} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="w-full bg-sand-50 border border-royal-900/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone number *"
                    className="w-full bg-sand-50 border border-royal-900/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Describe your event requirements (e.g. 500 guests, 2 days functions)..."
                    className="w-full bg-sand-50 border border-royal-900/10 rounded-xl p-3 text-xs focus:outline-none focus:border-gold-500 text-royal-950"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-royal-950 hover:bg-royal-900 text-gold-300 font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Call Me Back <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-royal-950 text-sand-200 pt-16 pb-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            
            <div className="space-y-4">
              <span className="font-serif text-2xl text-sand-50 tracking-tight font-extrabold block">
                Traditional Wedding <span className="text-gold-400 font-normal italic">Planner</span>
              </span>
              <p className="text-sand-300/60 font-light text-xs max-w-xs leading-relaxed">
                Shop No 1, First Floor, Sanjeevni Nagar, Royal Palace, Near Budhauliya Hospital, Jabalpur, Madhya Pradesh 482001. Exclusive catering and wedding decors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 text-xs">
              <div className="flex flex-col gap-3">
                <span className="font-bold text-sand-100 uppercase tracking-widest text-[10px]">Navigate</span>
                <a href="#about" className="hover:text-gold-400 transition-colors">Vision</a>
                <a href="#services" className="hover:text-gold-400 transition-colors">Services</a>
                <a href="#catering" className="hover:text-gold-400 transition-colors">Catering</a>
                <a href="#portfolio" className="hover:text-gold-400 transition-colors">Gallery</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-bold text-sand-100 uppercase tracking-widest text-[10px]">Direct Connect</span>
                <a href={`tel:${WEDDING_TIMINGS.phone}`} className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Call Hotlines
                </a>
                <a href={WEDDING_TIMINGS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-sand-300/40 font-light tracking-wide text-center sm:text-left">
            <p>© {new Date().getFullYear()} Traditional Wedding Planner &amp; Shahi Caterers. Registered in Jabalpur, Madhya Pradesh. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#contact" className="hover:text-gold-400">Contact Studio</a>
              <a href="#booking-studio" className="hover:text-gold-400">Planner Estimates</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Helpers for title layouts
function srvTitleTruncate(title: string) {
  return title;
}

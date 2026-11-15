"use client";

import { useMemo, useState, type FormEvent } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Search,
  GraduationCap,
  Users,
  Sprout,
  HeartHandshake,
  BriefcaseBusiness,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Landmark,
  BookOpen,
  CheckCircle2,
  Globe2,
  FileCheck2,
  ChevronRight,
  Star,
  Compass,
  Gift,
  Building2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

/* ============================================
   TYPES
============================================ */

type PortalKind = "scholarships" | "schemes";

type Portal = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  kinds: PortalKind[];
  keywords: string[];
  url: string;
  icon: LucideIcon;
  accent: string;
};

/* ============================================
   OFFICIAL RESOURCES

   These are starting points for discovery.
   They are not individual scholarship listings.
============================================ */

const officialPortals: Portal[] = [
  {
    id: "nsp",
    name: "National Scholarship Portal",
    shortName: "NSP",
    description:
      "Explore central and participating government scholarship opportunities for eligible students.",

    category: "National Government",

    kinds: ["scholarships"],

    keywords: [
      "scholarship",
      "student",
      "education",
      "school",
      "college",
      "university",
      "central",
      "national",
      "academic",
    ],

    url: "https://scholarships.gov.in/",

    icon: GraduationCap,

    accent: "emerald",
  },

  {
    id: "mahadbt",
    name: "MahaDBT",
    shortName: "MahaDBT",
    description:
      "Access Maharashtra Government scholarship and direct benefit transfer services.",

    category: "Maharashtra Government",

    kinds: ["scholarships", "schemes"],

    keywords: [
      "maharashtra",
      "scholarship",
      "education",
      "student",
      "state",
      "financial",
      "benefits",
      "welfare",
    ],

    url: "https://mahadbt.maharashtra.gov.in/",

    icon: Landmark,

    accent: "gold",
  },

  {
    id: "myscheme",
    name: "myScheme",
    shortName: "myScheme",
    description:
      "Discover government schemes across different sectors using your eligibility and requirements.",

    category: "Government of India",

    kinds: ["schemes"],

    keywords: [
      "government",
      "scheme",
      "women",
      "child",
      "agriculture",
      "farmer",
      "health",
      "employment",
      "business",
      "entrepreneurship",
      "welfare",
      "housing",
      "pension",
      "subsidy",
      "citizen",
      "education",
      "benefits",
      "social",
    ],

    url: "https://www.myscheme.gov.in/",

    icon: Building2,

    accent: "emerald",
  },
];

/* ============================================
   CATEGORIES
============================================ */

type Category = {
  title: string;
  description: string;
  icon: LucideIcon;
  query: string;
  tone: string;
};

const categories: Category[] = [
  {
    title: "Education & Students",
    description: "Scholarships and educational assistance.",

    icon: GraduationCap,

    query: "education",

    tone: "green",
  },

  {
    title: "Women & Children",
    description: "Support and welfare opportunities.",

    icon: HeartHandshake,

    query: "women",

    tone: "gold",
  },

  {
    title: "Agriculture",
    description: "Schemes and assistance for farmers.",

    icon: Sprout,

    query: "agriculture",

    tone: "green",
  },

  {
    title: "Employment",
    description: "Employment and skill development.",

    icon: BriefcaseBusiness,

    query: "employment",

    tone: "gold",
  },

  {
    title: "Health & Welfare",
    description: "Healthcare and social assistance.",

    icon: Stethoscope,

    query: "health",

    tone: "green",
  },

  {
    title: "Business & Startups",
    description: "Entrepreneurship and business support.",

    icon: Lightbulb,

    query: "business",

    tone: "gold",
  },
];

/* ============================================
   MAIN HOMEPAGE
============================================ */

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  const [activeKind, setActiveKind] = useState<
    "all" | PortalKind
  >("all");

  const [hasSearched, setHasSearched] = useState(false);

  /* SEARCH ENGINE */

  const filteredPortals = useMemo(() => {
    const queryWords = activeSearch
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return officialPortals.filter((portal) => {
      const typeMatches =
        activeKind === "all" ||
        portal.kinds.includes(activeKind);

      const searchableText = [
        portal.name,
        portal.description,
        portal.category,
        ...portal.keywords,
      ]
        .join(" ")
        .toLowerCase();

      const searchMatches = queryWords.every((word) =>
        searchableText.includes(word)
      );

      return typeMatches && searchMatches;
    });
  }, [activeSearch, activeKind]);

  /* SEARCH HANDLER */

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setActiveSearch(searchInput.trim());

    setHasSearched(true);

    document
      .getElementById("official-resources")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* CATEGORY HANDLER */

  const handleCategorySearch = (query: string) => {
    setSearchInput(query);

    setActiveSearch(query);

    setActiveKind("all");

    setHasSearched(true);

    document
      .getElementById("official-resources")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* QUICK FILTER */

  const handleQuickFilter = (
    kind: "all" | PortalKind
  ) => {
    setActiveKind(kind);

    setSearchInput("");

    setActiveSearch("");

    setHasSearched(true);
  };

  /* RESET SEARCH */

  const resetSearch = () => {
    setSearchInput("");

    setActiveSearch("");

    setActiveKind("all");

    setHasSearched(false);
  };

  return (
    <div className="overflow-hidden bg-[#FAF8F2]">

      {/* =====================================
          SECTION 1 - HERO
      ===================================== */}

      <section className="bx-home-hero relative">

        {/* Background Effects */}

        <div className="bx-hero-glow bx-hero-glow-one" />

        <div className="bx-hero-glow bx-hero-glow-two" />

        <div className="bx-hero-grid" />

        <div className="relative z-10 mx-auto grid min-h-[690px] max-w-[1440px] grid-cols-1 items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">

          {/* LEFT CONTENT */}

          <div className="relative z-20 max-w-[650px]">

            {/* Eyebrow */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D6B779]/40 bg-white/75 px-4 py-2 shadow-sm backdrop-blur-md">

              <Sparkles
                size={15}
                className="text-[#B8954B]"
              />

              <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#075B46]">
                Your Gateway to Government Benefits
              </span>

            </div>

            {/* Heading */}

            <h1 className="text-[43px] font-extrabold leading-[1.12] tracking-[-2.5px] text-[#123D32] sm:text-[55px] lg:text-[67px]">

              Discover Opportunities.

              <span className="block bg-gradient-to-r from-[#075B46] via-[#167A5B] to-[#B8954B] bg-clip-text text-transparent">
                Unlock Your Future.
              </span>

            </h1>

            {/* Description */}

            <p className="mt-7 max-w-[570px] text-base leading-8 text-[#59665F] md:text-[17px]">

              Find scholarships, government schemes and financial
              assistance opportunities that help you move forward.

              <span className="font-semibold text-[#075B46]">
                {" "}One platform. More possibilities.
              </span>

            </p>

            {/* Search Box */}

            <form
              onSubmit={handleSearch}
              className="mt-9 rounded-2xl border border-[#E4E8E0] bg-white p-2 shadow-[0_14px_45px_rgba(18,61,50,0.10)] transition focus-within:border-[#D6B779] focus-within:shadow-[0_15px_45px_rgba(18,61,50,0.14)]"
            >

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">

                  <Search
                    size={21}
                    className="shrink-0 text-[#B8954B]"
                  />

                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(event.target.value)
                    }
                    placeholder="Search scholarships, schemes, benefits..."
                    aria-label="Search official government portals"
                    className="h-[48px] min-w-0 flex-1 border-0 bg-transparent text-sm text-[#292D2C] outline-none placeholder:text-[#929A92] focus:ring-0"
                  />

                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-[49px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-7 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >

                  Search Now

                  <ArrowRight size={17} />

                </button>

              </div>

            </form>

            {/* Quick Search */}

            <div className="mt-5 flex flex-wrap items-center gap-2">

              <span className="mr-1 text-xs font-semibold text-[#7B847D]">
                Popular:
              </span>

              {[
                {
                  label: "Scholarships",
                  kind: "scholarships" as const,
                },
                {
                  label: "Maharashtra",
                  kind: "all" as const,
                  query: "maharashtra",
                },
                {
                  label: "Government Schemes",
                  kind: "schemes" as const,
                },
              ].map((item) => (

                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.query) {
                      setSearchInput(item.query);
                      setActiveSearch(item.query);
                      setActiveKind("all");
                      setHasSearched(true);

                      document
                        .getElementById("official-resources")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    } else {
                      handleQuickFilter(item.kind);

                      document
                        .getElementById("official-resources")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }
                  }}
                  className="rounded-full border border-[#D8DCCF] bg-white/80 px-3 py-2 text-xs font-semibold text-[#59665F] transition hover:border-[#D6B779] hover:bg-[#EEF3EC] hover:text-[#075B46]"
                >
                  {item.label}
                </button>

              ))}

            </div>

            {/* Hero CTAs */}

            <div className="mt-9 flex flex-wrap items-center gap-4">

              <a
                href="#categories"
                className="group inline-flex min-h-[50px] items-center gap-3 rounded-xl bg-[#D6B779] px-6 text-sm font-bold text-[#123D32] shadow-[0_8px_20px_rgba(184,149,75,0.18)] transition hover:-translate-y-1 hover:shadow-lg"
              >

                Explore Categories

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </a>

              <a
                href="#how-it-works"
                className="inline-flex min-h-[50px] items-center gap-2 rounded-xl border border-[#D8DCCF] bg-white/70 px-6 text-sm font-bold text-[#075B46] transition hover:border-[#D6B779] hover:bg-white"
              >

                How It Works

                <ChevronRight size={17} />

              </a>

            </div>

            {/* Trust Note */}

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#718077]">

              <span className="flex items-center gap-2">

                <ShieldCheck
                  size={16}
                  className="text-[#167A5B]"
                />

                Official source links

              </span>

              <span className="flex items-center gap-2">

                <CheckCircle2
                  size={16}
                  className="text-[#167A5B]"
                />

                Free to explore

              </span>

            </div>

          </div>

          {/* RIGHT SIDE - 3D VISUAL */}

          <div className="relative mx-auto flex w-full max-w-[590px] items-center justify-center lg:min-h-[570px]">

            <div
              className="bx-hero-stage relative flex aspect-square w-full max-w-[540px] items-center justify-center"
              aria-label="Three-dimensional BenefitX opportunity illustration"
              role="img"
            >

              {/* Orbit Rings */}

              <div className="bx-orbit bx-orbit-one" />

              <div className="bx-orbit bx-orbit-two" />

              <div className="bx-orbit bx-orbit-three" />

              {/* Main 3D Platform */}

              <div className="bx-hero-platform">

                <div className="bx-platform-top">

                  {/* Small Header */}

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] font-bold tracking-[2px] text-[#B8954B]">
                        BENEFITX
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-[#7B847D]">
                        Opportunity Discovery
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3EC]">
                      <Sparkles
                        size={17}
                        className="text-[#B8954B]"
                      />
                    </div>

                  </div>

                  {/* Main Card Content */}

                  <div className="mt-8">

                    <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#075B46] to-[#167A5B] shadow-lg shadow-[#075B46]/20">

                      <GraduationCap
                        size={33}
                        className="text-white"
                      />

                    </div>

                    <h3 className="mt-6 text-[25px] font-extrabold leading-tight tracking-[-0.8px] text-[#123D32]">

                      Your Next
                      <br />

                      <span className="text-[#167A5B]">
                        Opportunity
                      </span>

                    </h3>

                    <p className="mt-3 max-w-[230px] text-xs leading-6 text-[#7B847D]">

                      Discover the support and resources that can
                      help shape your future.

                    </p>

                  </div>

                  {/* Bottom Steps */}

                  <div className="mt-7 rounded-2xl bg-[#F2F5F0] p-4">

                    <p className="text-[9px] font-bold tracking-[1.5px] text-[#7B847D]">
                      YOUR JOURNEY
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <div className="text-center">

                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#075B46] text-white">
                          <Search size={16} />
                        </div>

                        <p className="mt-2 text-[9px] font-semibold text-[#123D32]">
                          Discover
                        </p>

                      </div>

                      <div className="h-[2px] flex-1 bg-[#D6B779]" />

                      <div className="text-center">

                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#D6B779] text-[#123D32]">
                          <FileCheck2 size={16} />
                        </div>

                        <p className="mt-2 text-[9px] font-semibold text-[#123D32]">
                          Check
                        </p>

                      </div>

                      <div className="h-[2px] flex-1 bg-[#D6B779]" />

                      <div className="text-center">

                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#123D32] text-white">
                          <ArrowUpRight size={16} />
                        </div>

                        <p className="mt-2 text-[9px] font-semibold text-[#123D32]">
                          Apply
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Floating Verified Card */}

              <div className="bx-float-card bx-float-card-top">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC]">
                    <ShieldCheck
                      size={23}
                      className="text-[#075B46]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#123D32]">
                      Source-focused
                    </p>

                    <p className="mt-1 text-[10px] text-[#7B847D]">
                      Official portals
                    </p>
                  </div>

                  <CheckCircle2
                    size={17}
                    className="ml-1 text-[#167A5B]"
                  />

                </div>

              </div>

              {/* Floating Golden Card */}

              <div className="bx-float-card bx-float-card-bottom">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF4E5]">

                    <Sparkles
                      size={20}
                      className="text-[#B8954B]"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-bold text-[#123D32]">
                      More Possibilities
                    </p>

                    <p className="mt-1 text-[10px] text-[#7B847D]">
                      One platform to explore
                    </p>

                  </div>

                </div>

              </div>

              {/* Decorative Gold Orb */}

              <div className="bx-decor-orb bx-decor-orb-one" />

              <div className="bx-decor-orb bx-decor-orb-two" />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          SECTION 2 - QUICK VALUE STRIP
      ===================================== */}

      <section className="relative z-20 mx-auto -mt-7 max-w-[1200px] px-5 md:px-8">

        <div className="grid grid-cols-1 gap-3 rounded-3xl border border-[#E4E8E0] bg-white p-4 shadow-[0_12px_35px_rgba(18,61,50,0.08)] sm:grid-cols-3 md:p-6">

          {[
            {
              icon: Compass,
              title: "Discover",
              desc: "Explore relevant opportunities.",
            },
            {
              icon: ShieldCheck,
              title: "Understand",
              desc: "Read eligibility and requirements.",
            },
            {
              icon: ArrowUpRight,
              title: "Apply Officially",
              desc: "Continue through official portals.",
            },
          ].map((item, index) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center gap-4 px-3 py-4 ${
                  index !== 2
                    ? "sm:border-r sm:border-[#E4E8E0]"
                    : ""
                }`}
              >

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3EC]">

                  <Icon
                    size={23}
                    className="text-[#075B46]"
                  />

                </div>

                <div>

                  <h3 className="text-sm font-bold text-[#123D32]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#7B847D]">
                    {item.desc}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* =====================================
          SECTION 3 - CATEGORIES
      ===================================== */}

      <section
        id="categories"
        className="bx-section scroll-mt-28"
      >

        <div className="bx-container">

          <div className="mx-auto max-w-[650px] text-center">

            <span className="bx-section-kicker">

              <Sparkles size={14} />

              EXPLORE POSSIBILITIES

            </span>

            <h2 className="bx-section-heading mt-4">

              Find Opportunities
              <span className="block text-[#167A5B]">
                That Matter to You
              </span>

            </h2>

            <p className="mt-4 text-sm leading-7 text-[#718077]">

              Explore different categories and discover government
              resources designed to support individuals, students
              and communities.

            </p>

          </div>

          {/* Category Cards */}

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category, index) => {

              const Icon = category.icon;

              return (

                <button
                  key={category.title}
                  type="button"
                  onClick={() =>
                    handleCategorySearch(category.query)
                  }
                  className="bx-category-card group text-left"
                >

                  <div className="flex items-start justify-between">

                    <div
                      className={`flex h-[58px] w-[58px] items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 ${
                        category.tone === "green"
                          ? "bg-[#EEF3EC] text-[#075B46]"
                          : "bg-[#FBF4E5] text-[#B8954B]"
                      }`}
                    >

                      <Icon size={28} strokeWidth={1.7} />

                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E8E0] text-[#7B847D] transition group-hover:border-[#D6B779] group-hover:bg-[#D6B779] group-hover:text-[#123D32]">

                      <ArrowUpRight size={17} />

                    </span>

                  </div>

                  <h3 className="mt-7 text-lg font-bold tracking-tight text-[#123D32] transition group-hover:text-[#167A5B]">

                    {category.title}

                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#7B847D]">

                    {category.description}

                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <span className="text-xs font-bold text-[#075B46]">
                      Explore category
                    </span>

                    <span className="text-xs font-semibold text-[#B8954B]">
                      0{index + 1}
                    </span>

                  </div>

                </button>

              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================
          SECTION 4 - OFFICIAL PORTALS
      ===================================== */}

      <section
        id="official-resources"
        className="scroll-mt-28 bg-[#F2F5F0] py-24"
      >

        <div className="bx-container">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <span className="bx-section-kicker">

                <Landmark size={15} />

                TRUSTED GOVERNMENT RESOURCES

              </span>

              <h2 className="bx-section-heading mt-4">

                Start With the
                <span className="text-[#167A5B]">
                  {" "}Official Sources
                </span>

              </h2>

              <p className="mt-4 max-w-[600px] text-sm leading-7 text-[#718077]">

                Explore these official platforms for government
                scholarship applications and scheme information.

              </p>

            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#D8DCCF] bg-white px-4 py-2 text-xs font-semibold text-[#075B46] lg:self-auto">

              <ShieldCheck size={15} />

              Official portal links

            </div>

          </div>

          {/* Search Results Header */}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">

            <div>

              <h3 className="text-base font-bold text-[#123D32]">

                {hasSearched
                  ? "Matching Official Resources"
                  : "Popular Official Resources"}

              </h3>

              <p
                aria-live="polite"
                className="mt-1 text-xs text-[#7B847D]"
              >
                {filteredPortals.length} resource
                {filteredPortals.length === 1 ? "" : "s"} found

                {activeSearch
                  ? ` for "${activeSearch}"`
                  : ""}
              </p>

            </div>

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-2">

              {[
                { label: "All", value: "all" as const },
                {
                  label: "Scholarships",
                  value: "scholarships" as const,
                },
                {
                  label: "Government Schemes",
                  value: "schemes" as const,
                },
              ].map((filter) => (

                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    handleQuickFilter(filter.value)
                  }
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    activeKind === filter.value
                      ? "border-[#075B46] bg-[#075B46] text-white"
                      : "border-[#D8DCCF] bg-white text-[#59665F] hover:border-[#B8954B] hover:text-[#075B46]"
                  }`}
                >
                  {filter.label}
                </button>

              ))}

              {(hasSearched || activeKind !== "all") && (

                <button
                  type="button"
                  onClick={resetSearch}
                  aria-label="Reset search and filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8DCCF] bg-white text-[#59665F] transition hover:bg-[#EEF3EC]"
                >

                  <RotateCcw size={14} />

                </button>

              )}

            </div>

          </div>

          {/* Resource Cards */}

          {filteredPortals.length > 0 ? (

            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredPortals.map((portal) => {

                const Icon = portal.icon;

                return (

                  <article
                    key={portal.id}
                    className="bx-resource-card group"
                  >

                    <div className="flex items-start justify-between">

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          portal.accent === "gold"
                            ? "bg-[#FBF4E5] text-[#B8954B]"
                            : "bg-[#EEF3EC] text-[#075B46]"
                        }`}
                      >

                        <Icon size={28} />

                      </div>

                      <span className="rounded-full bg-[#EEF3EC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#075B46]">
                        Official Source
                      </span>

                    </div>

                    <p className="mt-7 text-[10px] font-bold uppercase tracking-[1.5px] text-[#B8954B]">
                      {portal.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold tracking-tight text-[#123D32]">

                      {portal.name}

                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#718077]">

                      {portal.description}

                    </p>

                    <div className="mt-6 border-t border-[#E4E8E0] pt-5">

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#075B46] transition hover:text-[#B8954B]"
                      >

                        Visit Official Portal

                        <ArrowUpRight
                          size={17}
                          className="transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                        />

                      </a>

                    </div>

                  </article>

                );

              })}

            </div>

          ) : (

            <div className="mt-8 rounded-3xl border border-dashed border-[#D8DCCF] bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3EC]">

                <Search
                  size={26}
                  className="text-[#075B46]"
                />

              </div>

              <h3 className="mt-5 text-xl font-bold text-[#123D32]">

                No matching portal found

              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#718077]">

                Try a different keyword or explore all available
                official starting points.

              </p>

              <button
                type="button"
                onClick={resetSearch}
                className="mt-6 rounded-xl bg-[#075B46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123D32]"
              >

                Show All Resources

              </button>

            </div>

          )}

          <p className="mt-7 text-center text-xs leading-6 text-[#7B847D]">

            Official portals control their own application processes,
            deadlines and eligibility decisions. Always check the
            latest information on the relevant portal.

          </p>

        </div>

      </section>


      {/* =====================================
          SECTION 5 - ELIGIBILITY PROMOTION
      ===================================== */}

      <section className="bx-section">

        <div className="bx-container">

          <div className="bx-eligibility-banner relative overflow-hidden rounded-[32px] bg-[#123D32] px-7 py-14 md:px-14 md:py-16">

            {/* Background Decoration */}

            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-[#D6B779]/20" />

            <div className="pointer-events-none absolute -right-5 -top-12 h-64 w-64 rounded-full border border-[#D6B779]/15" />

            <div className="pointer-events-none absolute -bottom-32 -left-12 h-72 w-72 rounded-full bg-[#167A5B]/30 blur-[70px]" />

            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-4 py-2 text-xs font-semibold text-[#E8D6AA]">

                  <Sparkles size={15} />

                  SMART OPPORTUNITY MATCHING

                </div>

                <h2 className="mt-7 max-w-[650px] text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">

                  The Right Opportunities
                  <span className="block text-[#D6B779]">
                    Start With You.
                  </span>

                </h2>

                <p className="mt-6 max-w-[580px] text-sm leading-8 text-[#D4E2DA] md:text-base">

                  We're building a guided eligibility experience
                  that will help you explore opportunities based
                  on relevant information such as your state,
                  education level and applicable criteria.

                </p>

                <a
                  href="#how-it-works"
                  className="mt-8 inline-flex min-h-[49px] items-center gap-3 rounded-xl bg-[#D6B779] px-6 text-sm font-bold text-[#123D32] transition hover:-translate-y-1 hover:shadow-lg"
                >

                  Discover How It Works

                  <ArrowRight size={17} />

                </a>

                <p className="mt-4 text-[11px] text-[#C7D7CD]">

                  Eligibility matching is part of the upcoming development stage.

                </p>

              </div>

              {/* Decorative Eligibility Card */}

              <div className="relative mx-auto w-full max-w-[350px]">

                <div className="rounded-[27px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold text-white">
                        Your Opportunity Profile
                      </p>

                      <p className="mt-1 text-[10px] text-[#C7D7CD]">
                        Guided discovery
                      </p>
                    </div>

                    <Sparkles
                      size={20}
                      className="text-[#D6B779]"
                    />

                  </div>

                  <div className="mt-6 space-y-3">

                    {[
                      "Education level",
                      "State of residence",
                      "Income criteria",
                      "Scheme-specific conditions",
                    ].map((item) => (

                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-3"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D6B779]/15">

                          <CheckCircle2
                            size={16}
                            className="text-[#D6B779]"
                          />

                        </div>

                        <span className="text-xs font-medium text-white">
                          {item}
                        </span>

                      </div>

                    ))}

                  </div>

                  <div className="mt-6 rounded-xl bg-[#D6B779] p-4">

                    <div className="flex items-center gap-2 text-[#123D32]">

                      <ShieldCheck size={18} />

                      <span className="text-xs font-bold">
                        Privacy-conscious discovery
                      </span>

                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-[#385444]">

                      Only relevant eligibility information
                      should be requested.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          SECTION 6 - HOW IT WORKS
      ===================================== */}

      <section
        id="how-it-works"
        className="bx-section scroll-mt-28 bg-white"
      >

        <div className="bx-container">

          <div className="mx-auto max-w-[650px] text-center">

            <span className="bx-section-kicker">

              <Compass size={15} />

              SIMPLE PROCESS

            </span>

            <h2 className="bx-section-heading mt-4">

              Three Steps.
              <span className="text-[#167A5B]">
                {" "}More Possibilities.
              </span>

            </h2>

            <p className="mt-4 text-sm leading-7 text-[#718077]">

              Finding information about government benefits
              should be easier. Here's how BenefitX is designed
              to guide you.

            </p>

          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Explore scholarships and government schemes across different categories.",
                icon: Search,
              },
              {
                number: "02",
                title: "Understand",
                description:
                  "Read eligibility requirements, benefits, documents and important dates.",
                icon: BookOpen,
              },
              {
                number: "03",
                title: "Apply",
                description:
                  "Continue your application through the relevant official government portal.",
                icon: ArrowUpRight,
              },
            ].map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.number}
                  className="group relative rounded-3xl border border-[#E4E8E0] bg-[#FAF8F2] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#D6B779] hover:bg-white hover:shadow-[0_15px_40px_rgba(18,61,50,0.09)]"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-4xl font-black tracking-tight text-[#E4E8E0] transition group-hover:text-[#D6B779]">

                      {item.number}

                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3EC] text-[#075B46] transition duration-300 group-hover:scale-110 group-hover:bg-[#075B46] group-hover:text-white">

                      <Icon size={25} />

                    </div>

                  </div>

                  <h3 className="mt-8 text-xl font-bold text-[#123D32]">

                    {item.title}

                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#718077]">

                    {item.description}

                  </p>

                  <div className="mt-7 h-1 w-12 rounded-full bg-[#D6B779] transition-all duration-300 group-hover:w-24" />

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================
          SECTION 7 - WHY BENEFITX
      ===================================== */}

      <section className="bx-section bg-[#F2F5F0]">

        <div className="bx-container">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="bx-section-kicker">

                <Star size={15} />

                THE BENEFITX APPROACH

              </span>

              <h2 className="bx-section-heading mt-5">

                More Than Just
                <span className="block text-[#167A5B]">
                  Finding a Scheme.
                </span>

              </h2>

              <p className="mt-5 max-w-[520px] text-sm leading-8 text-[#718077]">

                BenefitX is being designed around one simple
                idea: useful opportunities should be easier
                to discover and understand.

              </p>

              <div className="mt-9 space-y-6">

                {[
                  {
                    icon: ShieldCheck,
                    title: "Source Transparency",
                    text: "Every published opportunity should lead users to a relevant official information source.",
                  },
                  {
                    icon: Compass,
                    title: "Easy Discovery",
                    text: "Organised categories and search tools make information easier to navigate.",
                  },
                  {
                    icon: Users,
                    title: "Designed for Everyone",
                    text: "A clear, accessible experience for students and citizens.",
                  },
                ].map((item) => {

                  const Icon = item.icon;

                  return (

                    <div
                      key={item.title}
                      className="flex gap-4"
                    >

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#075B46] shadow-sm">

                        <Icon size={22} />

                      </div>

                      <div>

                        <h3 className="text-sm font-bold text-[#123D32]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#718077]">
                          {item.text}
                        </p>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

            {/* Right Visual Cards */}

            <div className="relative grid grid-cols-2 gap-4">

              <div className="space-y-4 pt-12">

                <div className="rounded-3xl bg-[#075B46] p-6 text-white shadow-xl shadow-[#075B46]/15">

                  <GraduationCap
                    size={32}
                    className="text-[#D6B779]"
                  />

                  <h3 className="mt-7 text-lg font-bold">
                    Education
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#D4E2DA]">
                    Discover educational opportunities.
                  </p>

                </div>

                <div className="rounded-3xl border border-[#E4E8E0] bg-white p-6 shadow-sm">

                  <Sprout
                    size={30}
                    className="text-[#167A5B]"
                  />

                  <h3 className="mt-6 text-lg font-bold text-[#123D32]">
                    Agriculture
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#718077]">
                    Explore farmer-focused resources.
                  </p>

                </div>

              </div>

              <div className="space-y-4">

                <div className="rounded-3xl border border-[#E4E8E0] bg-white p-6 shadow-sm">

                  <HeartHandshake
                    size={30}
                    className="text-[#B8954B]"
                  />

                  <h3 className="mt-6 text-lg font-bold text-[#123D32]">
                    Welfare
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#718077]">
                    Explore support programs.
                  </p>

                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#D6B779] to-[#B8954B] p-6 text-[#123D32] shadow-xl shadow-[#B8954B]/15">

                  <Gift size={32} />

                  <h3 className="mt-7 text-lg font-bold">
                    Opportunity
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#385444]">
                    A clearer path to discovering benefits.
                  </p>

                </div>

              </div>

              {/* Decorative Center Circle */}

              <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#F2F5F0] bg-white shadow-lg">

                <span className="text-sm font-black tracking-tight text-[#075B46]">
                  BX
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          SECTION 8 - FINAL CTA
      ===================================== */}

      <section className="bg-[#FAF8F2] px-5 py-24">

        <div className="mx-auto max-w-[1000px] text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#EEF3EC] shadow-sm">

            <Globe2
              size={30}
              className="text-[#075B46]"
            />

          </div>

          <span className="mt-7 inline-block text-xs font-bold uppercase tracking-[2px] text-[#B8954B]">

            YOUR OPPORTUNITY STARTS HERE

          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#123D32] md:text-5xl">

            Discover More.
            <span className="block text-[#167A5B]">
              Achieve More.
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-[570px] text-sm leading-8 text-[#718077]">

            Start exploring official government resources
            and discover opportunities that may help you
            take your next step.

          </p>

          <a
            href="#official-resources"
            className="mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-8 text-sm font-bold text-white shadow-lg shadow-[#075B46]/20 transition hover:-translate-y-1 hover:shadow-xl"
          >

            Explore Opportunities

            <ArrowRight size={18} />

          </a>

        </div>

      </section>

    </div>
  );
}
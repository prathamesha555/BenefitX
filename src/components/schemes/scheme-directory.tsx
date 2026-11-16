"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Filter,
  Sprout,
  HeartHandshake,
  Stethoscope,
  BriefcaseBusiness,
  House,
  Building2,
  Users,
  GraduationCap,
  Accessibility,
} from "lucide-react";

import SchemeCard from "./scheme-card";

import type {
  SchemeCategory,
  BeneficiaryGroup,
  SchemeScope,
  SchemeStatus,
  GovernmentScheme
} from "@/types/scheme";


const categoryOptions: {
  label: string;
  value: SchemeCategory;
}[] = [

  { label: "Agriculture", value: "agriculture" },

  { label: "Women & Children", value: "women-child" },

  { label: "Healthcare", value: "healthcare" },

  { label: "Employment", value: "employment" },

  { label: "Housing", value: "housing" },

  { label: "Business", value: "business" },

  { label: "Senior Citizens", value: "senior-citizens" },

  { label: "Social Welfare", value: "social-welfare" },

  { label: "Disability Assistance", value: "disability" },

  { label: "Education", value: "education" }

];


const beneficiaryOptions: {
  label: string;
  value: BeneficiaryGroup;
}[] = [

  { label: "Farmers", value: "farmers" },

  { label: "Women", value: "women" },

  { label: "Children", value: "children" },

  { label: "Students", value: "students" },

  { label: "Entrepreneurs", value: "entrepreneurs" },

  { label: "Senior Citizens", value: "senior-citizens" },

  {
    label: "Persons with Disabilities",
    value: "persons-with-disabilities"
  },

  { label: "General Public", value: "general-public" },

  { label: "Workers", value: "workers" },

  { label: "Families", value: "families" }

];


const categoryIcons = [
  Sprout,
  HeartHandshake,
  Stethoscope,
  BriefcaseBusiness,
  House,
  Building2,
  Users,
  HeartHandshake,
  Accessibility,
  GraduationCap
];


export default function SchemeDirectory() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [beneficiary, setBeneficiary] = useState("all");

  const [scope, setScope] = useState("all");

  const [state, setState] = useState("all");

  const [status, setStatus] = useState("all");

  const [sort, setSort] = useState("name-asc");

  const [showFilters, setShowFilters] = useState(false);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  /* LOAD VERIFIED AND PUBLISHED RECORDS FROM FIRESTORE */
  useEffect(() => {
    const controller = new AbortController();

    async function loadSchemes() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/schemes", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          schemes?: GovernmentScheme[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load government schemes.");
        }

        setSchemes(Array.isArray(payload.schemes) ? payload.schemes : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load government schemes. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadSchemes();
    return () => controller.abort();
  }, [reloadKey]);

  const availableStates = useMemo(
    () => Array.from(new Set(schemes.map((scheme) => scheme.state).filter(Boolean))).sort(),
    [schemes],
  );


  /* READ HEADER QUERY PARAMETERS */

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    const categoryParam = params.get("category");

    if (
      categoryOptions.some(
        (item) => item.value === categoryParam
      )
    ) {

      setCategory(categoryParam!);

    }

  }, []);


  /* FILTER ENGINE */

  const filteredSchemes = useMemo(() => {

    let results = [...schemes];

    const query = search.toLowerCase().trim();

    if (query) {

      const words = query.split(/\s+/).filter(Boolean);

      results = results.filter((scheme) => {

        const searchable = [

          scheme.title,

          scheme.provider,

          scheme.description,

          scheme.objective,

          scheme.state,

          scheme.providerType,

          scheme.officialPortalName,

          ...scheme.categories,

          ...scheme.beneficiaryGroups,

          ...scheme.eligibilityCriteria

        ]
          .join(" ")
          .toLowerCase();

        return words.every((word) =>
          searchable.includes(word)
        );

      });

    }


    if (category !== "all") {

      results = results.filter((scheme) =>
        scheme.categories.includes(
          category as SchemeCategory
        )
      );

    }


    if (beneficiary !== "all") {

      results = results.filter((scheme) =>
        scheme.beneficiaryGroups.includes(
          beneficiary as BeneficiaryGroup
        )
      );

    }


    if (scope !== "all") {

      results = results.filter((scheme) =>
        scheme.scope === scope as SchemeScope
      );

    }


    if (state !== "all") {

      results = results.filter((scheme) =>
        scheme.state === state
      );

    }


    if (status !== "all") {

      results = results.filter((scheme) =>
        scheme.applicationStatus ===
          status as SchemeStatus
      );

    }


    if (sort === "name-asc") {

      results.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    }


    if (sort === "name-desc") {

      results.sort((a, b) =>
        b.title.localeCompare(a.title)
      );

    }

    return results;

  }, [
    search,
    category,
    beneficiary,
    scope,
    state,
    status,
    sort,
    schemes
  ]);


  /* RESET FILTERS */

  const resetFilters = () => {

    setSearch("");

    setCategory("all");

    setBeneficiary("all");

    setScope("all");

    setState("all");

    setStatus("all");

    setSort("name-asc");

  };


  /* ACTIVE FILTER COUNT */

  const activeFilterCount = [

    category !== "all",

    beneficiary !== "all",

    scope !== "all",

    state !== "all",

    status !== "all"

  ].filter(Boolean).length;


  const selectClass =
    "h-12 w-full rounded-xl border border-[#E4E8E0] bg-white px-4 text-sm text-[#59665F] outline-none transition focus:border-[#167A5B] focus:ring-2 focus:ring-[#167A5B]/10";


  return (

    <main className="min-h-screen bg-[#FAF8F2]">


      {/* ===================================
          HERO SECTION
      =================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] px-5 py-20 text-white md:py-24">

        <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-10 -top-14 h-[300px] w-[300px] rounded-full border border-[#D6B779]/20" />

        <div className="pointer-events-none absolute -bottom-36 -left-24 h-[400px] w-[400px] rounded-full bg-[#D6B779]/10 blur-[90px]" />


        <div className="relative mx-auto max-w-[1200px]">

          <div className="mb-6 flex items-center gap-2 text-xs text-[#D4E2DA]">

            <Link
              href="/"
              className="transition hover:text-[#D6B779]"
            >
              Home
            </Link>

            <ArrowRight size={13} />

            <span className="text-[#E8D6AA]">
              Government Schemes
            </span>

          </div>


          <div className="max-w-[750px]">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[1.7px] text-[#E8D6AA]">

              <Landmark size={16} />

              Government Benefits Discovery

            </div>


            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-1.5px] md:text-6xl">

              Discover Government
              <span className="block text-[#D6B779]">
                Schemes & Benefits.
              </span>

            </h1>


            <p className="mt-6 max-w-[620px] text-sm leading-8 text-[#D4E2DA] md:text-base">

              Explore information about government assistance,
              welfare programmes and support opportunities
              for different sections of society.

            </p>

          </div>


          {/* QUICK CATEGORY LINKS */}

          <div className="mt-10 flex flex-wrap gap-3">

            {[
              {
                name: "Agriculture",
                icon: Sprout
              },
              {
                name: "Women",
                icon: HeartHandshake
              },
              {
                name: "Healthcare",
                icon: Stethoscope
              },
              {
                name: "Employment",
                icon: BriefcaseBusiness
              },
              {
                name: "Education",
                icon: GraduationCap
              }
            ].map((item) => {

              const Icon = item.icon;

              const matchingCategory = categoryOptions.find(
                (option) =>
                  option.label.toLowerCase() ===
                  item.name.toLowerCase()
              );

              return (

                <button
                  key={item.name}
                  type="button"
                  onClick={() => {

                    if (matchingCategory) {

                      setCategory(matchingCategory.value);

                      setSearch("");

                      document
                        .getElementById("scheme-directory")
                        ?.scrollIntoView({
                          behavior: "smooth"
                        });

                    }

                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur-md transition hover:border-[#D6B779] hover:bg-white/20"
                >

                  <Icon
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {item.name}

                </button>

              );

            })}

          </div>

        </div>

      </section>


      {/* ===================================
          DIRECTORY SECTION
      =================================== */}

      <section
        id="scheme-directory"
        className="scroll-mt-24 px-5 py-16 md:py-20"
      >

        <div className="mx-auto max-w-[1200px]">


          {/* SOURCE AND VERIFICATION NOTE */}

          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-[#D6B779]/50 bg-[#FBF4E5] p-5">

            <ShieldCheck
              size={21}
              className="mt-0.5 shrink-0 text-[#927337]"
            />

            <div>

              <h3 className="text-sm font-bold text-[#725A2C]">

                Reviewed Government Scheme Information

              </h3>

              <p className="mt-2 text-xs leading-6 text-[#806C44]">

                Listings shown here have been reviewed by BenefitX against
                the official source recorded for each scheme. BenefitX is an
                independent information platform, not a government portal.
                Always confirm current details with the relevant authority.

              </p>

            </div>

          </div>


          {/* SECTION HEADING */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <span className="text-xs font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                EXPLORE GOVERNMENT BENEFITS

              </span>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#123D32] md:text-3xl">

                Government Schemes Directory

              </h2>

              <p className="mt-2 max-w-[600px] text-sm leading-7 text-[#718077]">

                Search and explore opportunities based on your
                category, location and beneficiary group.

              </p>

            </div>


            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white px-5 text-sm font-bold text-[#123D32] shadow-sm transition hover:border-[#D6B779] md:hidden"
            >

              <SlidersHorizontal size={17} />

              Filters

              {activeFilterCount > 0 && (

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#075B46] text-[10px] text-white">

                  {activeFilterCount}

                </span>

              )}

            </button>

          </div>


          {/* SEARCH BAR */}

          <div className="mt-8 rounded-2xl border border-[#E4E8E0] bg-white p-3 shadow-[0_7px_25px_rgba(18,61,50,0.05)]">

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#FAF8F2] px-4">

                <Search
                  size={20}
                  className="shrink-0 text-[#B8954B]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search schemes, beneficiaries, categories..."
                  aria-label="Search government schemes"
                  className="h-12 w-full min-w-0 border-0 bg-transparent text-sm text-[#292D2C] outline-none placeholder:text-[#929A92] focus:ring-0"
                />

              </div>


              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] px-5 text-sm font-bold text-[#59665F] transition hover:bg-[#EEF3EC]"
              >

                <RotateCcw size={16} />

                Reset All

              </button>

            </div>

          </div>


          {/* FILTERS AND RESULTS */}

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[265px_1fr]">


            {/* FILTER SIDEBAR */}

            <aside
              className={`h-fit rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm ${
                showFilters ? "block" : "hidden"
              } lg:block`}
            >

              <div className="flex items-center justify-between border-b border-[#E4E8E0] pb-5">

                <h3 className="flex items-center gap-2 text-base font-bold text-[#123D32]">

                  <Filter
                    size={18}
                    className="text-[#B8954B]"
                  />

                  Filters

                </h3>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#167A5B] hover:underline"
                >

                  Clear

                </button>

              </div>


              <div className="mt-6 space-y-6">


                {/* CATEGORY FILTER */}

                <div>

                  <label
                    htmlFor="scheme-category"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >

                    Category

                  </label>


                  <select
                    id="scheme-category"
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Categories
                    </option>

                    {categoryOptions.map((option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >

                        {option.label}

                      </option>

                    ))}

                  </select>

                </div>


                {/* BENEFICIARY FILTER */}

                <div>

                  <label
                    htmlFor="beneficiary-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >

                    Beneficiary

                  </label>


                  <select
                    id="beneficiary-filter"
                    value={beneficiary}
                    onChange={(event) =>
                      setBeneficiary(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Beneficiaries
                    </option>

                    {beneficiaryOptions.map((option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >

                        {option.label}

                      </option>

                    ))}

                  </select>

                </div>


                {/* PROVIDER FILTER */}

                <div>

                  <label
                    htmlFor="scheme-scope"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >

                    Government Level

                  </label>


                  <select
                    id="scheme-scope"
                    value={scope}
                    onChange={(event) =>
                      setScope(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Government Levels
                    </option>

                    <option value="central">
                      Central Government
                    </option>

                    <option value="state">
                      State Government
                    </option>

                  </select>

                </div>


                {/* STATE FILTER */}

                <div>

                  <label
                    htmlFor="scheme-state"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >

                    State

                  </label>


                  <select
                    id="scheme-state"
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All States
                    </option>

                    {availableStates.map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}

                  </select>

                </div>


                {/* STATUS FILTER */}

                <div>

                  <label
                    htmlFor="scheme-status"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >

                    Application Status

                  </label>


                  <select
                    id="scheme-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Statuses
                    </option>

                    <option value="open">
                      Open
                    </option>

                    <option value="ongoing">
                      Ongoing
                    </option>

                    <option value="upcoming">
                      Upcoming
                    </option>

                    <option value="closed">
                      Closed
                    </option>

                    <option value="not-verified">
                      Application Status Not Confirmed
                    </option>

                  </select>

                </div>

              </div>

            </aside>


            {/* RESULT AREA */}

            <div className="min-w-0">


              {/* RESULT HEADER */}

              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h3 className="text-lg font-bold text-[#123D32]">

                    {isLoading ? "Loading schemes…" : `${filteredSchemes.length} Schemes`}

                  </h3>

                  <p className="mt-1 text-xs text-[#7B847D]">

                    Showing verified and published records from BenefitX’s live database.

                  </p>

                </div>


                <div className="flex items-center gap-3">

                  <label
                    htmlFor="scheme-sort"
                    className="text-xs font-semibold text-[#7B847D]"
                  >

                    Sort By

                  </label>


                  <select
                    id="scheme-sort"
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value)
                    }
                    className="h-11 rounded-xl border border-[#E4E8E0] bg-white px-3 text-xs font-semibold text-[#59665F] outline-none focus:border-[#167A5B]"
                  >

                    <option value="name-asc">
                      Name: A to Z
                    </option>

                    <option value="name-desc">
                      Name: Z to A
                    </option>

                  </select>

                </div>

              </div>


              {/* SCHEME CARDS */}

              {isLoading ? (

                <div className="rounded-3xl border border-[#E4E8E0] bg-white px-6 py-16 text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#167A5B] border-t-transparent" />
                  <p className="mt-5 text-sm font-semibold text-[#59665F]">Loading verified government schemes…</p>
                </div>

              ) : loadError ? (

                <div className="rounded-3xl border border-red-200 bg-white px-6 py-12 text-center">
                  <h3 className="text-xl font-bold text-[#123D32]">Unable to load schemes</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#718077]">{loadError}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="mt-6 rounded-xl bg-[#075B46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123D32]"
                  >
                    Try Again
                  </button>
                </div>

              ) : filteredSchemes.length > 0 ? (

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                  {filteredSchemes.map((scheme) => (

                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                    />

                  ))}

                </div>

              ) : (

                <div className="rounded-3xl border border-dashed border-[#D8DCCF] bg-white px-6 py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3EC]">

                    <Search
                      size={28}
                      className="text-[#075B46]"
                    />

                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#123D32]">

                    {schemes.length === 0 ? "No Schemes Published Yet" : "No Schemes Found"}

                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#718077]">

                    {schemes.length === 0
                      ? "There are no verified government schemes available right now. Please check back after new opportunities are reviewed and published."
                      : "We couldn't find schemes matching your selected criteria. Try another category or remove some filters."}

                  </p>

                  <button
                    type="button"
                    onClick={schemes.length === 0 ? () => setReloadKey((value) => value + 1) : resetFilters}
                    className="mt-6 rounded-xl bg-[#075B46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123D32]"
                  >
                    {schemes.length === 0 ? "Reload Schemes" : "Clear All Filters"}
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}
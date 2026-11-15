"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import Link from "next/link";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Filter
} from "lucide-react";

import { scholarships } from "@/data/scholarships";

import ScholarshipCard from "./scholarship-card";

import type {
  EducationLevel,
  ScholarshipType,
  ScholarshipScope,
  ApplicationStatus
} from "@/types/scholarship";


export default function ScholarshipDirectory() {

  const [search, setSearch] = useState("");

  const [education, setEducation] = useState("all");

  const [type, setType] = useState("all");

  const [scope, setScope] = useState("all");

  const [state, setState] = useState("all");

  const [status, setStatus] = useState("all");

  const [sort, setSort] = useState("name-asc");

  const [showFilters, setShowFilters] = useState(false);


  /* READ HEADER QUERY PARAMETERS */

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    const level = params.get("level");

    if (level === "school") {
      setEducation("school");
    }

    if (level === "postgraduate") {
      setEducation("postgraduate");
    }

    if (level === "college") {
      setEducation("college");
    }

  }, []);


  /* FILTER LOGIC */

  const filteredScholarships = useMemo(() => {

    let results = [...scholarships];

    const query = search.toLowerCase().trim();

    if (query) {

      const words = query.split(/\s+/).filter(Boolean);

      results = results.filter((item) => {

        const searchable = [
          item.title,
          item.provider,
          item.description,
          item.state,
          item.providerType,
          item.officialPortalName,
          ...item.educationLevels,
          ...item.scholarshipType,
          ...item.eligibilitySummary
        ]
          .join(" ")
          .toLowerCase();

        return words.every((word) =>
          searchable.includes(word)
        );

      });

    }


    if (education !== "all") {

      results = results.filter((item) => {

        if (education === "college") {

          return item.educationLevels.some((level) =>
            [
              "diploma",
              "undergraduate",
              "postgraduate",
              "doctoral"
            ].includes(level)
          );

        }

        return item.educationLevels.includes(
          education as EducationLevel
        );

      });

    }


    if (type !== "all") {

      results = results.filter((item) =>
        item.scholarshipType.includes(
          type as ScholarshipType
        )
      );

    }


    if (scope !== "all") {

      results = results.filter((item) =>
        item.scope === scope as ScholarshipScope
      );

    }


    if (state !== "all") {

      results = results.filter((item) =>
        item.state === state
      );

    }


    if (status !== "all") {

      results = results.filter((item) =>
        item.applicationStatus ===
          status as ApplicationStatus
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
    education,
    type,
    scope,
    state,
    status,
    sort
  ]);


  /* RESET FILTERS */

  const resetFilters = () => {

    setSearch("");

    setEducation("all");

    setType("all");

    setScope("all");

    setState("all");

    setStatus("all");

    setSort("name-asc");

  };


  /* ACTIVE FILTER COUNT */

  const activeFilterCount = [
    education !== "all",
    type !== "all",
    scope !== "all",
    state !== "all",
    status !== "all"
  ].filter(Boolean).length;


  /* COMMON INPUT STYLING */

  const selectClass =
    "h-12 w-full rounded-xl border border-[#E4E8E0] bg-white px-4 text-sm text-[#59665F] outline-none transition focus:border-[#167A5B] focus:ring-2 focus:ring-[#167A5B]/10";


  return (

    <div className="min-h-screen bg-[#FAF8F2]">


      {/* PAGE HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] px-5 py-20 text-white md:py-24">

        <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-12 -top-16 h-[300px] w-[300px] rounded-full border border-[#D6B779]/20" />

        <div className="pointer-events-none absolute -bottom-36 -left-24 h-[400px] w-[400px] rounded-full bg-[#D6B779]/10 blur-[90px]" />

        <div className="relative mx-auto max-w-[1200px]">

          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-[#D4E2DA]">

            <Link
              href="/"
              className="transition hover:text-[#D6B779]"
            >
              Home
            </Link>

            <ArrowRight size={13} />

            <span className="text-[#E8D6AA]">
              Scholarships
            </span>

          </div>


          <div className="max-w-[720px]">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[1.6px] text-[#E8D6AA]">

              <GraduationCap size={15} />

              Scholarship Discovery

            </div>


            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-1.5px] md:text-6xl">

              Find the Right
              <span className="block text-[#D6B779]">
                Scholarship for You.
              </span>

            </h1>


            <p className="mt-6 max-w-[600px] text-sm leading-8 text-[#D4E2DA] md:text-base">

              Explore scholarship opportunities across different
              education levels and categories. Understand the
              requirements and find the relevant official sources.

            </p>

          </div>


          {/* QUICK STATS */}

          <div className="mt-10 flex flex-wrap gap-4">

            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">

              <BookOpen
                size={20}
                className="text-[#D6B779]"
              />

              <div>

                <p className="text-lg font-bold">
                  {scholarships.length}
                </p>

                <p className="text-[10px] text-[#D4E2DA]">
                  Demo Records
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">

              <ShieldCheck
                size={20}
                className="text-[#D6B779]"
              />

              <div>

                <p className="text-sm font-bold">
                  Source-focused
                </p>

                <p className="text-[10px] text-[#D4E2DA]">
                  Official portal links
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* DIRECTORY */}

      <section className="px-5 py-16 md:py-20">

        <div className="mx-auto max-w-[1200px]">


          {/* DEMO DISCLAIMER */}

          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-[#D6B779]/50 bg-[#FBF4E5] p-5">

            <ShieldCheck
              size={21}
              className="mt-0.5 shrink-0 text-[#927337]"
            />

            <div>

              <h3 className="text-sm font-bold text-[#725A2C]">
                Demonstration scholarship directory
              </h3>

              <p className="mt-1 text-xs leading-6 text-[#806C44]">

                The current records are examples for development and
                testing. They are not verified scholarship announcements.
                No application deadlines or financial benefits are being
                claimed. Official listings will be added after verification.

              </p>

            </div>

          </div>


          {/* SEARCH AND FILTER HEADER */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <span className="text-xs font-bold uppercase tracking-[1.5px] text-[#B8954B]">

                EXPLORE OPPORTUNITIES

              </span>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#123D32] md:text-3xl">

                Scholarship Directory

              </h2>

              <p className="mt-2 text-sm text-[#718077]">

                Find opportunities using search and filters.

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
                  placeholder="Search by scholarship, course, provider or category..."
                  aria-label="Search scholarships"
                  className="h-12 w-full min-w-0 border-0 bg-transparent text-sm text-[#292D2C] outline-none placeholder:text-[#929A92] focus:ring-0"
                />

              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] px-5 text-sm font-bold text-[#59665F] transition hover:bg-[#EEF3EC] hover:text-[#075B46]"
              >

                <RotateCcw size={16} />

                Reset All

              </button>

            </div>

          </div>


          {/* FILTERS + RESULTS */}

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">


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


                {/* EDUCATION LEVEL */}

                <div>

                  <label
                    htmlFor="education-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >
                    Education Level
                  </label>

                  <select
                    id="education-filter"
                    value={education}
                    onChange={(event) =>
                      setEducation(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Education Levels
                    </option>

                    <option value="school">
                      School
                    </option>

                    <option value="higher-secondary">
                      Higher Secondary
                    </option>

                    <option value="diploma">
                      Diploma
                    </option>

                    <option value="college">
                      College
                    </option>

                    <option value="undergraduate">
                      Undergraduate
                    </option>

                    <option value="postgraduate">
                      Postgraduate
                    </option>

                    <option value="doctoral">
                      Doctoral
                    </option>

                  </select>

                </div>


                {/* SCHOLARSHIP TYPE */}

                <div>

                  <label
                    htmlFor="type-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >
                    Scholarship Type
                  </label>

                  <select
                    id="type-filter"
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Types
                    </option>

                    <option value="merit">
                      Merit Based
                    </option>

                    <option value="need-based">
                      Need Based
                    </option>

                    <option value="category-based">
                      Category Based
                    </option>

                    <option value="minority">
                      Minority
                    </option>

                    <option value="disability">
                      Disability
                    </option>

                    <option value="technical">
                      Technical Education
                    </option>

                    <option value="research">
                      Research
                    </option>

                  </select>

                </div>


                {/* PROVIDER */}

                <div>

                  <label
                    htmlFor="scope-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >
                    Provider Type
                  </label>

                  <select
                    id="scope-filter"
                    value={scope}
                    onChange={(event) =>
                      setScope(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All Providers
                    </option>

                    <option value="central">
                      Central Government
                    </option>

                    <option value="state">
                      State Government
                    </option>

                    <option value="institution">
                      Institution
                    </option>

                  </select>

                </div>


                {/* STATE */}

                <div>

                  <label
                    htmlFor="state-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >
                    State
                  </label>

                  <select
                    id="state-filter"
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    className={selectClass}
                  >

                    <option value="all">
                      All States
                    </option>

                    <option value="All India">
                      All India
                    </option>

                    <option value="Maharashtra">
                      Maharashtra
                    </option>

                  </select>

                </div>


                {/* APPLICATION STATUS */}

                <div>

                  <label
                    htmlFor="status-filter"
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#59665F]"
                  >
                    Application Status
                  </label>

                  <select
                    id="status-filter"
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

                    <option value="upcoming">
                      Upcoming
                    </option>

                    <option value="closed">
                      Closed
                    </option>

                    <option value="not-verified">
                      Not Verified
                    </option>

                  </select>

                </div>

              </div>

            </aside>


            {/* RESULTS AREA */}

            <div className="min-w-0">


              {/* RESULT HEADER */}

              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h3 className="text-lg font-bold text-[#123D32]">

                    {filteredScholarships.length} Opportunities

                  </h3>

                  <p className="mt-1 text-xs text-[#7B847D]">

                    Showing matching demonstration records.

                  </p>

                </div>


                <div className="flex items-center gap-3">

                  <label
                    htmlFor="sort-filter"
                    className="whitespace-nowrap text-xs font-semibold text-[#7B847D]"
                  >
                    Sort By
                  </label>

                  <select
                    id="sort-filter"
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


              {/* SCHOLARSHIP GRID */}

              {filteredScholarships.length > 0 ? (

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                  {filteredScholarships.map((scholarship) => (

                    <ScholarshipCard
                      key={scholarship.id}
                      scholarship={scholarship}
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

                    No Scholarships Found

                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#718077]">

                    We couldn't find any records matching
                    your current search and filters.

                    Try changing your search criteria.

                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-xl bg-[#075B46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123D32]"
                  >

                    Clear All Filters

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}
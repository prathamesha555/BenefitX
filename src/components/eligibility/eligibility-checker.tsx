"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {

  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  GraduationCap,
  Landmark,
  MapPin,
  UserRound,
  Wallet,
  Search,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ExternalLink,
  AlertCircle,
  Info

} from "lucide-react";


import type {

  EligibilityProfile,
  EligibilityMatch,
  IncomeRange

} from "@/types/eligibility";


import {

  eligibilityOpportunities

} from "@/data/eligibility-opportunities";


import {

  evaluateEligibility

} from "@/lib/eligibility-engine";


import type {

  EducationLevel

} from "@/types/scholarship";


import type {

  BeneficiaryGroup

} from "@/types/scheme";



/* =========================================
   STATES AND UNION TERRITORIES
========================================= */

const indianStates = [

  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"

];


/* =========================================
   EDUCATION OPTIONS
========================================= */

const educationOptions: {

  label: string;

  value: EducationLevel | "not-applicable";

}[] = [

  {
    label: "School – Class 1 to 5",
    value: "school"
  },

  {
    label: "School – Class 6 to 10",
    value: "school"
  },

  {
    label: "Class 11 and 12",
    value: "higher-secondary"
  },

  {
    label: "Diploma",
    value: "diploma"
  },

  {
    label: "Undergraduate",
    value: "undergraduate"
  },

  {
    label: "Postgraduate",
    value: "postgraduate"
  },

  {
    label: "PhD / Doctoral",
    value: "doctoral"
  },

  {
    label: "Not Applicable",
    value: "not-applicable"
  }

];


/* =========================================
   BENEFICIARY OPTIONS
========================================= */

const beneficiaryOptions: {

  label: string;

  value: BeneficiaryGroup;

}[] = [

  {
    label: "Student",
    value: "students"
  },

  {
    label: "Farmer",
    value: "farmers"
  },

  {
    label: "Woman",
    value: "women"
  },

  {
    label: "Entrepreneur",
    value: "entrepreneurs"
  },

  {
    label: "Senior Citizen",
    value: "senior-citizens"
  },

  {
    label: "Worker",
    value: "workers"
  },

  {
    label: "Family",
    value: "families"
  },

  {
    label: "General Public",
    value: "general-public"
  }

];


/* =========================================
   INCOME RANGES
========================================= */

const incomeRanges: IncomeRange[] = [

  {
    id: "below-1",
    label: "Below ₹1,00,000",
    min: 0,
    max: 100000
  },

  {
    id: "1-to-2.5",
    label: "₹1,00,001 – ₹2,50,000",
    min: 100001,
    max: 250000
  },

  {
    id: "2.5-to-5",
    label: "₹2,50,001 – ₹5,00,000",
    min: 250001,
    max: 500000
  },

  {
    id: "5-to-8",
    label: "₹5,00,001 – ₹8,00,000",
    min: 500001,
    max: 800000
  },

  {
    id: "above-8",
    label: "Above ₹8,00,000",
    min: 800001,
    max: null
  }

];


/* =========================================
   INITIAL PROFILE
========================================= */

const initialProfile: EligibilityProfile = {

  state: "",

  age: null,

  educationLevel: null,

  beneficiaryGroup: null,

  opportunityType: "all",

  annualIncomeRange: null

};


/* =========================================
   RESULT FILTER TYPE
========================================= */

type ResultFilter =

  | "all"
  | "potential-match"
  | "needs-info"
  | "not-match";



/* =========================================
   MAIN COMPONENT
========================================= */

export default function EligibilityChecker() {


  const [step, setStep] = useState(1);


  const [profile, setProfile] =
    useState<EligibilityProfile>(initialProfile);


  const [results, setResults] =
    useState<EligibilityMatch[]>([]);


  const [showResults, setShowResults] =
    useState(false);


  const [resultFilter, setResultFilter] =
    useState<ResultFilter>("all");


  const [error, setError] =
    useState("");



  /* =====================================
     UPDATE PROFILE
  ===================================== */

  function updateProfile<K extends keyof EligibilityProfile>(

    key: K,

    value: EligibilityProfile[K]

  ) {

    setProfile((previous) => ({

      ...previous,

      [key]: value

    }));

    setError("");

  }



  /* =====================================
     STEP NAVIGATION
  ===================================== */

  function nextStep() {

    if (step === 1 && !profile.state) {

      setError("Please select your state or union territory.");

      return;

    }


    setError("");

    setStep((previous) =>
      Math.min(previous + 1, 3)
    );

  }


  function previousStep() {

    setError("");

    setStep((previous) =>
      Math.max(previous - 1, 1)
    );

  }



  /* =====================================
     RUN ELIGIBILITY CHECK
  ===================================== */

  function handleEligibilityCheck() {


    const selectedOpportunities =
      eligibilityOpportunities.filter((opportunity) => {

        if (profile.opportunityType === "all") {

          return true;

        }

        return opportunity.kind ===
          profile.opportunityType;

      });


    const evaluated =
      evaluateEligibility(
        selectedOpportunities,
        profile
      );


    setResults(evaluated);

    setResultFilter("all");

    setShowResults(true);


    setTimeout(() => {

      document
        .getElementById("eligibility-results")
        ?.scrollIntoView({

          behavior: "smooth",

          block: "start"

        });

    }, 100);

  }



  /* =====================================
     FILTER RESULTS
  ===================================== */

  const filteredResults = useMemo(() => {

    if (resultFilter === "all") {

      return results;

    }

    return results.filter((result) =>

      result.status === resultFilter

    );

  }, [results, resultFilter]);



  /* =====================================
     RESULT COUNTS
  ===================================== */

  const potentialCount =
    results.filter(
      (result) => result.status === "potential-match"
    ).length;


  const needsInfoCount =
    results.filter(
      (result) => result.status === "needs-info"
    ).length;


  const notMatchCount =
    results.filter(
      (result) => result.status === "not-match"
    ).length;



  /* =====================================
     RESTART CHECKER
  ===================================== */

  function restartChecker() {

    setProfile(initialProfile);

    setStep(1);

    setResults([]);

    setShowResults(false);

    setResultFilter("all");

    setError("");

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }



  /* =====================================
     STYLING
  ===================================== */

  const inputClass =

    "h-13 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] px-4 text-sm text-[#292D2C] outline-none transition focus:border-[#167A5B] focus:bg-white focus:ring-4 focus:ring-[#167A5B]/10";


  const stepTitles = [

    "About You",

    "Your Requirements",

    "Financial Details"

  ];



  return (

    <main className="min-h-screen bg-[#FAF8F2]">


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] px-5 py-16 text-white md:py-20">


        <div className="pointer-events-none absolute -right-36 -top-36 h-[430px] w-[430px] rounded-full border border-[#D6B779]/20" />


        <div className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full border border-white/10" />


        <div className="pointer-events-none absolute -bottom-36 -left-32 h-[380px] w-[380px] rounded-full bg-[#D6B779]/10 blur-[90px]" />


        <div className="relative mx-auto max-w-[1100px]">


          <div className="flex items-center gap-2 text-xs text-[#D4E2DA]">

            <Link
              href="/"
              className="hover:text-[#D6B779]"
            >

              Home

            </Link>

            <ArrowRight size={13} />

            <span className="text-[#D6B779]">

              Eligibility Checker

            </span>

          </div>



          <div className="mt-9 max-w-[750px]">


            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[1.7px] text-[#E8D6AA]">

              <Sparkles size={15} />

              Smart Eligibility Discovery

            </div>


            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-1.5px] md:text-6xl">

              Find Opportunities
              <span className="block text-[#D6B779]">

                That Match You.

              </span>

            </h1>


            <p className="mt-6 max-w-[600px] text-sm leading-8 text-[#D4E2DA] md:text-base">

              Answer a few simple questions and explore
              opportunities that may match your profile.
              Let BenefitX make discovery easier.

            </p>



            <div className="mt-8 flex flex-wrap gap-5 text-xs text-[#E3EAE5]">

              <span className="flex items-center gap-2">

                <ShieldCheck
                  size={16}
                  className="text-[#D6B779]"
                />

                Guided assessment

              </span>


              <span className="flex items-center gap-2">

                <CheckCircle2
                  size={16}
                  className="text-[#D6B779]"
                />

                Rule-based matching

              </span>


              <span className="flex items-center gap-2">

                <UserRound
                  size={16}
                  className="text-[#D6B779]"
                />

                No account required

              </span>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================
          CHECKER MAIN AREA
      ===================================== */}

      <section className="px-5 py-14 md:py-20">

        <div className="mx-auto max-w-[950px]">


          {!showResults ? (

            <div className="overflow-hidden rounded-[28px] border border-[#E4E8E0] bg-white shadow-[0_15px_50px_rgba(18,61,50,0.07)]">


              {/* FORM HEADER */}

              <div className="border-b border-[#E4E8E0] px-6 py-7 md:px-10">


                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                      PERSONALIZED DISCOVERY

                    </p>


                    <h2 className="mt-3 text-2xl font-extrabold text-[#123D32]">

                      Eligibility Assessment

                    </h2>


                    <p className="mt-2 text-xs leading-6 text-[#718077]">

                      Complete these three steps to explore
                      potentially matching opportunities.

                    </p>

                  </div>



                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3EC]">

                    <GraduationCap
                      size={32}
                      className="text-[#075B46]"
                    />

                  </div>

                </div>



                {/* PROGRESS INDICATOR */}

                <div className="mt-8">


                  <div className="flex items-center justify-between gap-2">


                    {stepTitles.map((title, index) => {

                      const number = index + 1;

                      const completed = step > number;

                      const active = step === number;


                      return (

                        <div
                          key={title}
                          className="flex flex-1 items-center gap-2"
                        >

                          <div className="flex flex-col items-center gap-2 sm:flex-row">


                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                                completed

                                  ? "bg-[#075B46] text-white"

                                  : active

                                  ? "bg-[#D6B779] text-[#123D32] shadow-md"

                                  : "bg-[#EEF3EC] text-[#7B847D]"
                              }`}
                            >

                              {completed ? (
                                <Check size={16} />
                              ) : (
                                number
                              )}

                            </div>


                            <span
                              className={`hidden text-[11px] font-bold sm:block ${
                                active || completed
                                  ? "text-[#123D32]"
                                  : "text-[#A0A9A1]"
                              }`}
                            >

                              {title}

                            </span>

                          </div>


                          {number !== 3 && (

                            <div
                              className={`h-[2px] flex-1 rounded-full ${
                                completed
                                  ? "bg-[#075B46]"
                                  : "bg-[#E4E8E0]"
                              }`}
                            />

                          )}

                        </div>

                      );

                    })}


                  </div>


                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF3EC]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#075B46] to-[#D6B779] transition-all duration-500"
                      style={{
                        width: `${(step / 3) * 100}%`
                      }}
                    />

                  </div>

                </div>

              </div>



              {/* FORM CONTENT */}

              <div className="px-6 py-8 md:px-10 md:py-10">


                {/* =================================
                    STEP 1
                ================================= */}

                {step === 1 && (

                  <div className="animate-in fade-in duration-300">


                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EC] text-[#075B46]">

                        <MapPin size={23} />

                      </div>


                      <div>

                        <h3 className="text-xl font-bold text-[#123D32]">

                          Let's Get to Know You

                        </h3>


                        <p className="mt-1 text-xs text-[#718077]">

                          Tell us a little about your location and age.

                        </p>

                      </div>

                    </div>



                    <div className="mt-9 grid grid-cols-1 gap-7 md:grid-cols-2">


                      {/* STATE */}

                      <div>

                        <label
                          htmlFor="user-state"
                          className="mb-3 block text-sm font-bold text-[#123D32]"
                        >

                          State / Union Territory

                          <span className="ml-1 text-[#B54747]">
                            *
                          </span>

                        </label>


                        <select
                          id="user-state"
                          value={profile.state}
                          onChange={(event) =>
                            updateProfile("state", event.target.value)
                          }
                          className={inputClass}
                        >

                          <option value="">
                            Select your state
                          </option>


                          {indianStates.map((state) => (

                            <option
                              key={state}
                              value={state}
                            >

                              {state}

                            </option>

                          ))}

                        </select>


                        <p className="mt-2 text-[11px] text-[#7B847D]">

                          Select your current state of residence.

                        </p>

                      </div>



                      {/* AGE */}

                      <div>

                        <label
                          htmlFor="user-age"
                          className="mb-3 block text-sm font-bold text-[#123D32]"
                        >

                          Your Age

                          <span className="ml-2 text-[10px] font-medium text-[#7B847D]">

                            Optional

                          </span>

                        </label>


                        <input
                          id="user-age"
                          type="number"
                          min="1"
                          max="120"
                          value={profile.age ?? ""}
                          onChange={(event) => {

                            const value = event.target.value;

                            updateProfile(
                              "age",
                              value === ""
                                ? null
                                : Number(value)
                            );

                          }}
                          placeholder="Enter your age"
                          className={inputClass}
                        />


                        <p className="mt-2 text-[11px] text-[#7B847D]">

                          Some opportunities have age requirements.

                        </p>

                      </div>

                    </div>

                  </div>

                )}



                {/* =================================
                    STEP 2
                ================================= */}

                {step === 2 && (

                  <div className="animate-in fade-in duration-300">


                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EC] text-[#075B46]">

                        <GraduationCap size={23} />

                      </div>


                      <div>

                        <h3 className="text-xl font-bold text-[#123D32]">

                          What Are You Looking For?

                        </h3>


                        <p className="mt-1 text-xs text-[#718077]">

                          Select your preferred opportunity type and relevant details.

                        </p>

                      </div>

                    </div>



                    {/* OPPORTUNITY TYPE */}

                    <div className="mt-9">

                      <label className="mb-4 block text-sm font-bold text-[#123D32]">

                        Select Opportunity Type

                      </label>



                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


                        {[
                          {
                            value: "all",
                            title: "Both",
                            description: "Scholarships and schemes",
                            icon: Sparkles
                          },
                          {
                            value: "scholarship",
                            title: "Scholarships",
                            description: "Education support",
                            icon: GraduationCap
                          },
                          {
                            value: "scheme",
                            title: "Government Schemes",
                            description: "Citizen benefits",
                            icon: Landmark
                          }
                        ].map((item) => {

                          const Icon = item.icon;

                          const active =
                            profile.opportunityType === item.value;


                          return (

                            <button
                              key={item.value}
                              type="button"
                              aria-pressed={active}
                              onClick={() =>

                                updateProfile(
                                  "opportunityType",
                                  item.value as EligibilityProfile["opportunityType"]
                                )

                              }
                              className={`rounded-2xl border p-5 text-left transition ${
                                active
                                  ? "border-[#075B46] bg-[#EEF3EC] shadow-sm"
                                  : "border-[#E4E8E0] bg-white hover:border-[#D6B779]"
                              }`}
                            >

                              <Icon
                                size={25}
                                className={
                                  active
                                    ? "text-[#075B46]"
                                    : "text-[#B8954B]"
                                }
                              />


                              <h4 className="mt-4 text-sm font-bold text-[#123D32]">

                                {item.title}

                              </h4>


                              <p className="mt-2 text-[11px] leading-5 text-[#718077]">

                                {item.description}

                              </p>


                              {active && (

                                <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#075B46]">

                                  <CheckCircle2 size={13} />

                                  Selected

                                </div>

                              )}

                            </button>

                          );

                        })}

                      </div>

                    </div>



                    {/* EDUCATION */}

                    <div className="mt-8">

                      <label
                        htmlFor="education-level"
                        className="mb-3 block text-sm font-bold text-[#123D32]"
                      >

                        Current Education Level

                        <span className="ml-2 text-[10px] font-medium text-[#7B847D]">

                          Optional

                        </span>

                      </label>


                      <select
                        id="education-level"
                        value={profile.educationLevel ?? ""}
                        onChange={(event) =>

                          updateProfile(
                            "educationLevel",
                            event.target.value as EligibilityProfile["educationLevel"]
                          )

                        }
                        className={inputClass}
                      >

                        <option value="">

                          Select education level

                        </option>


                        {educationOptions.map((option) => (

                          <option
                            key={option.label}
                            value={option.value}
                          >

                            {option.label}

                          </option>

                        ))}

                      </select>

                    </div>



                    {/* BENEFICIARY */}

                    <div className="mt-8">

                      <label
                        htmlFor="beneficiary-group"
                        className="mb-3 block text-sm font-bold text-[#123D32]"
                      >

                        Beneficiary Category

                        <span className="ml-2 text-[10px] font-medium text-[#7B847D]">

                          Optional

                        </span>

                      </label>


                      <select
                        id="beneficiary-group"
                        value={profile.beneficiaryGroup ?? ""}
                        onChange={(event) =>

                          updateProfile(
                            "beneficiaryGroup",
                            (event.target.value || null) as EligibilityProfile["beneficiaryGroup"]
                          )

                        }
                        className={inputClass}
                      >

                        <option value="">

                          Select beneficiary category

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


                      <p className="mt-2 text-[11px] leading-5 text-[#7B847D]">

                        Choose the category that describes the intended beneficiary.
                        You can leave this blank when it is not applicable.

                      </p>

                    </div>

                  </div>

                )}



                {/* =================================
                    STEP 3
                ================================= */}

                {step === 3 && (

                  <div className="animate-in fade-in duration-300">


                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBF4E5] text-[#B8954B]">

                        <Wallet size={23} />

                      </div>


                      <div>

                        <h3 className="text-xl font-bold text-[#123D32]">

                          Financial Information

                        </h3>


                        <p className="mt-1 text-xs text-[#718077]">

                          Help us evaluate income-related conditions.

                        </p>

                      </div>

                    </div>



                    {/* INCOME */}

                    <div className="mt-9">

                      <label
                        htmlFor="family-income"
                        className="mb-3 block text-sm font-bold text-[#123D32]"
                      >

                        Annual Family Income

                      </label>


                      <select
                        id="family-income"
                        value={
                          profile.annualIncomeRange?.id ?? ""
                        }
                        onChange={(event) => {

                          const selectedRange =
                            incomeRanges.find(
                              (range) =>
                                range.id === event.target.value
                            ) ?? null;


                          updateProfile(
                            "annualIncomeRange",
                            selectedRange
                          );

                        }}
                        className={inputClass}
                      >

                        <option value="">

                          Prefer not to disclose

                        </option>


                        {incomeRanges.map((range) => (

                          <option
                            key={range.id}
                            value={range.id}
                          >

                            {range.label}

                          </option>

                        ))}

                      </select>


                      <p className="mt-3 text-xs leading-7 text-[#718077]">

                        We use broad income ranges rather than asking
                        for an exact family income. Some scholarship
                        and scheme conditions may depend on this detail.

                      </p>

                    </div>



                    {/* PRIVACY INFORMATION */}

                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E4E8E0] bg-[#F2F5F0] p-5">

                      <ShieldCheck
                        size={22}
                        className="mt-0.5 shrink-0 text-[#075B46]"
                      />


                      <div>

                        <h4 className="text-sm font-bold text-[#123D32]">

                          Your Information Matters

                        </h4>


                        <p className="mt-2 text-xs leading-6 text-[#718077]">

                          This checker evaluates your answers in your browser.
                          This version does not save your eligibility answers
                          to a BenefitX account or database.

                        </p>

                      </div>

                    </div>



                    {/* SUMMARY */}

                    <div className="mt-8 rounded-2xl border border-[#D6B779]/50 bg-[#FBF4E5] p-5">

                      <p className="text-xs font-bold uppercase tracking-wide text-[#876A2F]">

                        Your Assessment Summary

                      </p>


                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                          <p className="text-[10px] text-[#806C44]">
                            State
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#725A2C]">
                            {profile.state || "Not selected"}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] text-[#806C44]">
                            Age
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#725A2C]">
                            {profile.age ?? "Not provided"}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] text-[#806C44]">
                            Opportunity Type
                          </p>

                          <p className="mt-1 text-sm font-bold capitalize text-[#725A2C]">
                            {profile.opportunityType === "all"
                              ? "Both"
                              : profile.opportunityType}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] text-[#806C44]">
                            Income Range
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#725A2C]">
                            {profile.annualIncomeRange?.label ?? "Not provided"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                )}



                {/* ERROR MESSAGE */}

                {error && (

                  <div
                    role="alert"
                    className="mt-7 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >

                    <AlertCircle size={18} />

                    {error}

                  </div>

                )}



                {/* FORM BUTTONS */}

                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#E4E8E0] pt-7 sm:flex-row sm:items-center sm:justify-between">


                  {step > 1 ? (

                    <button
                      type="button"
                      onClick={previousStep}
                      className="inline-flex min-h-[49px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] px-6 text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
                    >

                      <ArrowLeft size={17} />

                      Previous

                    </button>

                  ) : (

                    <p className="text-[11px] text-[#7B847D]">

                      * Required field

                    </p>

                  )}



                  {step < 3 ? (

                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-8 text-sm font-bold text-white shadow-lg shadow-[#075B46]/15 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >

                      Continue

                      <ArrowRight size={17} />

                    </button>

                  ) : (

                    <button
                      type="button"
                      onClick={handleEligibilityCheck}
                      className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-8 text-sm font-bold text-white shadow-lg shadow-[#075B46]/15 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >

                      <Sparkles size={17} />

                      Find Opportunities

                    </button>

                  )}

                </div>

              </div>

            </div>

          ) : (



            /* =================================
               RESULTS SECTION
            ================================= */

            <div
              id="eligibility-results"
              className="scroll-mt-28"
              aria-live="polite"
            >


              {/* RESULT HEADER */}

              <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123D32] to-[#075B46] p-7 text-white shadow-xl md:p-10">


                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">


                  <div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#E8D6AA]">

                      <Sparkles size={14} />

                      Assessment Complete

                    </div>


                    <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">

                      Your Opportunity
                      <span className="block text-[#D6B779]">
                        Discovery Results
                      </span>

                    </h2>


                    <p className="mt-4 text-sm text-[#D4E2DA]">

                      Review the results based on the information you entered.

                    </p>

                  </div>



                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#D6B779] text-[#123D32] shadow-lg">

                    <ShieldCheck size={39} />

                  </div>


                </div>



                {/* RESULT STATS */}

                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">


                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">

                    <p className="text-3xl font-extrabold text-[#D6B779]">

                      {potentialCount}

                    </p>

                    <p className="mt-1 text-xs font-medium text-[#D4E2DA]">

                      Potential Matches

                    </p>

                  </div>



                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">

                    <p className="text-3xl font-extrabold text-white">

                      {needsInfoCount}

                    </p>

                    <p className="mt-1 text-xs font-medium text-[#D4E2DA]">

                      More Information Needed

                    </p>

                  </div>



                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">

                    <p className="text-3xl font-extrabold text-[#E8D6AA]">

                      {notMatchCount}

                    </p>

                    <p className="mt-1 text-xs font-medium text-[#D4E2DA]">

                      Do Not Match

                    </p>

                  </div>


                </div>

              </div>



              {/* IMPORTANT NOTICE */}

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#D6B779]/50 bg-[#FBF4E5] p-5">

                <Info
                  size={21}
                  className="mt-0.5 shrink-0 text-[#927337]"
                />

                <div>

                  <h3 className="text-sm font-bold text-[#725A2C]">

                    Demonstration Results – Not Official Eligibility Decisions

                  </h3>


                  <p className="mt-2 text-xs leading-6 text-[#806C44]">

                    These results use illustrative test records and
                    synthetic eligibility conditions. They do not
                    establish eligibility for any real government
                    scholarship or scheme. Actual eligibility must
                    be checked against the relevant official notification.

                  </p>

                </div>

              </div>



              {/* FILTER BUTTONS */}

              <div className="mt-9 flex flex-wrap gap-2">


                {[
                  {
                    label: "All Results",
                    value: "all" as const,
                    count: results.length
                  },
                  {
                    label: "Potential Matches",
                    value: "potential-match" as const,
                    count: potentialCount
                  },
                  {
                    label: "Need More Information",
                    value: "needs-info" as const,
                    count: needsInfoCount
                  },
                  {
                    label: "Not Matched",
                    value: "not-match" as const,
                    count: notMatchCount
                  }
                ].map((filter) => (

                  <button
                    key={filter.value}
                    type="button"
                    onClick={() =>
                      setResultFilter(filter.value)
                    }
                    className={`rounded-full border px-4 py-2.5 text-xs font-bold transition ${
                      resultFilter === filter.value

                        ? "border-[#075B46] bg-[#075B46] text-white"

                        : "border-[#D8DCCF] bg-white text-[#59665F] hover:border-[#D6B779]"
                    }`}
                  >

                    {filter.label}

                    <span className="ml-2 opacity-70">
                      {filter.count}
                    </span>

                  </button>

                ))}

              </div>



              {/* RESULT CARDS */}

              <div className="mt-7 space-y-5">


                {filteredResults.length > 0 ? (

                  filteredResults.map((result) => (

                    <article
                      key={result.opportunity.id}
                      className="rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm transition hover:border-[#D6B779] hover:shadow-lg"
                    >


                      {/* CARD HEADER */}

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">


                        <div className="flex items-start gap-4">


                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                            {result.opportunity.kind === "scholarship" ? (

                              <GraduationCap size={25} />

                            ) : (

                              <Landmark size={25} />

                            )}

                          </div>



                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-[#FBF4E5] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-[#876A2F]">

                                Demo Record

                              </span>


                              <span className="rounded-full bg-[#EEF3EC] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-[#075B46]">

                                {result.opportunity.kind}

                              </span>

                            </div>



                            <h3 className="mt-3 text-lg font-bold text-[#123D32]">

                              {result.opportunity.title}

                            </h3>


                            <p className="mt-2 text-xs text-[#718077]">

                              {result.opportunity.provider}

                            </p>

                          </div>

                        </div>



                        {/* RESULT BADGE */}

                        <span
                          className={`shrink-0 self-start rounded-xl px-3 py-2 text-[10px] font-bold ${
                            result.status === "potential-match"

                              ? "bg-[#E9F5EC] text-[#176B43]"

                              : result.status === "needs-info"

                              ? "bg-[#FBF4E5] text-[#876A2F]"

                              : "bg-[#FCEDEE] text-[#A33E49]"
                          }`}
                        >

                          {result.status === "potential-match"

                            ? "Potential Match · Demo"

                            : result.status === "needs-info"

                            ? "More Information Needed"

                            : "Does Not Match"}

                        </span>


                      </div>



                      {/* DESCRIPTION */}

                      <p className="mt-5 text-sm leading-7 text-[#718077]">

                        {result.opportunity.description}

                      </p>



                      {/* CRITERION CHECKS */}

                      <div className="mt-6 rounded-2xl bg-[#FAF8F2] p-5">


                        <h4 className="text-xs font-bold uppercase tracking-wide text-[#123D32]">

                          Eligibility Condition Analysis

                        </h4>



                        <div className="mt-4 space-y-3">


                          {result.checks.map((check, index) => (

                            <div
                              key={index}
                              className="flex items-start gap-3"
                            >


                              <div
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                  check.status === "match"

                                    ? "bg-[#E4F2E8] text-[#176B43]"

                                    : check.status === "not-match"

                                    ? "bg-[#FCEDEE] text-[#A33E49]"

                                    : "bg-[#FBF0D9] text-[#927337]"
                                }`}
                              >

                                {check.status === "match" ? (

                                  <Check size={14} />

                                ) : check.status === "not-match" ? (

                                  <AlertCircle size={14} />

                                ) : (

                                  <CircleHelp size={14} />

                                )}

                              </div>



                              <div>

                                <p className="text-xs font-bold text-[#123D32]">

                                  {check.label}

                                </p>


                                <p className="mt-1 text-xs leading-5 text-[#718077]">

                                  {check.message}

                                </p>

                              </div>

                            </div>

                          ))}

                        </div>

                      </div>



                      {/* ACTIONS */}

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">


                        <Link
                          href={
                            result.opportunity.kind === "scholarship"

                              ? "/scholarships"

                              : "/schemes"
                          }
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 text-xs font-bold text-white transition hover:bg-[#123D32]"
                        >

                          Explore Directory

                          <ArrowRight size={15} />

                        </Link>



                        <a
                          href={result.opportunity.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white px-5 text-xs font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
                        >

                          Official Information Source

                          <ExternalLink size={14} />

                        </a>


                      </div>


                    </article>

                  ))

                ) : (

                  <div className="rounded-2xl border border-dashed border-[#D8DCCF] bg-white px-6 py-14 text-center">

                    <Search
                      size={32}
                      className="mx-auto text-[#B8954B]"
                    />


                    <h3 className="mt-5 text-lg font-bold text-[#123D32]">

                      No Results in This Category

                    </h3>


                    <p className="mt-2 text-sm text-[#718077]">

                      Try selecting another result category.

                    </p>

                  </div>

                )}

              </div>



              {/* BOTTOM ACTIONS */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-between">


                <button
                  type="button"
                  onClick={restartChecker}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white px-6 text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
                >

                  <RotateCcw size={16} />

                  Start Again

                </button>



                <Link
                  href="/scholarships"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#D6B779] px-6 text-sm font-bold text-[#123D32] transition hover:bg-[#C9A75E]"
                >

                  Browse Opportunities

                  <ArrowRight size={16} />

                </Link>


              </div>


            </div>

          )}

        </div>

      </section>



      {/* =====================================
          TRUST SECTION
      ===================================== */}

      <section className="border-t border-[#E4E8E0] bg-white px-5 py-12">

        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 text-center">


          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EC]">

            <ShieldCheck
              size={24}
              className="text-[#075B46]"
            />

          </div>


          <h3 className="text-lg font-bold text-[#123D32]">

            Transparent. Simple. Source-Focused.

          </h3>


          <p className="max-w-[650px] text-xs leading-7 text-[#718077]">

            BenefitX provides preliminary eligibility guidance.
            Government departments and authorised institutions
            make the final eligibility and approval decisions.
            Always confirm the conditions through official
            notifications before applying.

          </p>


        </div>

      </section>


    </main>

  );

}
import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  MapPin,
  CalendarDays,
  BookOpen,
  FileText,
  CheckCircle2,
  Landmark,
  AlertCircle
} from "lucide-react";

import {
  scholarships,
  getScholarshipBySlug
} from "@/data/scholarships";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};


export async function generateStaticParams() {

  return scholarships.map((scholarship) => ({

    slug: scholarship.slug

  }));

}


export async function generateMetadata({
  params
}: Props): Promise<Metadata> {

  const { slug } = await params;

  const scholarship = getScholarshipBySlug(slug);

  if (!scholarship) {

    return {
      title: "Scholarship Not Found"
    };

  }

  return {

    title: scholarship.title,

    description: scholarship.description

  };

}


export default async function ScholarshipDetailsPage({
  params
}: Props) {

  const { slug } = await params;

  const scholarship = getScholarshipBySlug(slug);

  if (!scholarship) {

    notFound();

  }


  return (

    <main className="min-h-screen bg-[#FAF8F2]">


      {/* HEADER */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] to-[#075B46] px-5 py-16 text-white md:py-20">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#D6B779]/20" />

        <div className="relative mx-auto max-w-[1100px]">

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4E2DA]">

            <Link
              href="/"
              className="hover:text-[#D6B779]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/scholarships"
              className="hover:text-[#D6B779]"
            >
              Scholarships
            </Link>

            <span>/</span>

            <span className="text-[#D6B779]">
              Details
            </span>

          </div>


          <div className="mt-9 flex flex-col gap-7 md:flex-row md:items-start">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D6B779] text-[#123D32] shadow-lg">

              <GraduationCap size={33} />

            </div>

            <div className="max-w-[780px]">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full border border-[#D6B779]/40 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#E8D6AA]">
                  Demo Listing
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                  Not Verified
                </span>

              </div>


              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">

                {scholarship.title}

              </h1>


              <p className="mt-5 text-sm leading-8 text-[#D4E2DA] md:text-base">

                {scholarship.description}

              </p>


              <div className="mt-7 flex flex-wrap gap-5 text-xs text-[#E3EAE5]">

                <span className="flex items-center gap-2">

                  <Landmark
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {scholarship.officialPortalName}

                </span>


                <span className="flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {scholarship.state}

                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* DETAILS CONTENT */}

      <section className="px-5 py-14 md:py-20">

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">


          {/* MAIN CONTENT */}

          <div className="space-y-7">


            {/* DEMO WARNING */}

            <div className="rounded-2xl border border-[#D6B779]/60 bg-[#FBF4E5] p-5">

              <div className="flex items-start gap-3">

                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-[#927337]"
                />

                <div>

                  <h2 className="text-sm font-bold text-[#725A2C]">

                    Demonstration Record – Not an Actual Scholarship

                  </h2>

                  <p className="mt-2 text-xs leading-7 text-[#806C44]">

                    This page contains illustrative information used
                    to demonstrate BenefitX functionality. Its
                    eligibility criteria, benefits and application
                    details have not been verified.

                    Do not use this example as an actual scholarship
                    announcement.

                  </p>

                </div>

              </div>

            </div>


            {/* OVERVIEW */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <BookOpen size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">
                  About This Opportunity
                </h2>

              </div>


              <p className="mt-5 text-sm leading-8 text-[#718077]">

                {scholarship.description}

              </p>


              <div className="mt-6 border-t border-[#E4E8E0] pt-6">

                <p className="text-xs font-bold uppercase tracking-wide text-[#B8954B]">

                  Expected Benefit Information

                </p>

                <p className="mt-3 text-sm leading-7 text-[#59665F]">

                  {scholarship.benefitSummary}

                </p>

              </div>

            </section>


            {/* ELIGIBILITY */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <ShieldCheck size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">
                  Eligibility Information
                </h2>

              </div>


              <div className="mt-6 space-y-4">

                {scholarship.eligibilitySummary.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#B8954B]"
                      />

                      <p className="text-sm leading-7 text-[#59665F]">

                        {item}

                      </p>

                    </div>

                  )
                )}

              </div>

              <p className="mt-6 rounded-xl bg-[#F2F5F0] p-4 text-xs leading-6 text-[#59665F]">

                These are illustrative development conditions,
                not verified eligibility criteria.

              </p>

            </section>


            {/* EDUCATION */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <h2 className="text-lg font-bold text-[#123D32]">

                Education Levels

              </h2>


              <div className="mt-5 flex flex-wrap gap-3">

                {scholarship.educationLevels.map((level) => (

                  <span
                    key={level}
                    className="rounded-xl bg-[#EEF3EC] px-4 py-2.5 text-xs font-semibold capitalize text-[#075B46]"
                  >

                    {level.replace("-", " ")}

                  </span>

                ))}

              </div>

            </section>


            {/* DOCUMENTS */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <FileText size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">
                  Required Documents
                </h2>

              </div>


              {scholarship.documents.length > 0 ? (

                <ul className="mt-5 space-y-3">

                  {scholarship.documents.map((document) => (

                    <li
                      key={document}
                      className="flex items-center gap-3 text-sm text-[#59665F]"
                    >

                      <CheckCircle2
                        size={17}
                        className="text-[#167A5B]"
                      />

                      {document}

                    </li>

                  ))}

                </ul>

              ) : (

                <p className="mt-5 text-sm leading-7 text-[#718077]">

                  No verified document list is available for
                  this demonstration record. Refer to the actual
                  scheme notification for its document requirements.

                </p>

              )}

            </section>


            {/* APPLICATION PROCESS */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <GraduationCap size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">
                  Application Process
                </h2>

              </div>


              <div className="mt-6 space-y-5">

                {scholarship.applicationProcess.map(
                  (step, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#075B46] text-xs font-bold text-white">

                        {index + 1}

                      </div>

                      <p className="pt-1 text-sm leading-7 text-[#59665F]">

                        {step}

                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          </div>


          {/* RIGHT SIDEBAR */}

          <aside className="space-y-6">


            {/* QUICK INFORMATION */}

            <div className="h-fit rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#123D32]">

                Quick Information

              </h2>


              <div className="mt-6 space-y-5">


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Provider

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scholarship.provider}

                  </p>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Scheme Type

                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {scholarship.scholarshipType.map((type) => (

                      <span
                        key={type}
                        className="rounded-lg bg-[#EEF3EC] px-2.5 py-1.5 text-[10px] font-semibold capitalize text-[#075B46]"
                      >

                        {type.replace("-", " ")}

                      </span>

                    ))}

                  </div>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Application Deadline

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scholarship.deadline ?? "Not verified"}

                  </p>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Last Verified

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scholarship.lastVerifiedAt ?? "Not verified"}

                  </p>

                </div>

              </div>


              {/* OFFICIAL SOURCE */}

              <div className="mt-7 rounded-xl bg-[#F2F5F0] p-4">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-[#075B46]"
                  />

                  <p className="text-xs font-bold text-[#123D32]">

                    Official Information Source

                  </p>

                </div>

                <p className="mt-2 text-xs leading-6 text-[#718077]">

                  {scholarship.officialPortalName}

                </p>

              </div>


              <a
                href={scholarship.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#075B46] px-4 text-sm font-bold text-white transition hover:bg-[#123D32]"
              >

                Visit Official Portal

                <ArrowUpRight size={17} />

              </a>


              <p className="mt-3 text-center text-[10px] leading-5 text-[#7B847D]">

                Opens the general official portal.
                This is not a verified application link for this demo record.

              </p>

            </div>


            {/* BACK BUTTON */}

            <Link
              href="/scholarships"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
            >

              <ArrowLeft size={17} />

              Back to Scholarships

            </Link>

          </aside>

        </div>

      </section>

    </main>

  );

}
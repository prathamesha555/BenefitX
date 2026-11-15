import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  Landmark,
  ShieldCheck,
  MapPin,
  CalendarDays,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Users,
  IndianRupee
} from "lucide-react";

import {
  governmentSchemes,
  getSchemeBySlug
} from "@/data/schemes";


type Props = {

  params: Promise<{
    slug: string;
  }>;

};


export async function generateStaticParams() {

  return governmentSchemes.map((scheme) => ({

    slug: scheme.slug

  }));

}


export async function generateMetadata({
  params
}: Props): Promise<Metadata> {

  const { slug } = await params;

  const scheme = getSchemeBySlug(slug);

  if (!scheme) {

    return {
      title: "Scheme Not Found"
    };

  }

  return {

    title: scheme.title,

    description: scheme.description

  };

}


export default async function SchemeDetailsPage({
  params
}: Props) {

  const { slug } = await params;

  const scheme = getSchemeBySlug(slug);

  if (!scheme) {

    notFound();

  }


  return (

    <main className="min-h-screen bg-[#FAF8F2]">


      {/* ===================================
          HERO HEADER
      =================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] to-[#075B46] px-5 py-16 text-white md:py-20">

        <div className="pointer-events-none absolute -right-36 -top-36 h-[420px] w-[420px] rounded-full border border-[#D6B779]/20" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#D6B779]/10 blur-[90px]" />


        <div className="relative mx-auto max-w-[1100px]">

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4E2DA]">

            <Link
              href="/"
              className="transition hover:text-[#D6B779]"
            >

              Home

            </Link>

            <span>/</span>

            <Link
              href="/schemes"
              className="transition hover:text-[#D6B779]"
            >

              Government Schemes

            </Link>

            <span>/</span>

            <span className="text-[#D6B779]">
              Details
            </span>

          </div>


          <div className="mt-9 flex flex-col gap-7 md:flex-row md:items-start">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D6B779] text-[#123D32] shadow-lg">

              <Landmark size={32} />

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

                {scheme.title}

              </h1>


              <p className="mt-5 text-sm leading-8 text-[#D4E2DA] md:text-base">

                {scheme.description}

              </p>


              <div className="mt-7 flex flex-wrap gap-5 text-xs text-[#E3EAE5]">

                <span className="flex items-center gap-2">

                  <Landmark
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {scheme.provider}

                </span>


                <span className="flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {scheme.state}

                </span>


                <span className="flex items-center gap-2">

                  <Users
                    size={16}
                    className="text-[#D6B779]"
                  />

                  {scheme.beneficiaryGroups.length} beneficiary groups

                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================
          MAIN DETAILS
      =================================== */}

      <section className="px-5 py-14 md:py-20">

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">


          {/* MAIN CONTENT */}

          <div className="space-y-7">


            {/* DEMO NOTICE */}

            <div className="rounded-2xl border border-[#D6B779]/60 bg-[#FBF4E5] p-5">

              <div className="flex items-start gap-3">

                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-[#927337]"
                />

                <div>

                  <h2 className="text-sm font-bold text-[#725A2C]">

                    Demonstration Record – Not an Actual Government Scheme

                  </h2>

                  <p className="mt-2 text-xs leading-7 text-[#806C44]">

                    This page contains illustrative information for
                    BenefitX development and testing. The scheme name,
                    benefits, eligibility criteria and application
                    details have not been verified as an actual
                    government programme.

                  </p>

                </div>

              </div>

            </div>


            {/* ABOUT */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <BookOpen size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">

                  About This Scheme

                </h2>

              </div>


              <p className="mt-5 text-sm leading-8 text-[#718077]">

                {scheme.description}

              </p>


              <div className="mt-7 border-t border-[#E4E8E0] pt-6">

                <p className="text-xs font-bold uppercase tracking-wide text-[#B8954B]">

                  Scheme Objective

                </p>

                <p className="mt-3 text-sm leading-7 text-[#59665F]">

                  {scheme.objective}

                </p>

              </div>

            </section>


            {/* BENEFITS */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <IndianRupee size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">

                  Benefits & Assistance

                </h2>

              </div>


              <div className="mt-6 space-y-4">

                {scheme.benefits.map((benefit, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#B8954B]"
                    />

                    <p className="text-sm leading-7 text-[#59665F]">

                      {benefit}

                    </p>

                  </div>

                ))}

              </div>

            </section>


            {/* ELIGIBILITY */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <ShieldCheck size={21} />

                </div>

                <h2 className="text-lg font-bold text-[#123D32]">

                  Eligibility Criteria

                </h2>

              </div>


              <div className="mt-6 space-y-4">

                {scheme.eligibilityCriteria.map((item, index) => (

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

                ))}

              </div>

              <p className="mt-6 rounded-xl bg-[#F2F5F0] p-4 text-xs leading-6 text-[#59665F]">

                The conditions above are illustrative development
                examples, not verified eligibility rules.

              </p>

            </section>


            {/* BENEFICIARIES */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <h2 className="text-lg font-bold text-[#123D32]">

                Intended Beneficiaries

              </h2>


              <div className="mt-5 flex flex-wrap gap-3">

                {scheme.beneficiaryGroups.map((group) => (

                  <span
                    key={group}
                    className="rounded-xl bg-[#EEF3EC] px-4 py-2.5 text-xs font-semibold capitalize text-[#075B46]"
                  >

                    {group.replaceAll("-", " ")}

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


              {scheme.requiredDocuments.length > 0 ? (

                <ul className="mt-6 space-y-3">

                  {scheme.requiredDocuments.map((document) => (

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

                  No verified document list is available for this
                  demonstration record. Check the actual scheme
                  notification for the official requirements.

                </p>

              )}

            </section>


            {/* APPLICATION STEPS */}

            <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7">

              <h2 className="text-lg font-bold text-[#123D32]">

                Application Process

              </h2>


              <div className="mt-6 space-y-5">

                {scheme.applicationSteps.map((step, index) => (

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

                ))}

              </div>

            </section>

          </div>


          {/* SIDEBAR */}

          <aside className="space-y-6">


            <div className="h-fit rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#123D32]">

                Scheme Information

              </h2>


              <div className="mt-6 space-y-5">


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Provider

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scheme.provider}

                  </p>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Government Level

                  </p>

                  <p className="mt-2 text-sm font-semibold capitalize text-[#123D32]">

                    {scheme.scope} Government

                  </p>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Application Deadline

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scheme.deadline ?? "Not verified"}

                  </p>

                </div>


                <div className="border-t border-[#E4E8E0] pt-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Last Verified

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {scheme.lastVerifiedAt ?? "Not verified"}

                  </p>

                </div>

              </div>


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

                  {scheme.officialPortalName}

                </p>

              </div>


              <a
                href={scheme.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#075B46] px-4 text-sm font-bold text-white transition hover:bg-[#123D32]"
              >

                Visit Official Portal

                <ArrowUpRight size={17} />

              </a>


              <p className="mt-3 text-center text-[10px] leading-5 text-[#7B847D]">

                Opens a general official information portal,
                not a verified application link for this demo.

              </p>

            </div>


            <Link
              href="/schemes"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
            >

              <ArrowLeft size={17} />

              Back to Schemes

            </Link>

          </aside>

        </div>

      </section>

    </main>

  );

}
import BookmarkButton from "@/components/auth/bookmark-button";
import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Sprout,
  HeartHandshake,
  Stethoscope,
  BriefcaseBusiness,
  House,
  Building2,
  Users,
  GraduationCap,
  Accessibility,
  Landmark,
  IndianRupee,
  LucideIcon
} from "lucide-react";

import type {
  GovernmentScheme,
  SchemeCategory
} from "@/types/scheme";


interface SchemeCardProps {
  scheme: GovernmentScheme;
}


const categoryIcons: Record<SchemeCategory, LucideIcon> = {

  agriculture: Sprout,

  "women-child": HeartHandshake,

  healthcare: Stethoscope,

  employment: BriefcaseBusiness,

  housing: House,

  business: Building2,

  "senior-citizens": Users,

  "social-welfare": HeartHandshake,

  disability: Accessibility,

  education: GraduationCap

};


const categoryLabels: Record<SchemeCategory, string> = {

  agriculture: "Agriculture",

  "women-child": "Women & Children",

  healthcare: "Healthcare",

  employment: "Employment",

  housing: "Housing",

  business: "Business",

  "senior-citizens": "Senior Citizens",

  "social-welfare": "Social Welfare",

  disability: "Disability Assistance",

  education: "Education"

};


const statusLabels = {

  open: "Application Open",

  ongoing: "Ongoing Scheme",

  upcoming: "Upcoming",

  closed: "Application Closed",

  "not-verified": "Application Status Not Confirmed"

};


export default function SchemeCard({
  scheme
}: SchemeCardProps) {

  const Icon =
    categoryIcons[scheme.categories[0]] || Landmark;


  return (

    <article className="group flex h-full flex-col overflow-hidden rounded-[23px] border border-[#E4E8E0] bg-white shadow-[0_5px_22px_rgba(18,61,50,0.04)] transition duration-300 hover:-translate-y-2 hover:border-[#D6B779] hover:shadow-[0_20px_45px_rgba(18,61,50,0.10)]">


      {/* Card Header */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF3EC] to-[#FAF8F2] p-6">

        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#D6B779]/30" />

        <div className="relative flex items-start justify-between">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#075B46] shadow-sm">

            <Icon size={28} />

          </div>

          <span className="rounded-full border border-[#D6B779]/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#876A2F]">

            BenefitX Reviewed

          </span>

        </div>


        <div className="relative mt-6">

    <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B8954B]">

    {scheme.providerType}

  </p>

  <h3 className="mt-2 min-h-[55px] text-lg font-bold leading-7 text-[#123D32]">

    {scheme.title}

  </h3>

  <div className="mt-3 flex items-center justify-between gap-3">

    <p className="text-xs font-medium text-[#718077]">

      {scheme.provider}

    </p>

    <BookmarkButton

      kind="scheme"

      title={scheme.title}

      slug={scheme.slug}

      sourceUrl={scheme.sourceUrl}

    />

  </div>

</div>

      </div>


      {/* Card Body */}

      <div className="flex flex-1 flex-col p-6">

        <p className="min-h-[78px] text-sm leading-7 text-[#718077]">

          {scheme.description}

        </p>


        {/* Categories */}

        <div className="mt-5">

          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

            Categories

          </p>

          <div className="flex flex-wrap gap-2">

            {scheme.categories.map((category) => (

              <span
                key={category}
                className="rounded-lg bg-[#EEF3EC] px-2.5 py-1.5 text-[10px] font-semibold text-[#075B46]"
              >

                {categoryLabels[category]}

              </span>

            ))}

          </div>

        </div>


        {/* Beneficiary */}

        <div className="mt-5">

          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

            Beneficiaries

          </p>

          <div className="flex flex-wrap gap-2">

            {scheme.beneficiaryGroups.slice(0, 2).map((group) => (

              <span
                key={group}
                className="rounded-lg bg-[#FBF4E5] px-2.5 py-1.5 text-[10px] font-semibold capitalize text-[#876A2F]"
              >

                {group.replaceAll("-", " ")}

              </span>

            ))}

            {scheme.beneficiaryGroups.length > 2 && (

              <span className="rounded-lg bg-[#FBF4E5] px-2.5 py-1.5 text-[10px] font-semibold text-[#876A2F]">

                +{scheme.beneficiaryGroups.length - 2} more

              </span>

            )}

          </div>

        </div>


        {/* Important Information */}

        <div className="mt-5 space-y-3 border-t border-[#E4E8E0] pt-5">

          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <MapPin
              size={15}
              className="text-[#B8954B]"
            />

            {scheme.state}

          </div>


          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <IndianRupee
              size={15}
              className="text-[#B8954B]"
            />

            {scheme.benefitAmount ?? "See official source for benefit details"}

          </div>


          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <CalendarDays
              size={15}
              className="text-[#B8954B]"
            />

            {scheme.deadline ?? "No fixed deadline listed"}

          </div>

        </div>


        {/* Status */}

        <div className="mt-5 flex items-center justify-between rounded-xl bg-[#FBF4E5] px-3 py-3">

          <span className="text-[11px] font-bold text-[#725A2C]">

            {statusLabels[scheme.applicationStatus]}

          </span>

          <ShieldCheck
            size={16}
            className="text-[#B8954B]"
          />

        </div>


        {/* Action */}

        <div className="mt-auto pt-6">

          <Link
            href={`/schemes/${scheme.slug}`}
            className="group/button inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 text-sm font-bold text-white transition hover:bg-[#123D32]"
          >

            View Scheme Details

            <ArrowUpRight
              size={17}
              className="transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
            />

          </Link>

        </div>

      </div>

    </article>

  );

}
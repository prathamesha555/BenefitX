import BookmarkButton from "@/components/auth/bookmark-button";
import Link from "next/link";

import {
  ArrowUpRight,
  GraduationCap,
  MapPin,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  Clock3
} from "lucide-react";

import type { Scholarship } from "@/types/scholarship";

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

const statusLabels = {
  open: "Application Open",
  upcoming: "Upcoming",
  closed: "Application Closed",
  "not-verified": "Not Verified"
};

export default function ScholarshipCard({
  scholarship
}: ScholarshipCardProps) {

  return (

    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E4E8E0] bg-white shadow-[0_5px_22px_rgba(18,61,50,0.04)] transition duration-300 hover:-translate-y-2 hover:border-[#D6B779] hover:shadow-[0_20px_45px_rgba(18,61,50,0.10)]">

      {/* Card Header */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF3EC] to-[#FAF8F2] p-6">

        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-[#D6B779]/30" />

        <div className="relative flex items-start justify-between">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#075B46] shadow-sm">

            <GraduationCap size={29} />

          </div>

          <span className="rounded-full border border-[#D6B779]/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#876A2F]">

            Demo Listing

          </span>

        </div>

        <div className="relative mt-6">

  <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

    {scholarship.providerType}

  </p>

  <h3 className="mt-2 min-h-[55px] text-lg font-bold leading-7 text-[#123D32]">

    {scholarship.title}

  </h3>

  <div className="mt-3 flex items-center justify-between gap-3">

    <p className="text-xs font-medium text-[#718077]">

      {scholarship.provider}

    </p>

    <BookmarkButton

      kind="scholarship"

      title={scholarship.title}

      slug={scholarship.slug}

      sourceUrl={scholarship.sourceUrl}

    />

  </div>

</div>

      </div>


      {/* Card Body */}

      <div className="flex flex-1 flex-col p-6">

        <p className="min-h-[75px] text-sm leading-7 text-[#718077]">

          {scholarship.description}

        </p>

        {/* Education Level */}

        <div className="mt-5">

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[1.3px] text-[#7B847D]">

            Education Level

          </p>

          <div className="flex flex-wrap gap-2">

            {scholarship.educationLevels.map((level) => (

              <span
                key={level}
                className="rounded-lg bg-[#EEF3EC] px-2.5 py-1.5 text-[10px] font-semibold capitalize text-[#075B46]"
              >

                {level.replace("-", " ")}

              </span>

            ))}

          </div>

        </div>


        {/* Information */}

        <div className="mt-5 space-y-3 border-t border-[#E4E8E0] pt-5">

          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <MapPin
              size={15}
              className="text-[#B8954B]"
            />

            {scholarship.state}

          </div>

          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <IndianRupee
              size={15}
              className="text-[#B8954B]"
            />

            {scholarship.amount ?? "Benefit amount not verified"}

          </div>

          <div className="flex items-center gap-2 text-xs text-[#59665F]">

            <CalendarDays
              size={15}
              className="text-[#B8954B]"
            />

            {scholarship.deadline
              ? scholarship.deadline
              : "Deadline not verified"}

          </div>

        </div>


        {/* Status */}

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#FBF4E5] px-3 py-3">

          <div className="flex items-center gap-2">

            <Clock3
              size={15}
              className="text-[#B8954B]"
            />

            <span className="text-[11px] font-bold text-[#725A2C]">

              {statusLabels[scholarship.applicationStatus]}

            </span>

          </div>

          <ShieldCheck
            size={16}
            className="shrink-0 text-[#B8954B]"
          />

        </div>


        {/* Action */}

        <div className="mt-auto pt-6">

          <Link
            href={`/scholarships/${scholarship.slug}`}
            className="group/button inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 text-sm font-bold text-white transition hover:bg-[#123D32]"
          >

            View Details

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
import Link from "next/link";

import {
  ArrowUpRight,
  GraduationCap,
  Heart,
  ShieldCheck,
  Landmark,
  ArrowUp,
  Leaf,
} from "lucide-react";

import BenefitXLogo from "@/components/brand/benefitx-logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Scholarships", href: "/scholarships" },
  { name: "Government Schemes", href: "/schemes" },
  { name: "Eligibility Checker", href: "/eligibility" },
  { name: "About BenefitX", href: "/about" },
];

const scholarshipLinks = [
  {
    name: "School Scholarships",
    href: "/scholarships?level=school",
  },
  {
    name: "College Scholarships",
    href: "/scholarships?level=college",
  },
  {
    name: "Undergraduate",
    href: "/scholarships?level=undergraduate",
  },
  {
    name: "Postgraduate",
    href: "/scholarships?level=postgraduate",
  },
];

const governmentLinks = [
  {
    name: "National Scholarship Portal",
    href: "https://scholarships.gov.in/",
  },
  {
    name: "myScheme",
    href: "https://www.myscheme.gov.in/",
  },
  {
    name: "MahaDBT",
    href: "https://mahadbt.maharashtra.gov.in/",
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#123D32] text-white">

      {/* Decorative Background */}

      <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-[#D6B779]/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-48 -left-32 h-[350px] w-[350px] rounded-full bg-[#167A5B]/30 blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-16 md:px-8 lg:px-12">

        {/* Upper Footer */}

        <div className="grid grid-cols-1 gap-12 border-b border-white/15 pb-14 md:grid-cols-2 lg:grid-cols-12">

          {/* Brand Column */}

          <div className="lg:col-span-4">

            <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10">

              <BenefitXLogo showTagline />

            </div>

            <p className="mt-6 max-w-[350px] text-sm leading-7 text-[#D7E4DC]">
              Discover scholarships, government schemes and financial
              assistance opportunities through one simple platform.
              Find opportunities that help you move forward.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-[#D6B779]/10 px-4 py-2 text-xs font-medium text-[#E8D6AA]">

              <ShieldCheck size={15} />

              Verified Sources. Better Opportunities.

            </div>

          </div>

          {/* Quick Links */}

          <div className="lg:col-span-2">

            <h3 className="mb-6 text-sm font-bold tracking-wide text-[#D6B779]">
              QUICK LINKS
            </h3>

            <ul className="space-y-4">

              {quickLinks.map((link) => (

                <li key={link.name}>

                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#D7E4DC] transition hover:text-white"
                  >

                    {link.name}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />

                  </Link>

                </li>

              ))}

            </ul>

          </div>

          {/* Scholarship Links */}

          <div className="lg:col-span-3">

            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wide text-[#D6B779]">

              <GraduationCap size={18} />

              SCHOLARSHIPS

            </h3>

            <ul className="space-y-4">

              {scholarshipLinks.map((link) => (

                <li key={link.name}>

                  <Link
                    href={link.href}
                    className="text-sm text-[#D7E4DC] transition hover:text-white"
                  >
                    {link.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

          {/* Government Resources */}

          <div className="lg:col-span-3">

            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wide text-[#D6B779]">

              <Landmark size={18} />

              OFFICIAL RESOURCES

            </h3>

            <ul className="space-y-4">

              {governmentLinks.map((link) => (

                <li key={link.name}>

                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-[#D7E4DC] transition hover:text-white"
                  >

                    {link.name}

                    <ArrowUpRight
                      size={13}
                      className="text-[#D6B779] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                  </a>

                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Trust Notice */}

        <div className="flex flex-col gap-4 border-b border-white/15 py-7 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#D6B779]"
            />

            <p className="max-w-[850px] text-xs leading-6 text-[#D7E4DC]">
              BenefitX is an independent information and discovery platform.
              It is not affiliated with or operated by any government authority.
              Always verify eligibility, deadlines and application requirements
              through the relevant official government portal.
            </p>

          </div>

          <a
            href="#top"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#D6B779] transition hover:text-white"
          >

            Back to top

            <ArrowUp size={15} />

          </a>

        </div>

        {/* Bottom Footer */}

        <div className="flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">

          <p className="text-xs text-[#C5D4CB]">
            © 2026 BenefitX. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">

            <Link
              href="/privacy"
              className="text-[#D7E4DC] transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[#D7E4DC] transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <span className="inline-flex items-center gap-1.5 text-[#D7E4DC]">

              Made with

              <Heart
                size={13}
                fill="#D6B779"
                className="text-[#D6B779]"
              />

              for better opportunities

            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}
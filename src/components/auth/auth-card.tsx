import type { ReactNode } from "react";

import BenefitXLogo from "@/components/brand/benefitx-logo";

interface AuthCardProps {

  eyebrow: string;

  title: string;

  description: string;

  children: ReactNode;

}

export default function AuthCard({

  eyebrow,

  title,

  description,

  children

}: AuthCardProps) {

  return (

    <main className="relative flex min-h-[750px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF8F2] via-white to-[#EEF3EC] px-5 py-16">

      <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#D6B779]/25" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#167A5B]/10 blur-[100px]" />


      <div className="relative z-10 w-full max-w-[470px]">

        <div className="mb-8 flex justify-center">

          <BenefitXLogo showTagline />

        </div>


        <div className="rounded-[28px] border border-[#E4E8E0] bg-white p-7 shadow-[0_20px_60px_rgba(18,61,50,0.09)] sm:p-10">


          <div className="text-center">

            <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#B8954B]">

              {eyebrow}

            </span>


            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123D32]">

              {title}

            </h1>


            <p className="mt-3 text-sm leading-7 text-[#718077]">

              {description}

            </p>

          </div>


          <div className="mt-8">

            {children}

          </div>


        </div>


        <p className="mt-7 text-center text-[11px] text-[#7B847D]">

          © 2026 BenefitX. All rights reserved.

        </p>

      </div>

    </main>

  );

}
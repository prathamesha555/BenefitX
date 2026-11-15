"use client";

import { useRouter } from "next/navigation";

import {

  LayoutDashboard,
  GraduationCap,
  Landmark,
  Users,
  ShieldCheck,
  FileCheck,
  Settings,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Clock,
  Database,
  Globe2,
  LockKeyhole,
  Menu,
  X

} from "lucide-react";

import { useState } from "react";

import BenefitXLogo from "@/components/brand/benefitx-logo";

import {
  signOutBenefitX
} from "@/lib/benefitx-signout";


interface AdminStats {

  scholarships: number;

  schemes: number;

  users: number;

  pendingVerification: number;

}


interface AdminDashboardProps {

  stats: AdminStats;

  adminEmail: string;

}


const comingSoonModules = [

  {
    title: "Scholarship Management",
    description: "Create and manage scholarship records.",
    icon: GraduationCap
  },

  {
    title: "Government Schemes",
    description: "Manage government benefit information.",
    icon: Landmark
  },

  {
    title: "Verification Centre",
    description: "Review official sources and approvals.",
    icon: ShieldCheck
  },

  {
    title: "User Management",
    description: "Manage registered BenefitX accounts.",
    icon: Users
  },

  {
    title: "Activity Logs",
    description: "Review administrator activity.",
    icon: Clock
  },

  {
    title: "Platform Settings",
    description: "Manage BenefitX configuration.",
    icon: Settings
  }

];


export default function AdminDashboard({

  stats,

  adminEmail

}: AdminDashboardProps) {


  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);


  async function handleLogout() {

    setLoggingOut(true);

    try {

      await signOutBenefitX();

      router.replace("/login");

      router.refresh();

    } catch (error) {

      console.error(
        "Admin Logout Error:",
        error
      );

      alert("Unable to sign out. Please try again.");

      setLoggingOut(false);

    }

  }


  const statCards = [

    {
      title: "Scholarships",
      value: stats.scholarships,
      icon: GraduationCap,
      note: "Database records"
    },

    {
      title: "Government Schemes",
      value: stats.schemes,
      icon: Landmark,
      note: "Database records"
    },

    {
      title: "Registered Users",
      value: stats.users,
      icon: Users,
      note: "User accounts"
    },

    {
      title: "Pending Verification",
      value: stats.pendingVerification,
      icon: ShieldCheck,
      note: "Awaiting review"
    }

  ];


  return (

    <div className="min-h-screen bg-[#F4F6F2]">


      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />

      )}



      {/* SIDEBAR */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-[#E4E8E0] bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >


        {/* BRAND */}

        <div className="flex h-[85px] items-center justify-between border-b border-[#E4E8E0] px-6">

          <BenefitXLogo />


          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#59665F] lg:hidden"
            aria-label="Close admin menu"
          >

            <X size={20} />

          </button>

        </div>



        {/* ADMIN PROFILE */}

        <div className="mx-4 mt-6 rounded-2xl bg-gradient-to-br from-[#123D32] to-[#075B46] p-4 text-white">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D6B779] text-[#123D32]">

              <LockKeyhole size={22} />

            </div>


            <div className="min-w-0">

              <p className="text-sm font-bold">
                Super Admin
              </p>

              <p className="mt-1 truncate text-[10px] text-[#D4E2DA]">
                Administrator Access
              </p>

            </div>

          </div>

        </div>



        {/* SIDEBAR NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-7">


          <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.6px] text-[#A0A99F]">

            MAIN MENU

          </p>


          <button
            type="button"
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl bg-[#EEF3EC] px-4 text-sm font-bold text-[#075B46]"
          >

            <LayoutDashboard size={18} />

            Overview

          </button>



          <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[1.6px] text-[#A0A99F]">

            MANAGEMENT

          </p>


          {comingSoonModules.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                title="Management module will be activated in the next development stage."
                className="mb-2 flex min-h-[46px] cursor-not-allowed items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#A0A99F]"
              >

                <Icon size={18} />

                <span>
                  {item.title}
                </span>

              </div>

            );

          })}



          <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[1.6px] text-[#A0A99F]">

            QUICK ACCESS

          </p>


          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#59665F] transition hover:bg-[#F2F5F0] hover:text-[#075B46]"
          >

            <Globe2 size={18} />

            View Website

          </button>


          <button
            type="button"
            onClick={() => router.push("/scholarships")}
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#59665F] transition hover:bg-[#F2F5F0] hover:text-[#075B46]"
          >

            <GraduationCap size={18} />

            Scholarship Directory

          </button>


          <button
            type="button"
            onClick={() => router.push("/schemes")}
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#59665F] transition hover:bg-[#F2F5F0] hover:text-[#075B46]"
          >

            <Landmark size={18} />

            Schemes Directory

          </button>

        </div>



        {/* SIDEBAR BOTTOM */}

        <div className="border-t border-[#E4E8E0] p-4">

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >

            <LogOut size={18} />

            {loggingOut ? "Signing Out..." : "Sign Out"}

          </button>

          <p className="mt-4 text-center text-[9px] text-[#A0A99F]">

            BENEFITX ADMIN PANEL · 2026

          </p>

        </div>

      </aside>



      {/* MAIN AREA */}

      <div className="min-h-screen lg:ml-[270px]">


        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[75px] items-center justify-between border-b border-[#E4E8E0] bg-white/95 px-5 backdrop-blur-xl md:px-8">


          <div className="flex items-center gap-3">


            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="rounded-xl border border-[#E4E8E0] p-2 text-[#123D32] lg:hidden"
            >

              <Menu size={21} />

            </button>


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#B8954B]">

                ADMINISTRATION

              </p>

              <h1 className="text-lg font-extrabold text-[#123D32]">

                Overview

              </h1>

            </div>

          </div>



          <div className="flex items-center gap-4">


            <div className="hidden text-right sm:block">

              <p className="text-xs font-bold text-[#123D32]">

                Super Administrator

              </p>

              <p className="mt-1 max-w-[210px] truncate text-[10px] text-[#7B847D]">

                {adminEmail}

              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3EC] text-[#075B46]">

              <LockKeyhole size={19} />

            </div>

          </div>

        </header>



        {/* DASHBOARD CONTENT */}

        <main className="px-5 py-9 md:px-8 md:py-10">


          {/* WELCOME */}

          <section className="relative overflow-hidden rounded-[25px] bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] p-7 text-white shadow-lg md:p-10">

            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#D6B779]/20" />

            <div className="pointer-events-none absolute -right-5 -top-10 h-56 w-56 rounded-full border border-white/10" />


            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">

              <div>

                <span className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#E8D6AA]">

                  <ShieldCheck size={14} />

                  Secure Admin Access

                </span>


                <h2 className="mt-6 text-3xl font-extrabold leading-tight md:text-4xl">

                  Welcome to BenefitX

                  <span className="block text-[#D6B779]">
                    Administration Centre
                  </span>

                </h2>


                <p className="mt-4 max-w-[570px] text-sm leading-7 text-[#D4E2DA]">

                  Manage the platform, monitor content and maintain
                  accurate information for BenefitX users.

                </p>

              </div>


              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[25px] bg-[#D6B779] text-[#123D32] shadow-xl">

                <LayoutDashboard size={38} />

              </div>

            </div>

          </section>



          {/* STATS */}

          <section className="mt-10">


            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                  PLATFORM OVERVIEW

                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-[#123D32]">

                  Dashboard Statistics

                </h2>

              </div>


              <span className="text-[10px] text-[#7B847D]">

                Live Firestore collection counts

              </span>

            </div>



            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


              {statCards.map((item) => {

                const Icon = item.icon;

                return (

                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-[0_5px_20px_rgba(18,61,50,0.04)] transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-semibold text-[#718077]">

                          {item.title}

                        </p>

                        <p className="mt-4 text-3xl font-extrabold text-[#123D32]">

                          {item.value.toLocaleString("en-IN")}

                        </p>

                        <p className="mt-2 text-[10px] text-[#9AA39B]">

                          {item.note}

                        </p>

                      </div>


                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                        <Icon size={24} />

                      </div>

                    </div>

                  </div>

                );

              })}


            </div>

          </section>



          {/* MANAGEMENT MODULES */}

          <section className="mt-12">


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                CONTENT CONTROL

              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#123D32]">

                Management Modules

              </h2>

              <p className="mt-2 text-sm text-[#718077]">

                Centralised tools for managing BenefitX.

              </p>

            </div>



            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">


              {comingSoonModules.map((item) => {

                const Icon = item.icon;

                return (

                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm"
                  >


                    <div className="flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                        <Icon size={23} />

                      </div>


                      <span className="rounded-full bg-[#FBF4E5] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#876A2F]">

                        Coming Next

                      </span>

                    </div>


                    <h3 className="mt-6 text-base font-bold text-[#123D32]">

                      {item.title}

                    </h3>


                    <p className="mt-2 text-xs leading-6 text-[#718077]">

                      {item.description}

                    </p>

                  </div>

                );

              })}


            </div>

          </section>



          {/* SYSTEM INFORMATION */}

          <section className="mt-12 rounded-2xl border border-[#E4E8E0] bg-white p-7">


            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                <Database size={22} />

              </div>


              <div>

                <h2 className="text-lg font-bold text-[#123D32]">

                  Platform Information

                </h2>

                <p className="mt-1 text-xs text-[#718077]">

                  BenefitX administration environment.

                </p>

              </div>

            </div>


            <div className="mt-7 grid grid-cols-1 gap-6 border-t border-[#E4E8E0] pt-6 sm:grid-cols-2">


              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                  Application

                </p>

                <p className="mt-2 text-sm font-bold text-[#123D32]">

                  BenefitX

                </p>

              </div>


              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                  Database

                </p>

                <p className="mt-2 text-sm font-bold text-[#123D32]">

                  Firebase Firestore

                </p>

              </div>


              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                  Authentication

                </p>

                <p className="mt-2 text-sm font-bold text-[#123D32]">

                  Firebase Authentication

                </p>

              </div>


              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                  Access Level

                </p>

                <p className="mt-2 text-sm font-bold text-[#167A5B]">

                  Super Administrator

                </p>

              </div>


            </div>

          </section>


        </main>



        {/* FOOTER */}

        <footer className="border-t border-[#E4E8E0] bg-white px-5 py-6 text-center md:px-8">

          <p className="text-[10px] text-[#7B847D]">

            © 2026 BenefitX Administration Centre. All rights reserved.

          </p>

        </footer>


      </div>

    </div>

  );

}
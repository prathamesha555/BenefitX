"use client";
import { getIdTokenResult } from "firebase/auth";

import {
  signOutBenefitX
} from "@/lib/benefitx-signout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  GraduationCap,
  Landmark,
  Sparkles,
  UserRound,
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useAuth } from "@/components/auth/auth-provider";

import BenefitXLogo from "@/components/brand/benefitx-logo";


const scholarshipItems = [
  {
    name: "All Scholarships",
    description: "Explore available scholarships",
    href: "/scholarships",
  },
  {
    name: "School Scholarships",
    description: "Opportunities for school students",
    href: "/scholarships?level=school",
  },
  {
    name: "College Scholarships",
    description: "Financial assistance for college",
    href: "/scholarships?level=college",
  },
  {
    name: "Postgraduate Scholarships",
    description: "Funding for advanced education",
    href: "/scholarships?level=postgraduate",
  },
];


const schemeItems = [
  {
    name: "All Government Schemes",
    description: "Explore government benefits",
    href: "/schemes",
  },
  {
    name: "Education Schemes",
    description: "Education and student assistance",
    href: "/schemes?category=education",
  },
  {
    name: "Women & Child Welfare",
    description: "Benefits for women and children",
    href: "/schemes?category=women-child",
  },
  {
    name: "Agriculture Schemes",
    description: "Agricultural assistance and subsidies",
    href: "/schemes?category=agriculture",
  },
  {
    name: "Social Welfare",
    description: "Social support and assistance",
    href: "/schemes?category=social-welfare",
  },
];


export default function SiteHeader() {

  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const { user, loading } = useAuth();


  const [mobileOpen, setMobileOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<
    "scholarships" | "schemes" | null
  >(null);


  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

  let active = true;


  async function checkAdminRole() {

    if (!user) {

      setIsAdmin(false);

      return;

    }


    try {

      const tokenResult =
        await getIdTokenResult(user);

      if (active) {

        setIsAdmin(
          tokenResult.claims.admin === true
        );

      }

    } catch {

      if (active) {

        setIsAdmin(false);

      }

    }

  }


  checkAdminRole();


  return () => {

    active = false;

  };

}, [user]);

  // Close navigation when route changes.

  useEffect(() => {

    setMobileOpen(false);

    setActiveDropdown(null);

    setAccountOpen(false);

  }, [pathname]);


  // Close account dropdown when clicking outside.

  useEffect(() => {

    function handleClickOutside(event: PointerEvent) {

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {

        setAccountOpen(false);

      }

    }

    document.addEventListener(
      "pointerdown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );

    };

  }, []);


  const isActive = (href: string) => {

    if (href === "/") {

      return pathname === "/";

    }

    return pathname.startsWith(href);

  };


  const closeMenus = () => {

    setMobileOpen(false);

    setActiveDropdown(null);

    setAccountOpen(false);

  };


  // Logout

async function handleLogout() {

  try {

    await signOutBenefitX();

    closeMenus();

    router.replace("/");

    router.refresh();

  } catch (error) {

    console.error(
      "BenefitX Logout Error:",
      error
    );

    alert("Unable to sign out. Please try again.");

  }

}


  return (

    <header className="sticky top-0 z-50 w-full">

      {/* ANNOUNCEMENT BAR */}

      <div className="hidden bg-[#123D32] py-2 text-center text-[11px] font-medium tracking-wide text-white md:block">

        <span className="font-semibold text-[#D6B779]">

          Discover opportunities.

        </span>{" "}

        Find government benefits that matter to you.

      </div>


      {/* MAIN NAVIGATION */}

      <div className="border-b border-[#E4E8E0] bg-white/95 shadow-[0_3px_15px_rgba(18,61,50,0.05)] backdrop-blur-xl">

        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">


          {/* LOGO */}

          <BenefitXLogo showTagline />


          {/* DESKTOP NAVIGATION */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >

            <Link
              href="/"
              className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                pathname === "/"
                  ? "bg-[#EEF3EC] text-[#075B46]"
                  : "text-[#59665F] hover:bg-[#F2F5F0] hover:text-[#075B46]"
              }`}
            >

              Home

            </Link>


            {/* SCHOLARSHIPS */}

            <div className="relative">

              <button
                type="button"
                onClick={() => {

                  setAccountOpen(false);

                  setActiveDropdown(
                    activeDropdown === "scholarships"
                      ? null
                      : "scholarships"
                  );

                }}
                aria-expanded={
                  activeDropdown === "scholarships"
                }
                className={`flex items-center gap-1 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                  isActive("/scholarships")
                    ? "bg-[#EEF3EC] text-[#075B46]"
                    : "text-[#59665F] hover:bg-[#F2F5F0] hover:text-[#075B46]"
                }`}
              >

                Scholarships

                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    activeDropdown === "scholarships"
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>


              {activeDropdown === "scholarships" && (

                <div className="absolute left-0 top-full z-50 mt-3 w-[320px] rounded-2xl border border-[#E4E8E0] bg-white p-3 shadow-[0_15px_45px_rgba(18,61,50,0.13)]">

                  <div className="mb-2 flex items-center gap-2 border-b border-[#E4E8E0] px-3 pb-3">

                    <GraduationCap
                      size={21}
                      className="text-[#B8954B]"
                    />

                    <span className="text-sm font-bold text-[#123D32]">

                      Explore Scholarships

                    </span>

                  </div>


                  {scholarshipItems.map((item) => (

                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenus}
                      className="group block rounded-xl px-3 py-3 transition hover:bg-[#F2F5F0]"
                    >

                      <span className="text-sm font-semibold text-[#292D2C] group-hover:text-[#075B46]">

                        {item.name}

                      </span>

                      <p className="mt-1 text-xs text-[#7B847D]">

                        {item.description}

                      </p>

                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* GOVERNMENT SCHEMES */}

            <div className="relative">

              <button
                type="button"
                onClick={() => {

                  setAccountOpen(false);

                  setActiveDropdown(
                    activeDropdown === "schemes"
                      ? null
                      : "schemes"
                  );

                }}
                aria-expanded={activeDropdown === "schemes"}
                className={`flex items-center gap-1 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                  isActive("/schemes")
                    ? "bg-[#EEF3EC] text-[#075B46]"
                    : "text-[#59665F] hover:bg-[#F2F5F0] hover:text-[#075B46]"
                }`}
              >

                Government Schemes

                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    activeDropdown === "schemes"
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>


              {activeDropdown === "schemes" && (

                <div className="absolute left-0 top-full z-50 mt-3 w-[330px] rounded-2xl border border-[#E4E8E0] bg-white p-3 shadow-[0_15px_45px_rgba(18,61,50,0.13)]">

                  <div className="mb-2 flex items-center gap-2 border-b border-[#E4E8E0] px-3 pb-3">

                    <Landmark
                      size={21}
                      className="text-[#B8954B]"
                    />

                    <span className="text-sm font-bold text-[#123D32]">

                      Government Benefits

                    </span>

                  </div>


                  {schemeItems.map((item) => (

                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenus}
                      className="group block rounded-xl px-3 py-3 transition hover:bg-[#F2F5F0]"
                    >

                      <span className="text-sm font-semibold text-[#292D2C] group-hover:text-[#075B46]">

                        {item.name}

                      </span>

                      <p className="mt-1 text-xs text-[#7B847D]">

                        {item.description}

                      </p>

                    </Link>

                  ))}

                </div>

              )}

            </div>


            <Link
              href="/eligibility"
              className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                isActive("/eligibility")
                  ? "bg-[#EEF3EC] text-[#075B46]"
                  : "text-[#59665F] hover:bg-[#F2F5F0] hover:text-[#075B46]"
              }`}
            >

              Eligibility

            </Link>


            <Link
              href="/about"
              className="rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#59665F] transition hover:bg-[#F2F5F0] hover:text-[#075B46]"
            >

              About Us

            </Link>

          </nav>


          {/* DESKTOP ACCOUNT AREA */}

          <div className="hidden items-center gap-3 lg:flex">


            {loading ? (

              <div className="h-10 w-28 animate-pulse rounded-xl bg-[#EEF3EC]" />

            ) : user ? (


              user.emailVerified ? (

                /* LOGGED-IN USER */

                <div
                  className="relative"
                  ref={accountMenuRef}
                >

                  <button
                    type="button"
                    onClick={() => {

                      setActiveDropdown(null);

                      setAccountOpen(!accountOpen);

                    }}
                    aria-expanded={accountOpen}
                    className="flex items-center gap-3 rounded-xl border border-[#E4E8E0] bg-white px-4 py-2.5 transition hover:border-[#D6B779] hover:bg-[#FAF8F2]"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF3EC] text-[#075B46]">

                      <UserRound size={17} />

                    </div>


                    <div className="text-left">

                      <p className="text-[10px] text-[#7B847D]">

                        Welcome back

                      </p>

                      <p className="max-w-[110px] truncate text-xs font-bold text-[#123D32]">

                        {user.displayName || "My Account"}

                      </p>

                    </div>


                    <ChevronDown
                      size={15}
                      className={`text-[#B8954B] transition-transform ${
                        accountOpen ? "rotate-180" : ""
                      }`}
                    />

                  </button>


                  {accountOpen && (

                    <div className="absolute right-0 top-full z-50 mt-3 w-[260px] rounded-2xl border border-[#E4E8E0] bg-white p-3 shadow-[0_15px_45px_rgba(18,61,50,0.14)]">


                      <div className="border-b border-[#E4E8E0] px-3 pb-4">

                        <p className="truncate text-sm font-bold text-[#123D32]">

                          {user.displayName || "BenefitX Member"}

                        </p>

                        <p className="mt-1 truncate text-xs text-[#7B847D]">

                          {user.email}

                        </p>

                        <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#167A5B]">

                          <ShieldCheck size={13} />

                          Verified Account

                        </p>

                      </div>


                      <Link
                        href="/dashboard"
                        onClick={closeMenus}
                        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#59665F] transition hover:bg-[#EEF3EC] hover:text-[#075B46]"
                      >

                        <LayoutDashboard size={18} />

                        My Dashboard

                      </Link>


                      <Link
                        href="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#59665F] transition hover:bg-[#EEF3EC] hover:text-[#075B46]"
                      >

                        <UserRound size={18} />

                        My Profile

                      </Link>
                      {isAdmin && (

                      <Link
                      href="/admin"
                            onClick={closeMenus}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#075B46] transition hover:bg-[#EEF3EC]"
                        >

                      <ShieldCheck size={18} />

                      Admin Dashboard

                      </Link>

                        )}

                      <Link
                        href="/dashboard"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#59665F] transition hover:bg-[#EEF3EC] hover:text-[#075B46]"
                      >

                        <Settings size={18} />

                        Account Settings

                      </Link>


                      <div className="my-2 border-t border-[#E4E8E0]" />


                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >

                        <LogOut size={18} />

                        Sign Out

                      </button>

                    </div>

                  )}

                </div>

              ) : (

                <Link
                  href="/verify-email"
                  className="rounded-xl bg-[#D6B779] px-5 py-3 text-xs font-bold text-[#123D32]"
                >

                  Verify Email

                </Link>

              )

            ) : (

              /* GUEST USER */

              <>

                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#123D32] transition hover:text-[#B8954B]"
                >

                  Sign In

                </Link>


                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-5 py-3 text-[13px] font-bold text-white shadow-md shadow-[#123D32]/20 transition hover:-translate-y-0.5"
                >

                  Create Account

                  <ArrowUpRight
                    size={16}
                    className="text-[#D6B779]"
                  />

                </Link>

              </>

            )}

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] text-[#123D32] transition hover:bg-[#EEF3EC] lg:hidden"
          >

            {mobileOpen ? <X size={23} /> : <Menu size={23} />}

          </button>

        </div>

      </div>


      {/* MOBILE NAVIGATION */}

      {mobileOpen && (

        <div className="absolute left-0 top-full max-h-[calc(100vh-90px)] w-full overflow-y-auto border-b border-[#E4E8E0] bg-white px-5 pb-7 pt-4 shadow-xl lg:hidden">

          <div className="mx-auto max-w-[600px] space-y-2">


            <Link
              href="/"
              onClick={closeMenus}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#123D32] hover:bg-[#EEF3EC]"
            >

              Home

            </Link>


            <div className="rounded-xl border border-[#E4E8E0] p-3">

              <p className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-[#123D32]">

                <GraduationCap size={19} className="text-[#B8954B]" />

                Scholarships

              </p>


              {scholarshipItems.map((item) => (

                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-2.5 text-sm text-[#59665F] hover:bg-[#F2F5F0]"
                >

                  {item.name}

                </Link>

              ))}

            </div>


            <div className="rounded-xl border border-[#E4E8E0] p-3">

              <p className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-[#123D32]">

                <Landmark size={19} className="text-[#B8954B]" />

                Government Schemes

              </p>


              {schemeItems.map((item) => (

                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-2.5 text-sm text-[#59665F] hover:bg-[#F2F5F0]"
                >

                  {item.name}

                </Link>

              ))}

            </div>


            <Link
              href="/eligibility"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#123D32] hover:bg-[#EEF3EC]"
            >

              <Sparkles size={18} className="text-[#B8954B]" />

              Eligibility Checker

            </Link>


            <Link
              href="/about"
              onClick={closeMenus}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#123D32] hover:bg-[#EEF3EC]"
            >

              About Us

            </Link>


            {/* MOBILE AUTHENTICATION */}

            <div className="mt-4 border-t border-[#E4E8E0] pt-5">


              {loading ? (

                <div className="h-12 animate-pulse rounded-xl bg-[#EEF3EC]" />

              ) : user ? (

                <div className="space-y-3">


                  <div className="rounded-xl bg-[#EEF3EC] p-4">

                    <p className="text-sm font-bold text-[#123D32]">

                      {user.displayName || "BenefitX Member"}

                    </p>

                    <p className="mt-1 break-all text-xs text-[#718077]">

                      {user.email}

                    </p>

                  </div>


                  {user.emailVerified && (

                    <>

                      <Link
                        href="/dashboard"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#123D32] hover:bg-[#EEF3EC]"
                      >

                        <LayoutDashboard size={18} />

                        My Dashboard

                      </Link>


                      <Link
                        href="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#123D32] hover:bg-[#EEF3EC]"
                      >

                        <UserRound size={18} />

                        My Profile

                      </Link>

                    </>

                  )}


                  {!user.emailVerified && (

                    <Link
                      href="/verify-email"
                      onClick={closeMenus}
                      className="flex items-center justify-center rounded-xl bg-[#D6B779] px-4 py-3 text-sm font-bold text-[#123D32]"
                    >

                      Verify Email

                    </Link>

                  )}


                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-[45px] w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-700"
                  >

                    <LogOut size={17} />

                    Sign Out

                  </button>

                </div>

              ) : (

                <div className="grid grid-cols-2 gap-3">

                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="flex items-center justify-center rounded-xl border border-[#D8DCCF] px-4 py-3 text-sm font-bold text-[#123D32]"
                  >

                    Sign In

                  </Link>


                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="flex items-center justify-center rounded-xl bg-[#075B46] px-4 py-3 text-sm font-bold text-white"
                  >

                    Register

                  </Link>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </header>

  );

}
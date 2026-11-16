"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  GraduationCap,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type {
  ApplicationStatus,
  EducationLevel,
  Scholarship,
  ScholarshipScope,
  ScholarshipType,
} from "@/types/scholarship";

type VerificationStatus = "pending" | "verified" | "rejected";
type PublicationStatus = "draft" | "in_review" | "published" | "archived";

type ManagedScholarship = Omit<Scholarship, "verification" | "publication"> & {
  // Firestore may contain older or partially completed records, so the
  // nested editorial fields are optional in the admin management UI.
  verification?: {
    status?: VerificationStatus;
    sourceUrl?: string;
    lastVerifiedAt?: string | null;
  };
  publication?: { status?: PublicationStatus };
  updatedAt?: string;
};

interface ScholarshipFormState {
  title: string;
  slug: string;
  provider: string;
  providerType: string;
  scope: ScholarshipScope;
  state: string;
  educationLevels: EducationLevel[];
  scholarshipType: ScholarshipType[];
  description: string;
  benefitSummary: string;
  eligibilityText: string;
  documentsText: string;
  applicationProcessText: string;
  applicationStatus: ApplicationStatus;
  deadline: string;
  amount: string;
  officialPortalName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
}

const educationOptions: { label: string; value: EducationLevel }[] = [
  { label: "School", value: "school" },
  { label: "Higher Secondary", value: "higher-secondary" },
  { label: "Diploma", value: "diploma" },
  { label: "Undergraduate", value: "undergraduate" },
  { label: "Postgraduate", value: "postgraduate" },
  { label: "Doctoral / Research", value: "doctoral" },
];

const scholarshipTypeOptions: { label: string; value: ScholarshipType }[] = [
  { label: "Merit-based", value: "merit" },
  { label: "Need-based", value: "need-based" },
  { label: "Category-based", value: "category-based" },
  { label: "Minority", value: "minority" },
  { label: "Disability", value: "disability" },
  { label: "Technical Education", value: "technical" },
  { label: "Research", value: "research" },
];

const inputClass = "mt-2 w-full rounded-xl border border-[#DDE5DC] bg-white px-4 py-3 text-sm text-[#173D32] outline-none transition placeholder:text-[#A0AAA2] focus:border-[#167A5B] focus:ring-4 focus:ring-[#167A5B]/10";
const labelClass = "text-xs font-bold text-[#344B40]";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#064A3A] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DDE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#42554A] transition hover:bg-[#F5F8F3] disabled:opacity-60";

function emptyForm(): ScholarshipFormState {
  return {
    title: "",
    slug: "",
    provider: "",
    providerType: "Government",
    scope: "state",
    state: "Maharashtra",
    educationLevels: [],
    scholarshipType: [],
    description: "",
    benefitSummary: "",
    eligibilityText: "",
    documentsText: "",
    applicationProcessText: "",
    applicationStatus: "not-verified",
    deadline: "",
    amount: "",
    officialPortalName: "MahaDBT",
    sourceUrl: "https://mahadbt.maharashtra.gov.in/",
    verificationStatus: "pending",
    publicationStatus: "draft",
  };
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function toForm(item: ManagedScholarship): ScholarshipFormState {
  return {
    title: item.title ?? "",
    slug: item.slug ?? "",
    provider: item.provider ?? "",
    providerType: item.providerType ?? "Government",
    scope: item.scope ?? "state",
    state: item.state ?? "Maharashtra",
    educationLevels: item.educationLevels ?? [],
    scholarshipType: item.scholarshipType ?? [],
    description: item.description ?? "",
    benefitSummary: item.benefitSummary ?? "",
    eligibilityText: (item.eligibilitySummary ?? []).join("\n"),
    documentsText: (item.documents ?? []).join("\n"),
    applicationProcessText: (item.applicationProcess ?? []).join("\n"),
    applicationStatus: item.applicationStatus ?? "not-verified",
    deadline: item.deadline ?? "",
    amount: item.amount ?? "",
    officialPortalName: item.officialPortalName ?? "",
    sourceUrl: item.sourceUrl ?? item.verification?.sourceUrl ?? "",
    verificationStatus: item.verification?.status ?? "pending",
    publicationStatus: item.publication?.status ?? "draft",
  };
}

function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "gold" | "red" | "neutral" }) {
  const tones = {
    green: "bg-[#E8F5EC] text-[#176344]",
    gold: "bg-[#FBF3E2] text-[#8B6B2D]",
    red: "bg-[#FDECEC] text-[#A63D3D]",
    neutral: "bg-[#EFF2EE] text-[#67746B]",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${tones[tone]}`}>{children}</span>;
}

export default function ScholarshipManagement({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<ManagedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [publicationFilter, setPublicationFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ScholarshipFormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadScholarships = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/scholarships", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load scholarship records.");
      setScholarships(Array.isArray(result.scholarships) ? result.scholarships : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load scholarship records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadScholarships();
  }, [loadScholarships]);

  const filteredScholarships = useMemo(() => {
    const query = search.toLowerCase().trim();
    return scholarships.filter((item) => {
      const searchable = [item.title, item.provider, item.state, item.officialPortalName, item.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const publicationStatus = item.publication?.status ?? "draft";
      const verificationStatus = item.verification?.status ?? "pending";
      const matchesPublication = publicationFilter === "all" || publicationStatus === publicationFilter;
      const matchesVerification = verificationFilter === "all" || verificationStatus === verificationFilter;
      return matchesSearch && matchesPublication && matchesVerification;
    });
  }, [scholarships, search, publicationFilter, verificationFilter]);

  const counts = useMemo(() => ({
    total: scholarships.length,
    published: scholarships.filter((item) => item.publication?.status === "published").length,
    pending: scholarships.filter((item) => (item.verification?.status ?? "pending") === "pending").length,
    drafts: scholarships.filter((item) => !item.publication?.status || item.publication.status === "draft").length,
  }), [scholarships]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(item: ManagedScholarship) {
    setEditingId(item.id);
    setForm(toForm(item));
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  function updateField<K extends keyof ScholarshipFormState>(field: K, value: ScholarshipFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleArrayValue<T extends EducationLevel | ScholarshipType>(
    field: "educationLevels" | "scholarshipType",
    value: T,
  ) {
    setForm((current) => {
      const values = current[field] as T[];
      const next = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
      return { ...current, [field]: next };
    });
  }

  async function saveScholarship(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      slug: form.slug || makeSlug(form.title),
      eligibilitySummary: lines(form.eligibilityText),
      documents: lines(form.documentsText),
      applicationProcess: lines(form.applicationProcessText),
      deadline: form.deadline || null,
      amount: form.amount || null,
      ...(editingId ? { id: editingId } : {}),
    };

    try {
      const response = await fetch("/api/admin/scholarships", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save scholarship.");
      setSuccess(result.message || "Scholarship saved successfully.");
      setFormOpen(false);
      setEditingId(null);
      await loadScholarships();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save scholarship.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteScholarship(item: ManagedScholarship) {
    const confirmed = window.confirm(`Delete “${item.title}” permanently? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingId(item.id);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/scholarships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete scholarship.");
      setSuccess(result.message || "Scholarship deleted.");
      await loadScholarships();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete scholarship.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2]">
      <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-[#E4E8E0] bg-white/95 px-5 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin")} className="rounded-xl border border-[#E4E8E0] p-2.5 text-[#285342] transition hover:bg-[#F1F5EF]" aria-label="Back to admin dashboard">
            <ArrowLeft size={19} />
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#B8954B]">BenefitX · Administration</p>
            <h1 className="text-lg font-extrabold text-[#123D32]">Scholarship Management</h1>
          </div>
        </div>
        <div className="hidden max-w-[260px] text-right sm:block">
          <p className="text-xs font-bold text-[#123D32]">Super Administrator</p>
          <p className="truncate text-[10px] text-[#7B847D]">{adminEmail}</p>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
        <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] p-7 text-white shadow-lg md:p-9">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[#D6B779]/25" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D6B779]/30 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#E8D6AA]"><GraduationCap size={14} /> Opportunity Content Control</span>
              <h2 className="mt-5 text-3xl font-extrabold md:text-4xl">Manage scholarships</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#D4E2DA]">Create and maintain scholarship records, capture the official source, and keep verification separate from application status. Only verified records can be published.</p>
            </div>
            <button type="button" onClick={openCreateForm} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D6B779] px-5 py-3 text-sm font-extrabold text-[#123D32] shadow-lg transition hover:bg-[#E5C98F]"><Plus size={18} /> Add Scholarship</button>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            { label: "Total records", value: counts.total, icon: BookOpen },
            { label: "Published", value: counts.published, icon: CheckCircle2 },
            { label: "Awaiting verification", value: counts.pending, icon: ShieldCheck },
            { label: "Drafts", value: counts.drafts, icon: FileText },
          ].map((stat) => {
            const Icon = stat.icon;
            return <div key={stat.label} className="rounded-2xl border border-[#E4E8E0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-[#718077]">{stat.label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]"><Icon size={18} /></span></div>
              <p className="mt-3 text-3xl font-extrabold text-[#123D32]">{stat.value.toLocaleString("en-IN")}</p>
            </div>;
          })}
        </section>

        {error && !formOpen && <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><CircleAlert size={18} className="mt-0.5 shrink-0" />{error}</div>}
        {success && <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{success}</div>}

        <section className="mt-8 rounded-2xl border border-[#E4E8E0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div><p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B8954B]">Scholarship Library</p><h2 className="mt-1 text-xl font-extrabold text-[#123D32]">All scholarship records</h2></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block min-w-[220px]"><span className="sr-only">Search scholarships</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91A095]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, provider, state..." className="w-full rounded-xl border border-[#DDE5DC] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#167A5B]" /></label>
              <select value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value)} className="rounded-xl border border-[#DDE5DC] bg-white px-3 py-2.5 text-xs text-[#42554A] outline-none"><option value="all">All publication statuses</option><option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option></select>
              <select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)} className="rounded-xl border border-[#DDE5DC] bg-white px-3 py-2.5 text-xs text-[#42554A] outline-none"><option value="all">All verification statuses</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select>
              <button type="button" onClick={() => void loadScholarships()} disabled={loading} className={secondaryButtonClass}><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
              <thead><tr className="bg-[#F6F8F4] text-[10px] uppercase tracking-wide text-[#758278]"><th className="rounded-l-xl px-4 py-3 font-bold">Scholarship</th><th className="px-4 py-3 font-bold">Scope</th><th className="px-4 py-3 font-bold">Application</th><th className="px-4 py-3 font-bold">Verification</th><th className="px-4 py-3 font-bold">Publication</th><th className="rounded-r-xl px-4 py-3 text-right font-bold">Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="px-4 py-14 text-center text-sm text-[#718077]"><span className="inline-flex items-center gap-2"><LoaderCircle size={18} className="animate-spin" /> Loading scholarship records...</span></td></tr> : filteredScholarships.length === 0 ? <tr><td colSpan={6} className="px-4 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EC] text-[#075B46]"><GraduationCap size={23} /></div><p className="mt-3 text-sm font-bold text-[#123D32]">{scholarships.length === 0 ? "No scholarships added yet" : "No matching scholarships"}</p><p className="mt-1 text-xs text-[#89958C]">{scholarships.length === 0 ? "Add your first verified scholarship record to begin building the directory." : "Try changing your search or filters."}</p>{scholarships.length === 0 && <button type="button" onClick={openCreateForm} className={`${primaryButtonClass} mt-4`}><Plus size={16} /> Add first scholarship</button>}</td></tr> : filteredScholarships.map((item) => {
                  const verification = item.verification?.status ?? "pending";
                  const publication = item.publication?.status ?? "draft";
                  return <tr key={item.id} className="border-b border-[#EEF1EC] last:[&>td]:border-b-0">
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><p className="max-w-[320px] truncate text-sm font-bold text-[#183F33]">{item.title}</p><p className="mt-1 max-w-[320px] truncate text-[10px] text-[#87938A]">{item.provider} · {item.state}</p></td>
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><span className="text-xs font-semibold capitalize text-[#516257]">{item.scope}</span></td>
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><StatusPill tone={item.applicationStatus === "open" ? "green" : item.applicationStatus === "closed" ? "red" : "neutral"}>{item.applicationStatus.replaceAll("-", " ")}</StatusPill></td>
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><StatusPill tone={verification === "verified" ? "green" : verification === "rejected" ? "red" : "gold"}>{verification}</StatusPill></td>
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><StatusPill tone={publication === "published" ? "green" : publication === "archived" ? "red" : "neutral"}>{publication.replaceAll("_", " ")}</StatusPill></td>
                    <td className="border-b border-[#EEF1EC] px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEditForm(item)} className="rounded-lg border border-[#DDE5DC] px-3 py-2 text-[11px] font-bold text-[#075B46] transition hover:bg-[#EFF5EF]">Edit</button><a href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open official source for ${item.title}`} className="rounded-lg border border-[#DDE5DC] p-2 text-[#617268] transition hover:bg-[#F5F8F3]"><ExternalLink size={15} /></a><button type="button" onClick={() => void deleteScholarship(item)} disabled={deletingId === item.id} aria-label={`Delete ${item.title}`} className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50">{deletingId === item.id ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}</button></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[10px] leading-5 text-[#8A968C]">Showing {filteredScholarships.length} of {scholarships.length} Firestore scholarship records. This management page writes to the <code className="rounded bg-[#F1F4EF] px-1">scholarships</code> collection.</p>
        </section>

        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E9DFC8] bg-[#FFFCF5] p-5 sm:flex-row sm:items-start">
          <ShieldCheck size={20} className="shrink-0 text-[#A17D36]" />
          <div><p className="text-sm font-bold text-[#6E5525]">Publishing safeguard</p><p className="mt-1 text-xs leading-6 text-[#806C48]">A scholarship cannot be published until its official source is marked as verified. Keep application status separate from publication status; an item may be published while its application window is upcoming or closed.</p></div>
        </section>
      </main>

      {formOpen && <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#10271F]/60 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="scholarship-form-title">
        <div className="my-4 w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#E7ECE5] bg-white px-5 py-4 md:px-7">
            <div><p className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#B8954B]">Opportunity Records</p><h2 id="scholarship-form-title" className="mt-1 text-xl font-extrabold text-[#123D32]">{editingId ? "Edit scholarship" : "Add new scholarship"}</h2></div>
            <button type="button" onClick={closeForm} disabled={saving} className="rounded-xl p-2 text-[#647269] hover:bg-[#F2F5F0]" aria-label="Close form"><X size={20} /></button>
          </div>
          <form onSubmit={saveScholarship} className="space-y-7 p-5 md:p-7">
            {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800"><CircleAlert size={16} className="mt-0.5 shrink-0" />{error}</div>}
            <section>
              <h3 className="text-sm font-extrabold text-[#123D32]">Basic information</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className={labelClass}>Scholarship name *<input required value={form.title} onChange={(event) => { const title = event.target.value; setForm((current) => ({ ...current, title, slug: current.slug === "" || current.slug === makeSlug(current.title) ? makeSlug(title) : current.slug })); }} className={inputClass} placeholder="Official scholarship name" /></label>
                <label className={labelClass}>URL slug *<input required value={form.slug} onChange={(event) => updateField("slug", makeSlug(event.target.value))} className={inputClass} placeholder="scholarship-url-name" /><span className="mt-1 block text-[10px] font-normal text-[#8A968C]">Used in the opportunity URL. Keep it unique.</span></label>
                <label className={labelClass}>Provider / department *<input required value={form.provider} onChange={(event) => updateField("provider", event.target.value)} className={inputClass} placeholder="Government department or institution" /></label>
                <label className={labelClass}>Provider type<input value={form.providerType} onChange={(event) => updateField("providerType", event.target.value)} className={inputClass} placeholder="Central Government / State Government" /></label>
                <label className={labelClass}>Scope<select value={form.scope} onChange={(event) => { const scope = event.target.value as ScholarshipScope; setForm((current) => ({ ...current, scope, state: scope === "central" ? "All India" : current.state === "All India" ? "Maharashtra" : current.state })); }} className={inputClass}><option value="central">Central Government</option><option value="state">State Government</option><option value="institution">Institution</option></select></label>
                <label className={labelClass}>Applicable state<input value={form.state} onChange={(event) => updateField("state", event.target.value)} className={inputClass} placeholder="All India or Maharashtra" /></label>
                <label className={labelClass}>Official portal name *<input required value={form.officialPortalName} onChange={(event) => updateField("officialPortalName", event.target.value)} className={inputClass} placeholder="e.g. National Scholarship Portal" /></label>
                <label className={labelClass}>Official source URL *<input required type="url" value={form.sourceUrl} onChange={(event) => updateField("sourceUrl", event.target.value)} className={inputClass} placeholder="https://official.gov.in/..." /></label>
                <label className={`${labelClass} md:col-span-2`}>Description *<textarea required rows={3} value={form.description} onChange={(event) => updateField("description", event.target.value)} className={inputClass} placeholder="Describe the scholarship using its official information." /></label>
                <label className={labelClass}>Benefit summary<input value={form.benefitSummary} onChange={(event) => updateField("benefitSummary", event.target.value)} className={inputClass} placeholder="Financial or other assistance offered" /></label>
                <label className={labelClass}>Benefit amount<input value={form.amount} onChange={(event) => updateField("amount", event.target.value)} className={inputClass} placeholder="Use official wording; leave blank if unknown" /></label>
              </div>
            </section>

            <section className="border-t border-[#E7ECE5] pt-6">
              <h3 className="text-sm font-extrabold text-[#123D32]">Eligibility and requirements</h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <fieldset><legend className={labelClass}>Eligible education levels *</legend><div className="mt-3 grid grid-cols-2 gap-2">{educationOptions.map((option) => <label key={option.value} className="flex items-center gap-2 rounded-xl border border-[#E5EBE3] px-3 py-2.5 text-xs text-[#506056]"><input type="checkbox" checked={form.educationLevels.includes(option.value)} onChange={() => toggleArrayValue("educationLevels", option.value)} className="h-4 w-4 accent-[#075B46]" />{option.label}</label>)}</div></fieldset>
                <fieldset><legend className={labelClass}>Scholarship category *</legend><div className="mt-3 grid grid-cols-2 gap-2">{scholarshipTypeOptions.map((option) => <label key={option.value} className="flex items-center gap-2 rounded-xl border border-[#E5EBE3] px-3 py-2.5 text-xs text-[#506056]"><input type="checkbox" checked={form.scholarshipType.includes(option.value)} onChange={() => toggleArrayValue("scholarshipType", option.value)} className="h-4 w-4 accent-[#075B46]" />{option.label}</label>)}</div></fieldset>
                <label className={`${labelClass} md:col-span-2`}>Eligibility criteria * <textarea rows={4} value={form.eligibilityText} onChange={(event) => updateField("eligibilityText", event.target.value)} className={inputClass} placeholder="Enter one criterion per line. Use only details confirmed by the official source." /><span className="mt-1 block text-[10px] font-normal text-[#8A968C]">One condition per line. These criteria will be used later by the eligibility engine.</span></label>
                <label className={labelClass}>Required documents<textarea rows={4} value={form.documentsText} onChange={(event) => updateField("documentsText", event.target.value)} className={inputClass} placeholder="Enter one document per line" /></label>
                <label className={labelClass}>Application steps<textarea rows={4} value={form.applicationProcessText} onChange={(event) => updateField("applicationProcessText", event.target.value)} className={inputClass} placeholder="Enter one application step per line" /></label>
              </div>
            </section>

            <section className="border-t border-[#E7ECE5] pt-6">
              <h3 className="text-sm font-extrabold text-[#123D32]">Application and verification status</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className={labelClass}>Application status<select value={form.applicationStatus} onChange={(event) => updateField("applicationStatus", event.target.value as ApplicationStatus)} className={inputClass}><option value="not-verified">Unknown / Not verified</option><option value="upcoming">Upcoming</option><option value="open">Open</option><option value="closed">Closed</option></select></label>
                <label className={labelClass}>Application deadline<input type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} className={inputClass} /></label>
                <label className={labelClass}>Verification status<select value={form.verificationStatus} onChange={(event) => updateField("verificationStatus", event.target.value as VerificationStatus)} className={inputClass}><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select></label>
                <label className={labelClass}>Publication status<select value={form.publicationStatus} onChange={(event) => updateField("publicationStatus", event.target.value as PublicationStatus)} className={inputClass}><option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              </div>
              <p className="mt-3 rounded-xl bg-[#F7F8F4] p-3 text-[11px] leading-5 text-[#77847A]">Mark a source as verified only after checking the official notification or department page. The server blocks publication until verification is complete and all key content sections are filled.</p>
            </section>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#E7ECE5] pt-5 sm:flex-row">
              <button type="button" onClick={closeForm} disabled={saving} className={secondaryButtonClass}>Cancel</button>
              <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />}{saving ? "Saving..." : editingId ? "Save changes" : "Create scholarship"}</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}

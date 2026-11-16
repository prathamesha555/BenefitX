"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Landmark,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type {
  BeneficiaryGroup,
  GovernmentScheme,
  PublicationStatus,
  SchemeCategory,
  SchemeScope,
  SchemeStatus,
  VerificationStatus,
} from "@/types/scheme";

type ManagedScheme = GovernmentScheme & {
  verification?: GovernmentScheme["verification"];
  publication?: GovernmentScheme["publication"];
  updatedAt?: string;
};

type SchemeFormState = {
  title: string;
  slug: string;
  provider: string;
  providerType: string;
  scope: SchemeScope;
  state: string;
  categories: SchemeCategory[];
  beneficiaryGroups: BeneficiaryGroup[];
  description: string;
  objective: string;
  benefitsText: string;
  eligibilityText: string;
  documentsText: string;
  applicationStepsText: string;
  applicationStatus: SchemeStatus;
  applicationStartDate: string;
  deadline: string;
  benefitAmount: string;
  officialPortalName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
};

const categoryOptions: { label: string; value: SchemeCategory }[] = [
  { label: "Agriculture", value: "agriculture" },
  { label: "Women & Children", value: "women-child" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Employment", value: "employment" },
  { label: "Housing", value: "housing" },
  { label: "Business", value: "business" },
  { label: "Senior Citizens", value: "senior-citizens" },
  { label: "Social Welfare", value: "social-welfare" },
  { label: "Disability Assistance", value: "disability" },
  { label: "Education", value: "education" },
];

const beneficiaryOptions: { label: string; value: BeneficiaryGroup }[] = [
  { label: "Farmers", value: "farmers" },
  { label: "Women", value: "women" },
  { label: "Children", value: "children" },
  { label: "Students", value: "students" },
  { label: "Entrepreneurs", value: "entrepreneurs" },
  { label: "Senior Citizens", value: "senior-citizens" },
  { label: "Persons with Disabilities", value: "persons-with-disabilities" },
  { label: "General Public", value: "general-public" },
  { label: "Workers", value: "workers" },
  { label: "Families", value: "families" },
];

const inputClass = "mt-2 w-full rounded-xl border border-[#DDE5DC] bg-white px-4 py-3 text-sm text-[#173D32] outline-none transition placeholder:text-[#A0AAA2] focus:border-[#167A5B] focus:ring-4 focus:ring-[#167A5B]/10";
const labelClass = "text-xs font-bold text-[#344B40]";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#064A3A] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DDE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#42554A] transition hover:bg-[#F5F8F3] disabled:opacity-60";

function emptyForm(): SchemeFormState {
  return {
    title: "",
    slug: "",
    provider: "",
    providerType: "Government",
    scope: "state",
    state: "Maharashtra",
    categories: [],
    beneficiaryGroups: [],
    description: "",
    objective: "",
    benefitsText: "",
    eligibilityText: "",
    documentsText: "",
    applicationStepsText: "",
    applicationStatus: "not-verified",
    applicationStartDate: "",
    deadline: "",
    benefitAmount: "",
    officialPortalName: "",
    sourceUrl: "",
    verificationStatus: "pending",
    publicationStatus: "draft",
  };
}

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function toForm(item: ManagedScheme): SchemeFormState {
  return {
    title: item.title ?? "",
    slug: item.slug ?? "",
    provider: item.provider ?? "",
    providerType: item.providerType ?? "Government",
    scope: item.scope ?? "state",
    state: item.state ?? "Maharashtra",
    categories: item.categories ?? [],
    beneficiaryGroups: item.beneficiaryGroups ?? [],
    description: item.description ?? "",
    objective: item.objective ?? "",
    benefitsText: (item.benefits ?? []).join("\n"),
    eligibilityText: (item.eligibilityCriteria ?? []).join("\n"),
    documentsText: (item.requiredDocuments ?? []).join("\n"),
    applicationStepsText: (item.applicationSteps ?? []).join("\n"),
    applicationStatus: item.applicationStatus ?? "not-verified",
    applicationStartDate: item.applicationStartDate ?? "",
    deadline: item.deadline ?? "",
    benefitAmount: item.benefitAmount ?? "",
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

function statusTone(status: string): "green" | "gold" | "red" | "neutral" {
  if (status === "verified" || status === "published" || status === "open" || status === "ongoing") return "green";
  if (status === "rejected" || status === "closed") return "red";
  if (status === "pending" || status === "in_review" || status === "upcoming") return "gold";
  return "neutral";
}

export default function SchemeManagement({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [schemes, setSchemes] = useState<ManagedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [publicationFilter, setPublicationFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SchemeFormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSchemes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/schemes", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load government schemes.");
      setSchemes(Array.isArray(result.schemes) ? result.schemes : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load government schemes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchemes();
  }, [loadSchemes]);

  const filteredSchemes = useMemo(() => {
    const query = search.toLowerCase().trim();
    return schemes.filter((item) => {
      const searchable = [item.title, item.provider, item.state, item.officialPortalName, item.slug, ...(item.categories ?? [])]
        .filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const publicationStatus = item.publication?.status ?? "draft";
      const verificationStatus = item.verification?.status ?? "pending";
      return matchesSearch
        && (publicationFilter === "all" || publicationStatus === publicationFilter)
        && (verificationFilter === "all" || verificationStatus === verificationFilter);
    });
  }, [schemes, search, publicationFilter, verificationFilter]);

  const counts = useMemo(() => ({
    total: schemes.length,
    published: schemes.filter((item) => item.publication?.status === "published").length,
    pending: schemes.filter((item) => (item.verification?.status ?? "pending") === "pending").length,
    drafts: schemes.filter((item) => !item.publication?.status || item.publication.status === "draft").length,
  }), [schemes]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(item: ManagedScheme) {
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

  function updateField<K extends keyof SchemeFormState>(field: K, value: SchemeFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleArrayValue(
    field: "categories" | "beneficiaryGroups",
    value: SchemeCategory | BeneficiaryGroup,
  ) {
    setForm((current) => {
      if (field === "categories") {
        const category = value as SchemeCategory;
        const next = current.categories.includes(category)
          ? current.categories.filter((item) => item !== category)
          : [...current.categories, category];
        return { ...current, categories: next };
      }

      const beneficiary = value as BeneficiaryGroup;
      const next = current.beneficiaryGroups.includes(beneficiary)
        ? current.beneficiaryGroups.filter((item) => item !== beneficiary)
        : [...current.beneficiaryGroups, beneficiary];
      return { ...current, beneficiaryGroups: next };
    });
  }

  async function saveScheme(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      slug: form.slug || makeSlug(form.title),
      benefits: splitLines(form.benefitsText),
      eligibilityCriteria: splitLines(form.eligibilityText),
      requiredDocuments: splitLines(form.documentsText),
      applicationSteps: splitLines(form.applicationStepsText),
      applicationStartDate: form.applicationStartDate || null,
      deadline: form.deadline || null,
      benefitAmount: form.benefitAmount || null,
      ...(editingId ? { id: editingId } : {}),
    };

    try {
      const response = await fetch("/api/admin/schemes", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save government scheme.");
      setSuccess(result.message || "Government scheme saved successfully.");
      setFormOpen(false);
      setEditingId(null);
      await loadSchemes();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save government scheme.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteScheme(item: ManagedScheme) {
    const confirmed = window.confirm(`Delete “${item.title}” permanently? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingId(item.id);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/schemes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete government scheme.");
      setSuccess(result.message || "Government scheme deleted.");
      await loadSchemes();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete government scheme.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <button type="button" onClick={() => router.push("/admin")} className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#647168] transition hover:text-[#075B46]">
              <ArrowLeft size={15} /> Back to Admin Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0E8] text-[#075B46]"><Landmark size={24} /></div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.8px] text-[#9AA59A]">BenefitX Administration</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#123D32] sm:text-3xl">Government Scheme Management</h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#748076]">Create and maintain government benefit records, track their verification, and control what appears in the public directory.</p>
          </div>
          <button type="button" onClick={openCreateForm} className={primaryButtonClass}><Plus size={17} /> Add Government Scheme</button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total schemes", value: counts.total, note: "Firestore records" },
            { label: "Published", value: counts.published, note: "Visible when public directory is connected" },
            { label: "Pending verification", value: counts.pending, note: "Require source review" },
            { label: "Drafts", value: counts.drafts, note: "Not publicly published" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#E5EAE2] bg-white p-5 shadow-[0_8px_30px_rgba(28,55,36,0.04)]">
              <p className="text-xs font-semibold text-[#829087]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-[#123D32]">{item.value}</p>
              <p className="mt-1 text-[10px] text-[#9AA49B]">{item.note}</p>
            </div>
          ))}
        </div>

        {success && <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-[#CBE4D2] bg-[#EDF8EF] px-4 py-3 text-sm text-[#176344]"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{success}</div>}
        {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[#F1D1D1] bg-[#FFF1F1] px-4 py-3 text-sm text-[#A63D3D]"><CircleAlert size={18} className="mt-0.5 shrink-0" />{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-[#E5EAE2] bg-white shadow-[0_8px_30px_rgba(28,55,36,0.04)]">
          <div className="flex flex-col gap-3 border-b border-[#E9EEE7] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-extrabold text-[#123D32]">All government schemes</h2>
              <p className="mt-1 text-xs text-[#869188]">Signed in as {adminEmail}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA59A]" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-[#DDE5DC] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#167A5B] sm:w-56" placeholder="Search schemes..." />
              </label>
              <select value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value)} className="rounded-xl border border-[#DDE5DC] bg-white px-3 py-2.5 text-xs font-semibold text-[#405448] outline-none">
                <option value="all">All publication states</option><option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
              <select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)} className="rounded-xl border border-[#DDE5DC] bg-white px-3 py-2.5 text-xs font-semibold text-[#405448] outline-none">
                <option value="all">All verification states</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
              </select>
              <button type="button" onClick={() => void loadSchemes()} disabled={loading} className={secondaryButtonClass} aria-label="Refresh schemes"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#7C887F]"><LoaderCircle size={19} className="animate-spin" /> Loading schemes from Firestore...</div>
          ) : filteredSchemes.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F4EF] text-[#7C8D80]"><FileText size={24} /></div>
              <h3 className="mt-4 font-bold text-[#173D32]">No government schemes found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#89948A]">Add your first scheme or adjust the search and filters. Draft and pending records remain private from the public directory.</p>
              <button type="button" onClick={openCreateForm} className={`${primaryButtonClass} mt-5`}><Plus size={16} /> Add first scheme</button>
            </div>
          ) : (
            <div className="divide-y divide-[#EDF0EB]">
              {filteredSchemes.map((item) => {
                const verification = item.verification?.status ?? "pending";
                const publication = item.publication?.status ?? "draft";
                return (
                  <article key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#173D32]">{item.title}</h3>
                        <StatusPill tone={statusTone(verification)}>{verification}</StatusPill>
                        <StatusPill tone={statusTone(publication)}>{publication.replaceAll("_", " ")}</StatusPill>
                      </div>
                      <p className="mt-1 text-xs text-[#839086]">{item.provider} · {item.scope === "central" ? "Central" : item.state} · {(item.categories ?? []).map((category) => category.replaceAll("-", " ")).join(", ")}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#68766C]">{item.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-[#7B897F]">
                        <span>Application: {item.applicationStatus}</span>
                        {item.deadline && <span>· Deadline: {item.deadline}</span>}
                        {item.isDemo && <StatusPill tone="gold">Legacy demo</StatusPill>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDE5DC] px-3 text-xs font-semibold text-[#526459] hover:bg-[#F5F8F3]" aria-label={`Open source for ${item.title}`}><ExternalLink size={14} /> Source</a>
                      <button type="button" onClick={() => openEditForm(item)} className={secondaryButtonClass}>Edit</button>
                      <button type="button" onClick={() => void deleteScheme(item)} disabled={deletingId === item.id} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#F1D9D9] px-3 text-[#A63D3D] transition hover:bg-[#FFF2F2] disabled:opacity-50" aria-label={`Delete ${item.title}`}>{deletingId === item.id ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#10251D]/55 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E7ECE5] bg-white px-5 py-4 sm:px-7">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[1.6px] text-[#98A398]">Opportunity record</p><h2 className="mt-1 text-lg font-black text-[#123D32]">{editingId ? "Edit Government Scheme" : "Add Government Scheme"}</h2></div>
              <button type="button" onClick={closeForm} disabled={saving} className="rounded-xl p-2 text-[#78857B] hover:bg-[#F2F5F0]" aria-label="Close form"><X size={20} /></button>
            </div>

            <form onSubmit={saveScheme} className="space-y-7 p-5 sm:p-7">
              <section>
                <h3 className="text-sm font-extrabold text-[#123D32]">Basic information</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Scheme name *<input required value={form.title} onChange={(event) => updateField("title", event.target.value)} className={inputClass} placeholder="Official scheme name" /></label>
                  <label className={labelClass}>URL slug<input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} className={inputClass} placeholder="Generated from scheme name if blank" /></label>
                  <label className={labelClass}>Provider / department *<input required value={form.provider} onChange={(event) => updateField("provider", event.target.value)} className={inputClass} placeholder="Responsible ministry or department" /></label>
                  <label className={labelClass}>Provider type<input value={form.providerType} onChange={(event) => updateField("providerType", event.target.value)} className={inputClass} placeholder="Central Government / Maharashtra Government" /></label>
                  <label className={labelClass}>Government scope<select value={form.scope} onChange={(event) => updateField("scope", event.target.value as SchemeScope)} className={inputClass}><option value="central">Central Government</option><option value="state">State Government</option></select></label>
                  <label className={labelClass}>Applicable state<input value={form.state} onChange={(event) => updateField("state", event.target.value)} className={inputClass} placeholder="All India or Maharashtra" /></label>
                  <label className={labelClass}>Official portal name *<input required value={form.officialPortalName} onChange={(event) => updateField("officialPortalName", event.target.value)} className={inputClass} placeholder="myScheme / department portal" /></label>
                  <label className={labelClass}>Official source URL *<input required type="url" value={form.sourceUrl} onChange={(event) => updateField("sourceUrl", event.target.value)} className={inputClass} placeholder="https://official.gov.in/..." /></label>
                  <label className={`${labelClass} md:col-span-2`}>Description *<textarea required rows={3} value={form.description} onChange={(event) => updateField("description", event.target.value)} className={inputClass} placeholder="Describe the scheme using its official information." /></label>
                  <label className={`${labelClass} md:col-span-2`}>Objective<textarea rows={2} value={form.objective} onChange={(event) => updateField("objective", event.target.value)} className={inputClass} placeholder="What is the scheme intended to achieve? Required before publication." /></label>
                  <label className={labelClass}>Benefit amount / assistance<input value={form.benefitAmount} onChange={(event) => updateField("benefitAmount", event.target.value)} className={inputClass} placeholder="Official wording; leave blank if unknown" /></label>
                </div>
              </section>

              <section className="border-t border-[#E7ECE5] pt-6">
                <h3 className="text-sm font-extrabold text-[#123D32]">Categories and beneficiaries</h3>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <fieldset><legend className={labelClass}>Scheme categories *</legend><div className="mt-3 grid grid-cols-2 gap-2">{categoryOptions.map((option) => <label key={option.value} className="flex items-center gap-2 rounded-xl border border-[#E5EBE3] px-3 py-2.5 text-xs text-[#506056]"><input type="checkbox" checked={form.categories.includes(option.value)} onChange={() => toggleArrayValue("categories", option.value)} className="h-4 w-4 accent-[#075B46]" />{option.label}</label>)}</div></fieldset>
                  <fieldset><legend className={labelClass}>Beneficiary groups *</legend><div className="mt-3 grid grid-cols-2 gap-2">{beneficiaryOptions.map((option) => <label key={option.value} className="flex items-center gap-2 rounded-xl border border-[#E5EBE3] px-3 py-2.5 text-xs text-[#506056]"><input type="checkbox" checked={form.beneficiaryGroups.includes(option.value)} onChange={() => toggleArrayValue("beneficiaryGroups", option.value)} className="h-4 w-4 accent-[#075B46]" />{option.label}</label>)}</div></fieldset>
                </div>
              </section>

              <section className="border-t border-[#E7ECE5] pt-6">
                <h3 className="text-sm font-extrabold text-[#123D32]">Benefits and eligibility</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Benefits *<textarea rows={4} value={form.benefitsText} onChange={(event) => updateField("benefitsText", event.target.value)} className={inputClass} placeholder="One benefit per line. Use verified official information." /><span className="mt-1 block text-[10px] font-normal text-[#8A968C]">Enter one benefit per line.</span></label>
                  <label className={labelClass}>Eligibility criteria *<textarea rows={4} value={form.eligibilityText} onChange={(event) => updateField("eligibilityText", event.target.value)} className={inputClass} placeholder="One eligibility condition per line." /><span className="mt-1 block text-[10px] font-normal text-[#8A968C]">Do not infer missing criteria.</span></label>
                  <label className={labelClass}>Required documents<textarea rows={4} value={form.documentsText} onChange={(event) => updateField("documentsText", event.target.value)} className={inputClass} placeholder="One required document per line" /></label>
                  <label className={labelClass}>Application steps *<textarea rows={4} value={form.applicationStepsText} onChange={(event) => updateField("applicationStepsText", event.target.value)} className={inputClass} placeholder="One official application step per line." /></label>
                </div>
              </section>

              <section className="border-t border-[#E7ECE5] pt-6">
                <h3 className="text-sm font-extrabold text-[#123D32]">Application and verification status</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <label className={labelClass}>Application status<select value={form.applicationStatus} onChange={(event) => updateField("applicationStatus", event.target.value as SchemeStatus)} className={inputClass}><option value="not-verified">Unknown / Not verified</option><option value="upcoming">Upcoming</option><option value="open">Open</option><option value="ongoing">Ongoing</option><option value="closed">Closed</option></select></label>
                  <label className={labelClass}>Application start<input type="date" value={form.applicationStartDate} onChange={(event) => updateField("applicationStartDate", event.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Application deadline<input type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Verification status<select value={form.verificationStatus} onChange={(event) => updateField("verificationStatus", event.target.value as VerificationStatus)} className={inputClass}><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select></label>
                  <label className={labelClass}>Publication status<select value={form.publicationStatus} onChange={(event) => updateField("publicationStatus", event.target.value as PublicationStatus)} className={inputClass}><option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
                </div>
                <p className="mt-3 rounded-xl bg-[#F7F8F4] p-3 text-[11px] leading-5 text-[#77847A]">Only publish after checking the official notification or department page. The server blocks publication until the record is marked verified and its key content is complete. Editing verified scheme details resets verification to pending.</p>
              </section>

              {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#F1D1D1] bg-[#FFF1F1] px-4 py-3 text-sm text-[#A63D3D]"><CircleAlert size={17} className="mt-0.5 shrink-0" />{error}</div>}

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#E7ECE5] pt-5 sm:flex-row">
                <button type="button" onClick={closeForm} disabled={saving} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />}{saving ? "Saving..." : editingId ? "Save changes" : "Create scheme"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

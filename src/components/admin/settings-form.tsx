"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteContent } from "@/lib/site-content";

export function SettingsForm({
  initial,
  loadError,
}: {
  initial: SiteContent;
  loadError: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteContent>(key: K, val: SiteContent[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // --- specialties ---
  function setSpecialty(i: number, val: { title: string; description: string }) {
    set("specialties", form.specialties.map((s, idx) => (idx === i ? val : s)));
  }
  function addSpecialty() {
    set("specialties", [...form.specialties, { title: "", description: "" }]);
  }
  function removeSpecialty(i: number) {
    set("specialties", form.specialties.filter((_, idx) => idx !== i));
  }

  // --- intro paragraphs ---
  function setIntro(i: number, val: string) {
    set("aboutIntro", form.aboutIntro.map((p, idx) => (idx === i ? val : p)));
  }
  function addIntro() {
    set("aboutIntro", [...form.aboutIntro, ""]);
  }
  function removeIntro(i: number) {
    set("aboutIntro", form.aboutIntro.filter((_, idx) => idx !== i));
  }

  // --- expertise groups ---
  function setExpertise(i: number, val: { heading: string; items: string[] }) {
    set("expertise", form.expertise.map((g, idx) => (idx === i ? val : g)));
  }
  function addExpertise() {
    set("expertise", [...form.expertise, { heading: "", items: [] }]);
  }
  function removeExpertise(i: number) {
    set("expertise", form.expertise.filter((_, idx) => idx !== i));
  }

  // --- approach items ---
  function setApproach(
    i: number,
    val: { n: string; title: string; body: string },
  ) {
    set("approach", form.approach.map((a, idx) => (idx === i ? val : a)));
  }
  function addApproach() {
    set("approach", [...form.approach, { n: "", title: "", body: "" }]);
  }
  function removeApproach(i: number) {
    set("approach", form.approach.filter((_, idx) => idx !== i));
  }

  // --- social links ---
  function setLink(i: number, val: { label: string; href: string }) {
    set("socialLinks", form.socialLinks.map((l, idx) => (idx === i ? val : l)));
  }
  function addLink() {
    set("socialLinks", [...form.socialLinks, { label: "", href: "" }]);
  }
  function removeLink(i: number) {
    set("socialLinks", form.socialLinks.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Trim and drop fully-empty rows so validation doesn't reject blanks.
    const payload = {
      heroTitle: form.heroTitle.trim(),
      heroSubtitle: form.heroSubtitle.trim(),
      specialties: form.specialties
        .map((s) => ({
          title: s.title.trim(),
          description: s.description.trim(),
        }))
        .filter((s) => s.title),
      aboutHeading: form.aboutHeading.trim(),
      aboutIntro: form.aboutIntro.map((p) => p.trim()).filter(Boolean),
      expertise: form.expertise
        .map((g) => ({
          heading: g.heading.trim(),
          items: g.items.map((it) => it.trim()).filter(Boolean),
        }))
        .filter((g) => g.heading),
      approach: form.approach
        .map((a) => ({
          n: a.n.trim(),
          title: a.title.trim(),
          body: a.body.trim(),
        }))
        .filter((a) => a.title),
      name: form.name.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      contactEmail: form.contactEmail.trim(),
      socialLinks: form.socialLinks
        .map((l) => ({ label: l.label.trim(), href: l.href.trim() }))
        .filter((l) => l.label || l.href),
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Save failed");
      }
      const saved = (await res.json()) as SiteContent;
      setForm(saved);
      toast.success("Site content saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Site content</h1>
        <p className="text-muted-foreground text-sm">
          Edit your home page, About page, contact details, and social links.
        </p>
      </div>

      {loadError ? (
        <div className="border-destructive/40 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm">
          Could not load saved settings: {loadError}. Showing defaults.
        </div>
      ) : null}

      {/* Home */}
      <Section title="Home">
        <Field label="Hero title">
          <Textarea
            value={form.heroTitle}
            onChange={(e) => set("heroTitle", e.target.value)}
            rows={2}
            placeholder="Alex — bringing stories to life through animation."
          />
        </Field>
        <Field label="Hero subtitle">
          <Textarea
            value={form.heroSubtitle}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            rows={3}
            placeholder="A short intro shown under the hero title…"
          />
        </Field>

        <div className="space-y-3">
          <Label>Specialties</Label>
          {form.specialties.map((s, i) => (
            <div
              key={i}
              className="border-border space-y-2 rounded-md border p-3"
            >
              <div className="flex gap-2">
                <Input
                  value={s.title}
                  onChange={(e) =>
                    setSpecialty(i, { ...s, title: e.target.value })
                  }
                  placeholder="Title (e.g. 3D Animation)"
                />
                <RemoveButton
                  onClick={() => removeSpecialty(i)}
                  label="specialty"
                />
              </div>
              <Textarea
                value={s.description}
                onChange={(e) =>
                  setSpecialty(i, { ...s, description: e.target.value })
                }
                rows={2}
                placeholder="Describe this specialty…"
              />
            </div>
          ))}
          <AddButton onClick={addSpecialty}>Add specialty</AddButton>
        </div>
      </Section>

      {/* About */}
      <Section title="About">
        <Field label="Heading">
          <Input
            value={form.aboutHeading}
            onChange={(e) => set("aboutHeading", e.target.value)}
            placeholder="Bringing imagination to life."
          />
        </Field>

        <div className="space-y-2">
          <Label>Intro paragraphs</Label>
          {form.aboutIntro.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                value={p}
                onChange={(e) => setIntro(i, e.target.value)}
                rows={3}
                placeholder="Write a paragraph…"
              />
              <RemoveButton onClick={() => removeIntro(i)} label="paragraph" />
            </div>
          ))}
          <AddButton onClick={addIntro}>Add paragraph</AddButton>
        </div>

        <div className="space-y-3">
          <Label>Expertise groups</Label>
          {form.expertise.map((g, i) => (
            <div
              key={i}
              className="border-border space-y-2 rounded-md border p-3"
            >
              <div className="flex gap-2">
                <Input
                  value={g.heading}
                  onChange={(e) =>
                    setExpertise(i, { ...g, heading: e.target.value })
                  }
                  placeholder="Group heading (e.g. 3D Animation)"
                />
                <RemoveButton
                  onClick={() => removeExpertise(i)}
                  label="group"
                />
              </div>
              <Textarea
                value={g.items.join("\n")}
                onChange={(e) =>
                  setExpertise(i, {
                    ...g,
                    items: e.target.value.split("\n"),
                  })
                }
                rows={4}
                placeholder="One item per line"
              />
              <p className="text-muted-foreground text-xs">One item per line.</p>
            </div>
          ))}
          <AddButton onClick={addExpertise}>Add expertise group</AddButton>
        </div>

        <div className="space-y-3">
          <Label>Approach items</Label>
          {form.approach.map((a, i) => (
            <div
              key={i}
              className="border-border space-y-2 rounded-md border p-3"
            >
              <div className="flex gap-2">
                <Input
                  value={a.n}
                  onChange={(e) => setApproach(i, { ...a, n: e.target.value })}
                  placeholder="No. (01)"
                  className="w-24"
                />
                <Input
                  value={a.title}
                  onChange={(e) =>
                    setApproach(i, { ...a, title: e.target.value })
                  }
                  placeholder="Title"
                />
                <RemoveButton onClick={() => removeApproach(i)} label="item" />
              </div>
              <Textarea
                value={a.body}
                onChange={(e) => setApproach(i, { ...a, body: e.target.value })}
                rows={3}
                placeholder="Describe this approach…"
              />
            </div>
          ))}
          <AddButton onClick={addApproach}>Add approach item</AddButton>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact & identity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Alex"
            />
          </Field>
          <Field label="Role">
            <Input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="Animator"
            />
          </Field>
          <Field label="Location">
            <Input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Los Angeles, CA"
            />
          </Field>
        </div>
        <Field label="Contact email" hint="Shown as the footer Email link">
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            placeholder="alex@example.com"
          />
        </Field>
      </Section>

      {/* Social links */}
      <Section title="Social links">
        {form.socialLinks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No links yet.</p>
        ) : null}
        {form.socialLinks.map((l, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={l.label}
              onChange={(e) => setLink(i, { ...l, label: e.target.value })}
              placeholder="Label (e.g. Instagram)"
              className="sm:w-44"
            />
            <Input
              value={l.href}
              onChange={(e) => setLink(i, { ...l, href: e.target.value })}
              placeholder="https://…"
            />
            <RemoveButton onClick={() => removeLink(i)} label="link" />
          </div>
        ))}
        <AddButton onClick={addLink}>Add social link</AddButton>
      </Section>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border mb-6 space-y-5 border-t pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      + {children}
    </Button>
  );
}

function RemoveButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive shrink-0"
      onClick={onClick}
      title={`Remove ${label}`}
    >
      Remove
    </Button>
  );
}

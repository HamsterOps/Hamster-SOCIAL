import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Loader2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import HamsterIcon from '@/components/layout/HamsterIcon';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  const [form, setForm] = useState({
    about_what: '',
    about_who_for: '',
    about_who_builds: '',
    contact_email: '',
    instagram_link: '',
    linkedin_link: '',
    tiktok_link: '',
    x_link: '',
    additional_links: [],
  });

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  useEffect(() => {
    if (settingsList[0]) {
      const s = settingsList[0];
      setSettingsId(s.id);
      setForm({
        about_what: s.about_what || '',
        about_who_for: s.about_who_for || '',
        about_who_builds: s.about_who_builds || '',
        contact_email: s.contact_email || '',
        instagram_link: s.instagram_link || '',
        linkedin_link: s.linkedin_link || '',
        tiktok_link: s.tiktok_link || '',
        x_link: s.x_link || '',
        additional_links: s.additional_links || [],
      });
    }
  }, [settingsList]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addLink = () => setForm(f => ({ ...f, additional_links: [...f.additional_links, { label: '', url: '' }] }));
  const removeLink = (i) => setForm(f => ({ ...f, additional_links: f.additional_links.filter((_, idx) => idx !== i) }));
  const updateLink = (i, key, val) => setForm(f => ({
    ...f,
    additional_links: f.additional_links.map((l, idx) => idx === i ? { ...l, [key]: val } : l),
  }));

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, singleton_key: 'main' };
    if (settingsId) {
      await base44.entities.AppSettings.update(settingsId, data);
    } else {
      await base44.entities.AppSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    toast.success('About & Contact page settings saved');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <HamsterIcon size={36} />
          <div>
            <h1 className="text-2xl font-heading font-bold">Builder Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage global app content visible to all users</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card className="p-6 border space-y-6">
            <div>
              <h2 className="text-base font-semibold mb-1">About & Contact Page Settings</h2>
              <p className="text-xs text-muted-foreground">These fields power the public About and Contact pages. Empty fields are hidden from users.</p>
            </div>

            <Separator />

            {/* Content fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">What is Hamster?</label>
                <Textarea
                  value={form.about_what}
                  onChange={e => set('about_what', e.target.value)}
                  placeholder="Describe what Hamster is in 2–3 sentences..."
                  className="resize-none h-24"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Who is it for?</label>
                <Textarea
                  value={form.about_who_for}
                  onChange={e => set('about_who_for', e.target.value)}
                  placeholder="Describe your target audience..."
                  className="resize-none h-20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Who builds it?</label>
                <Textarea
                  value={form.about_who_builds}
                  onChange={e => set('about_who_builds', e.target.value)}
                  placeholder="Founder or team blurb..."
                  className="resize-none h-20"
                />
              </div>
            </div>

            <Separator />

            {/* Contact & social */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Contact & Social Links</h3>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Contact Email</label>
                <Input value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="hello@hamsterapp.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Instagram URL</label>
                  <Input value={form.instagram_link} onChange={e => set('instagram_link', e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">LinkedIn URL</label>
                  <Input value={form.linkedin_link} onChange={e => set('linkedin_link', e.target.value)} placeholder="https://linkedin.com/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">TikTok URL</label>
                  <Input value={form.tiktok_link} onChange={e => set('tiktok_link', e.target.value)} placeholder="https://tiktok.com/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">X (Twitter) URL</label>
                  <Input value={form.x_link} onChange={e => set('x_link', e.target.value)} placeholder="https://x.com/..." />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Additional Links</h3>
                <Button variant="outline" size="sm" onClick={addLink}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
                </Button>
              </div>
              {form.additional_links.length === 0 && (
                <p className="text-xs text-muted-foreground">No additional links yet.</p>
              )}
              {form.additional_links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={link.label}
                    onChange={e => updateLink(i, 'label', e.target.value)}
                    placeholder="Label (e.g. Blog)"
                    className="w-32 flex-shrink-0"
                  />
                  <Input
                    value={link.url}
                    onChange={e => updateLink(i, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Globe className="w-3 h-3" /> Changes reflect immediately on the public About and Contact pages — no redeploy needed.
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Loader2, Instagram, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { data: settings = [] } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const s = settings[0] || {};
  const contactEmail = s.contact_email || 'hello@hamsterapp.co';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: contactEmail,
      subject: `Contact form: ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-2">We'd love to hear from you — questions, feedback, or just a hello.</p>
      </div>

      <Card className="p-6 border">
        <div className="flex items-center gap-2 mb-5">
          <Mail className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{contactEmail}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
              <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
              <Input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Message</label>
            <Textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us what's on your mind..." className="min-h-[120px]" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            Send Message
          </Button>
        </form>
      </Card>

      <div className="text-sm text-muted-foreground space-y-1">
        {(s.instagram_link || s.linkedin_link || s.tiktok_link || s.x_link || (s.additional_links && s.additional_links.length > 0)) && (
          <div className="flex gap-4 flex-wrap">
            {s.instagram_link && <a href={s.instagram_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-75"><Instagram className="w-3.5 h-3.5" /> Instagram</a>}
            {s.linkedin_link && <a href={s.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-75"><ExternalLink className="w-3.5 h-3.5" /> LinkedIn</a>}
            {s.tiktok_link && <a href={s.tiktok_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-75"><ExternalLink className="w-3.5 h-3.5" /> TikTok</a>}
            {s.x_link && <a href={s.x_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-75"><ExternalLink className="w-3.5 h-3.5" /> X (Twitter)</a>}
            {(s.additional_links || []).map((link, i) => link.url && link.label && (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-2 hover:opacity-75"><ExternalLink className="w-3.5 h-3.5" /> {link.label}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
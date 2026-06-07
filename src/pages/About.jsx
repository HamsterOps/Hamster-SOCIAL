import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import HamsterIcon from '@/components/layout/HamsterIcon';
import { Instagram, ExternalLink } from 'lucide-react';

const DEFAULT = {
  about_what: `Hamster is an all-in-one social media management platform built specifically for service-based businesses — salons, clinics, agencies, studios, and every business that never really clocks off. It brings your content calendar, post composer, automation rules, and analytics together in a single streamlined hub.`,
  about_who_for: `Hamster is built for small and medium service businesses that are serious about growing their online presence but don't have the time or budget for a full marketing team.`,
  about_who_builds: `Hamster is built by a small, focused team of product builders who have spent years watching incredible business owners drown in sticky notes, missed bookings, and manual follow-ups.`,
  contact_email: '',
  instagram_link: '',
  tiktok_link: '',
  x_link: '',
};

export default function About() {
  const { data: settings = [] } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const s = settings[0] || DEFAULT;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <HamsterIcon size={40} />
        <h1 className="text-3xl md:text-4xl font-heading font-bold">About Hamster</h1>
      </div>

      <Card className="p-6 border space-y-3">
        <h2 className="text-lg font-heading font-semibold">What is Hamster?</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.about_what || DEFAULT.about_what}</p>
      </Card>

      <Card className="p-6 border space-y-3">
        <h2 className="text-lg font-heading font-semibold">Who is it for?</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.about_who_for || DEFAULT.about_who_for}</p>
      </Card>

      <Card className="p-6 border space-y-3">
        <h2 className="text-lg font-heading font-semibold">Who builds Hamster?</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.about_who_builds || DEFAULT.about_who_builds}</p>
        {!settings[0] && (
          <p className="text-muted-foreground leading-relaxed">
            We're currently in pre-launch and actively growing our waitlist of early adopters who will shape the product alongside us. Want to be part of it?{' '}
            <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-75">Get in touch.</Link>
          </p>
        )}
      </Card>

      {(s.contact_email || s.instagram_link || s.linkedin_link || s.tiktok_link || s.x_link || (s.additional_links && s.additional_links.length > 0)) && (
        <Card className="p-6 border space-y-3">
          <h2 className="text-lg font-heading font-semibold">Get in Touch</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            {s.contact_email && <div><span className="font-medium">Email: </span><a href={`mailto:${s.contact_email}`} className="text-primary underline underline-offset-2">{s.contact_email}</a></div>}
            {s.instagram_link && <div><a href={s.instagram_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /> Instagram <ExternalLink className="w-3 h-3" /></a></div>}
            {s.linkedin_link && <div><a href={s.linkedin_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3" /></a></div>}
            {s.tiktok_link && <div><a href={s.tiktok_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /> TikTok <ExternalLink className="w-3 h-3" /></a></div>}
            {s.x_link && <div><a href={s.x_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /> X (Twitter) <ExternalLink className="w-3 h-3" /></a></div>}
            {(s.additional_links || []).map((link, i) => link.url && link.label && (
              <div key={i}><a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /> {link.label} <ExternalLink className="w-3 h-3" /></a></div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
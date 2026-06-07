import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, Settings, Calendar, Sparkles, BarChart3, CheckCircle2 } from 'lucide-react';
import HamsterIcon from '@/components/layout/HamsterIcon';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: <HamsterIcon size={48} />,
    title: "Welcome to Hamster Social Hub 🐹",
    desc: "Your content command center. Let's take 60 seconds to show you around.",
    cta: "Let's go →",
  },
  {
    icon: <Settings className="w-12 h-12 text-primary" />,
    title: "Set up your brand",
    highlight: "Settings → Brand Profile",
    desc: "Start by adding your brand name, logo, tagline, and brand colors. This keeps everything consistent.",
    cta: "Got it →",
  },
  {
    icon: <Sparkles className="w-12 h-12 text-accent" />,
    title: "Connect your accounts",
    highlight: "Settings → Connected Accounts",
    desc: "Add your social media handles and follower counts so your analytics are accurate from day one.",
    cta: "Got it →",
  },
  {
    icon: <Calendar className="w-12 h-12 text-primary" />,
    title: "Your content calendar",
    highlight: "Content Calendar page",
    desc: "This is where your content lives. Click any day to add a post, or hit '+ New Post' to start writing. We've added one example post so you can see how it works.",
    cta: "Got it →",
  },
  {
    icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    title: "Creating a post",
    highlight: "The example draft post on the calendar",
    desc: "Click a post to open it. Write your caption, choose your platforms, upload media, and either save as a draft or schedule it. When you've published it manually, hit 'Mark as Posted' to keep your analytics up to date.",
    cta: "Got it →",
  },
  {
    icon: <BarChart3 className="w-12 h-12 text-accent" />,
    title: "Track your growth",
    highlight: "Analytics page",
    desc: "Head to Analytics to see your follower growth, engagement rates, and best-performing content. Update your stats regularly for accurate insights.",
    cta: "Got it →",
  },
  {
    icon: <HamsterIcon size={48} />,
    title: "You're all set!",
    desc: "Build your plan, track your growth, and stay off the hamster wheel. 🐹",
    cta: "Open my calendar",
    isLast: true,
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem('hamster_onboarded');
    if (!seen) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem('hamster_onboarded', '1');
    setOpen(false);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      handleClose();
      navigate('/calendar');
    }
  };

  const current = steps[step];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md text-center p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/50">
            {current.icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-bold">{current.title}</h2>
            {current.highlight && (
              <p className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                📍 {current.highlight}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{current.desc}</p>
          </div>

          {/* Step dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === step ? 'bg-primary w-5' : 'bg-muted-foreground/30 w-2'}`}
              />
            ))}
          </div>

          <div className="flex gap-2 w-full">
            {step > 0 && (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setStep(s => s - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" className="flex-1" onClick={next}>
              {current.cta} {!current.isLast && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {step < steps.length - 1 && (
            <button onClick={handleClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Skip tour
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
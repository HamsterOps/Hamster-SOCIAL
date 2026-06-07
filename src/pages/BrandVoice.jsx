import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Sparkles, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const personality = ['Energetic', 'Witty', 'Direct', 'Empathetic', 'No-fluff'];

const toneSpectrum = [
  { trait: 'Smart', desc: 'Not condescending — you know your stuff, and you share it like a friend' },
  { trait: 'Relatable', desc: 'You feel the pain of running a business — you\'ve been there' },
  { trait: 'Optimistic', desc: 'Transformation is possible — and it starts now' },
];

const wordsToUse = ['Streamlined', 'Systems', 'Booked solid', 'Running smooth', 'Real-time', 'Built for', 'Done-for-you', 'On autopilot'];
const wordsToAvoid = ['Revolutionary', 'Disruptive', 'Game-changer', 'Synergy', 'Leverage', 'Seamlessly', 'Cutting-edge', 'Best-in-class'];

const doList = [
  'Speak like a friend who runs a business',
  'Use short, punchy sentences',
  'Lead with empathy, close with action',
  'Use specific examples (salon, clinic, agency)',
  'Be honest about the grind',
];
const dontList = [
  'Use corporate jargon or buzzwords',
  'Over-promise or hype without substance',
  'Be condescending or preachy',
  'Use passive voice when active hits harder',
  'Ignore the reader\'s pain points',
];

const hashtagGroups = {
  'Brand Tags': ['#HamsterApp', '#ForBusinessesThatNeverStop', '#HamsterHustle', '#RunItSmooth'],
  'Niche Tags': ['#SalonOwner', '#ClinicLife', '#AgencyOwner', '#SmallBizOps', '#ServiceBusiness'],
  'Engagement Tags': ['#BusinessTip', '#EntrepreneurLife', '#SmallBizTips', '#OperationsHack'],
};

export default function BrandVoice() {
  const [checkCaption, setCheckCaption] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToneCheck = async () => {
    if (!checkCaption.trim()) return;
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the brand voice checker for Hamster — a business operations SaaS.
      
Brand personality: Energetic, Witty, Direct, Empathetic, No-fluff
Tone: Smart (not condescending), Relatable (feel the pain), Optimistic (transformation is possible)
Words to use: Streamlined, Systems, Booked solid, Running smooth, Real-time
Words to avoid: Revolutionary, Disruptive, Game-changer, Synergy, Leverage, Seamlessly

Rate this caption on a 1-10 scale for brand voice alignment. Give 2-3 specific suggestions to improve it.

Caption: "${checkCaption}"`,
      response_json_schema: {
        type: 'object',
        properties: {
          score: { type: 'number' },
          feedback: { type: 'string' },
          suggestions: { type: 'array', items: { type: 'string' } },
        },
      },
    });
    setCheckResult(result);
    setLoading(false);
  };

  const copyTag = (tag) => {
    navigator.clipboard.writeText(tag);
    toast.success(`Copied ${tag}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-heading font-bold">Brand Voice Guide</h1>

      {/* Personality */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Personality Traits</h2>
        <div className="flex flex-wrap gap-2">
          {personality.map(t => (
            <Badge key={t} className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">{t}</Badge>
          ))}
        </div>
      </Card>

      {/* Tone Spectrum */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Tone Spectrum</h2>
        <div className="space-y-3">
          {toneSpectrum.map(({ trait, desc }) => (
            <div key={trait} className="flex items-start gap-3">
              <span className="font-heading font-bold text-sm min-w-[80px]">{trait}</span>
              <span className="text-sm text-muted-foreground">— {desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Caption Formula */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Caption Formula</h2>
        <div className="flex flex-wrap items-center gap-2">
          {['Hook', 'Bridge', 'Tease', 'CTA'].map((step, i) => (
            <React.Fragment key={step}>
              <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">{step}</span>
              {i < 3 && <span className="text-muted-foreground">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Hook them in → Bridge to the problem → Tease the solution → Call them to action
        </p>
      </Card>

      {/* Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border">
          <h2 className="text-sm font-medium mb-3">Words to Use ✅</h2>
          <div className="flex flex-wrap gap-1.5">
            {wordsToUse.map(w => (
              <Badge key={w} variant="outline" className="bg-green-50 text-green-700 border-green-200">{w}</Badge>
            ))}
          </div>
        </Card>
        <Card className="p-5 border">
          <h2 className="text-sm font-medium mb-3">Words to Avoid ❌</h2>
          <div className="flex flex-wrap gap-1.5">
            {wordsToAvoid.map(w => (
              <Badge key={w} variant="outline" className="bg-red-50 text-red-700 border-red-200">{w}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Do / Don't */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border">
          <h2 className="text-sm font-medium mb-3">Do</h2>
          <ul className="space-y-2">
            {doList.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 border">
          <h2 className="text-sm font-medium mb-3">Don't</h2>
          <ul className="space-y-2">
            {dontList.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Hashtag Bank */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Hashtag Bank</h2>
        <div className="space-y-4">
          {Object.entries(hashtagGroups).map(([group, tags]) => (
            <div key={group}>
              <p className="text-xs text-muted-foreground mb-1.5">{group}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => copyTag(tag)}
                  >
                    {tag} <Copy className="w-3 h-3 ml-1 opacity-50" />
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Tone Checker */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> AI Tone Checker
        </h2>
        <Textarea
          value={checkCaption}
          onChange={(e) => setCheckCaption(e.target.value)}
          placeholder="Paste your caption draft here to check if it matches Hamster's brand voice..."
          className="min-h-[100px] mb-3"
        />
        <Button onClick={handleToneCheck} disabled={loading || !checkCaption.trim()}>
          {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
          Check Brand Voice
        </Button>

        {checkResult && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Score:</span>
              <span className={`text-lg font-heading font-bold ${checkResult.score >= 7 ? 'text-green-600' : checkResult.score >= 4 ? 'text-amber-500' : 'text-red-500'}`}>
                {checkResult.score}/10
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{checkResult.feedback}</p>
            {checkResult.suggestions?.length > 0 && (
              <ul className="space-y-1 mt-2">
                {checkResult.suggestions.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-accent">•</span> {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
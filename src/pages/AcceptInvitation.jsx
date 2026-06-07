import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import HamsterIcon from '@/components/layout/HamsterIcon';

export default function AcceptInvitation() {
  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | valid | invalid | expired | already_used
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    loadInvite();
  }, []);

  const loadInvite = async () => {
    const results = await base44.entities.Invite.filter({ token });
    if (!results || results.length === 0) { setStatus('invalid'); return; }
    const inv = results[0];
    setInvite(inv);

    if (inv.status === 'accepted') { setStatus('already_used'); return; }
    if (inv.status === 'expired') { setStatus('expired'); return; }

    // Check expiry by date
    if (inv.expires_at && new Date(inv.expires_at) < new Date()) {
      await base44.entities.Invite.update(inv.id, { status: 'expired' });
      setStatus('expired');
      return;
    }

    setStatus('valid');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setSubmitting(true);

    // Register the user
    await base44.auth.register({ email: invite.email, password });

    // Verify OTP is not needed here — the platform invite flow handles verification
    // We attempt login directly after register
    const result = await base44.auth.loginViaEmailPassword(invite.email, password);

    // Mark invite as accepted
    await base44.entities.Invite.update(invite.id, {
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    });

    window.location.href = '/';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === 'invalid' || status === 'expired' || status === 'already_used') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <h1 className="text-xl font-heading font-semibold">
            {status === 'already_used' ? 'Invite Already Used' : 'Invite Link Invalid'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === 'already_used'
              ? 'This invite link has already been used. Sign in to access your account.'
              : 'This invite link is no longer valid. Ask your admin to send a new one.'}
          </p>
          {status === 'already_used' && (
            <Button className="w-full mt-2" onClick={() => window.location.href = '/login'}>
              Go to Sign In
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <HamsterIcon size={44} />
          <h1 className="text-2xl font-heading font-bold">You're invited!</h1>
          <p className="text-sm text-muted-foreground">
            You've been invited to join <span className="font-medium text-foreground">Hamster Social Hub</span>.
            Create a password to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Email Address</label>
            <Input value={invite?.email || ''} readOnly className="bg-muted cursor-not-allowed" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Create Password</label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
                className="pr-10"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Accept & Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="text-primary underline underline-offset-2 hover:opacity-75">Sign in instead</a>
        </p>
      </Card>
    </div>
  );
}
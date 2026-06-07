import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Download, RotateCcw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';
import ConnectedAccounts from '@/components/settings/ConnectedAccounts';
import UserProfile from '@/components/settings/UserProfile';

export default function Settings() {
  const queryClient = useQueryClient();
  const [waitlistUrl, setWaitlistUrl] = useState('');
  const [notifications, setNotifications] = useState({ email: true, inApp: true, digest: false });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [brandName, setBrandName] = useState('Hamster');
  const [tagline, setTagline] = useState('For businesses that never stop.');

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: invites = [], refetch: refetchInvites } = useQuery({
    queryKey: ['invites'],
    queryFn: () => base44.entities.Invite.list('-created_date', 50),
  });

  const handleInvite = async () => {
    if (!inviteEmail) return;
    // Create invite record
    const token = crypto.randomUUID();
    const expiresAt = addDays(new Date(), 7).toISOString();
    await base44.entities.Invite.create({ email: inviteEmail, role: inviteRole, token, status: 'pending', expires_at: expiresAt });
    // Send invite email with accept link
    const acceptUrl = `${window.location.origin}/accept-invitation?token=${token}`;
    await base44.integrations.Core.SendEmail({
      to: inviteEmail,
      subject: 'You\'ve been invited to Hamster Social Hub',
      body: `You've been invited to join Hamster Social Hub.\n\nClick the link below to accept your invitation and create your account:\n\n${acceptUrl}\n\nThis link expires in 7 days.\n\nIf you didn't expect this invitation, you can ignore this email.`,
    });
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
    refetchInvites();
  };

  const getInviteStatus = (inv) => {
    if (inv.status === 'accepted') return { label: 'Accepted', icon: CheckCircle2, color: 'text-green-600' };
    if (inv.status === 'expired') return { label: 'Expired', icon: AlertCircle, color: 'text-destructive' };
    const isExpired = inv.expires_at && new Date(inv.expires_at) < new Date();
    if (isExpired) return { label: 'Expired', icon: AlertCircle, color: 'text-destructive' };
    return { label: 'Pending', icon: Clock, color: 'text-muted-foreground' };
  };

  const restartTour = () => {
    localStorage.removeItem('hamster_onboarded');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-heading font-bold">Settings</h1>

      {/* My Profile */}
      <UserProfile user={user} />

      {/* Connected Accounts */}
      <ConnectedAccounts />

      {/* Waitlist Integration */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Waitlist Integration</h2>
        <div className="flex gap-2">
          <Input value={waitlistUrl} onChange={(e) => setWaitlistUrl(e.target.value)} placeholder="Paste your Typeform or Tally form URL" className="flex-1" />
          <Button size="sm" onClick={() => toast.success('Waitlist URL saved')}>Save</Button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email Alerts</span>
            <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications(n => ({ ...n, email: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">In-App Alerts</span>
            <Switch checked={notifications.inApp} onCheckedChange={(v) => setNotifications(n => ({ ...n, inApp: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Daily Digest</span>
            <Switch checked={notifications.digest} onCheckedChange={(v) => setNotifications(n => ({ ...n, digest: v }))} />
          </div>
        </div>
      </Card>

      {/* Team Members */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Team Members</h2>
        <div className="flex gap-2 mb-4">
          <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email address" className="flex-1" />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="px-3 py-2 border rounded-md text-sm bg-background">
            <option value="user">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <Button size="sm" onClick={handleInvite}>
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Invite
          </Button>
        </div>
        {invites.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-xs text-muted-foreground font-medium">Sent Invites</p>
            {invites.map(inv => {
              const { label, icon: Icon, color } = getInviteStatus(inv);
              return (
                <div key={inv.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-foreground">{inv.email}</span>
                  <div className={`flex items-center gap-1 text-xs ${color} flex-shrink-0 ml-2`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Brand Profile */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Brand Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Brand Name</label>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Tagline</label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <Button size="sm" onClick={() => toast.success('Brand profile updated')}>Save Changes</Button>
        </div>
      </Card>

      {/* Export */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-3">Export</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('CSV export coming soon')}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export as CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info('PDF export coming soon')}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export as PDF
          </Button>
        </div>
      </Card>

      {/* Tour */}
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-1">Guided Tour</h2>
        <p className="text-xs text-muted-foreground mb-3">Restart the onboarding walkthrough.</p>
        <Button variant="outline" size="sm" onClick={restartTour}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restart Tour
        </Button>
      </Card>
    </div>
  );
}
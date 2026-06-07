import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Singapore',
  'Asia/Tokyo', 'Australia/Sydney',
];

export default function UserProfile({ user }) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setRole(user.job_title || '');
      setBio(user.bio || '');
      setTimezone(user.timezone || 'UTC');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const initials = (fullName || user?.full_name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setAvatarUrl(file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ full_name: fullName, phone, job_title: role, bio, timezone, avatar_url: avatarUrl });
    queryClient.invalidateQueries({ queryKey: ['current-user'] });
    toast.success('Profile saved');
    setSaving(false);
  };

  return (
    <Card className="p-5 border">
      <h2 className="text-sm font-medium mb-4">My Profile</h2>
      <div className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                {initials}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 p-1 rounded-full bg-card border cursor-pointer hover:bg-muted transition-colors">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium">{fullName || user?.full_name || 'Your Name'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email Address</label>
            <Input value={user?.email || ''} disabled className="opacity-60" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Phone (optional)</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Role / Job Title</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Founder, Social Media Manager" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Time Zone</label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Short Bio (max 200 characters)</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            placeholder="A short intro about you..."
            className="h-20 resize-none"
          />
          <p className="text-[10px] text-muted-foreground text-right">{bio.length}/200</p>
        </div>

        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}
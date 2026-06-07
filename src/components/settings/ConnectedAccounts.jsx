import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, RefreshCw, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: 'bg-orange-500' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-500' },
  { id: 'x', label: 'X (Twitter)', color: 'bg-gray-500' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-purple-400' },
];

function AccountForm({ account, onSave, onClose }) {
  const [handle, setHandle] = useState(account?.handle || '');
  const [profileUrl, setProfileUrl] = useState(account?.profile_url || '');
  const [followerCount, setFollowerCount] = useState(account?.follower_count || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ handle, profile_url: profileUrl, follower_count: Number(followerCount) || 0, last_updated: new Date().toISOString() });
    setSaving(false);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground">Handle (e.g. @hamsterapp)</label>
        <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Profile URL</label>
        <Input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Current Follower Count</label>
        <Input type="number" value={followerCount} onChange={(e) => setFollowerCount(e.target.value)} placeholder="0" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}

export default function ConnectedAccounts() {
  const queryClient = useQueryClient();
  const [editingPlatform, setEditingPlatform] = useState(null);

  const { data: accounts = [] } = useQuery({
    queryKey: ['social-accounts'],
    queryFn: () => base44.entities.SocialAccount.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialAccount.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-accounts'] }); toast.success('Account added'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SocialAccount.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-accounts'] }); toast.success('Account updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SocialAccount.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-accounts'] }); toast.success('Account removed'); },
  });

  const handleSave = async (platform, data) => {
    const existing = accounts.find(a => a.platform === platform);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { ...data, platform } });
    } else {
      await createMutation.mutateAsync({ ...data, platform });
    }
  };

  const handleSync = async (platform) => {
    const existing = accounts.find(a => a.platform === platform);
    if (!existing) { setEditingPlatform(platform); return; }
    await updateMutation.mutateAsync({ id: existing.id, data: { last_updated: new Date().toISOString() } });
    toast.success('Last updated timestamp refreshed');
  };

  return (
    <>
      <Card className="p-5 border">
        <h2 className="text-sm font-medium mb-4">Connected Accounts</h2>
        <div className="space-y-3">
          {PLATFORMS.map(p => {
            const acct = accounts.find(a => a.platform === p.id);
            return (
              <div key={p.id} className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${p.color}`} />
                    <div>
                      <span className="text-sm font-medium">{p.label}</span>
                      {acct?.handle && <span className="text-xs text-muted-foreground ml-2">{acct.handle}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {acct ? (
                      <>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleSync(p.id)}>
                          <RefreshCw className="w-3 h-3 mr-1" /> Sync
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingPlatform(p.id)}>
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(acct.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setEditingPlatform(p.id)}>
                        <PlusCircle className="w-3 h-3 mr-1" /> Add Account
                      </Button>
                    )}
                  </div>
                </div>
                {acct && (
                  <div className="flex items-center gap-4 pl-6 text-xs text-muted-foreground">
                    <span>{acct.follower_count?.toLocaleString() || 0} followers</span>
                    {acct.last_updated && <span>Updated {format(new Date(acct.last_updated), 'MMM d, h:mm a')}</span>}
                    {acct && <span className="text-green-600 font-medium">● Connected (Manual)</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Live sync requires platform API keys. Until connected, update your stats manually to keep analytics accurate.
        </p>
      </Card>

      <Dialog open={!!editingPlatform} onOpenChange={(v) => { if (!v) setEditingPlatform(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {PLATFORMS.find(p => p.id === editingPlatform)?.label} Account
            </DialogTitle>
          </DialogHeader>
          {editingPlatform && (
            <AccountForm
              account={accounts.find(a => a.platform === editingPlatform)}
              onSave={(data) => handleSave(editingPlatform, data)}
              onClose={() => setEditingPlatform(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Zap, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import EmptyState from '@/components/shared/EmptyState';

export default function AutomationRules() {
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', description: '', trigger_type: 'time_based', condition: '', action: '' });

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.AutomationRule.list('-created_date', 50),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
      await base44.entities.AutomationRule.update(id, { is_active: !is_active });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['automation-rules'] }); toast.success('Rule updated'); },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.AutomationRule.create({ ...newRule, is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast.success('Rule created');
      setShowNew(false);
      setNewRule({ name: '', description: '', trigger_type: 'time_based', condition: '', action: '' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Automation Rules</h1>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> New Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          title="No automation rules yet"
          description="Set up rules to automate your content workflow."
          action={<Button onClick={() => setShowNew(true)}>Create Rule</Button>}
        />
      ) : (
        <div className="space-y-3">
          {rules.map(rule => (
            <Card key={rule.id} className="p-4 border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  {rule.trigger_type === 'time_based' ? (
                    <Clock className="w-5 h-5 text-accent" />
                  ) : (
                    <Zap className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{rule.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                  {rule.condition && <p className="text-xs text-muted-foreground mt-1">Condition: {rule.condition}</p>}
                  <p className="text-xs text-muted-foreground">Action: {rule.action}</p>
                  {rule.last_triggered && (
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Last triggered: {format(new Date(rule.last_triggered), 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={() => toggleMutation.mutate({ id: rule.id, is_active: rule.is_active })}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Rule Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Create Automation Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rule Name</label>
              <Input value={newRule.name} onChange={(e) => setNewRule(r => ({ ...r, name: e.target.value }))} placeholder="e.g. Auto-reminder for drafts" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={newRule.description} onChange={(e) => setNewRule(r => ({ ...r, description: e.target.value }))} placeholder="What does this rule do?" />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger Type</label>
              <Select value={newRule.trigger_type} onValueChange={(v) => setNewRule(r => ({ ...r, trigger_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="time_based">Time-based</SelectItem>
                  <SelectItem value="event_based">Event-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Condition (optional)</label>
              <Input value={newRule.condition} onChange={(e) => setNewRule(r => ({ ...r, condition: e.target.value }))} placeholder="e.g. Post status is Draft" />
            </div>
            <div>
              <label className="text-sm font-medium">Action</label>
              <Input value={newRule.action} onChange={(e) => setNewRule(r => ({ ...r, action: e.target.value }))} placeholder="e.g. Send notification reminder" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!newRule.name || !newRule.action}>Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
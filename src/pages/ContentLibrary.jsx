import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid3X3, List, Trash2, Copy, CalendarClock } from 'lucide-react';
import PostActionButton from '@/components/posts/PostActionButton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import PlatformBadge from '@/components/shared/PlatformBadge';
import PostTypeBadge from '@/components/shared/PostTypeBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';

export default function ContentLibrary() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 200),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      for (const id of ids) await base44.entities.Post.delete(id);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); toast.success('Posts deleted'); setSelected([]); },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (post) => {
      const { id, created_date, updated_date, created_by_id, ...data } = post;
      await base44.entities.Post.create({ ...data, title: `${data.title} (copy)`, status: 'draft' });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); toast.success('Post duplicated'); },
  });

  const filtered = posts.filter(p => {
    if (search && !p.caption?.toLowerCase().includes(search.toLowerCase()) && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.hashtags?.some(h => h.toLowerCase().includes(search.toLowerCase()))) return false;
    if (platformFilter !== 'all' && !p.platforms?.includes(platformFilter)) return false;
    if (typeFilter !== 'all' && p.post_type !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Content Library</h1>
        <Button onClick={() => navigate('/compose')}>+ New Post</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="pl-9" />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="x">X</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="social_proof">Social Proof</SelectItem>
            <SelectItem value="hype">Hype</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg">
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(selected)}>
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState title="No posts found" description="Try adjusting your filters or create a new post." action={<Button onClick={() => navigate('/compose')}>Create Post</Button>} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => (
            <Card key={post.id} className="p-4 border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/compose?edit=${post.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.includes(post.id)} onCheckedChange={() => toggleSelect(post.id)} />
                </div>
                <StatusBadge status={post.status} />
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.caption}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.platforms?.map(p => <PlatformBadge key={p} platform={p} size="xs" />)}
                <PostTypeBadge type={post.post_type} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-[10px] text-muted-foreground">
                  {post.scheduled_date ? format(new Date(post.scheduled_date), 'MMM d, yyyy') : 'Unscheduled'}
                </span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <PostActionButton post={post} size="sm" />
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); duplicateMutation.mutate(post); }}>
                    <Copy className="w-3 h-3 mr-1" /> Duplicate
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(post => (
            <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/compose?edit=${post.id}`)}>
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={selected.includes(post.id)} onCheckedChange={() => toggleSelect(post.id)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{post.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{post.caption}</p>
              </div>
              <div className="flex items-center gap-1.5">{post.platforms?.map(p => <PlatformBadge key={p} platform={p} size="xs" />)}</div>
              <PostTypeBadge type={post.post_type} />
              <StatusBadge status={post.status} />
              <span className="text-xs text-muted-foreground shrink-0">{post.scheduled_date ? format(new Date(post.scheduled_date), 'MMM d') : '-'}</span>
              <div onClick={(e) => e.stopPropagation()}>
                <PostActionButton post={post} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
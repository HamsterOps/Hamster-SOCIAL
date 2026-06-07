import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Save, CalendarClock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CaptionEditor from '@/components/composer/CaptionEditor';
import PlatformSelector from '@/components/composer/PlatformSelector';
import HashtagManager from '@/components/composer/HashtagManager';
import SchedulePicker from '@/components/composer/SchedulePicker';
import MediaUploader from '@/components/composer/MediaUploader';
import PostPreview from '@/components/composer/PostPreview';

export default function PostComposer() {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  const prefillDate = params.get('date');
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [postType, setPostType] = useState('awareness');
  const [hashtags, setHashtags] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(prefillDate || '');
  const [scheduledTime, setScheduledTime] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Load post for editing
  const { data: editPost } = useQuery({
    queryKey: ['post', editId],
    queryFn: () => editId ? base44.entities.Post.filter({ id: editId }) : null,
    enabled: !!editId,
  });

  useEffect(() => {
    if (editPost && editPost.length > 0) {
      const p = editPost[0];
      setTitle(p.title || '');
      setCaption(p.caption || '');
      setPlatforms(p.platforms || []);
      setPostType(p.post_type || 'awareness');
      setHashtags(p.hashtags || []);
      setMediaUrls(p.media_urls || []);
      setScheduledDate(p.scheduled_date || '');
      setScheduledTime(p.scheduled_time || '');
    }
  }, [editPost]);

  const saveMutation = useMutation({
    mutationFn: async (status) => {
      const data = {
        title, caption, platforms, post_type: postType, hashtags, media_urls: mediaUrls,
        scheduled_date: scheduledDate, scheduled_time: scheduledTime, status,
      };
      if (editId) {
        await base44.entities.Post.update(editId, data);
      } else {
        await base44.entities.Post.create(data);
      }
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(status === 'scheduled' ? 'Post scheduled!' : 'Draft saved!');
    },
  });

  const handleAiAssist = async () => {
    if (!caption) { toast.error('Write a caption first'); return; }
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the brand voice assistant for Hamster — a business operations SaaS for service-based businesses. The tone is bold, empathetic, no-fluff, and relatable to busy business owners (salons, clinics, agencies, etc).

Improve this social media caption while keeping the same message and tone. Make it punchier, more engaging, and add a strong call-to-action. Keep it concise.

Original caption:
${caption}

Return ONLY the improved caption, nothing else.`,
    });
    setCaption(result);
    setAiLoading(false);
    toast.success('Caption improved by AI');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">
          {editId ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => saveMutation.mutate('draft')} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button onClick={() => saveMutation.mutate('scheduled')} disabled={saveMutation.isPending || !scheduledDate}>
            <CalendarClock className="w-4 h-4 mr-1.5" /> Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </div>

          <PlatformSelector selected={platforms} setSelected={setPlatforms} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Post Type</label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social_proof">Social Proof</SelectItem>
                <SelectItem value="hype">Hype</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CaptionEditor caption={caption} setCaption={setCaption} platforms={platforms} />

          <Button variant="outline" onClick={handleAiAssist} disabled={aiLoading} className="gap-2">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Caption Assistant
          </Button>

          <MediaUploader mediaUrls={mediaUrls} setMediaUrls={setMediaUrls} />
          <HashtagManager hashtags={hashtags} setHashtags={setHashtags} platforms={platforms} />
          <SchedulePicker date={scheduledDate} setDate={setScheduledDate} time={scheduledTime} setTime={setScheduledTime} platforms={platforms} />
        </div>

        {/* Preview */}
        <div className="lg:border-l lg:pl-6">
          <PostPreview caption={caption} platforms={platforms} mediaUrls={mediaUrls} hashtags={hashtags} />
        </div>
      </div>
    </div>
  );
}
import React, { useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MediaUploader({ mediaUrls, setMediaUrls }) {
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setMediaUrls(prev => [...prev, file_url]);
      toast.success('Media uploaded');
    }
    e.target.value = '';
  };

  const removeMedia = (idx) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Media</label>
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Drop images or videos here, or click to upload</p>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} />
      </div>
      {mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeMedia(idx)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PostEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ value, onChange }) => {
  // Kita gunakan 'any' untuk ref guna menghindari konflik versi React 19
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Upload ke backend Cloudflare Pages Function
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        
        // Masukkan gambar ke editor
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);
        
        if (quill) {
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, 'image', data.url);
        }

      } catch (error) {
        console.error('Error:', error);
        alert('Gagal upload gambar. Pastikan Binding R2 sudah diset di Dashboard Cloudflare.');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'link'], // Tombol Image aktif
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      }
    }
  }), []);

  return (
    <div className="bg-white text-black rounded border border-gray-300">
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-64 mb-12" // mb-12 memberi ruang untuk toolbar bawah
      />
    </div>
  );
};

export default PostEditor;
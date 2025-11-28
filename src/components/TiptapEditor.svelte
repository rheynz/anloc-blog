<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Image from "@tiptap/extension-image";

  export let post = null;

  let title = post?.title || "";
  let tagsString = post?.tags?.join(", ") || "";
  let excerpt = post?.excerpt || "";
  let content = post?.content || "";
  let editorElement;
  let editor;

  // Reactive states for toolbar buttons
  let isBold,
    isItalic,
    isStrike,
    isH1,
    isH2,
    isH3,
    isParagraph,
    isBulletList,
    isOrderedList,
    isBlockquote;

  async function uploadAndInsertImage(file: File) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Silakan pilih file gambar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload gagal");
      }

      const { url } = await res.json();

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Gagal mengunggah gambar: ${error.message}`);
    }
  }

  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      uploadAndInsertImage(target.files[0]);
      target.value = ""; // Reset file input
    }
  };

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [StarterKit],
      content: content,
      onUpdate: () => {
        content = editor.getHTML();
        updateButtonStates();
      },
      onSelectionUpdate: () => {
        updateButtonStates();
      },
    });
    updateButtonStates();
  });

  function updateButtonStates() {
    if (!editor) return;
    isBold = editor.isActive("bold");
    isItalic = editor.isActive("italic");
    isStrike = editor.isActive("strike");
    isH1 = editor.isActive("heading", { level: 1 });
    isH2 = editor.isActive("heading", { level: 2 });
    isH3 = editor.isActive("heading", { level: 3 });
    isParagraph = editor.isActive("paragraph");
    isBulletList = editor.isActive("bulletList");
    isOrderedList = editor.isActive("orderedList");
    isBlockquote = editor.isActive("blockquote");
  }

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  async function handleSave() {
    const postData = {
      id: post?.id,
      title,
      content,
      tags: tagsString
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t), // Process tags string into array
      excerpt,
    };

    const response = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      alert("Post saved successfully!");
      if (!post) {
        // If this was a NEW post
        const newPost = await response.json();
        // Redirect to the new post's edit page
        window.location.href = `/admin/editor?id=${newPost.slug}`;
      } else {
        // If we were UPDATING an existing post
        // Just reload the page to see the saved state
        window.location.reload();
      }
    } else {
      alert("Failed to save post.");
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Are you sure you want to delete this post?")) {
      return;
    }

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Post deleted successfully!");
      window.location.href = "/admin";
    } else {
      alert("Failed to delete post.");
    }
  }
</script>

<div class="space-y-4">
  <label for="title" class="block text-sm font-medium text-gray-700"
    >Title</label
  >
  <input
    type="text"
    id="title"
    placeholder="Post Title"
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
    bind:value={title}
  />

  <label for="tags" class="block text-sm font-medium text-gray-700"
    >Tags (comma-separated)</label
  >
  <input
    type="text"
    id="tags"
    placeholder="e.g. astro, tutorial, javascript"
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
    bind:value={tagsString}
  />

  <label for="excerpt" class="block text-sm font-medium text-gray-700"
    >Excerpt (for SEO)</label
  >
  <textarea
    id="excerpt"
    placeholder="A short summary of the post..."
    rows="3"
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
    bind:value={excerpt}
  ></textarea>

  <label class="block text-sm font-medium text-gray-700">Content</label>

  {#if editor}
    <div
      class="toolbar flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-t-md bg-gray-50"
    >
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleBold().run()}
        class:is-active={isBold}
        class="toolbar-button"><strong>B</strong></button
      >
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleItalic().run()}
        class:is-active={isItalic}
        class="toolbar-button"><em>I</em></button
      >
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleStrike().run()}
        class:is-active={isStrike}
        class="toolbar-button"><s>S</s></button
      >
      <span class="toolbar-divider"></span>
      <button
        type="button"
        on:click={() => editor.chain().focus().setParagraph().run()}
        class:is-active={isParagraph}
        class="toolbar-button">P</button
      >
      <button
        type="button"
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()}
        class:is-active={isH1}
        class="toolbar-button">H1</button
      >
      <button
        type="button"
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()}
        class:is-active={isH2}
        class="toolbar-button">H2</button
      >
      <button
        type="button"
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()}
        class:is-active={isH3}
        class="toolbar-button">H3</button
      >
      <span class="toolbar-divider"></span>
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleBulletList().run()}
        class:is-active={isBulletList}
        class="toolbar-button"
        title="Bullet List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
          /></svg
        >
      </button>
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleOrderedList().run()}
        class:is-active={isOrderedList}
        class="toolbar-button"
        title="Ordered List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M8 4h13v2H8V4zM5.1 13.5H4.4L2 12.3v-1l1.6-.8H2V9h3v1.8H3.3l1.1 1-1.1 1H5v.7zm.9-6.3L4.4 6L2 4.8v-1l1.6-.8H2V2h3v1.8H3.3l1.1 1-1.1 1H5v.7zM8 11h13v2H8v-2zm0 7h13v2H8v-2zM4 21.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
          /></svg
        >
      </button>
      <button
        type="button"
        on:click={() => editor.chain().focus().toggleBlockquote().run()}
        class:is-active={isBlockquote}
        class="toolbar-button"
        title="Blockquote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"
          /></svg
        >
      </button>
    </div>
  {/if}
  <div
    class="editor-content border border-gray-300 rounded-b-md p-2 border-t-0"
    bind:this={editorElement}
  ></div>

  <div class="flex justify-between mt-4">
    <button
      class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      on:click={handleSave}
    >
      {#if post}Update Post{:else}Create Post{/if}
    </button>
    {#if post}
      <button
        class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        on:click={handleDelete}
      >
        Delete Post
      </button>
    {/if}
  </div>
</div>

<style>
  .ProseMirror {
    min-height: 300px;
  }
  .ProseMirror:focus {
    outline: none;
  }
  .toolbar-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid transparent;
    font-weight: 600;
    font-size: 0.875rem;
  }
  .toolbar-button svg {
    fill: currentColor;
  }
  .toolbar-button:hover {
    background-color: #f0f0f0;
    border-color: #ccc;
  }
  .is-active {
    background-color: #d1d5db;
    border-color: #9ca3af;
  }
  .toolbar-divider {
    width: 1px;
    background-color: #e5e7eb;
    margin: 0 0.5rem;
    height: 1.5rem;
  }
</style>

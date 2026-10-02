import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Quote,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Youtube as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  lang?: "ml" | "en";
  placeholder?: string;
}

/**
 * Story editor used in the admin panel. Renders Malayalam and English
 * Unicode content without any transformation of the underlying text, so
 * saved HTML round-trips exactly as typed.
 */
export function RichTextEditor({ content, onChange, lang = "en", placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      ImageExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `reading-area min-h-[300px] max-w-none focus:outline-none ${
          lang === "ml" ? "font-serifml" : ""
        }`,
        lang,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
    // Only re-sync when switching between records, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL (paste a Cloudinary/media URL)");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const ToolbarButton = ({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded p-2 text-ink/70 hover:bg-ink/5 ${active ? "bg-ink/10 text-ink" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-mist bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-mist bg-paper/50 p-2">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="YouTube" onClick={addYoutube}>
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

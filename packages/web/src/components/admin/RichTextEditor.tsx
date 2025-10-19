import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
  features?: {
    headings?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    lists?: boolean;
    links?: boolean;
    images?: boolean;
    code?: boolean;
  };
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  minHeight = "200px",
  maxHeight = "400px",
  features = {
    headings: true,
    bold: true,
    italic: true,
    underline: true,
    lists: true,
    links: true,
    images: true,
    code: true,
  },
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  };

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        {features.headings && (
          <>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text formatting */}
        {features.bold && (
          <Button
            type="button"
            variant={editor.isActive("bold") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
        )}
        {features.italic && (
          <Button
            type="button"
            variant={editor.isActive("italic") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
        )}
        {features.underline && (
          <Button
            type="button"
            variant={editor.isActive("underline") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className="h-4 w-4" />
          </Button>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        {features.lists && (
          <>
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Quote */}
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>

        {features.code && (
          <Button
            type="button"
            variant={editor.isActive("codeBlock") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="h-4 w-4" />
          </Button>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Links */}
        {features.links && (
          <>
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant={editor.isActive("link") ? "default" : "ghost"}
                  size="sm"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Link</DialogTitle>
                  <DialogDescription>
                    Enter the URL you want to link to.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsLinkDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addLink}>Add Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {editor.isActive("link") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeLink}
              >
                Remove Link
              </Button>
            )}
          </>
        )}

        {/* Images */}
        {features.images && (
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Image</DialogTitle>
                <DialogDescription>
                  Enter the URL of the image you want to add.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={addImage}>Add Image</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Editor Content */}
      <div
        className="p-4 prose prose-sm max-w-none focus:outline-none"
        style={{ minHeight, maxHeight, overflowY: "auto" }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

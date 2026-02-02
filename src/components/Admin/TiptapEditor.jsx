import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaTable,
  FaCode,
  FaFileCode,
} from "react-icons/fa";
import { Button, ButtonGroup } from "react-bootstrap";
import "./TiptapEditor.css";

const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="editor-menu-bar mb-2 p-2 border rounded bg-dark d-flex flex-wrap gap-2">
      <ButtonGroup size="sm">
        <Button
          variant={editor.isActive("bold") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <FaBold />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <FaItalic />
        </Button>
        <Button
          variant={editor.isActive("strike") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strike"
        >
          <FaStrikethrough />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="sm">
        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "light" : "outline-light"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="H2"
        >
          <FaHeading />2
        </Button>
        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "light" : "outline-light"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="H3"
        >
          <FaHeading />3
        </Button>
      </ButtonGroup>

      <ButtonGroup size="sm">
        <Button
          variant={editor.isActive("bulletList") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <FaListUl />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <FaListOl />
        </Button>
        <Button
          variant={editor.isActive("blockquote") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <FaQuoteRight />
        </Button>
        <Button
          variant={editor.isActive("code") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <FaCode />
        </Button>
        <Button
          variant={editor.isActive("codeBlock") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <FaFileCode />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="sm">
        <Button
          variant={editor.isActive("link") ? "light" : "outline-light"}
          onClick={setLink}
          title="Link"
        >
          <FaLink />
        </Button>
        <Button variant="outline-light" onClick={addImage} title="Image">
          <FaImage />
        </Button>
         <Button
          variant={editor.isActive("table") ? "light" : "outline-light"}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <FaTable />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="sm" className="ms-auto">
        <Button
          variant="outline-light"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <FaUndo />
        </Button>
        <Button
          variant="outline-light"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <FaRedo />
        </Button>
      </ButtonGroup>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Usage of codeBlockLowlight
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px]",
      },
    },
  });

  return (
    <div className="tiptap-editor-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-content p-3 border rounded bg-dark text-white" />
    </div>
  );
};

export default TiptapEditor;

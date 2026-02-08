"use client";

import { useState, useRef, useEffect } from "react";
import { generateId } from "@/lib/utils/id";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import { MediaPicker } from "./MediaPicker";
import { mockMedia } from "@/lib/admin/mock";
import { mockMatches } from "@/lib/admin/matchesData";
import type { NewsBlock, NewsBlockType } from "@/types/news";

type BlockEditorProps = {
  blocks: NewsBlock[];
  onBlocksChange: (blocks: NewsBlock[]) => void;
  disabled?: boolean;
};

const blockTypeLabels: Record<NewsBlockType, string> = {
  paragraph: "پاراگراف",
  heading: "عنوان",
  image: "تصویر",
  video: "ویدیو",
  gallery: "گالری",
  quote: "نقل قول",
  list: "لیست",
  table: "جدول",
  embed: "کد تعبیه",
  divider: "جداکننده",
  note: "یادداشت",
  report: "گزارش مسابقه",
};

const blockIcons: Record<NewsBlockType, string> = {
  paragraph: "¶",
  heading: "H",
  image: "🖼",
  video: "▶",
  gallery: "🖼🖼",
  quote: "❝",
  list: "•",
  table: "⊞",
  embed: "</>",
  divider: "─",
  note: "📝",
  report: "📊",
};

export function BlockEditor({ blocks, onBlocksChange, disabled = false }: BlockEditorProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const handleAddBlock = (type: NewsBlockType, afterBlockId?: string) => {
    const newBlock: NewsBlock = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
      order: afterBlockId
        ? (blocks.find((b) => b.id === afterBlockId)?.order ?? blocks.length) + 1
        : blocks.length,
    };

    const updatedBlocks = blocks.map((b) =>
      b.order >= newBlock.order ? { ...b, order: b.order + 1 } : b
    );

    onBlocksChange([...updatedBlocks, newBlock]);
    setEditingBlockId(newBlock.id);
  };

  const handleDeleteBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    const updatedBlocks = blocks
      .filter((b) => b.id !== blockId)
      .map((b) => (b.order > block.order ? { ...b, order: b.order - 1 } : b));

    onBlocksChange(updatedBlocks);
  };

  const handleUpdateBlock = (blockId: string, content: string) => {
    onBlocksChange(
      blocks.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
  };

  const handleDragStart = (blockId: string) => {
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetBlockId: string) => {
    if (!draggedBlockId || draggedBlockId === targetBlockId) {
      setDraggedBlockId(null);
      return;
    }

    const draggedBlock = blocks.find((b) => b.id === draggedBlockId);
    const targetBlock = blocks.find((b) => b.id === targetBlockId);

    if (!draggedBlock || !targetBlock) {
      setDraggedBlockId(null);
      return;
    }

    const updatedBlocks = blocks.map((b) => {
      if (b.id === draggedBlockId) {
        return { ...b, order: targetBlock.order };
      }
      if (draggedBlock.order < targetBlock.order) {
        if (b.order > draggedBlock.order && b.order <= targetBlock.order) {
          return { ...b, order: b.order - 1 };
        }
      } else {
        if (b.order >= targetBlock.order && b.order < draggedBlock.order) {
          return { ...b, order: b.order + 1 };
        }
      }
      return b;
    });

    onBlocksChange(updatedBlocks);
    setDraggedBlockId(null);
  };

  const handleBlockClick = (blockId: string, event: React.MouseEvent) => {
    if (disabled) return;
    setSelectedBlockId(blockId);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setToolbarPosition({ top: rect.top - 50, left: rect.left });
    setShowToolbar(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowToolbar(false);
        setSelectedBlockId(null);
      }
    };

    if (showToolbar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToolbar]);

  return (
    <div className="relative" dir="rtl" ref={editorRef}>
      {/* Floating Toolbar */}
      {showToolbar && selectedBlockId && !disabled && (
        <div
          className="fixed z-50 flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white p-1 shadow-lg"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setEditingBlockId(selectedBlockId);
              setShowToolbar(false);
            }}
            className="rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            title="ویرایش"
          >
            ویرایش
          </button>
          <div className="h-4 w-px bg-[var(--border)]" />
          <button
            type="button"
            onClick={() => {
              handleDeleteBlock(selectedBlockId);
              setShowToolbar(false);
            }}
            className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            title="حذف"
          >
            حذف
          </button>
          <div className="h-4 w-px bg-[var(--border)]" />
          <button
            type="button"
            onClick={() => {
              const block = blocks.find((b) => b.id === selectedBlockId);
              if (block) {
                handleAddBlock("paragraph", block.id);
              }
              setShowToolbar(false);
            }}
            className="rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            title="افزودن بلاک بعد"
          >
            + بعد
          </button>
        </div>
      )}

      {/* Main Toolbar - Sticky Top */}
      {!disabled && (
        <div className="sticky top-0 z-40 mb-4 rounded-lg border border-[var(--border)] bg-white p-2 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600">افزودن بلاک:</span>
            {Object.entries(blockTypeLabels).map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAddBlock(type as NewsBlockType)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand"
                title={label}
              >
                <span className="text-sm">{blockIcons[type as NewsBlockType]}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blocks Container */}
      <div className="space-y-3">
        {sortedBlocks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-[var(--border)] bg-slate-50 p-12 text-center">
            <p className="text-sm font-medium text-slate-600">هنوز بلاکی اضافه نشده است</p>
            <p className="mt-1 text-xs text-slate-500">
              برای شروع، یک بلاک از جعبه ابزار بالا انتخاب کنید
            </p>
          </div>
        ) : (
          sortedBlocks.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              isEditing={editingBlockId === block.id}
              isDragging={draggedBlockId === block.id}
              onEdit={() => {
                setEditingBlockId(block.id);
                setShowToolbar(false);
              }}
              onCancelEdit={() => {
                setEditingBlockId(null);
                setSelectedBlockId(null);
              }}
              onUpdate={(content) => handleUpdateBlock(block.id, content)}
              onDelete={() => handleDeleteBlock(block.id)}
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(block.id)}
              onClick={(e) => handleBlockClick(block.id, e)}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}

type BlockItemProps = {
  block: NewsBlock;
  isEditing: boolean;
  isDragging: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

function BlockItem({
  block,
  isEditing,
  isDragging,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onClick,
  disabled,
}: BlockItemProps) {
  if (isEditing) {
    return (
      <BlockEditorForm
        block={block}
        onSave={(content) => {
          onUpdate(content);
          onCancelEdit();
        }}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-lg border-2 border-transparent bg-white p-4 transition-all hover:border-brand/30 hover:shadow-sm ${
        isDragging ? "opacity-50" : ""
      } ${disabled ? "cursor-default" : ""}`}
    >
      <BlockPreview block={block} />
      {!disabled && (
        <div className="absolute left-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-6 w-6 cursor-move items-center justify-center rounded bg-slate-100 text-[10px] text-slate-500">
            ⋮⋮
          </div>
        </div>
      )}
    </div>
  );
}

function BlockPreview({ block }: { block: NewsBlock }) {
  try {
    const content = JSON.parse(block.content || "{}");

    switch (block.type) {
      case "paragraph":
        return (
          <p className="min-h-[24px] text-sm leading-7 text-slate-900">
            {content.text || <span className="text-slate-400">پاراگراف خالی...</span>}
          </p>
        );
      case "heading":
        const HeadingTag = `h${content.level || 2}` as keyof JSX.IntrinsicElements;
        const headingSizes = {
          1: "text-2xl",
          2: "text-xl",
          3: "text-lg",
          4: "text-base",
          5: "text-sm",
          6: "text-xs",
        };
        return (
          <HeadingTag className={`min-h-[24px] font-bold text-slate-900 ${headingSizes[content.level as keyof typeof headingSizes] || "text-xl"}`}>
            {content.text || <span className="text-slate-400">عنوان...</span>}
          </HeadingTag>
        );
      case "quote":
        return (
          <blockquote className="min-h-[24px] border-r-4 border-brand bg-slate-50 pr-4 py-3 italic text-slate-700">
            {content.text || <span className="text-slate-400">نقل قول...</span>}
            {content.author && (
              <cite className="mt-2 block text-xs text-slate-500">
                — {content.author}
              </cite>
            )}
          </blockquote>
        );
      case "list":
        const ListTag = content.type === "ordered" ? "ol" : "ul";
        return (
          <ListTag className="min-h-[24px] list-inside space-y-1 text-sm text-slate-900">
            {content.items && content.items.length > 0 ? (
              content.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))
            ) : (
              <li className="text-slate-400">آیتم لیست...</li>
            )}
          </ListTag>
        );
      case "divider":
        return <hr className="my-2 border-[var(--border)]" />;
      case "note":
        return (
          <div className="min-h-[24px] rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>یادداشت:</strong> {content.text || <span className="text-slate-400">یادداشت...</span>}
          </div>
        );
      case "image":
        const imageMedia = mockMedia.find((m) => m.id === content.mediaId);
        return (
          <figure className="min-h-[100px] rounded-lg border border-[var(--border)] bg-slate-50 p-3">
            {imageMedia ? (
              <div className="space-y-2">
                <div className="aspect-video w-full rounded bg-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-500">تصویر: {imageMedia.title}</span>
                </div>
                {content.caption && (
                  <figcaption className="text-xs text-slate-600">{content.caption}</figcaption>
                )}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                تصویر انتخاب نشده
              </div>
            )}
          </figure>
        );
      case "video":
        const videoMedia = mockMedia.find((m) => m.id === content.mediaId);
        return (
          <div className="min-h-[100px] rounded-lg border border-[var(--border)] bg-slate-50 p-3">
            {videoMedia ? (
              <div className="space-y-2">
                <div className="aspect-video w-full rounded bg-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-500">ویدیو: {videoMedia.title}</span>
                </div>
                {content.caption && (
                  <p className="text-xs text-slate-600">{content.caption}</p>
                )}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                ویدیو انتخاب نشده
              </div>
            )}
          </div>
        );
      case "gallery":
        return (
          <div className="min-h-[100px] rounded-lg border border-[var(--border)] bg-slate-50 p-3">
            {content.mediaIds && content.mediaIds.length > 0 ? (
              <div className="text-xs text-slate-600">
                گالری: {content.mediaIds.length} تصویر
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                گالری خالی است
              </div>
            )}
          </div>
        );
      case "table":
        return (
          <div className="min-h-[100px] overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
            {content.headers && content.headers.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-slate-50">
                    {content.headers.map((header: string, idx: number) => (
                      <th key={idx} className="px-3 py-2 text-right font-medium text-slate-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.rows && content.rows.length > 0 ? (
                    content.rows.map((row: string[], rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-[var(--border)]">
                        {row.map((cell: string, cellIdx: number) => (
                          <td key={cellIdx} className="px-3 py-2 text-slate-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={content.headers.length} className="px-3 py-4 text-center text-xs text-slate-400">
                        بدون سطر
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                جدول خالی است
              </div>
            )}
          </div>
        );
      case "embed":
        return (
          <div className="min-h-[100px] rounded-lg border border-dashed border-[var(--border)] bg-slate-50 p-3">
            {content.embedCode || content.url ? (
              <div className="text-xs text-slate-600">
                {content.type === "custom" ? "کد تعبیه سفارشی" : `کد تعبیه ${content.type}`}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                کد تعبیه وارد نشده
              </div>
            )}
          </div>
        );
      case "report":
        const reportMatch = mockMatches.find((m) => m.id === content.matchId);
        return (
          <div className="min-h-[100px] rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
            <div className="mb-2 text-xs font-bold text-blue-900">📊 گزارش مسابقه</div>
            {reportMatch ? (
              <div className="space-y-1 text-xs text-blue-800">
                <div>{reportMatch.homeTeam} vs {reportMatch.awayTeam}</div>
                {content.sections && content.sections.length > 0 && (
                  <div className="mt-2 text-slate-600">
                    {content.sections.length} بخش گزارش
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400">مسابقه انتخاب نشده</div>
            )}
          </div>
        );
      default:
        return (
          <div className="min-h-[24px] rounded-lg border border-dashed border-[var(--border)] bg-slate-50 p-3 text-center text-xs text-slate-500">
            [{blockTypeLabels[block.type]}]
          </div>
        );
    }
  } catch {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700">
        خطا در نمایش بلاک
      </div>
    );
  }
}

function BlockEditorForm({
  block,
  onSave,
  onCancel,
}: {
  block: NewsBlock;
  onSave: (content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(() => {
    try {
      return JSON.parse(block.content || "{}");
    } catch {
      return {};
    }
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);

  const handleSubmit = () => {
    onSave(JSON.stringify(content));
  };

  switch (block.type) {
    case "paragraph": {
      const textareaRef = useRef<HTMLTextAreaElement>(null);
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">پاراگراف</label>
          <TextFormattingToolbar
            textareaRef={textareaRef}
            value={content.text || ""}
            onChange={(text) => setContent({ ...content, text })}
          />
          <textarea
            ref={textareaRef}
            value={content.text || ""}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            rows={8}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm leading-7 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 resize-y"
            placeholder="متن پاراگراف را بنویسید..."
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );
    }

    case "heading":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">سطح</label>
              <select
                value={content.level || 2}
                onChange={(e) => setContent({ ...content, level: Number(e.target.value) })}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value={1}>سطح ۱ (بزرگ)</option>
                <option value={2}>سطح ۲</option>
                <option value={3}>سطح ۳</option>
                <option value={4}>سطح ۴</option>
              </select>
            </div>
          </div>
          <label className="mb-1 block text-xs font-medium text-slate-700">متن عنوان</label>
          <input
            type="text"
            value={content.text || ""}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="عنوان را وارد کنید..."
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">نقل قول</label>
          <textarea
            value={content.text || ""}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="متن نقل قول..."
            autoFocus
          />
          <input
            type="text"
            value={content.author || ""}
            onChange={(e) => setContent({ ...content, author: e.target.value })}
            className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="نویسنده (اختیاری)"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "list":
      const [items, setItems] = useState<string[]>(content.items || [""]);
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <label className="text-xs font-medium text-slate-700">نوع لیست:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setContent({ ...content, type: "unordered" })}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  content.type === "unordered"
                    ? "bg-brand text-white"
                    : "border border-[var(--border)] bg-white text-slate-700"
                }`}
              >
                نقطه‌ای
              </button>
              <button
                type="button"
                onClick={() => setContent({ ...content, type: "ordered" })}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  content.type === "ordered"
                    ? "bg-brand text-white"
                    : "border border-[var(--border)] bg-white text-slate-700"
                }`}
              >
                شماره‌دار
              </button>
            </div>
          </div>
          <label className="mb-2 block text-xs font-medium text-slate-700">آیتم‌ها</label>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = e.target.value;
                    setItems(newItems);
                    setContent({ ...content, items: newItems });
                  }}
                  className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder={`آیتم ${idx + 1}`}
                  autoFocus={idx === 0}
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== idx);
                      setItems(newItems);
                      setContent({ ...content, items: newItems });
                    }}
                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setItems([...items, ""]);
              }}
              className="w-full rounded-lg border border-dashed border-[var(--border)] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              + افزودن آیتم
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">تصویر</label>
          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            className="w-full rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {content.mediaId ? `انتخاب شده: ${content.mediaId}` : "انتخاب تصویر"}
          </button>
          <MediaPicker
            isOpen={showImagePicker}
            onClose={() => setShowImagePicker(false)}
            onSelect={(media) => {
              setContent({ ...content, mediaId: media.id });
              setShowImagePicker(false);
            }}
            allowedTypes={["image"]}
            title="انتخاب تصویر"
          />
          <input
            type="text"
            value={content.caption || ""}
            onChange={(e) => setContent({ ...content, caption: e.target.value })}
            className="mt-3 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="توضیحات تصویر (اختیاری)"
          />
          <input
            type="text"
            value={content.alt || ""}
            onChange={(e) => setContent({ ...content, alt: e.target.value })}
            className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="متن جایگزین (Alt Text)"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setContent({ ...content, alignment: "left" })}
              className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
                content.alignment === "left"
                  ? "bg-brand text-white"
                  : "border border-[var(--border)] bg-white text-slate-700"
              }`}
            >
              چپ
            </button>
            <button
              type="button"
              onClick={() => setContent({ ...content, alignment: "center" })}
              className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
                content.alignment === "center"
                  ? "bg-brand text-white"
                  : "border border-[var(--border)] bg-white text-slate-700"
              }`}
            >
              وسط
            </button>
            <button
              type="button"
              onClick={() => setContent({ ...content, alignment: "right" })}
              className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
                content.alignment === "right"
                  ? "bg-brand text-white"
                  : "border border-[var(--border)] bg-white text-slate-700"
              }`}
            >
              راست
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">ویدیو</label>
          <button
            type="button"
            onClick={() => setShowVideoPicker(true)}
            className="w-full rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {content.mediaId ? `انتخاب شده: ${content.mediaId}` : "انتخاب ویدیو"}
          </button>
          <MediaPicker
            isOpen={showVideoPicker}
            onClose={() => setShowVideoPicker(false)}
            onSelect={(media) => {
              setContent({ ...content, mediaId: media.id });
              setShowVideoPicker(false);
            }}
            allowedTypes={["video"]}
            title="انتخاب ویدیو"
          />
          <input
            type="text"
            value={content.caption || ""}
            onChange={(e) => setContent({ ...content, caption: e.target.value })}
            className="mt-3 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="توضیحات ویدیو (اختیاری)"
          />
          <label className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.autoplay || false}
              onChange={(e) => setContent({ ...content, autoplay: e.target.checked })}
              className="rounded border-[var(--border)] text-brand"
            />
            <span className="text-xs text-slate-700">پخش خودکار</span>
          </label>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "gallery":
      const [galleryItems, setGalleryItems] = useState<string[]>(content.mediaIds || []);
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">گالری تصاویر</label>
          <div className="mb-3 space-y-2">
            {galleryItems.map((mediaId, idx) => (
              <div key={idx} className="flex gap-2">
                <select
                  value={mediaId}
                  onChange={(e) => {
                    const newItems = [...galleryItems];
                    newItems[idx] = e.target.value;
                    setGalleryItems(newItems);
                    setContent({ ...content, mediaIds: newItems });
                  }}
                  className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="">انتخاب تصویر...</option>
                  {mockMedia
                    .filter((m) => m.type === "image")
                    .map((media) => (
                      <option key={media.id} value={media.id}>
                        {media.title}
                      </option>
                    ))}
                </select>
                {galleryItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = galleryItems.filter((_, i) => i !== idx);
                      setGalleryItems(newItems);
                      setContent({ ...content, mediaIds: newItems });
                    }}
                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setGalleryItems([...galleryItems, ""]);
              }}
              className="w-full rounded-lg border border-dashed border-[var(--border)] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              + افزودن تصویر
            </button>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">چیدمان</label>
              <select
                value={content.layout || "grid"}
                onChange={(e) => setContent({ ...content, layout: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="grid">شبکه‌ای</option>
                <option value="carousel">کاروسل</option>
              </select>
            </div>
            {content.layout === "grid" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">تعداد ستون</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={content.columns || 3}
                  onChange={(e) => setContent({ ...content, columns: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "table":
      const [tableHeaders, setTableHeaders] = useState<string[]>(content.headers || ["ستون ۱", "ستون ۲"]);
      const [tableRows, setTableRows] = useState<string[][]>(content.rows || [["", ""]]);
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">جدول</label>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-slate-700">سرستون‌ها</label>
            <div className="flex gap-2">
              {tableHeaders.map((header, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={header}
                  onChange={(e) => {
                    const newHeaders = [...tableHeaders];
                    newHeaders[idx] = e.target.value;
                    setTableHeaders(newHeaders);
                    setContent({ ...content, headers: newHeaders });
                  }}
                  className="flex-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder={`ستون ${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const newHeaders = [...tableHeaders, `ستون ${tableHeaders.length + 1}`];
                  setTableHeaders(newHeaders);
                  setContent({ ...content, headers: newHeaders });
                  setTableRows(tableRows.map((row) => [...row, ""]));
                }}
                className="rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-3 space-y-2">
            <label className="block text-xs font-medium text-slate-700">سطرها</label>
            {tableRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2">
                {row.map((cell, cellIdx) => (
                  <input
                    key={cellIdx}
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const newRows = [...tableRows];
                      newRows[rowIdx][cellIdx] = e.target.value;
                      setTableRows(newRows);
                      setContent({ ...content, rows: newRows });
                    }}
                    className="flex-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder={`سلول ${rowIdx + 1}-${cellIdx + 1}`}
                  />
                ))}
                {tableRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newRows = tableRows.filter((_, i) => i !== rowIdx);
                      setTableRows(newRows);
                      setContent({ ...content, rows: newRows });
                    }}
                    className="rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setTableRows([...tableRows, new Array(tableHeaders.length).fill("")]);
              }}
              className="w-full rounded-lg border border-dashed border-[var(--border)] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              + افزودن سطر
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "embed":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">کد تعبیه</label>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-slate-700">نوع</label>
            <select
              value={content.type || "custom"}
              onChange={(e) => setContent({ ...content, type: e.target.value, embedCode: "" })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="youtube">یوتیوب</option>
              <option value="twitter">توییتر</option>
              <option value="instagram">اینستاگرام</option>
              <option value="custom">سفارشی</option>
            </select>
          </div>
          {content.type === "custom" ? (
            <textarea
              value={content.embedCode || ""}
              onChange={(e) => setContent({ ...content, embedCode: e.target.value })}
              rows={4}
              className="mb-3 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="کد HTML را وارد کنید..."
            />
          ) : (
            <input
              type="text"
              value={content.url || ""}
              onChange={(e) => setContent({ ...content, url: e.target.value })}
              className="mb-3 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="لینک را وارد کنید..."
            />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "note":
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">یادداشت</label>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-slate-700">نوع یادداشت</label>
            <select
              value={content.type || "journalist"}
              onChange={(e) => setContent({ ...content, type: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="journalist">یادداشت خبرنگار</option>
              <option value="analysis">تحلیل</option>
              <option value="internal">یادداشت داخلی</option>
            </select>
          </div>
          <textarea
            value={content.text || ""}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            rows={6}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="متن یادداشت را بنویسید..."
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    case "report":
      const [reportSections, setReportSections] = useState<Array<{ title: string; content: string }>>(
        content.sections || [{ title: "", content: "" }]
      );
      const [selectedMatchId, setSelectedMatchId] = useState(content.matchId || "");
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">گزارش مسابقه</label>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-slate-700">مسابقه</label>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setContent({ ...content, matchId: e.target.value });
              }}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">انتخاب مسابقه...</option>
              {mockMatches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.homeTeam} vs {match.awayTeam} - {match.date}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 space-y-3">
            <label className="block text-xs font-medium text-slate-700">بخش‌های گزارش</label>
            {reportSections.map((section, idx) => (
              <div key={idx} className="rounded-lg border border-[var(--border)] bg-slate-50 p-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...reportSections];
                    newSections[idx].title = e.target.value;
                    setReportSections(newSections);
                    setContent({ ...content, sections: newSections });
                  }}
                  className="mb-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder={`عنوان بخش ${idx + 1}`}
                />
                <textarea
                  value={section.content}
                  onChange={(e) => {
                    const newSections = [...reportSections];
                    newSections[idx].content = e.target.value;
                    setReportSections(newSections);
                    setContent({ ...content, sections: newSections });
                  }}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="محتوا..."
                />
                {reportSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSections = reportSections.filter((_, i) => i !== idx);
                      setReportSections(newSections);
                      setContent({ ...content, sections: newSections });
                    }}
                    className="mt-2 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    حذف بخش
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setReportSections([...reportSections, { title: "", content: "" }]);
              }}
              className="w-full rounded-lg border border-dashed border-[var(--border)] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              + افزودن بخش
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className="rounded-lg border-2 border-brand bg-white p-4">
          <p className="mb-3 text-sm text-slate-600">
            ویرایشگر برای این نوع بلاک در حال توسعه است
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            بستن
          </button>
        </div>
      );
  }
}

function getDefaultContent(type: NewsBlockType): string {
  switch (type) {
    case "paragraph":
      return JSON.stringify({ text: "" });
    case "heading":
      return JSON.stringify({ level: 2, text: "" });
    case "quote":
      return JSON.stringify({ text: "", author: "" });
    case "list":
      return JSON.stringify({ type: "unordered", items: [""] });
    case "divider":
      return JSON.stringify({});
    case "note":
      return JSON.stringify({ text: "", type: "journalist" });
    case "image":
      return JSON.stringify({ mediaId: "", caption: "", alt: "", alignment: "center" });
    case "video":
      return JSON.stringify({ mediaId: "", caption: "", autoplay: false });
    case "gallery":
      return JSON.stringify({ mediaIds: [], layout: "grid", columns: 3 });
    case "table":
      return JSON.stringify({ headers: ["ستون ۱", "ستون ۲"], rows: [["", ""]] });
    case "embed":
      return JSON.stringify({ type: "custom", embedCode: "", url: "" });
    case "report":
      return JSON.stringify({ matchId: "", sections: [{ title: "", content: "" }] });
    default:
      return JSON.stringify({});
  }
}

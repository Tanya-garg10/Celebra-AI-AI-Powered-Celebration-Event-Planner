import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  isUser?: boolean;
}

// Parses inline tokens: **bold**, *italic*, `code`
export const renderInline = (text: string, isUser: boolean = false): React.ReactNode[] => {
  if (!text) return [];

  // Match bold (**...**), italic (*...*), or inline code (`...`)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-bold ${isUser ? 'text-white' : 'text-stone-900'}`}
        >
          {inner}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {inner}
        </em>
      );
    }

    // Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
            isUser ? 'bg-stone-800 text-rose-200' : 'bg-stone-200/70 text-purple-900'
          }`}
        >
          {inner}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content, isUser = false }) => {
  if (!content) return null;

  // Split into lines
  const rawLines = content.split('\n');

  // Group lines into blocks (paragraphs, lists, headings, quotes)
  type Block =
    | { type: 'heading'; level: number; text: string }
    | { type: 'ordered-list'; items: string[] }
    | { type: 'unordered-list'; items: string[] }
    | { type: 'blockquote'; text: string }
    | { type: 'paragraph'; text: string };

  const blocks: Block[] = [];
  let currentList: { type: 'ordered-list' | 'unordered-list'; items: string[] } | null = null;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentParagraphLines.join(' ').trim()
      });
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check heading: #, ##, ###, ####
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      continue;
    }

    // Check Blockquote: > text
    if (line.startsWith('>')) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'blockquote',
        text: line.replace(/^>\s*/, '')
      });
      continue;
    }

    // Check Ordered list item: e.g. 1. text or 1) text
    const orderedMatch = line.match(/^\d+[\.\)]\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ordered-list') {
        flushList();
        currentList = { type: 'ordered-list', items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    // Check Unordered list item: - text, * text, • text
    const unorderedMatch = line.match(/^[\-\*\•]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'unordered-list') {
        flushList();
        currentList = { type: 'unordered-list', items: [] };
      }
      currentList.items.push(unorderedMatch[1]);
      continue;
    }

    // Regular text line
    if (currentList) {
      flushList();
    }
    currentParagraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return (
    <div className="space-y-2 text-xs leading-relaxed text-left">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div
              key={idx}
              className={`font-serif font-bold ${
                isUser ? 'text-white' : 'text-stone-900'
              } ${
                block.level <= 2
                  ? 'text-sm sm:text-base mt-2.5 mb-1.5 border-b border-stone-200/60 pb-1'
                  : 'text-xs sm:text-sm mt-2 mb-1 text-purple-950 font-bold'
              }`}
            >
              {renderInline(block.text, isUser)}
            </div>
          );
        }

        if (block.type === 'ordered-list') {
          return (
            <ol key={idx} className="space-y-2 my-2 pl-0.5">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span
                    className={`shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shadow-2xs ${
                      isUser
                        ? 'bg-stone-800 text-stone-200'
                        : 'bg-purple-100 text-purple-900 border border-purple-200'
                    }`}
                  >
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    {renderInline(item, isUser)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'unordered-list') {
          return (
            <ul key={idx} className="space-y-1.5 my-1.5 pl-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2">
                  <span
                    className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                      isUser ? 'bg-rose-300' : 'bg-purple-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    {renderInline(item, isUser)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={idx}
              className={`p-2.5 rounded-xl border-l-3 my-1.5 text-xs italic ${
                isUser
                  ? 'border-purple-300 bg-stone-800/80 text-stone-200'
                  : 'border-purple-600 bg-purple-50/70 text-purple-950'
              }`}
            >
              {renderInline(block.text, isUser)}
            </blockquote>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(block.text, isUser)}
          </p>
        );
      })}
    </div>
  );
};

// import React, { useEffect, useState } from 'react';

// interface TocItem {
//   level: number;
//   text: string;
//   slug: string;
// }

// interface TableOfContentsProps {
//   content: string;
// }

// const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
//   const [toc, setToc] = useState<TocItem[]>([]);

//   useEffect(() => {
//     const headings = (content || "").match(/(#{1,6})\s+(.+)/g) || [];
//     const tocItems = headings.map((heading) => {
//       const level = heading.match(/#{1,6}/)?.[0].length || 0;
//       const text = heading.replace(/#{1,6}\s+/, '');
//       const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
//       return { level, text, slug };
//     });
//     setToc(tocItems);
//   }, [content]);

//   return (
//     <nav className="toc">
//       <h2 className="text-xl font-bold mb-4">목차</h2>
//       <ul className="space-y-2">
//         {toc.map((item, index) => (
//           <li key={index} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
//             <a href={`#${item.slug}`} className="text-blue-600 hover:underline">
//               {item.text}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default TableOfContents;

import React from 'react';

interface TOCItem {
  level: number;
  content: string;
  id: string;
}

interface TableOfContentsProps {
  markdown: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ markdown = '' }) => {
  const parseMarkdown = (text: string): TOCItem[] => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const toc: TOCItem[] = [];

    lines.forEach(line => {
      if (line.startsWith('#')) {
        const level = line.split(' ')[0].length;
        const content = line.substring(level + 1).trim();
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        toc.push({ level, content, id });
      }
    });

    return toc;
  };

  const renderTOC = (items: TOCItem[]) => {
    return (
      <ul className="list-none pl-0">
        {items.map((item, index) => (
          <li key={index} className={`pl-${item.level * 4}`}>
            <a href={`#${item.id}`} className="text-blue-600 hover:underline">
              {item.content}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const tocItems = parseMarkdown(markdown);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">목차</h2>
      {renderTOC(tocItems)}
    </div>
  );
};

export default TableOfContents;
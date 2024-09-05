import React, { useEffect, useState } from 'react';

interface TocItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = (content || "").match(/(#{1,6})\s+(.+)/g) || [];
    const tocItems = headings.map((heading) => {
      const level = heading.match(/#{1,6}/)?.[0].length || 0;
      const text = heading.replace(/#{1,6}\s+/, '');
      const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      return { level, text, slug };
    });
    setToc(tocItems);
  }, [content]);

  return (
    <nav className="toc">
      <h2 className="text-xl font-bold mb-4">목차</h2>
      <ul className="space-y-2">
        {toc.map((item, index) => (
          <li key={index} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
            <a href={`#${item.slug}`} className="text-blue-600 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
import React, { useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import prism from 'remark-prism';
import Prism from 'prismjs';
import gfm from 'remark-gfm';
import { GetStaticProps, GetStaticPaths } from 'next';
import slugify from 'slugify';
import { Node } from 'unist';
import { Parent } from 'unist';
import { Heading } from 'mdast';
import Giscus from '../../components/Giscus';

interface TOCItem {
  level: number;
  content: string;
  id: string;
}

interface PostData {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  contentHtml: string;
}

interface PostProps {
  postData: PostData;
}

const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const parseMarkdown = (text: string): TOCItem[] => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const toc: TOCItem[] = [];

    lines.forEach(line => {
      if (line.startsWith('#')) {
        const level = line.split(' ')[0].length;
        const content = line.substring(level + 1).trim();
        const id = slugify(content, { lower: true, strict: true });

        toc.push({ level, content, id });
      }
    });

    return toc;
  };

  const renderTOCItem = (item: TOCItem) => {
    const indent = (item.level - 2) * 1.2;
    
    return (
      <li
        key={item.id}
        style={{
          marginLeft: `${indent}rem`,
          fontSize: `0.9rem`,
          marginBottom: '0.2rem'
        }}
      >
        <a
          href={`#${item.id}`}
          className="underline"
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item.id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {item.content}
        </a>
      </li>
    );
  };

  const tocItems = parseMarkdown(content);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className="bg-gray-100 p-4 rounded-lg mb-6">
      <ul className="list-none pl-0">
        {tocItems.map(renderTOCItem)}
      </ul>
    </nav>
  );
};

export default function Post({ postData }: PostProps): JSX.Element {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <Link href="/">
        <p className="text-gray-500 hover:underline mb-4 inline-block text-sm">&larr; Back to posts</p>
      </Link>
      <h1 className="text-2xl font-bold mb-2">{postData.title}</h1>
      <div className="text-gray-600 mb-4 text-xs">
        <span>{postData.date}</span> • <span>{postData.category}</span>
      </div>
      <TableOfContents content={postData.content} />
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <div className="mt-8">
        <Giscus />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { id: filename.replace(/\.md$/, '') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fullPath = path.join(postsDirectory, `${params?.id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(gfm)
    .use(() => (tree: Node) => {
      const visit = (node: Node) => {
        if (node.type === 'heading') {
          const headingNode = node as Heading;
          const headingContent = (headingNode.children as Array<{ value: string }>)
            .map(child => child.value)
            .join('');
          const id = slugify(headingContent, { lower: true, strict: true });
          headingNode.data = headingNode.data || {};
          headingNode.data.hProperties = headingNode.data.hProperties || {};
          headingNode.data.hProperties.id = id;
        }
        if ('children' in node) {
          (node as Parent).children.forEach(visit);
        }
      };
      visit(tree);
    })
    .use(html, { sanitize: false })
    .use(prism)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      postData: {
        id: params?.id as string,
        contentHtml,
        content: matterResult.content,
        ...(matterResult.data as Omit<PostData, 'id' | 'contentHtml' | 'content'>),
      },
    },
  };
};
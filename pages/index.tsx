import React, { useState, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';

interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  thumbnail: string; 
}

interface BlogWithMarkdownProps {
  posts: Post[];
}

export default function BlogWithMarkdown({ posts }: BlogWithMarkdownProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...new Set(posts.map(post => post.category))], [posts]);

  const filteredPosts = useMemo(() =>
    selectedCategory === 'All' ? posts : posts.filter(post => post.category === selectedCategory),
    [selectedCategory, posts]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`mr-4 mb-2 text-sm font-medium ${
              selectedCategory === category
                ? 'text-blue-800 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      <main>
        {filteredPosts.map(post => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <article className="flex items-center pb-2 border-b border-gray-200 last:border-b-0">
              <div className='flex flex-row'>
                <h2 className="text-sm font-semibold text-gray-900 hover:text-blue-800 transition-colors duration-200 mb-1">
                  {post.title}
                </h2>
                {/* <div className="flex items-center text-xs text-gray-500">
                  {post.date}
                </div> */}
              </div>
            </article>
          </Link>
        ))}
      </main>
    </div>
  );
}
export const getStaticProps: GetStaticProps<BlogWithMarkdownProps> = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename): Post => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      category: data.category,
      thumbnail: data.thumbnail 
    };
  });

  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      posts: sortedPosts,
    },
  };
};
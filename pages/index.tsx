import React, { useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { GetStaticProps } from 'next';

interface Post {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  content: string;
}

interface BlogWithMarkdownProps {
  posts: Post[];
}

export default function BlogWithMarkdown({ posts }: BlogWithMarkdownProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(posts.map(post => post.category))];

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } rounded`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="space-y-0">
        {filteredPosts.map(post => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="border-gray-200 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-md font-semibold text-gray-800">{post.title}</h2>
                  {/* <p className="text-sm text-gray-600 mt-1">{post.subtitle}</p> */}
                </div>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<BlogWithMarkdownProps> = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename): Post => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title,
      subtitle: data.subtitle || '',
      date: data.date,
      category: data.category,
      content: content
    };
  });

  // 날짜순으로 게시물 정렬
  const sortedPosts = posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return {
    props: {
      posts: sortedPosts,
    },
  };
};
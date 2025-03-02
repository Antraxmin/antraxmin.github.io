import React, { useState, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Profile from '../components/Profile';

interface Post {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  thumbnail: string; 
}

interface BlogWithMarkdownProps {
  posts: Post[];
}


export default function BlogWithMarkdown({ posts }: BlogWithMarkdownProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map(post => post.category)));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return selectedCategory
      ? posts.filter(post => post.category === selectedCategory)
      : posts;
  }, [posts, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto">
        <Profile />
        {/* <div className="mt-8 mb-4">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              className={`px-2 py-0.5 text-xs rounded-full ${
                selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-2 py-0.5 text-xs rounded-full ${
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div> */}
        <main>
          {filteredPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <article className="py-2 group flex items-center">
                <div className="flex-grow">
                  <h2 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <span>{post.date}</span>
                    {/* <span className="mx-2">·</span> */}
                    {/* <span>{post.category}</span> */}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </main>
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
    const { data } = matter(fileContents);

    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title,
      subtitle: data.subtitle,
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
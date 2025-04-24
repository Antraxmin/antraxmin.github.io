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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return selectedCategory
      ? posts.filter(post => post.category === selectedCategory)
      : posts;
  }, [posts, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-4xl mx-auto">
        <Profile />
        <div className="mt-8 mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All ({posts.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({categoryCounts[category] || 0})
              </button>
            ))}
          </div>
        </div>
        
        <main>
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Link href={`/posts/${post.id}`} key={post.id} className="block">
                <article className="py-2 group flex items-start hover:bg-gray-50 transition-colors rounded-md -mx-3 px-3">
                  <div className="hidden md:block flex-shrink-0 mr-6 w-44 h-28 overflow-hidden rounded border border-gray-100">
                    {post.thumbnail ? (
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h2 className="text-base md:text-[20px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-xs md:text-sm text-gray-500 mt-2">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
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
      subtitle: data.subtitle || '',
      date: data.date,
      category: data.category,
      thumbnail: data.thumbnail || ''
    };
  });

  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      posts: sortedPosts,
    },
  };
};
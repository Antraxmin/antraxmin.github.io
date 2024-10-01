import React, { useState, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { Calendar, Clock, GithubIcon, Mail, Tag, Twitter } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto">
        <Profile />
        </div>
        <main>
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <article className="py-4 group flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1 text-gray-400" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md ml-2 text-xs">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
              {/* {index < posts.length - 1 && <hr className="border-gray-200" />} */}
            </React.Fragment>
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
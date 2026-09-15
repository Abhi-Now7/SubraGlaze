import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/blogs').then(res => setBlogs(res.data));
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Read stories from around the world.
          </h1>
          <p className="mt-4 text-xl text-ink/60">
            Discover passionate writers and deep insights.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map(blog => (
            <article key={blog.id} className="flex flex-col overflow-hidden rounded-xl border border-stone/50 bg-paper/50 hover:bg-paper transition-colors duration-300">
              <div className="flex-1 bg-paper p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ochre/60">
                    <span className="hover:text-ochre hover:underline">Blog</span>
                  </p>
                  <Link to={`/blog/${blog.id}`} className="block mt-2">
                    <p className="text-xl font-semibold text-ink line-clamp-2">{blog.title}</p>
                    <p className="mt-3 text-base text-ink/60 line-clamp-3">{blog.content}</p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">{blog.author_name}</span>
                  </div>
                  <div className="ml-3 text-sm font-medium text-ink/70">
                    {blog.author_name}
                  </div>
                  <div className="ml-auto text-sm text-ink/50">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
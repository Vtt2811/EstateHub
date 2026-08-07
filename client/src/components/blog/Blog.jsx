import React, { useState } from "react";
import { BLOGS } from '../properties/data';

const Blogs = () => {
    const [expandedBlog, setExpandedBlog] = useState(null);

    const handleToggle = (title) => {
        setExpandedBlog(expandedBlog === title ? null : title);
    };

    return (
        <section className='max-padd-container py-16 xl:py-28'>
            <h2 className='text-4xl font-bold text-center mb-12'>Our Expert Blogs</h2>
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {BLOGS.map((blog) => (
                    <div key={blog.title} className='relative bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden'>
                        <img src={blog.image} alt={blog.title} className='w-full h-64 object-cover'/>
                        <div className='absolute top-0 left-0 h-full w-full bg-black/50 flex flex-col justify-end p-4'>
                            <h3 className='text-white text-xl font-bold'>{blog.title}</h3>
                            <p className='text-gray-200'>{blog.category}</p>
                            <button
                                className='bg-white px-4 py-2 rounded-lg mt-2 hover:bg-gray-200'
                                onClick={() => handleToggle(blog.title)}
                            >
                                {expandedBlog === blog.title ? 'Show Less' : 'Continue Reading'}
                            </button>
                            {expandedBlog === blog.title && (
                                <div className='mt-4 text-white'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Blogs;

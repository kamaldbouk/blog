import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Technology from '../pages/img/Technology.jpg';
import Lifestyle from '../pages/img/Lifestyle.jpg';
import Travel from '../pages/img/Travel.jpg';
import Food from '../pages/img/Food.jpg';
import Education from '../pages/img/Education.jpg';
import Health from '../pages/img/Health.jpg';
import Entertainment from '../pages/img/Entertainment.jpg';
import Sports from '../pages/img/Sports.jpg';
import DefaultImage from '../pages/img/blog.jpg';
import icon from '../pages/img/icon.jpg';
import { useAuthContext } from '../context/AuthContext'; 

const Blog = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [refresh, setRefresh] = useState(false); 
    const [voteError, setVoteError] = useState(''); 
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogs/${id}`);
                const data = await response.json();
                setBlog(data);
                setComments(data.comments || []);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [id, refresh]); 

    const categoryImages = {
        technology: Technology,
        lifestyle: Lifestyle,
        travel: Travel,
        food: Food,
        education: Education,
        health: Health,
        entertainment: Entertainment,
        sports: Sports,
    };
    const category = blog ? blog.category : 'Other';
    
    const imageSrc = categoryImages[category] || DefaultImage;

    const handleUpvote = async () => {
        if (!user) {
            setVoteError('You need to be logged in to vote.');
            return;
        }
    
        try {
            const response = await fetch(`/api/blogs/${id}/upvote`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                const updatedBlog = await response.json();
                setBlog(updatedBlog);
                setVoteError(''); 
            } else {
                const errorData = await response.json();
                setVoteError(errorData.error);
            }
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };
    
    const handleDownvote = async () => {
        if (!user) {
            setVoteError('You need to be logged in to vote.');
            return;
        }
    
        try {
            const response = await fetch(`/api/blogs/${id}/downvote`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                const updatedBlog = await response.json();
                setBlog(updatedBlog);
                setVoteError(''); 
            } else {
                const errorData = await response.json();
                setVoteError(errorData.error); 
            }
        } catch (error) {
            console.error('Error downvoting:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setCommentError('You need to be logged in to comment.');
            return;
        }

        if (commentText.trim() === '') return;

        try {
            const response = await fetch(`/api/blogs/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: user.name, text: commentText }),
            });
            if (response.ok) {
                setCommentText('');
                setRefresh(prev => !prev); 
                setCommentError(''); 
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-container">
            <div className='blog-header'>
                <img src={imageSrc} alt='Blog Header'/>
                <h1>{blog.title}</h1>
                <h3>Published by: {blog.author} <span className="secondary-text">{new Date(blog.createdAt).toLocaleDateString()}</span></h3>
                <h4>{blog.description}</h4>
            </div>
            <div className='blog-info'>
                <p>{blog.content}</p>
            </div>
            <div className='comment-section'>
                <div className='comment-header'>
                    <h3>Comment Section</h3>
                    <div className="vote-section-container">
                        {voteError && <p className="error-message">{voteError}</p>}
                        <div className="vote-section">
                            <div className="vote-button upvote" onClick={handleUpvote}></div>
                            <div className="vote-count">{blog.total}</div>
                            <div className="vote-button downvote" onClick={handleDownvote}></div>
                        </div>
                    </div>
                </div>
                {commentError && <p className="error-message2">{commentError}</p>}
                <div className="comment-input-container">
                    <img src={icon} alt="icon"/>
                    <form onSubmit={handleCommentSubmit}>
                        <input 
                            type='text' 
                            className='comment-here' 
                            placeholder='Add a comment...' 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type='submit' className='post-comment'>Post</button>
                    </form>
                </div>
                <div className='comments-list'>
                    {comments.map((comment, index) => (
                        <div className='comment-item' key={index}>
                            <img src={icon} alt='icon'/>
                            <div>
                                <span>{comment.name}</span>
                                <p>{comment.text}</p>
                                <span className='comment-date'>{new Date(comment.postedOn).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;

import React, { useState, useEffect } from 'react';

export default function CommentSection({ sampleId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(${import.meta.env.VITE_API_URL}/samples/${sampleId});
        const data = await res.json();
        if (data && data.comments) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
    if (sampleId) fetchComments();
  }, [sampleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(${import.meta.env.VITE_API_URL}/samples/${sampleId}/comments, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, user: 'Isuli' })
      });
      
      const updatedSample = await res.json();
      if (res.ok) {
        setComments(updatedSample.comments || []);
        setText('');
      } else {
        alert(updatedSample.error || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section mt-4 p-3 border-t">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      
      <div className="comments-list space-y-2 mb-4 max-h-48 overflow-y-auto">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded border text-sm">
              <div className="flex justify-between font-bold text-xs text-gray-600 mb-1">
                <span>{comment.user || 'Isuli'}</span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
        )}
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 border rounded text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
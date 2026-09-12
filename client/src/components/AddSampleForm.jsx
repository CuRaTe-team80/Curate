import { useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/samples';

function AddSampleForm({ boardId, onSampleAdded }) {
  const [type, setType] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const content = type === 'image' ? imagePreview : textContent.trim();
    if (!content) {
      setError('Please provide content before adding a sample.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type, boardId: boardId || null }),
      });
      if (!response.ok) throw new Error('Failed to add sample');
      const newSample = await response.json();

      setTextContent('');
      setImagePreview(null);
      if (onSampleAdded) onSampleAdded(newSample);
    } catch (err) {
      setError('Could not add sample. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button type="button" className={`btn ${type === 'text' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setType('text')}>Text</button>
        <button type="button" className={`btn ${type === 'image' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setType('image')}>Image</button>
      </div>

      {type === 'text' ? (
        <textarea className="input" placeholder="Type a sample to label..." value={textContent} onChange={(e) => setTextContent(e.target.value)} rows={3} />
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '160px', marginTop: 'var(--space-2)', borderRadius: 'var(--radius-md)' }} />}
        </div>
      )}

      {error && <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', margin: 0 }}>{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add sample'}
      </button>
    </form>
  );
}

export default AddSampleForm;
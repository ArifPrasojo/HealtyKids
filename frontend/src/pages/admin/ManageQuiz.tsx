import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizData {
  id: number;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
}

const ManageQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env?.VITE_API_URL;
  const API_URL = `${API_BASE_URL}/admin/quiz`;

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setQuiz(result.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
          duration: Number(quiz.duration),
          isActive: quiz.isActive
        }),
      });
      const result = await response.json();
      if (result.success) alert("Quiz updated successfully!");
    } catch (error) {
      alert("Failed to update quiz");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Quiz Settings</h1>
      <form onSubmit={handleUpdateQuiz} className="space-y-4 max-w-lg">
        <div>
          <label className="block">Title</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded"
            value={quiz?.title || ''} 
            onChange={e => setQuiz({...quiz!, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block">Duration (Minutes)</label>
          <input 
            type="number" 
            className="w-full border p-2 rounded"
            value={quiz?.duration || 0} 
            onChange={e => setQuiz({...quiz!, duration: parseInt(e.target.value)})}
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={quiz?.isActive} 
            onChange={e => setQuiz({...quiz!, isActive: e.target.checked})}
          />
          <label>Is Active</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
          <button 
            type="button" 
            onClick={() => navigate(`/admin/managequiz/${quiz?.id}/questions`)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Manage Questions
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageQuiz;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Gunakan dua kali ../ bukan tiga kali
import { quizService } from '../../services/api/quizService';
import type { QuizData } from '../../services/api/quizService';

const ManageQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const result = await quizService.getQuiz();
      if (result.success) {
        setQuiz(result.data);
      }
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
      const result = await quizService.updateQuiz(quiz);
      if (result.success) {
        alert("Quiz updated successfully!");
      }
    } catch (error) {
      alert("Failed to update quiz");
      console.error(error);
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
            onChange={e => setQuiz(prev => prev ? {...prev, title: e.target.value} : null)}
          />
        </div>
        <div>
          <label className="block">Duration (Minutes)</label>
          <input 
            type="number" 
            className="w-full border p-2 rounded"
            value={quiz?.duration || 0} 
            onChange={e => setQuiz(prev => prev ? {...prev, duration: parseInt(e.target.value)} : null)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={quiz?.isActive || false} 
            onChange={e => setQuiz(prev => prev ? {...prev, isActive: e.target.checked} : null)}
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
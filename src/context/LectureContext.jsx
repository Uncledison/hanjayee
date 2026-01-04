import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LectureContext = createContext();

export const LectureProvider = ({ children }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setLectures(data || []);
    } catch (err) {
      console.error('Error fetching lectures:', err);
      setError(err && err.message ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addLecture = async (lecture) => {
    try {
      // Remove 'id' if passing in a temporary one, let DB handle it
      const { id, ...lectureData } = lecture;

      const { data, error } = await supabase
        .from('lectures')
        .insert([lectureData])
        .select();

      if (error) throw error;
      if (data) {
        setLectures(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error('Error adding lecture:', err);
      alert('일정 저장 중 오류가 발생했습니다.');
    }
  };

  const updateLecture = async (id, updatedFields) => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .update(updatedFields)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setLectures(prev => prev.map(l => l.id === id ? data[0] : l));
      }
    } catch (err) {
      console.error('Error updating lecture:', err);
      alert('일정 수정 중 오류가 발생했습니다.');
    }
  };

  const deleteLecture = async (id) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLectures(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Error deleting lecture:', err);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  const getLecturesByDate = (dateStr) => {
    return lectures.filter(l => l.date === dateStr);
  };

  return (
    <LectureContext.Provider value={{
      lectures,
      loading,
      error,
      addLecture,
      updateLecture,
      deleteLecture,
      getLecturesByDate,
      fetchLectures
    }}>
      {children}
    </LectureContext.Provider>
  );
};

export const useLecture = () => {
  const context = useContext(LectureContext);
  if (!context) {
    throw new Error('useLecture must be used within a LectureProvider');
  }
  return context;
};

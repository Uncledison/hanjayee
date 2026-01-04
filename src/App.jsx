import { useState, useEffect } from 'react';
import { LectureProvider } from './context/LectureContext';
import CalendarView from './components/CalendarView';
import ListView from './components/ListView';
import LectureForm from './components/LectureForm';
import { Calendar, List, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';

function App() {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);

  const openForm = (date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    setEditingLecture(null);
    setIsFormOpen(true);
  };

  const openEditForm = (lecture) => {
    setSelectedDate(lecture.date);
    setEditingLecture(lecture);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
    setEditingLecture(null);
  };

  return (
    <LectureProvider>
      <div className="container min-h-screen max-w-xl mx-auto pb-4 transition-colors">
        <header className="flex items-center justify-between mb-2 pt-6 px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              한자이 강습일지
            </h1>
          </div>

          <div>
            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`p-2 rounded-md transition-all ${view === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Calendar size={18} />
              </button>
              <div className="w-[1px] bg-slate-200 mx-1 my-1"></div>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-visible relative min-h-[600px] h-[calc(100vh-100px)]">
          {view === 'calendar' ? (
            <CalendarView onOpenForm={openForm} onEdit={openEditForm} />
          ) : (
            <ListView onEdit={openEditForm} />
          )}
        </main>

        {isFormOpen && (
          <LectureForm
            selectedDate={selectedDate}
            existingLecture={editingLecture}
            onClose={closeForm}
          />
        )}
      </div>
    </LectureProvider>
  );
}

export default App;

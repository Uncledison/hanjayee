import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useLecture } from '../context/LectureContext';
import LectureForm from './LectureForm';

const CalendarView = ({ onOpenForm, onEdit }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { getLecturesByDate } = useLecture();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    // Generate days for grid
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Padding days for start of month (Mon, Tue...)
    const startDayOfWeek = getDay(monthStart); // 0 (Sun) - 6 (Sat)
    const paddingDays = Array(startDayOfWeek).fill(null);

    const handleDateClick = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLectures = getLecturesByDate(dateStr);
        if (dayLectures.length > 0) {
            onEdit(dayLectures[0]);
        } else {
            onOpenForm(date);
        }
    };

    const getDayContent = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLectures = getLecturesByDate(dateStr);
        if (dayLectures.length > 0) {
            return (
                <div className="absolute bottom-2 flex gap-1">
                    {dayLectures.slice(0, 1).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                    ))}
                    {dayLectures.length > 1 && <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full animate-fade-in px-2 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-4 px-2">
                <h2 className="text-3xl font-bold text-slate-700 tracking-tight">
                    {format(currentDate, 'yyyy')}년 <span className="text-indigo-600">{format(currentDate, 'M')}월</span>
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-4 text-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={day} className={`py-2 ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-indigo-500' : ''}`}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 auto-rows-fr pb-24 flex-1">
                {paddingDays.map((_, i) => (
                    <div key={`padding-${i}`} className="aspect-square" />
                ))}
                {daysInMonth.map(date => {
                    const isToday = isSameDay(date, new Date());
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const hasLecture = getLecturesByDate(dateStr).length > 0;

                    return (
                        <div
                            key={date.toString()}
                            onClick={() => handleDateClick(date)}
                            className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group border border-transparent
                  ${isToday
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : hasLecture
                                        ? 'bg-white border-indigo-100 text-slate-700 shadow-sm'
                                        : 'hover:bg-white hover:shadow-sm text-slate-600'
                                }
                `}
                        >
                            <span className={`text-base font-medium z-10 ${isToday ? 'font-bold' : ''}`}>
                                {format(date, 'd')}
                            </span>
                            {getDayContent(date)}
                        </div>
                    );
                })}
            </div>

            {/* FAB to add lecture today/selected */}
            <button
                onClick={() => onOpenForm(new Date())}
                className="absolute bottom-8 right-4 w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
            >
                <Plus size={28} />
            </button>
        </div>
    );
};

export default CalendarView;

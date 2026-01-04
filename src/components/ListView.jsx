import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FileDown, MapPin, Users, Clock, Tag, Pen, Trash2 } from 'lucide-react';
import { useLecture } from '../context/LectureContext';
import { downloadWordFile } from '../utils/wordGenerator';

const ListView = ({ onEdit }) => {
    const { lectures, deleteLecture } = useLecture();

    const groupedLectures = useMemo(() => {
        const groups = {};
        const sorted = [...lectures].sort((a, b) => new Date(a.date) - new Date(b.date));

        sorted.forEach(lecture => {
            const monthKey = format(parseISO(lecture.date), 'yyyy년 M월');
            if (!groups[monthKey]) groups[monthKey] = [];
            groups[monthKey].push(lecture);
        });

        return groups;
    }, [lectures]);

    const getCategory = (l) => l.category || '교육';

    const handleDelete = (id) => {
        if (window.confirm('정말 이 강의를 삭제하시겠습니까?')) {
            deleteLecture(id);
        }
    };

    if (lectures.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 glass-panel mx-4 mt-8">
                <p>등록된 강의가 없습니다.</p>
                <p className="text-sm mt-2">캘린더에서 일정을 추가해주세요.</p>
            </div>
        );
    }

    return (
        <div className="pb-24 px-1 animate-fade-in relative min-h-full">
            <div className="flex justify-between items-center px-4 mb-4 mt-2">
                <span className="text-sm text-slate-500 font-medium">총 {lectures.length}건</span>
                <button
                    onClick={() => downloadWordFile(lectures)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-green-600/20 font-medium"
                >
                    <FileDown size={14} /> 워드 출력
                </button>
            </div>

            <div className="space-y-8">
                {Object.keys(groupedLectures).map(month => (
                    <div key={month}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 ml-4 sticky top-0 bg-slate-50/95 backdrop-blur-md py-3 z-10 flex items-center gap-2 border-b border-slate-200">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                            {month}
                        </h3>
                        <div className="space-y-4 px-2">
                            {groupedLectures[month].map(lecture => (
                                <div key={lecture.id} className="glass-panel p-5 hover:bg-white transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center bg-slate-100 rounded-2xl p-2.5 min-w-[3.8rem] border border-slate-200">
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {format(parseISO(lecture.date), 'M월')}
                                                </span>
                                                <span className="font-bold text-2xl text-slate-800">
                                                    {format(parseISO(lecture.date), 'd')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {format(parseISO(lecture.date), 'EEE', { locale: ko })}요일
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategory(lecture) === '전수발표회' ? 'bg-purple-100 text-purple-600' :
                                                        getCategory(lecture) === '전체모임' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {getCategory(lecture)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Clock size={12} />
                                                    {lecture.startTime} ~ {lecture.endTime}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 ml-2">
                                            <button
                                                onClick={() => onEdit(lecture)}
                                                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Pen size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lecture.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-slate-600 pl-1 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className="text-indigo-400 shrink-0" />
                                            <span className="font-medium text-slate-800">{lecture.location}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                                            <div className="flex flex-wrap gap-1.5">
                                                {lecture.attendees.map(a => (
                                                    <span key={a} className="bg-slate-100 px-2.5 py-1 rounded-md text-xs text-slate-600 font-medium border border-slate-200">{a}</span>
                                                ))}
                                                {lecture.customAttendees && lecture.customAttendees.split(',').map(custom => (
                                                    <span key={custom} className="bg-emerald-50 px-2.5 py-1 rounded-md text-xs text-emerald-600 font-medium border border-emerald-100">
                                                        {custom.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {lecture.content && (
                                            <div className="mt-3 pt-3 border-t border-slate-200 text-slate-500 text-xs leading-relaxed">
                                                {lecture.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListView;

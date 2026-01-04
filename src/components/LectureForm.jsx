import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, MapPin, Tag } from 'lucide-react';
import { useLecture } from '../context/LectureContext';

const FIXED_ATTENDEES = [
    '한자이', '김재락', '김춘교', '원성원', '황기영',
    '김영미', '윤혜림', '김형곤', '구여필', '노연정',
    '김나혜', '이주영', '이승재', '장동재', '박준영',
    '김소연', '송영숙', '조재석', '송철규', '정유정',
    '이아름', '김민정'
];

const DEFAULT_LOCATION = '가곡전수소';
const CATEGORIES = ['교육', '전체모임', '전수발표회'];

const LectureForm = ({ selectedDate, onClose, existingLecture = null }) => {
    const { addLecture, updateLecture, deleteLecture } = useLecture();

    const [formData, setFormData] = useState({
        date: selectedDate,
        startTime: '09:00',
        endTime: '11:00',
        location: DEFAULT_LOCATION,
        locationCustom: '',
        category: '교육',
        categoryCustom: '',
        attendees: [],
        customAttendees: '',
        content: ''
    });

    const [isLocationCustom, setIsLocationCustom] = useState(false);
    const [isCategoryCustom, setIsCategoryCustom] = useState(false);

    useEffect(() => {
        if (existingLecture) {
            setFormData(existingLecture);
            setIsLocationCustom(existingLecture.location !== DEFAULT_LOCATION);
            setIsCategoryCustom(!CATEGORIES.includes(existingLecture.category));
        } else {
            setFormData(prev => ({ ...prev, date: selectedDate }));
        }
    }, [existingLecture, selectedDate]);

    const handleAttendeeToggle = (name) => {
        setFormData(prev => {
            const exists = prev.attendees.includes(name);
            return {
                ...prev,
                attendees: exists
                    ? prev.attendees.filter(a => a !== name)
                    : [...prev.attendees, name]
            };
        });
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a clean object with only database fields
        const dataToSave = {
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: isLocationCustom ? formData.locationCustom : DEFAULT_LOCATION,
            category: isCategoryCustom ? formData.categoryCustom : formData.category,
            attendees: formData.attendees,
            customAttendees: formData.customAttendees || '',
            content: formData.content || ''
        };

        if (existingLecture) {
            updateLecture(existingLecture.id, dataToSave);
        } else {
            addLecture(dataToSave);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {existingLecture ? '일정 수정' : '새 일정'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <form id="lecture-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Date & Time Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">날짜</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">시작</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">종료</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Category Section */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
                                    <MapPin size={14} /> 장소
                                </label>
                                {!isLocationCustom ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-50 text-slate-700 font-medium border border-slate-200 rounded-xl px-4 py-3">
                                            {DEFAULT_LOCATION}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationCustom(true)}
                                            className="px-3 py-2 text-sm text-indigo-600 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                        >
                                            변경
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="장소 입력"
                                            value={formData.locationCustom}
                                            onChange={e => setFormData({ ...formData, locationCustom: e.target.value })}
                                            autoFocus
                                            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationCustom(false)}
                                            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            기본값
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
                                    <Tag size={14} /> 구분
                                </label>
                                {!isCategoryCustom ? (
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={e => {
                                                if (e.target.value === '직접입력') setIsCategoryCustom(true);
                                                else setFormData({ ...formData, category: e.target.value });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            <option value="직접입력">직접입력...</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="구분 입력"
                                            value={formData.categoryCustom}
                                            onChange={e => setFormData({ ...formData, categoryCustom: e.target.value })}
                                            autoFocus
                                            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryCustom(false)}
                                            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            취소
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attendees Section */}
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">참석자</label>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {formData.attendees.length}명
                                </span>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                                {FIXED_ATTENDEES.map(name => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => handleAttendeeToggle(name)}
                                        className={`py-2 px-1 text-sm rounded-lg transition-all border font-medium truncate ${formData.attendees.includes(name)
                                            ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">추가 참석자</label>
                            <input
                                type="text"
                                placeholder="이름 입력 (쉼표로 구분)"
                                value={formData.customAttendees}
                                onChange={e => setFormData({ ...formData, customAttendees: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        {/* Content Section */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">메모</label>
                            <textarea
                                rows={2}
                                placeholder="강습 내용 (선택사항)"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none resize-none placeholder:text-slate-400"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10">
                    <div className="flex gap-3">
                        {existingLecture && (
                            <button
                                type="button"
                                onClick={() => { deleteLecture(existingLecture.id); onClose(); }}
                                className="flex-1 py-3.5 rounded-xl bg-white text-rose-600 border border-rose-100 font-bold hover:bg-rose-50 transition-colors shadow-sm"
                            >
                                삭제
                            </button>
                        )}
                        <button
                            type="submit"
                            form="lecture-form"
                            className="flex-[2] py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                        >
                            {existingLecture ? '수정 완료' : '등록하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureForm;

import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, HeadingLevel, TextRun, AlignmentType, BorderStyle, VerticalAlign } from 'docx';
import { format, parseISO } from 'date-fns';

export const generateWordDocument = async (lectures) => {
    if (!lectures || lectures.length === 0) {
        alert("데이터가 없습니다.");
        return;
    }

    // Sort lectures by date
    const sortedLectures = [...lectures].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 1. Group by Month to calculate row spans
    const groupedByMonth = {};
    sortedLectures.forEach(l => {
        const month = format(parseISO(l.date), 'M월');
        if (!groupedByMonth[month]) groupedByMonth[month] = [];
        groupedByMonth[month].push(l);
    });

    const tableRows = [];

    // Header Row
    tableRows.push(
        new TableRow({
            tableHeader: true,
            children: [
                new TableCell({ children: [new Paragraph({ text: "월", alignment: AlignmentType.CENTER, bold: true })], width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "날짜", alignment: AlignmentType.CENTER, bold: true })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "시간", alignment: AlignmentType.CENTER, bold: true })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "장소", alignment: AlignmentType.CENTER, bold: true })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "참석자", alignment: AlignmentType.CENTER, bold: true })], width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ text: "구분", alignment: AlignmentType.CENTER, bold: true })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, verticalAlign: VerticalAlign.CENTER }),
            ],
        })
    );

    // Body Rows
    Object.keys(groupedByMonth).forEach(month => {
        const monthLectures = groupedByMonth[month];

        monthLectures.forEach((lecture, index) => {
            const isFirstOfGroup = index === 0;

            // Format Date (MM-DD)
            const dateStr = format(parseISO(lecture.date), 'MM-dd');

            // Format Attendees
            const attendeesList = [...(lecture.attendees || [])];
            if (lecture.customAttendees) {
                attendeesList.push(...lecture.customAttendees.split(',').map(s => s.trim()).filter(Boolean));
            }
            const attendeesString = attendeesList.join(', ');

            const cells = [];

            // 1. Month Cell (Merged)
            // 1. Month Cell (Merged)
            // Using verticalMerge below to ensuring consistent table grid for every row

            // But wait, the table row structure must be consistent. 
            // If I omit a cell, the columns shift.
            // Correct way for 'docx': Use verticalMerge.
            // First cell: verticalMerge: 'restart'
            // Subsequent cells: verticalMerge: 'continue'

            cells.push(new TableCell({
                children: [new Paragraph({ text: isFirstOfGroup ? month : "", alignment: AlignmentType.CENTER, bold: true })],
                verticalMerge: isFirstOfGroup ? "restart" : "continue",
                verticalAlign: VerticalAlign.CENTER,
            }));


            // 2. Date
            cells.push(new TableCell({ children: [new Paragraph({ text: dateStr, alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }));

            // 3. Time
            cells.push(new TableCell({ children: [new Paragraph({ text: `${lecture.startTime} ~ ${lecture.endTime}`, alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }));

            // 4. Location
            cells.push(new TableCell({ children: [new Paragraph({ text: lecture.location, alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }));

            // 5. Attendees
            cells.push(new TableCell({ children: [new Paragraph({ text: attendeesString })], verticalAlign: VerticalAlign.CENTER }));

            // 6. Category
            cells.push(new TableCell({ children: [new Paragraph({ text: lecture.category || '교육', alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }));

            tableRows.push(new TableRow({ children: cells }));
        });
    });

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: `2026 대전광역시 무형유산 전수교육 실적보고서`,
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 500 },
                    }),
                    new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
};

export const downloadWordFile = async (lectures) => {
    try {
        const blob = await generateWordDocument(lectures);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `전수교육실적보고서_${format(new Date(), 'yyyyMMdd')}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error generating document:", error);
        alert("문서 생성 중 오류가 발생했습니다.");
    }
};


interface Subject {
  id: string;
  code: string;
  name: string;
  internal: number;
  external: number;
  credits: number;
  grade: string;
  gradePoints: number;
}

interface StudentInfo {
  name: string;
  motherName: string;
  collegeName: string;
  seatNo: string;
  centre: string;
  prn: string;
  examYear: string;
  examMonth: string;
  branch: string;
  resultDate: string;
}

interface UniversityContext {
  name: string;
  shortName: string;
  city: string;
  color: string;
}

interface ResultPreviewProps {
  studentInfo: StudentInfo;
  subjects: Subject[];
  sgpa: string;
  grandTotal: number;
  universityContext?: UniversityContext;
}

const ResultPreview = ({ studentInfo, subjects, sgpa, grandTotal, universityContext }: ResultPreviewProps) => {
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);

  // Get university-specific header
  const getUniversityHeader = () => {
    if (universityContext) {
      switch (universityContext.shortName) {
        case 'MU':
          return {
            title: 'UNIVERSITY OF MUMBAI',
            subtitle: 'Established in 1857',
            location: 'MUMBAI 400032'
          };
        case 'DU':
          return {
            title: 'UNIVERSITY OF DELHI',
            subtitle: 'Established in 1922',
            location: 'DELHI 110007'
          };
        case 'JNU':
          return {
            title: 'JAWAHARLAL NEHRU UNIVERSITY',
            subtitle: 'Established in 1969',
            location: 'NEW DELHI 110067'
          };
        case 'CU':
          return {
            title: 'UNIVERSITY OF CALCUTTA',
            subtitle: 'Established in 1857',
            location: 'KOLKATA 700073'
          };
        case 'AU':
          return {
            title: 'ANNA UNIVERSITY',
            subtitle: 'Established in 1978',
            location: 'CHENNAI 600025'
          };
        default:
          return {
            title: 'SAVITRIBAI PHULE PUNE UNIVERSITY',
            subtitle: '(formerly University of Pune)',
            location: 'GANESHKHIND, PUNE 411007'
          };
      }
    }
    return {
      title: 'SAVITRIBAI PHULE PUNE UNIVERSITY',
      subtitle: '(formerly University of Pune)',
      location: 'GANESHKHIND, PUNE 411007'
    };
  };

  const universityHeader = getUniversityHeader();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-h-[800px] overflow-y-auto">
      <div className="border-2 border-black p-6 font-mono text-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-black flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold">{universityHeader.title}</h1>
              <p className="text-sm">{universityHeader.subtitle}</p>
              <p className="text-sm">{universityHeader.location}.</p>
            </div>
          </div>
          <div className="w-16 h-16 border border-black flex items-center justify-center">
            <span className="text-xs">QR</span>
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-4">
          <div className="bg-gray-200 p-2 mb-2">
            <strong>Branch: {studentInfo.branch || 'MASTER OF BUSINESS ADMINISTRATION'} - {studentInfo.examMonth || 'APR'} {studentInfo.examYear || '2020'}</strong>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>SeatNo: <strong>{studentInfo.seatNo}</strong></div>
            <div>Centre: <strong>{studentInfo.centre}</strong></div>
            <div>Perm Reg No(PRN): <strong>{studentInfo.prn}</strong></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div>Student Name: <strong>{studentInfo.name.toUpperCase()}</strong></div>
            <div>Mother Name: <strong>{studentInfo.motherName.toUpperCase()}</strong></div>
          </div>
          
          <div className="text-sm mt-2">
            Col/Inst Name: <strong>{studentInfo.collegeName.toUpperCase()}</strong>
          </div>
        </div>

        <div className="mb-4">
          <strong>Performance/Result for the Examination at Year: {studentInfo.examMonth || 'APR'}/{studentInfo.examYear || '2020'}</strong>
        </div>

        {/* Results Table */}
        <table className="w-full border-collapse border border-black text-xs mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">SEM</th>
              <th className="border border-black p-1">SUBCODE</th>
              <th className="border border-black p-1">SUBJECT NAME</th>
              <th className="border border-black p-1">INT</th>
              <th className="border border-black p-1">UEX</th>
              <th className="border border-black p-1">TOT</th>
              <th className="border border-black p-1">CREDITS</th>
              <th className="border border-black p-1">GRADE</th>
              <th className="border border-black p-1">GP</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject.id}>
                <td className="border border-black p-1 text-center">1</td>
                <td className="border border-black p-1 text-center">{subject.code}</td>
                <td className="border border-black p-1 pl-2">{subject.name.toUpperCase()}</td>
                <td className="border border-black p-1 text-center">{subject.internal}</td>
                <td className="border border-black p-1 text-center">{subject.external}</td>
                <td className="border border-black p-1 text-center">{subject.internal + subject.external}</td>
                <td className="border border-black p-1 text-center">P {subject.credits}</td>
                <td className="border border-black p-1 text-center">{subject.grade}</td>
                <td className="border border-black p-1 text-center">{subject.gradePoints.toString().padStart(3, '0')}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="border border-black p-1 text-right" colSpan={5}>GRAND TOTAL(OUT OF 1600)</td>
              <td className="border border-black p-1 text-center">{grandTotal}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
          </tbody>
        </table>

        {/* SGPA */}
        <div className="mb-4">
          <strong>SGPA: ({totalCredits}) {sgpa}({sgpa}) {sgpa}</strong>
          <span className="ml-8">TOTAL: CREDITS {totalCredits} GRADE POINTS {subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0)}</span>
        </div>

        <div className="text-sm">
          <strong>RESULT DATE: {studentInfo.resultDate}</strong>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs">
          <p>The results published online are for immediate information only. These cannot be treated as original statement of marks.Please verify the information from original statement of marks issued by the {universityHeader.title} separately.</p>
          <div className="text-right mt-2">
            <strong>Print</strong>
          </div>
        </div>

        <div className="text-center mt-4 text-xs">
          <strong>Copyright © 2016. {universityHeader.title} All rights reserved. | HOME | DISCLAIMER</strong>
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;

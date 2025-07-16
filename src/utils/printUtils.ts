import jsPDF from 'jspdf';
import JSZip from 'jszip';

export const handlePrint = (elementId?: string) => {
  if (elementId) {
    // Print specific element
    const element = document.getElementById(elementId);
    if (element) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Result</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: 'Courier New', monospace; 
                  font-size: 12px;
                  line-height: 1.4;
                }
                @media print { 
                  body { margin: 0; padding: 0; }
                  .no-print { display: none !important; }
                }
                table { 
                  border-collapse: collapse; 
                  width: 100%; 
                }
                th, td { 
                  border: 1px solid black; 
                  padding: 4px; 
                  text-align: left; 
                }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .bg-gray-200 { background-color: #e5e7eb; }
              </style>
            </head>
            <body>
              ${element.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  } else {
    // Print entire page
    window.print();
  }
};

export const downloadAsImage = async (elementId: string, filename: string) => {
  try {
    const html2canvas = await import('html2canvas');
    const element = document.getElementById(elementId);
    if (element) {
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to print
    handlePrint(elementId);
  }
};

export const printAllResults = (results: any[]) => {
  results.forEach((result, index) => {
    setTimeout(() => {
      handlePrint(`result-${index}`);
    }, index * 1000); // Delay each print by 1 second
  });
};

export const generatePDF = async (elementId: string, filename: string): Promise<Blob> => {
  try {
    const html2canvas = await import('html2canvas');
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }

    // Ensure the element is visible and styled
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    element.style.display = 'block';
    element.style.visibility = 'visible';

    // Wait a bit more for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas.default(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    // Restore original styles
    element.style.display = originalDisplay;
    element.style.visibility = originalVisibility;

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Check if canvas is not empty
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas is empty - element may not be rendered properly');
    }

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

export const generateStudentPDF = async (studentData: any, universityContext?: any): Promise<{ blob: Blob; filename: string }> => {
  // Create a temporary div to render the student result
  const tempDiv = document.createElement('div');
  tempDiv.id = 'temp-student-result';
  tempDiv.style.position = 'fixed';
  tempDiv.style.left = '0px';
  tempDiv.style.top = '0px';
  tempDiv.style.width = '800px';
  tempDiv.style.height = 'auto';
  tempDiv.style.backgroundColor = '#ffffff';
  tempDiv.style.zIndex = '-1000';
  tempDiv.style.overflow = 'visible';
  
  // Convert bulk data to result format
  const studentInfo = {
    name: studentData['Student Name'] || '',
    motherName: studentData['Mother Name'] || '',
    collegeName: studentData['College Name'] || '',
    seatNo: studentData['Seat No'] || '',
    centre: studentData['Centre'] || '001',
    prn: studentData['PRN'] || '',
    examYear: studentData['Exam Year'] || '2024',
    examMonth: studentData['Exam Month'] || 'APR/MAY',
    branch: studentData['Branch'] || 'BACHELOR OF ENGINEERING',
    resultDate: new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).replace(/ /g, ' ')
  };

  const subjects = [];
  let subjectIndex = 1;
  
  while (studentData[`Subject${subjectIndex}_Code`]) {
    const internal = Number(studentData[`Subject${subjectIndex}_Internal`]) || 0;
    const external = Number(studentData[`Subject${subjectIndex}_External`]) || 0;
    const total = internal + external;
    
    let grade = 'F';
    let gradePoints = 0;
    
    if (total >= 70) { grade = 'A'; gradePoints = 9; }
    else if (total >= 60) { grade = 'B'; gradePoints = 8; }
    else if (total >= 55) { grade = 'C'; gradePoints = 7; }
    else if (total >= 50) { grade = 'D'; gradePoints = 6; }
    else if (total >= 45) { grade = 'E'; gradePoints = 5; }
    else if (total >= 40) { grade = 'P'; gradePoints = 4; }

    subjects.push({
      id: subjectIndex.toString(),
      code: studentData[`Subject${subjectIndex}_Code`] || '',
      name: studentData[`Subject${subjectIndex}_Name`] || '',
      internal,
      external,
      credits: Number(studentData[`Subject${subjectIndex}_Credits`]) || 0,
      grade,
      gradePoints
    });
    
    subjectIndex++;
  }

  // Calculate SGPA and Grand Total
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  const totalGradePoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0);
  const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(3) : '0.000';
  const grandTotal = subjects.reduce((sum, subject) => sum + subject.internal + subject.external, 0);

  // Get university header
  const getUniversityHeader = () => {
    if (universityContext) {
      switch (universityContext.shortName) {
        case 'MU':
          return {
            title: 'UNIVERSITY OF MUMBAI',
            subtitle: 'Established in 1857',
            location: 'MUMBAI 400032'
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

  // Generate HTML content for the result with comprehensive styling
  tempDiv.innerHTML = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .result-container {
        background: white;
        padding: 24px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
        color: black;
        width: 800px;
        min-height: 600px;
      }
      .result-border {
        border: 2px solid black;
        padding: 24px;
        width: 100%;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        width: 100%;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .logo-box {
        width: 64px;
        height: 64px;
        border: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        background: white;
      }
      .university-info {
        text-align: center;
      }
      .university-title {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        color: black;
      }
      .university-subtitle {
        font-size: 12px;
        margin: 4px 0;
        color: black;
      }
      .student-info {
        margin-bottom: 16px;
      }
      .branch-header {
        background-color: #e5e7eb;
        padding: 8px;
        margin-bottom: 8px;
        font-weight: bold;
        color: black;
      }
      .info-grid-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        font-size: 12px;
        margin-bottom: 8px;
      }
      .info-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        font-size: 12px;
        margin-bottom: 8px;
      }
      .results-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        background: white;
      }
      .table-header {
        background-color: #f3f4f6;
      }
      .table-cell {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
        color: black;
        background: white;
      }
      .table-cell-left {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
        color: black;
        background: white;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        font-size: 12px;
        margin-top: 16px;
      }
      .result-date {
        margin-top: 24px;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
      }
    </style>
    <div class="result-container">
      <div class="result-border">
        <!-- Header -->
        <div class="header-section">
          <div class="header-left">
            <div class="logo-box">
              LOGO
            </div>
            <div class="university-info">
              <h1 class="university-title">${universityHeader.title}</h1>
              <p class="university-subtitle">${universityHeader.subtitle}</p>
              <p class="university-subtitle">${universityHeader.location}.</p>
            </div>
          </div>
          <div class="logo-box">
            QR
          </div>
        </div>

        <!-- Student Info -->
        <div class="student-info">
          <div class="branch-header">
            Branch: ${studentInfo.branch} - ${studentInfo.examMonth} ${studentInfo.examYear}
          </div>
          
          <div class="info-grid-3">
            <div>SeatNo: <strong>${studentInfo.seatNo}</strong></div>
            <div>Centre: <strong>${studentInfo.centre}</strong></div>
            <div>Perm Reg No(PRN): <strong>${studentInfo.prn}</strong></div>
          </div>
          
          <div class="info-grid-2">
            <div>Student Name: <strong>${studentInfo.name.toUpperCase()}</strong></div>
            <div>Mother Name: <strong>${studentInfo.motherName.toUpperCase()}</strong></div>
          </div>
          
          <div style="font-size: 12px;">
            Col/Inst Name: <strong>${studentInfo.collegeName.toUpperCase()}</strong>
          </div>
        </div>

        <!-- Results Table -->
        <table class="results-table">
          <thead class="table-header">
            <tr>
              <th class="table-cell">Sr No.</th>
              <th class="table-cell">Subject Code</th>
              <th class="table-cell">Subject Name</th>
              <th class="table-cell">Internal</th>
              <th class="table-cell">External</th>
              <th class="table-cell">Total</th>
              <th class="table-cell">Credits</th>
              <th class="table-cell">Grade</th>
              <th class="table-cell">Grade Points</th>
            </tr>
          </thead>
          <tbody>
            ${subjects.map((subject, index) => `
              <tr>
                <td class="table-cell">${index + 1}</td>
                <td class="table-cell">${subject.code}</td>
                <td class="table-cell-left">${subject.name}</td>
                <td class="table-cell">${subject.internal}</td>
                <td class="table-cell">${subject.external}</td>
                <td class="table-cell">${subject.internal + subject.external}</td>
                <td class="table-cell">${subject.credits}</td>
                <td class="table-cell">${subject.grade}</td>
                <td class="table-cell">${subject.gradePoints}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary-grid">
          <div><strong>Total Credits: ${totalCredits}</strong></div>
          <div><strong>Grand Total: ${grandTotal}</strong></div>
          <div><strong>SGPA: ${sgpa}</strong></div>
        </div>

        <div class="result-date">
          <p>Result Date: ${studentInfo.resultDate}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Wait for the DOM to render the content
    await new Promise(resolve => setTimeout(resolve, 500));

    const pdfBlob = await generatePDF('temp-student-result', `${studentInfo.name}_Result`);
    const filename = `${studentInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}_Result.pdf`;
    
    return { blob: pdfBlob, filename };
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const generateBulkPDFZip = async (
  bulkStudents: any[], 
  universityContext?: any,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> => {
  const zip = new JSZip();
  const total = bulkStudents.length;

  for (let i = 0; i < bulkStudents.length; i++) {
    const student = bulkStudents[i];
    onProgress?.(i + 1, total);

    try {
      const { blob, filename } = await generateStudentPDF(student, universityContext);
      zip.file(filename, blob);
    } catch (error) {
      console.error(`Failed to generate PDF for ${student['Student Name']}:`, error);
      // Continue with other students even if one fails
    }
  }

  return await zip.generateAsync({ type: 'blob' });
};

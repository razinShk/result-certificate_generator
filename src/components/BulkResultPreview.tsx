import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Printer, ChevronLeft, ChevronRight, Download, Archive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ResultPreview from './ResultPreview';
import { handlePrint, generateBulkPDFZip } from '@/utils/printUtils';
import { toast } from 'sonner';

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

interface BulkResultPreviewProps {
  bulkStudents: any[];
  universityContext?: UniversityContext;
}

const BulkResultPreview = ({ bulkStudents, universityContext }: BulkResultPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  if (bulkStudents.length === 0) {
    return null;
  }

  const convertBulkDataToResult = (student: any) => {
    const studentInfo: StudentInfo = {
      name: student['Student Name'] || '',
      motherName: student['Mother Name'] || '',
      collegeName: student['College Name'] || '',
      seatNo: student['Seat No'] || '',
      centre: student['Centre'] || '001',
      prn: student['PRN'] || '',
      examYear: student['Exam Year'] || '2024',
      examMonth: student['Exam Month'] || 'APR/MAY',
      branch: student['Branch'] || 'BACHELOR OF ENGINEERING',
      resultDate: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' ')
    };

    const subjects: Subject[] = [];
    let subjectIndex = 1;
    
    while (student[`Subject${subjectIndex}_Code`]) {
      const internal = Number(student[`Subject${subjectIndex}_Internal`]) || 0;
      const external = Number(student[`Subject${subjectIndex}_External`]) || 0;
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
        code: student[`Subject${subjectIndex}_Code`] || '',
        name: student[`Subject${subjectIndex}_Name`] || '',
        internal,
        external,
        credits: Number(student[`Subject${subjectIndex}_Credits`]) || 0,
        grade,
        gradePoints
      });
      
      subjectIndex++;
    }

    return { studentInfo, subjects };
  };

  const calculateSGPA = (subjects: Subject[]) => {
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const totalGradePoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(3) : '0.000';
  };

  const calculateGrandTotal = (subjects: Subject[]) => {
    return subjects.reduce((sum, subject) => sum + subject.internal + subject.external, 0);
  };

  const currentStudent = convertBulkDataToResult(bulkStudents[currentIndex]);
  const sgpa = calculateSGPA(currentStudent.subjects);
  const grandTotal = calculateGrandTotal(currentStudent.subjects);

  const handlePrintCurrent = () => {
    handlePrint('bulk-result-preview');
    toast.success(`Printing result for ${currentStudent.studentInfo.name}`);
  };

  const handlePrintAll = () => {
    toast.info(`Preparing to print ${bulkStudents.length} results. Each will open in a new window.`);
    
    bulkStudents.forEach((student, index) => {
      setTimeout(() => {
        const studentResult = convertBulkDataToResult(student);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <div id="temp-result-${index}">
            <!-- Result content would be generated here -->
            <h2>Result for ${studentResult.studentInfo.name}</h2>
            <p>This would contain the full result sheet</p>
          </div>
        `;
        document.body.appendChild(tempDiv);
        handlePrint(`temp-result-${index}`);
        setTimeout(() => document.body.removeChild(tempDiv), 1000);
      }, index * 2000); // 2 second delay between each print
    });
  };

  /**
   * Handles the download of all student results as a ZIP file containing individual PDFs
   * Each PDF is named according to the student's name for easy identification
   */
  const handleDownloadZip = async () => {
    if (bulkStudents.length === 0) {
      toast.error('No students data available for download');
      return;
    }

    setIsGeneratingZip(true);
    setZipProgress(0);

    try {
      toast.info(`Generating PDFs for ${bulkStudents.length} students...`);

      const zipBlob = await generateBulkPDFZip(
        bulkStudents,
        universityContext,
        (current, total) => {
          const progress = (current / total) * 100;
          setZipProgress(progress);
          
          // Update toast message with progress
          if (current % 5 === 0 || current === total) {
            toast.info(`Processing ${current} of ${total} students...`);
          }
        }
      );

      // Create download link with timestamp for unique filename
      const timestamp = new Date().toISOString().split('T')[0];
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Student_Results_${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Successfully generated ZIP file with ${bulkStudents.length} student results!`);
    } catch (error) {
      console.error('Failed to generate ZIP file:', error);
      toast.error('Failed to generate ZIP file. Please try again.');
    } finally {
      setIsGeneratingZip(false);
      setZipProgress(0);
    }
  };

  const nextStudent = () => {
    setCurrentIndex((prev) => (prev + 1) % bulkStudents.length);
  };

  const prevStudent = () => {
    setCurrentIndex((prev) => (prev - 1 + bulkStudents.length) % bulkStudents.length);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700 flex items-center justify-between">
          <span>Bulk Results Preview ({bulkStudents.length} students)</span>
          <div className="flex gap-2">
            <Button onClick={handlePrintAll} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print All
            </Button>
            <Button 
              onClick={handleDownloadZip} 
              variant="outline" 
              size="sm"
              disabled={isGeneratingZip}
              className="text-green-600 hover:text-green-700"
            >
              {isGeneratingZip ? (
                <>
                  <Archive className="h-4 w-4 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Download ZIP
                </>
              )}
            </Button>
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview Results
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Result Preview - {currentStudent.studentInfo.name}</span>
                    <div className="flex items-center gap-2">
                      <Button onClick={prevStudent} variant="outline" size="sm" disabled={bulkStudents.length <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        {currentIndex + 1} of {bulkStudents.length}
                      </span>
                      <Button onClick={nextStudent} variant="outline" size="sm" disabled={bulkStudents.length <= 1}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button onClick={handlePrintCurrent} variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-1" />
                        Print This
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div id="bulk-result-preview">
                  <ResultPreview
                    studentInfo={currentStudent.studentInfo}
                    subjects={currentStudent.subjects}
                    sgpa={sgpa}
                    grandTotal={grandTotal}
                    universityContext={universityContext}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress indicator for ZIP generation */}
          {isGeneratingZip && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generating PDFs...</span>
                <span>{Math.round(zipProgress)}%</span>
              </div>
              <Progress value={zipProgress} className="w-full" />
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p><strong>Students loaded:</strong> {bulkStudents.length}</p>
            <p><strong>First student:</strong> {bulkStudents[0]?.['Student Name'] || 'N/A'}</p>
            <p><strong>Subjects per student:</strong> {Object.keys(bulkStudents[0] || {}).filter(key => key.includes('Subject')).length / 5}</p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setPreviewDialogOpen(true)} 
              variant="outline" 
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview Individual Results
            </Button>
            <Button 
              onClick={handlePrintAll} 
              variant="outline" 
              size="sm"
              className="text-blue-600"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print All Results
            </Button>
            <Button 
              onClick={handleDownloadZip} 
              variant="outline" 
              size="sm"
              disabled={isGeneratingZip}
              className="text-green-600 hover:text-green-700"
            >
              {isGeneratingZip ? (
                <>
                  <Archive className="h-4 w-4 mr-1 animate-spin" />
                  Generating ZIP...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Download All as ZIP
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p><strong>Print & Download Instructions:</strong></p>
            <p>• Use "Preview Individual Results" to see each student's result sheet</p>
            <p>• Navigate between students using arrow buttons</p>
            <p>• "Print This" prints the currently viewed result</p>
            <p>• "Print All" will open each result in a new window for printing</p>
            <p>• "Download All as ZIP" creates a ZIP file with individual PDFs for each student</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkResultPreview;

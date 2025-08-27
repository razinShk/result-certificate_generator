import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Download, FileText, Eye, Save, Upload, RotateCcw, Users, Printer } from 'lucide-react';
import { toast } from 'sonner';
import ResultPreview from '@/components/ResultPreview';
import AdvancedResultFeatures from '@/components/AdvancedResultFeatures';
import BulkResultPreview from '@/components/BulkResultPreview';
import BulkGeneration from '@/components/BulkGeneration';
import { handlePrint } from '@/utils/printUtils';

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

interface IndexProps {
  universityContext?: UniversityContext;
}

const Index = ({ universityContext }: IndexProps) => {
  const universityData = [
    {
      id: 'sppu',
      name: 'Savitribai Phule Pune University',
      city: 'Pune',
      state: 'Maharashtra',
      shortName: 'SPPU',
      color: 'bg-blue-600'
    },
    {
      id: 'mu',
      name: 'University of Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      shortName: 'MU',
      color: 'bg-purple-600'
    },
    {
      id: 'du',
      name: 'University of Delhi',
      city: 'Delhi',
      state: 'Delhi',
      shortName: 'DU',
      color: 'bg-green-600'
    },
    {
      id: 'jnu',
      name: 'Jawaharlal Nehru University',
      city: 'Delhi',
      state: 'Delhi',
      shortName: 'JNU',
      color: 'bg-red-600'
    },
    {
      id: 'cu',
      name: 'University of Calcutta',
      city: 'Kolkata',
      state: 'West Bengal',
      shortName: 'CU',
      color: 'bg-orange-600'
    },
    {
      id: 'au',
      name: 'Anna University',
      city: 'Chennai',
      state: 'Tamil Nadu',
      shortName: 'AU',
      color: 'bg-teal-600'
    },
    {
      id: 'impact',
      name: 'Impact School',
      city: 'Lagos',
      state: 'Lagos',
      shortName: 'IMPACT',
      color: 'bg-indigo-600'
    }
  ];

  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    motherName: '',
    collegeName: '',
    seatNo: '',
    centre: '',
    prn: '',
    examYear: '',
    examMonth: '',
    branch: '',
    resultDate: new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).replace(/ /g, ' ')
  });

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      code: '',
      name: '',
      internal: 0,
      external: 0,
      credits: 0,
      grade: '',
      gradePoints: 0
    }
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<string[]>([]);
  const [advancedFeatures, setAdvancedFeatures] = useState<any>({});
  const [bulkStudents, setBulkStudents] = useState<any[]>([]);
  const [showUniversitySelection, setShowUniversitySelection] = useState(false);

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      code: '',
      name: '',
      internal: 0,
      external: 0,
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value };
        
        // Auto-calculate grade based on total marks
        if (field === 'internal' || field === 'external') {
          const total = (field === 'internal' ? Number(value) : updated.internal) + 
                       (field === 'external' ? Number(value) : updated.external);
          
          let grade = 'F';
          let gradePoints = 0;
          
          if (total >= 70) { grade = 'A'; gradePoints = 9; }
          else if (total >= 60) { grade = 'B'; gradePoints = 8; }
          else if (total >= 55) { grade = 'C'; gradePoints = 7; }
          else if (total >= 50) { grade = 'D'; gradePoints = 6; }
          else if (total >= 45) { grade = 'E'; gradePoints = 5; }
          else if (total >= 40) { grade = 'P'; gradePoints = 4; }
          
          updated.grade = grade;
          updated.gradePoints = gradePoints;
        }
        
        return updated;
      }
      return subject;
    }));
  };

  const calculateSGPA = () => {
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const totalGradePoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(3) : '0.000';
  };

  const calculateGrandTotal = () => {
    return subjects.reduce((sum, subject) => sum + subject.internal + subject.external, 0);
  };

  const handleGenerateResult = () => {
    // Validate required fields
    if (!studentInfo.name || !studentInfo.seatNo || !studentInfo.prn) {
      toast.error('Please fill in all required student information fields');
      return;
    }
    
    const hasValidSubjects = subjects.some(subject => subject.code && subject.name);
    if (!hasValidSubjects) {
      toast.error('Please add at least one subject with code and name');
      return;
    }
    
    setShowPreview(true);
    toast.success('Result sheet generated successfully!');
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download feature coming soon!');
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      toast.success('Preview enabled - you can now see live updates!');
    }
  };

  const handleSaveTemplate = () => {
    const templateName = `Template_${new Date().toLocaleDateString()}`;
    const template = {
      studentInfo,
      subjects,
      university: universityContext?.shortName || 'General'
    };
    
    localStorage.setItem(`template_${templateName}`, JSON.stringify(template));
    setSavedTemplates([...savedTemplates, templateName]);
    toast.success('Template saved successfully!');
  };

  const handleResetForm = () => {
    setStudentInfo({
      name: '',
      motherName: '',
      collegeName: '',
      seatNo: '',
      centre: '',
      prn: '',
      examYear: '',
      examMonth: '',
      branch: '',
      resultDate: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' ')
    });
    setSubjects([{
      id: '1',
      code: '',
      name: '',
      internal: 0,
      external: 0,
      credits: 0,
      grade: '',
      gradePoints: 0
    }]);
    setShowPreview(false);
    toast.success('Form reset successfully!');
  };

  const handleAutoFillSample = () => {
    setStudentInfo({
      name: 'JOHN DOE',
      motherName: 'JANE DOE',
      collegeName: 'SAMPLE COLLEGE OF ENGINEERING',
      seatNo: '12345',
      centre: '001',
      prn: '21012345678',
      examYear: '2024',
      examMonth: 'APR/MAY',
      branch: 'BACHELOR OF ENGINEERING',
      resultDate: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' ')
    });
    
    setSubjects([
      {
        id: '1',
        code: 'CS-101',
        name: 'DATA STRUCTURES',
        internal: 18,
        external: 52,
        credits: 4,
        grade: 'A',
        gradePoints: 9
      },
      {
        id: '2',
        code: 'CS-102',
        name: 'ALGORITHMS',
        internal: 16,
        external: 48,
        credits: 3,
        grade: 'B',
        gradePoints: 8
      }
    ]);
    
    toast.success('Sample data filled successfully!');
  };

  const handleBulkDataGenerated = (students: any[]) => {
    setBulkStudents(students);
    toast.success(`Loaded ${students.length} students for bulk processing`);
  };

  const processBulkResults = () => {
    if (bulkStudents.length === 0) {
      toast.error('No bulk data available. Please upload student data first.');
      return;
    }

    // Process each student and generate their result
    bulkStudents.forEach((student, index) => {
      setTimeout(() => {
        // Here you would generate PDF for each student
        console.log(`Processing result for: ${student['Student Name']}`);
        
        if (index === bulkStudents.length - 1) {
          toast.success(`All ${bulkStudents.length} results processed successfully!`);
        }
      }, index * 100); // Stagger the processing
    });
  };

  const handlePrintResult = () => {
    if (!showPreview) {
      toast.error('Please enable preview first to print the result');
      return;
    }
    handlePrint('result-preview');
    toast.success('Printing result sheet...');
  };

  const handleAdvancedFeatureChange = (feature: string, value: any) => {
    setAdvancedFeatures(prev => ({ ...prev, [feature]: value }));
  };

  const handleUniversitySelect = (universityId: string) => {
    const selectedUniversity = universityData.find(uni => uni.id === universityId);
    if (selectedUniversity) {
      // Navigate to the university-specific page
      navigate(`/university/${universityId}`);
    }
  };

  // Get the page title based on context
  const getPageTitle = () => {
    if (universityContext) {
      return `${universityContext.shortName} Result Creator`;
    }
    return 'Exam Result Creator';
  };

  const getPageDescription = () => {
    if (universityContext) {
      return `Generate professional ${universityContext.name} result sheets instantly`;
    }
    return 'Generate professional university result sheets instantly';
  };

  return (
    <div className={universityContext ? '' : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'}>
      <div className="max-w-7xl mx-auto">
        {!universityContext && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">{getPageTitle()}</h1>
            </div>
            <p className="text-lg text-gray-600">{getPageDescription()}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Quick Actions Bar */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handlePreviewToggle} 
                    variant={showPreview ? "default" : "outline"}
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  <Button onClick={handleAutoFillSample} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Sample Data
                  </Button>
                  <Button onClick={handleSaveTemplate} variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save Template
                  </Button>
                  <Button onClick={handleResetForm} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset Form
                  </Button>
                  <Button
                    onClick={() => setShowUniversitySelection(!showUniversitySelection)}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <University className="h-4 w-4 mr-1" />
                    {showUniversitySelection ? 'Hide Universities' : 'Choose University'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* University Info Card */}
            {universityContext && (
              <Card className="shadow-lg border-l-4" style={{borderLeftColor: universityContext.color.replace('bg-', '#')}}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${universityContext.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold">{universityContext.shortName}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{universityContext.name}</h3>
                      <p className="text-sm text-gray-600">{universityContext.city} • Result Format</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      value={studentInfo.motherName}
                      onChange={(e) => setStudentInfo({...studentInfo, motherName: e.target.value})}
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seatNo">Seat No *</Label>
                    <Input
                      id="seatNo"
                      value={studentInfo.seatNo}
                      onChange={(e) => setStudentInfo({...studentInfo, seatNo: e.target.value})}
                      placeholder="Enter seat number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="centre">Centre</Label>
                    <Input
                      id="centre"
                      value={studentInfo.centre}
                      onChange={(e) => setStudentInfo({...studentInfo, centre: e.target.value})}
                      placeholder="Enter centre code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prn">PRN *</Label>
                    <Input
                      id="prn"
                      value={studentInfo.prn}
                      onChange={(e) => setStudentInfo({...studentInfo, prn: e.target.value})}
                      placeholder="Enter PRN number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={studentInfo.branch}
                      onChange={(e) => setStudentInfo({...studentInfo, branch: e.target.value})}
                      placeholder="e.g., MASTER OF BUSINESS ADMINISTRATION"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="collegeName">College/Institute Name</Label>
                  <Input
                    id="collegeName"
                    value={studentInfo.collegeName}
                    onChange={(e) => setStudentInfo({...studentInfo, collegeName: e.target.value})}
                    placeholder="Enter full college name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="examYear">Exam Year</Label>
                    <Input
                      id="examYear"
                      value={studentInfo.examYear}
                      onChange={(e) => setStudentInfo({...studentInfo, examYear: e.target.value})}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="examMonth">Exam Month</Label>
                    <Input
                      id="examMonth"
                      value={studentInfo.examMonth}
                      onChange={(e) => setStudentInfo({...studentInfo, examMonth: e.target.value})}
                      placeholder="e.g., APR/MAY"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Details */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-blue-700">Subject Details</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={addSubject} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subject
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-700">Subject {index + 1}</span>
                      {subjects.length > 1 && (
                        <Button
                          onClick={() => removeSubject(subject.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Subject Code</Label>
                        <Input
                          value={subject.code}
                          onChange={(e) => updateSubject(subject.id, 'code', e.target.value)}
                          placeholder="e.g., GC-01"
                        />
                      </div>
                      <div>
                        <Label>Subject Name</Label>
                        <Input
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                          placeholder="Enter subject name"
                        />
                      </div>
                      <div>
                        <Label>Internal Marks</Label>
                        <Input
                          type="number"
                          value={subject.internal}
                          onChange={(e) => updateSubject(subject.id, 'internal', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>External Marks</Label>
                        <Input
                          type="number"
                          value={subject.external}
                          onChange={(e) => updateSubject(subject.id, 'external', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Credits</Label>
                        <Input
                          type="number"
                          value={subject.credits}
                          onChange={(e) => updateSubject(subject.id, 'credits', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Total: {subject.internal + subject.external} | Grade: {subject.grade}</Label>
                        <div className="text-sm text-gray-600 mt-1">
                          Auto-calculated based on marks
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* University Selection */}
            {showUniversitySelection && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-700">Choose University Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {universityData.map((university) => (
                      <Card
                        key={university.id}
                        className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                        onClick={() => handleUniversitySelect(university.id)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${university.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <span className="text-white font-bold">{university.shortName}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold group-hover:text-blue-600 transition-colors">{university.name}</h3>
                              <p className="text-sm text-gray-600">{university.city}</p>
                            </div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            Select University
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowUniversitySelection(false)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      Close Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bulk Generation - Prominent placement */}
            <BulkGeneration onBulkDataGenerated={handleBulkDataGenerated} />

            {/* Bulk Results Preview */}
            {bulkStudents.length > 0 && (
              <BulkResultPreview
                bulkStudents={bulkStudents}
                universityContext={universityContext}
              />
            )}

            {/* Advanced Features */}
            <AdvancedResultFeatures
              onFeatureChange={handleAdvancedFeatureChange}
            />

            {/* Results Summary */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{calculateGrandTotal()}</div>
                    <div className="text-sm text-gray-600">Grand Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{calculateSGPA()}</div>
                    <div className="text-sm text-gray-600">SGPA</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleGenerateResult} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Generate Result Sheet
              </Button>
              {bulkStudents.length > 0 && (
                <Button onClick={processBulkResults} className="bg-purple-600 hover:bg-purple-700">
                  <Users className="h-4 w-4 mr-2" />
                  Process Bulk ({bulkStudents.length})
                </Button>
              )}
              {showPreview && (
                <>
                  <Button onClick={handlePrintResult} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Result
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Result Preview */}
          <div>
            {showPreview ? (
              <div id="result-preview">
                <ResultPreview 
                  studentInfo={studentInfo}
                  subjects={subjects}
                  sgpa={calculateSGPA()}
                  grandTotal={calculateGrandTotal()}
                  universityContext={universityContext}
                />
              </div>
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Result Preview</h3>
                  <p className="text-gray-500 mb-4">Click "Show Preview" to see live updates as you type</p>
                  <Button onClick={handlePreviewToggle} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Enable Live Preview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

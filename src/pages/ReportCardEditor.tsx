import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Palette, 
  Image as ImageIcon,
  FileText,
  Eye,
  Settings,
  GraduationCap,
  Star,
  Rainbow,
  Sparkles,
  Heart,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
  RefreshCw,
  Save
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

interface Subject {
  id: string;
  name: string;
  marks: string;
  maxMarks: string;
  grade: string;
}

interface ReportCardData {
  schoolName: string;
  schoolLogo: string;
  studentName: string;
  className: string;
  section: string;
  rollNo: string;
  year: string;
  teacherName: string;
  principalName: string;
  subjects: Subject[];
  comments: string;
  attendance: string;
  watermark: string;
  templateType: 'classic' | 'modern' | 'kids' | 'elegant' | 'compact' | 'nursery-2page' | 'academic-4page';
  backgroundType: 'color' | 'gradient' | 'pattern' | 'image';
  backgroundColor: string;
  gradientColors: { from: string; to: string };
  patternType: 'dots' | 'lines' | 'grid' | 'waves';
  backgroundImage: string;
  enableEmojis: boolean;
  enableStickers: boolean;
  enableRainbow: boolean;
  fontSize: number;
  borderRadius: number;
  shadowIntensity: number;
  teacherSignature: string;
  principalSignature: string;
  admissionNumber: string;
  dateOfBirth: string;
  parentName: string;
  address: string;
  phoneNumber: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  termName: string;
  examType: string;
}

const ReportCardEditor = () => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportCardData>({
    schoolName: 'Your School Name',
    schoolLogo: '',
    studentName: 'Student Name',
    className: 'Class X',
    section: 'A',
    rollNo: '001',
    year: '2024',
    teacherName: 'Teacher Name',
    principalName: 'Principal Name',
    subjects: [
      { id: '1', name: 'Mathematics', marks: '85', maxMarks: '100', grade: 'A' },
      { id: '2', name: 'Science', marks: '78', maxMarks: '100', grade: 'B+' },
      { id: '3', name: 'English', marks: '92', maxMarks: '100', grade: 'A+' },
      { id: '4', name: 'Social Studies', marks: '80', maxMarks: '100', grade: 'A' },
    ],
    comments: 'Excellent performance! Keep up the good work.',
    attendance: '95%',
    watermark: '',
    templateType: 'classic',
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    gradientColors: { from: '#f3f4f6', to: '#e5e7eb' },
    patternType: 'dots',
    backgroundImage: '',
    enableEmojis: false,
    enableStickers: false,
    enableRainbow: false,
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 2,
    teacherSignature: '',
    principalSignature: '',
    admissionNumber: '',
    dateOfBirth: '',
    parentName: '',
    address: '',
    phoneNumber: '',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: '',
    termName: 'First Term',
    examType: 'Term Examination',
  });

  const [activeTab, setActiveTab] = useState('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [showBulkProgress, setShowBulkProgress] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [previewStudent, setPreviewStudent] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(10);
  const printRef = useRef<HTMLDivElement>(null);
  const bulkPreviewRef = useRef<HTMLDivElement>(null);

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: 'New Subject',
      marks: '0',
      maxMarks: '100',
      grade: 'F'
    };
    setReportData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
  };

  const removeSubject = (id: string) => {
    setReportData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject.id !== id)
    }));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setReportData(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject => 
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportData(prev => ({
          ...prev,
          schoolLogo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportData(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportData(prev => ({
          ...prev,
          teacherSignature: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrincipalSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportData(prev => ({
          ...prev,
          principalSignature: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const generatePDF = useCallback(async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${reportData.studentName}_report_card.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [reportData.studentName]);

  const generateImage = useCallback(async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = `${reportData.studentName}_report_card.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [reportData.studentName]);

  const getTemplateName = (type: string) => {
    const templates = {
      'classic': 'Classic Professional',
      'modern': 'Modern Stylish',
      'kids': 'Kids Fun Version',
      'elegant': 'Elegant Academic',
      'compact': 'Compact Digital',
      'nursery-2page': 'Nursery 2-Page',
      'academic-4page': 'Academic 4-Page'
    };
    return templates[type as keyof typeof templates] || 'Unknown Template';
  };

  const generateSampleExcel = () => {
    // Create sample data based on current template subjects
    const sampleData = [
      {
        studentName: 'John Doe',
        className: 'X',
        section: 'A',
        rollNo: '001',
        admissionNumber: 'ADM001',
        dateOfBirth: '2010-05-15',
        parentName: 'Mr. John Smith',
        address: '123 Main Street, City',
        phoneNumber: '+1234567890',
        attendance: '95%',
        comments: 'Excellent student with great potential',
        ...reportData.subjects.reduce((acc, subject) => {
          acc[`${subject.name}_marks`] = subject.marks;
          acc[`${subject.name}_maxMarks`] = subject.maxMarks;
          return acc;
        }, {} as Record<string, string>)
      },
      {
        studentName: 'Jane Smith',
        className: 'X',
        section: 'A',
        rollNo: '002',
        admissionNumber: 'ADM002',
        dateOfBirth: '2010-08-22',
        parentName: 'Mrs. Mary Smith',
        address: '456 Oak Avenue, City',
        phoneNumber: '+1234567891',
        attendance: '92%',
        comments: 'Good student, needs improvement in mathematics',
        ...reportData.subjects.reduce((acc, subject) => {
          const marks = Math.max(40, parseInt(subject.marks) - Math.floor(Math.random() * 20));
          acc[`${subject.name}_marks`] = marks.toString();
          acc[`${subject.name}_maxMarks`] = subject.maxMarks;
          return acc;
        }, {} as Record<string, string>)
      }
    ];

    // Convert to CSV format for download
    const headers = Object.keys(sampleData[0]);
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => 
        headers.map(header => 
          typeof row[header as keyof typeof row] === 'string' && 
          (row[header as keyof typeof row] as string).includes(',') 
            ? `"${row[header as keyof typeof row]}"` 
            : row[header as keyof typeof row]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportData.schoolName}_report_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process the Excel data
        const processedData = jsonData.map((row: any, index) => {
          const subjects = reportData.subjects.map(subject => {
            const marks = row[`${subject.name}_marks`] || subject.marks;
            const maxMarks = row[`${subject.name}_maxMarks`] || subject.maxMarks;
            const grade = calculateGrade(parseInt(marks) || 0, parseInt(maxMarks) || 100);
            
            return {
              ...subject,
              marks: marks.toString(),
              maxMarks: maxMarks.toString(),
              grade
            };
          });

          return {
            ...reportData,
            studentName: row.studentName || `Student ${index + 1}`,
            className: row.className || reportData.className,
            section: row.section || reportData.section,
            rollNo: row.rollNo || `${index + 1}`,
            admissionNumber: row.admissionNumber || '',
            dateOfBirth: row.dateOfBirth || '',
            parentName: row.parentName || '',
            address: row.address || '',
            phoneNumber: row.phoneNumber || '',
            attendance: row.attendance || reportData.attendance,
            comments: row.comments || reportData.comments,
            subjects
          };
        });

        setBulkData(processedData);
        
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast({
          title: "Excel Processing Error",
          description: "Error processing Excel file. Please check the format and try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateTemplate = () => {
    const errors: string[] = [];
    
    if (!reportData.schoolName.trim()) errors.push('School name is required');
    if (!reportData.teacherName.trim()) errors.push('Teacher name is required');
    if (!reportData.principalName.trim()) errors.push('Principal name is required');
    if (reportData.subjects.length === 0) errors.push('At least one subject is required');
    if (reportData.subjects.some(s => !s.name.trim())) errors.push('All subjects must have names');
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateSingleStudentPDF = async (studentData: any, tempContainer?: HTMLDivElement) => {
    // Create temporary container if not provided
    const container = tempContainer || document.createElement('div');
    if (!tempContainer) {
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // A4 width
      container.style.minHeight = '297mm'; // A4 height
      container.style.backgroundColor = '#ffffff';
      container.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(container);
    }

    // Create a React-like render of the template
    container.innerHTML = '';
    const templateElement = renderStudentTemplate(studentData);
    container.appendChild(templateElement);

    // Wait for any images to load
    const images = container.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Generate canvas with better options
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: container.scrollWidth,
      height: container.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
    
    const finalWidth = imgWidth * 0.264583 * ratio;
    const finalHeight = imgHeight * 0.264583 * ratio;
    const x = (pdfWidth - finalWidth) / 2;
    const y = 0;
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Clean up if we created the container
    if (!tempContainer && container.parentNode) {
      document.body.removeChild(container);
    }

    return pdf;
  };

  const renderStudentTemplate = (studentData: any) => {
    const container = document.createElement('div');
    
    // Apply background styles
    const bgStyle = getBackgroundStyle();
    Object.assign(container.style, {
      width: '100%',
      minHeight: '297mm',
      padding: '20mm',
      fontSize: `${studentData.fontSize}px`,
      borderRadius: `${studentData.borderRadius}px`,
      boxShadow: `0 ${studentData.shadowIntensity * 2}px ${studentData.shadowIntensity * 4}px rgba(0,0,0,0.1)`,
      position: 'relative',
      overflow: 'hidden',
      ...bgStyle
    });

    // Render based on template type
    switch (studentData.templateType) {
      case 'classic':
        container.innerHTML = getClassicTemplateHTML(studentData);
        break;
      case 'modern':
        container.innerHTML = getModernTemplateHTML(studentData);
        break;
      case 'kids':
        container.innerHTML = getKidsTemplateHTML(studentData);
        break;
      case 'elegant':
        container.innerHTML = getElegantTemplateHTML(studentData);
        break;
      case 'compact':
        container.innerHTML = getCompactTemplateHTML(studentData);
        break;
      case 'nursery-2page':
        container.innerHTML = getNursery2PageTemplateHTML(studentData);
        break;
      case 'academic-4page':
        container.innerHTML = getAcademic4PageTemplateHTML(studentData);
        break;
      default:
        container.innerHTML = getClassicTemplateHTML(studentData);
    }

    return container;
  };

  const generateBulkPDFs = async () => {
    if (bulkData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload an Excel file first",
        variant: "destructive"
      });
      return;
    }

    if (!validateTemplate()) {
      toast({
        title: "Validation Failed",
        description: "Please fix template validation errors before generating PDFs",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setShowBulkProgress(true);
    setBulkProgress(0);

    const zip = new JSZip();
    const studentsToProcess = Array.from(selectedStudents).length > 0 
      ? Array.from(selectedStudents).map(index => bulkData[index])
      : bulkData;
    
    try {
      // Process in batches to prevent memory issues
      for (let i = 0; i < studentsToProcess.length; i += batchSize) {
        const batch = studentsToProcess.slice(i, i + batchSize);
        
        for (let j = 0; j < batch.length; j++) {
          const studentData = batch[j];
          
          try {
            const pdf = await generateSingleStudentPDF(studentData);
            const pdfBlob = pdf.output('blob');
            zip.file(`${studentData.studentName.replace(/[^a-zA-Z0-9]/g, '_')}_report_card.pdf`, pdfBlob);
          } catch (error) {
            console.error(`Error generating PDF for ${studentData.studentName}:`, error);
            // Continue with other students
          }
          
          // Update progress
          const currentIndex = i + j + 1;
          setBulkProgress(Math.round((currentIndex / studentsToProcess.length) * 100));
          
          // Small delay to prevent browser freeze
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Longer delay between batches
        if (i + batchSize < studentsToProcess.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${reportData.schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_report_cards_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();

      toast({
        title: "Success!",
        description: `Generated ${studentsToProcess.length} report cards successfully`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error generating bulk PDFs:', error);
      toast({
        title: "Generation Failed",
        description: "Error generating PDFs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setShowBulkProgress(false);
      setBulkProgress(0);
    }
  };

  // Template HTML generators
  const getClassicTemplateHTML = (data: any) => {
    return `
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background: white; padding: 2rem; font-family: Arial, sans-serif;">
        <div style="text-center; border-bottom: 2px solid #d1d5db; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          ${data.schoolLogo ? `<img src="${data.schoolLogo}" alt="School Logo" style="width: 4rem; height: 4rem; margin: 0 auto 1rem; object-fit: contain;" />` : ''}
          <h1 style="font-size: 1.5rem; font-weight: bold; color: #374151; margin-bottom: 0.5rem;">${data.schoolName}</h1>
          <h2 style="font-size: 1.125rem; color: #6b7280;">Academic Report Card</h2>
          <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">Academic Year: ${data.year}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Student Name:</strong> ${data.studentName}</div>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Class & Section:</strong> ${data.className} - ${data.section}</div>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Roll Number:</strong> ${data.rollNo}</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Teacher:</strong> ${data.teacherName}</div>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Attendance:</strong> ${data.attendance}</div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">Academic Performance</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: left;">Subject</th>
                <th style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center;">Marks</th>
                <th style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center;">Max Marks</th>
                <th style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center;">Grade</th>
              </tr>
            </thead>
            <tbody>
              ${data.subjects.map((subject: any) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 0.5rem 1rem;">${subject.name}</td>
                  <td style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center;">${subject.marks}</td>
                  <td style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center;">${subject.maxMarks}</td>
                  <td style="border: 1px solid #d1d5db; padding: 0.5rem 1rem; text-align: center; font-weight: bold;">${subject.grade}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${data.comments ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 0.75rem;">Teacher's Comments</h3>
            <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.375rem; border: 1px solid #e5e7eb;">
              <p style="font-size: 0.875rem; line-height: 1.5;">${data.comments}</p>
            </div>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: end; margin-top: 2rem; font-size: 0.875rem;">
          <div style="text-align: center;">
            ${data.teacherSignature ? `<img src="${data.teacherSignature}" alt="Teacher Signature" style="height: 3rem; margin-bottom: 0.5rem;" />` : '<div style="border-top: 1px solid #9ca3af; width: 8rem; margin-bottom: 0.25rem;"></div>'}
            <div>Teacher's Signature</div>
            <div style="font-size: 0.75rem; color: #6b7280;">${data.teacherName}</div>
          </div>
          <div style="text-align: center;">
            ${data.principalSignature ? `<img src="${data.principalSignature}" alt="Principal Signature" style="height: 3rem; margin-bottom: 0.5rem;" />` : '<div style="border-top: 1px solid #9ca3af; width: 8rem; margin-bottom: 0.25rem;"></div>'}
            <div>Principal's Signature</div>
            <div style="font-size: 0.75rem; color: #6b7280;">${data.principalName}</div>
          </div>
        </div>
      </div>
    `;
  };

  const getModernTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  const getKidsTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  const getElegantTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  const getCompactTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  const getNursery2PageTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  const getAcademic4PageTemplateHTML = (data: any) => {
    return getClassicTemplateHTML(data); // Simplified for now
  };

  // Preview and selection functions
  const previewBulkResults = () => {
    if (bulkData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload an Excel file first",
        variant: "destructive"
      });
      return;
    }
    setPreviewStudent(bulkData[0]);
    setShowPreview(true);
  };

  const toggleStudentSelection = (index: number) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedStudents(newSelection);
  };

  const selectAllStudents = () => {
    const allIndexes = new Set(Array.from({ length: bulkData.length }, (_, i) => i));
    setSelectedStudents(allIndexes);
  };

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  };

  const generateBulkImages = async () => {
    // Similar to generateBulkPDFs but for images
    if (bulkData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload an Excel file first",
        variant: "destructive"
      });
      return;
    }

    if (!validateTemplate()) {
      toast({
        title: "Validation Failed",
        description: "Please fix template validation errors before generating images",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setShowBulkProgress(true);
    setBulkProgress(0);

    const zip = new JSZip();
    const studentsToProcess = Array.from(selectedStudents).length > 0 
      ? Array.from(selectedStudents).map(index => bulkData[index])
      : bulkData;
    
    try {
      for (let i = 0; i < studentsToProcess.length; i++) {
        const studentData = studentsToProcess[i];
        
        try {
          // Create temporary container for rendering
          const container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.width = '210mm';
          container.style.minHeight = '297mm';
          container.style.backgroundColor = '#ffffff';
          document.body.appendChild(container);

          const templateElement = renderStudentTemplate(studentData);
          container.appendChild(templateElement);

          // Wait for images to load
          const images = container.querySelectorAll('img');
          await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }));

          // Generate canvas
          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });

          // Convert to blob and add to ZIP
          canvas.toBlob(blob => {
            if (blob) {
              zip.file(`${studentData.studentName.replace(/[^a-zA-Z0-9]/g, '_')}_report_card.png`, blob);
            }
          }, 'image/png');

          // Clean up
          document.body.removeChild(container);
          
        } catch (error) {
          console.error(`Error generating image for ${studentData.studentName}:`, error);
        }
        
        // Update progress
        setBulkProgress(Math.round((i + 1) / studentsToProcess.length * 100));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${reportData.schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_report_images_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();

      toast({
        title: "Success!",
        description: `Generated ${studentsToProcess.length} image files successfully`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error generating bulk images:', error);
      toast({
        title: "Generation Failed",
        description: "Error generating images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setShowBulkProgress(false);
      setBulkProgress(0);
    }
  };

  const getBackgroundStyle = () => {
    switch (reportData.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${reportData.gradientColors.from}, ${reportData.gradientColors.to})`
        };
      case 'pattern':
        return {
          backgroundColor: reportData.backgroundColor,
          backgroundImage: getPatternImage()
        };
      case 'image':
        return reportData.backgroundImage ? {
          backgroundImage: `url(${reportData.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : { backgroundColor: reportData.backgroundColor };
      default:
        return { backgroundColor: reportData.backgroundColor };
    }
  };

  const getPatternImage = () => {
    switch (reportData.patternType) {
      case 'dots':
        return 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)';
      case 'lines':
        return 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)';
      case 'grid':
        return 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)';
      case 'waves':
        return 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, transparent 70%)';
      default:
        return '';
    }
  };

  const renderTemplate = () => {
    const baseStyle = {
      ...getBackgroundStyle(),
      fontSize: `${reportData.fontSize}px`,
      borderRadius: `${reportData.borderRadius}px`,
      boxShadow: `0 ${reportData.shadowIntensity * 2}px ${reportData.shadowIntensity * 4}px rgba(0,0,0,0.1)`,
      position: 'relative' as const,
      overflow: 'hidden' as const
    };

    const watermarkStyle = reportData.watermark ? {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'rgba(0,0,0,0.05)',
      zIndex: 1,
      pointerEvents: 'none' as const
    } : {};

    switch (reportData.templateType) {
      case 'classic':
        return <ClassicTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'modern':
        return <ModernTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'kids':
        return <KidsTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'elegant':
        return <ElegantTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'compact':
        return <CompactTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'nursery-2page':
        return <Nursery2PageTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      case 'academic-4page':
        return <Academic4PageTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
      default:
        return <ClassicTemplate data={reportData} style={baseStyle} watermarkStyle={watermarkStyle} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            Report Card Editor
          </h1>
          <p className="text-gray-600">Create beautiful, customizable report cards for your school</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'bulk') {
            validateTemplate();
          }
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Bulk Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>School Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">School Name</Label>
                      <Input
                        id="schoolName"
                        value={reportData.schoolName}
                        onChange={(e) => setReportData(prev => ({ ...prev, schoolName: e.target.value }))}
                        placeholder="Enter school name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolLogo">School Logo</Label>
                      <Input
                        id="schoolLogo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentName">Student Name</Label>
                        <Input
                          id="studentName"
                          value={reportData.studentName}
                          onChange={(e) => setReportData(prev => ({ ...prev, studentName: e.target.value }))}
                          placeholder="Enter student name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rollNo">Roll Number</Label>
                        <Input
                          id="rollNo"
                          value={reportData.rollNo}
                          onChange={(e) => setReportData(prev => ({ ...prev, rollNo: e.target.value }))}
                          placeholder="Enter roll number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="className">Class</Label>
                        <Input
                          id="className"
                          value={reportData.className}
                          onChange={(e) => setReportData(prev => ({ ...prev, className: e.target.value }))}
                          placeholder="Enter class"
                        />
                      </div>
                      <div>
                        <Label htmlFor="section">Section</Label>
                        <Input
                          id="section"
                          value={reportData.section}
                          onChange={(e) => setReportData(prev => ({ ...prev, section: e.target.value }))}
                          placeholder="Enter section"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          value={reportData.year}
                          onChange={(e) => setReportData(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="Enter year"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="teacherName">Teacher Name</Label>
                        <Input
                          id="teacherName"
                          value={reportData.teacherName}
                          onChange={(e) => setReportData(prev => ({ ...prev, teacherName: e.target.value }))}
                          placeholder="Enter teacher name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="attendance">Attendance</Label>
                        <Input
                          id="attendance"
                          value={reportData.attendance}
                          onChange={(e) => setReportData(prev => ({ ...prev, attendance: e.target.value }))}
                          placeholder="Enter attendance %"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="principalName">Principal Name</Label>
                        <Input
                          id="principalName"
                          value={reportData.principalName}
                          onChange={(e) => setReportData(prev => ({ ...prev, principalName: e.target.value }))}
                          placeholder="Enter principal name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admissionNumber">Admission Number</Label>
                        <Input
                          id="admissionNumber"
                          value={reportData.admissionNumber}
                          onChange={(e) => setReportData(prev => ({ ...prev, admissionNumber: e.target.value }))}
                          placeholder="Enter admission number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={reportData.dateOfBirth}
                          onChange={(e) => setReportData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="parentName">Parent Name</Label>
                        <Input
                          id="parentName"
                          value={reportData.parentName}
                          onChange={(e) => setReportData(prev => ({ ...prev, parentName: e.target.value }))}
                          placeholder="Enter parent name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="termName">Term/Semester</Label>
                        <Input
                          id="termName"
                          value={reportData.termName}
                          onChange={(e) => setReportData(prev => ({ ...prev, termName: e.target.value }))}
                          placeholder="Enter term name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="examType">Exam Type</Label>
                        <Input
                          id="examType"
                          value={reportData.examType}
                          onChange={(e) => setReportData(prev => ({ ...prev, examType: e.target.value }))}
                          placeholder="Enter exam type"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={reportData.address}
                        onChange={(e) => setReportData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter student address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={reportData.phoneNumber}
                          onChange={(e) => setReportData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>School Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="schoolAddress">School Address</Label>
                      <Textarea
                        id="schoolAddress"
                        value={reportData.schoolAddress}
                        onChange={(e) => setReportData(prev => ({ ...prev, schoolAddress: e.target.value }))}
                        placeholder="Enter school address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schoolPhone">School Phone</Label>
                        <Input
                          id="schoolPhone"
                          value={reportData.schoolPhone}
                          onChange={(e) => setReportData(prev => ({ ...prev, schoolPhone: e.target.value }))}
                          placeholder="Enter school phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="schoolEmail">School Email</Label>
                        <Input
                          id="schoolEmail"
                          type="email"
                          value={reportData.schoolEmail}
                          onChange={(e) => setReportData(prev => ({ ...prev, schoolEmail: e.target.value }))}
                          placeholder="Enter school email"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="teacherSignature">Teacher Signature Image</Label>
                      <Input
                        id="teacherSignature"
                        type="file"
                        accept="image/*"
                        onChange={handleTeacherSignatureUpload}
                        className="cursor-pointer"
                      />
                      {reportData.teacherSignature && (
                        <div className="mt-2">
                          <img src={reportData.teacherSignature} alt="Teacher Signature" className="h-16 border rounded" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="principalSignature">Principal Signature Image</Label>
                      <Input
                        id="principalSignature"
                        type="file"
                        accept="image/*"
                        onChange={handlePrincipalSignatureUpload}
                        className="cursor-pointer"
                      />
                      {reportData.principalSignature && (
                        <div className="mt-2">
                          <img src={reportData.principalSignature} alt="Principal Signature" className="h-16 border rounded" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Subjects & Marks
                      <Button onClick={addSubject} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Subject
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reportData.subjects.map((subject, index) => (
                      <div key={subject.id} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg">
                        <div className="col-span-4">
                          <Input
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="Subject name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={subject.marks}
                            onChange={(e) => {
                              updateSubject(subject.id, 'marks', e.target.value);
                              const grade = calculateGrade(parseInt(e.target.value) || 0, parseInt(subject.maxMarks) || 100);
                              updateSubject(subject.id, 'grade', grade);
                            }}
                            placeholder="Marks"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={subject.maxMarks}
                            onChange={(e) => {
                              updateSubject(subject.id, 'maxMarks', e.target.value);
                              const grade = calculateGrade(parseInt(subject.marks) || 0, parseInt(e.target.value) || 100);
                              updateSubject(subject.id, 'grade', grade);
                            }}
                            placeholder="Max"
                          />
                        </div>
                        <div className="col-span-2">
                          <Badge variant={subject.grade.includes('A') ? 'default' : subject.grade === 'B+' || subject.grade === 'B' ? 'secondary' : 'destructive'}>
                            {subject.grade}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Button
                            onClick={() => removeSubject(subject.id)}
                            size="sm"
                            variant="destructive"
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Template Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          if (validateTemplate()) {
                            toast({
                              title: "Validation Passed ✅",
                              description: "Your template is ready for bulk generation!",
                              variant: "default"
                            });
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validate Template
                      </Button>
                      <Button 
                        onClick={() => {
                          localStorage.setItem('reportCardTemplate', JSON.stringify(reportData));
                          toast({
                            title: "Template Saved 💾",
                            description: "Your template has been saved locally",
                            variant: "default"
                          });
                        }}
                        variant="outline"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                      </Button>
                      <Button 
                        onClick={() => {
                          const saved = localStorage.getItem('reportCardTemplate');
                          if (saved) {
                            setReportData(JSON.parse(saved));
                            toast({
                              title: "Template Loaded 📂",
                              description: "Your saved template has been loaded",
                              variant: "default"
                            });
                          } else {
                            toast({
                              title: "No Template Found",
                              description: "No saved template was found",
                              variant: "destructive"
                            });
                          }
                        }}
                        variant="outline"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Load Template
                      </Button>
                    </div>
                    
                    {validationErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-sm font-semibold text-red-800 mb-2">Validation Errors:</div>
                        <ul className="space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comments & Remarks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={reportData.comments}
                      onChange={(e) => setReportData(prev => ({ ...prev, comments: e.target.value }))}
                      placeholder="Enter teacher comments..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="lg:sticky lg:top-4">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-white" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%', height: '166.67%' }}>
                      {renderTemplate()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={reportData.templateType} onValueChange={(value: any) => setReportData(prev => ({ ...prev, templateType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic Professional</SelectItem>
                        <SelectItem value="modern">Modern Stylish</SelectItem>
                        <SelectItem value="kids">Kids Fun Version</SelectItem>
                        <SelectItem value="elegant">Elegant Academic</SelectItem>
                        <SelectItem value="compact">Compact Digital</SelectItem>
                        <SelectItem value="nursery-2page">Nursery 2-Page</SelectItem>
                        <SelectItem value="academic-4page">Academic 4-Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Background Type</Label>
                      <Select value={reportData.backgroundType} onValueChange={(value: any) => setReportData(prev => ({ ...prev, backgroundType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="color">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="pattern">Pattern</SelectItem>
                          <SelectItem value="image">Custom Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {reportData.backgroundType === 'color' && (
                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={reportData.backgroundColor}
                          onChange={(e) => setReportData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        />
                      </div>
                    )}

                    {reportData.backgroundType === 'gradient' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>From Color</Label>
                          <Input
                            type="color"
                            value={reportData.gradientColors.from}
                            onChange={(e) => setReportData(prev => ({ 
                              ...prev, 
                              gradientColors: { ...prev.gradientColors, from: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>To Color</Label>
                          <Input
                            type="color"
                            value={reportData.gradientColors.to}
                            onChange={(e) => setReportData(prev => ({ 
                              ...prev, 
                              gradientColors: { ...prev.gradientColors, to: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    )}

                    {reportData.backgroundType === 'pattern' && (
                      <div>
                        <Label>Pattern Type</Label>
                        <Select value={reportData.patternType} onValueChange={(value: any) => setReportData(prev => ({ ...prev, patternType: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="lines">Lines</SelectItem>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="waves">Waves</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {reportData.backgroundType === 'image' && (
                      <div>
                        <Label>Background Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          className="cursor-pointer"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="watermark">Watermark Text</Label>
                      <Input
                        id="watermark"
                        value={reportData.watermark}
                        onChange={(e) => setReportData(prev => ({ ...prev, watermark: e.target.value }))}
                        placeholder="Enter watermark text (optional)"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fun Elements (Kids Theme)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rainbow className="h-4 w-4 text-purple-500" />
                        <Label>Enable Rainbow Effects</Label>
                      </div>
                      <Switch
                        checked={reportData.enableRainbow}
                        onCheckedChange={(checked) => setReportData(prev => ({ ...prev, enableRainbow: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <Label>Enable Emojis</Label>
                      </div>
                      <Switch
                        checked={reportData.enableEmojis}
                        onCheckedChange={(checked) => setReportData(prev => ({ ...prev, enableEmojis: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <Label>Enable Stickers</Label>
                      </div>
                      <Switch
                        checked={reportData.enableStickers}
                        onCheckedChange={(checked) => setReportData(prev => ({ ...prev, enableStickers: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography & Styling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Font Size: {reportData.fontSize}px</Label>
                      <Slider
                        value={[reportData.fontSize]}
                        onValueChange={([value]) => setReportData(prev => ({ ...prev, fontSize: value }))}
                        min={12}
                        max={24}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Border Radius: {reportData.borderRadius}px</Label>
                      <Slider
                        value={[reportData.borderRadius]}
                        onValueChange={([value]) => setReportData(prev => ({ ...prev, borderRadius: value }))}
                        min={0}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Shadow Intensity: {reportData.shadowIntensity}</Label>
                      <Slider
                        value={[reportData.shadowIntensity]}
                        onValueChange={([value]) => setReportData(prev => ({ ...prev, shadowIntensity: value }))}
                        min={0}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Customization Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-white" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%', height: '166.67%' }}>
                      {renderTemplate()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Print Preview</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={generateImage} 
                  disabled={isGenerating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Export PNG
                </Button>
                <Button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
              <div ref={printRef}>
                {renderTemplate()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Report Card Generation</h2>
                <p className="text-gray-600">Upload an Excel file to generate report cards for multiple students using your custom template</p>
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Excel Format Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Required Excel Columns:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div>• <strong>studentName</strong> - Student's full name</div>
                        <div>• <strong>className</strong> - Class (e.g., "10", "V")</div>
                        <div>• <strong>section</strong> - Section (e.g., "A", "B")</div>
                        <div>• <strong>rollNo</strong> - Roll number</div>
                        <div>• <strong>attendance</strong> - Attendance percentage</div>
                        <div>• <strong>comments</strong> - Teacher comments</div>
                      </div>
                      <div className="space-y-1">
                        <div>• <strong>admissionNumber</strong> - Admission number</div>
                        <div>• <strong>dateOfBirth</strong> - Date of birth (YYYY-MM-DD)</div>
                        <div>• <strong>parentName</strong> - Parent/Guardian name</div>
                        <div>• <strong>address</strong> - Student address</div>
                        <div>• <strong>phoneNumber</strong> - Contact number</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Subject Columns:</h3>
                    <div className="text-sm text-green-700">
                      <p className="mb-2">For each subject, create columns with the pattern:</p>
                      <div className="bg-white p-2 rounded border font-mono text-xs">
                        subjectName_marks, subjectName_maxMarks
                      </div>
                      <p className="mt-2">Example: Mathematics_marks, Mathematics_maxMarks, Science_marks, Science_maxMarks</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => generateSampleExcel()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample Excel
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-blue-600 text-blue-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Excel Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      Template Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => setActiveTab('edit')} 
                      className="mt-3 bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      Fix Template Issues
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-purple-600" />
                    Upload Student Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-gray-700">Drop your Excel file here</div>
                      <div className="text-sm text-gray-500">or click to browse</div>
                    </div>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      id="bulk-upload"
                      onChange={handleBulkUpload}
                    />
                    <Button 
                      onClick={() => document.getElementById('bulk-upload')?.click()}
                      variant="outline"
                      className="mt-4"
                    >
                      Choose Excel File
                    </Button>
                    
                    {bulkData.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-800">
                          ✅ <strong>{bulkData.length} students</strong> loaded successfully!
                        </div>
                      </div>
                    )}
                    
                    {showBulkProgress && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800 mb-2">
                          Processing: {bulkProgress}% complete
                        </div>
                        <Progress value={bulkProgress} className="w-full" />
                        <div className="text-xs text-blue-600 mt-1 text-center">
                          Please wait while we generate your report cards...
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <div className="text-yellow-600 mt-0.5">⚠️</div>
                      <div className="text-sm text-yellow-700">
                        <strong>Note:</strong> Make sure your Excel file follows the format above. 
                        The system will use your current template design and settings for all generated report cards.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Selection & Management */}
              {bulkData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Student Management ({bulkData.length} students loaded)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selection Controls */}
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={selectAllStudents} variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Select All ({bulkData.length})
                      </Button>
                      <Button onClick={deselectAllStudents} variant="outline" size="sm">
                        Deselect All
                      </Button>
                      <Button onClick={previewBulkResults} variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview Results
                      </Button>
                      <div className="flex items-center gap-2 ml-auto">
                        <Label htmlFor="batchSize" className="text-sm">Batch Size:</Label>
                        <Input
                          id="batchSize"
                          type="number"
                          min="1"
                          max="50"
                          value={batchSize}
                          onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                          className="w-16 h-8"
                        />
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      <div className="space-y-1 p-2">
                        {bulkData.map((student, index) => (
                          <div 
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              selectedStudents.has(index) ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                            onClick={() => toggleStudentSelection(index)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(index)}
                              onChange={() => toggleStudentSelection(index)}
                              className="rounded"
                            />
                            <div className="flex-1 text-sm">
                              <div className="font-medium">{student.studentName}</div>
                              <div className="text-gray-500">
                                {student.className}-{student.section} | Roll: {student.rollNo}
                              </div>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewStudent(student);
                                setShowPreview(true);
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span>Selected: {selectedStudents.size} students</span>
                        <span>Processing will be done in batches of {batchSize}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview & Generate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    Template Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Current Template Settings:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div><strong>Template:</strong> {getTemplateName(reportData.templateType)}</div>
                        <div><strong>School:</strong> {reportData.schoolName}</div>
                        <div><strong>Term:</strong> {reportData.termName}</div>
                      </div>
                      <div>
                        <div><strong>Year:</strong> {reportData.year}</div>
                        <div><strong>Exam Type:</strong> {reportData.examType}</div>
                        <div><strong>Background:</strong> {reportData.backgroundType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white" style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}>
                    {renderTemplate()}
                  </div>
                </CardContent>
              </Card>

              {/* Generation Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-600" />
                    Generate Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Button 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isGenerating || bulkData.length === 0}
                      onClick={generateBulkPDFs}
                    >
                      {isGenerating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Generate All PDFs ({Array.from(selectedStudents).length > 0 ? selectedStudents.size : bulkData.length})
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={isGenerating || bulkData.length === 0}
                      onClick={generateBulkImages}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate All Images ({Array.from(selectedStudents).length > 0 ? selectedStudents.size : bulkData.length})
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isGenerating || bulkData.length === 0}
                      onClick={generateBulkPDFs}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download as ZIP
                    </Button>
                  </div>

                  {bulkData.length > 0 ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="text-green-600">✅</div>
                        <div className="text-sm">
                          <strong>Ready for Bulk Generation!</strong> {bulkData.length} students loaded and ready to process with your custom template.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-700">
                        <div className="text-orange-600">⏳</div>
                        <div className="text-sm">
                          <strong>Upload Excel File</strong> to start bulk generation. Your template is configured and ready!
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bulk Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview Report Card - {previewStudent?.studentName || 'Student'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {previewStudent && (
              <div className="border rounded-lg p-4 bg-white" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                <div ref={bulkPreviewRef}>
                  {(() => {
                    switch (previewStudent.templateType) {
                      case 'classic':
                        return <ClassicTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'modern':
                        return <ModernTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'kids':
                        return <KidsTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'elegant':
                        return <ElegantTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'compact':
                        return <CompactTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'nursery-2page':
                        return <Nursery2PageTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      case 'academic-4page':
                        return <Academic4PageTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                      default:
                        return <ClassicTemplate data={previewStudent} style={getBackgroundStyle()} watermarkStyle={{}} />;
                    }
                  })()}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                {bulkData.map((student, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={previewStudent === student ? "default" : "outline"}
                    onClick={() => setPreviewStudent(student)}
                    className="text-xs"
                  >
                    {student.studentName.split(' ')[0]}
                  </Button>
                )).slice(0, 10)}
                {bulkData.length > 10 && <span className="text-sm text-gray-500">+{bulkData.length - 10} more</span>}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    if (previewStudent) {
                      const pdf = await generateSingleStudentPDF(previewStudent);
                      pdf.save(`${previewStudent.studentName}_preview.pdf`);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button onClick={() => setShowPreview(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Template Components
const ClassicTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-2xl mx-auto bg-white p-8 font-sans" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
      {data.schoolLogo && (
        <img src={data.schoolLogo} alt="School Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
      )}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.schoolName}</h1>
      <h2 className="text-lg text-gray-600">Academic Report Card</h2>
      <div className="text-sm text-gray-500 mt-2">Academic Year: {data.year}</div>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <div className="space-y-2 text-sm">
          <div><strong>Student Name:</strong> {data.studentName}</div>
          <div><strong>Class & Section:</strong> {data.className} - {data.section}</div>
          <div><strong>Roll Number:</strong> {data.rollNo}</div>
        </div>
      </div>
      <div>
        <div className="space-y-2 text-sm">
          <div><strong>Teacher:</strong> {data.teacherName}</div>
          <div><strong>Attendance:</strong> {data.attendance}</div>
        </div>
      </div>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Academic Performance</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Marks</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Max Marks</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Grade</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((subject: Subject) => (
            <tr key={subject.id}>
              <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{subject.marks}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{subject.maxMarks}</td>
              <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{subject.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {data.comments && (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Teacher's Comments</h3>
        <div className="bg-gray-50 p-4 rounded border">
          <p className="text-sm leading-relaxed">{data.comments}</p>
        </div>
      </div>
    )}

    <div className="flex justify-between items-end mt-8 text-sm">
      <div className="text-center">
        {data.teacherSignature ? (
          <img src={data.teacherSignature} alt="Teacher Signature" className="h-12 mb-2" />
        ) : (
          <div className="border-t border-gray-400 w-32 mb-1"></div>
        )}
        <div>Teacher's Signature</div>
        <div className="text-xs text-gray-600">{data.teacherName}</div>
      </div>
      <div className="text-center">
        {data.principalSignature ? (
          <img src={data.principalSignature} alt="Principal Signature" className="h-12 mb-2" />
        ) : (
          <div className="border-t border-gray-400 w-32 mb-1"></div>
        )}
        <div>Principal's Signature</div>
        <div className="text-xs text-gray-600">{data.principalName}</div>
      </div>
    </div>
  </div>
);

const ModernTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-2xl mx-auto bg-white overflow-hidden" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{data.schoolName}</h1>
          <div className="flex items-center gap-4 text-blue-100">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Report Card</span>
            <span>{data.year}</span>
          </div>
        </div>
        {data.schoolLogo && (
          <img src={data.schoolLogo} alt="School Logo" className="w-20 h-20 object-contain rounded-lg bg-white/10 p-2" />
        )}
      </div>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">{data.studentName}</div>
            <div className="text-sm text-gray-600">Student Name</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">{data.className}-{data.section}</div>
            <div className="text-sm text-gray-600">Class & Section</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">{data.rollNo}</div>
            <div className="text-sm text-gray-600">Roll Number</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
          Academic Performance
        </h3>
        <div className="space-y-3">
          {data.subjects.map((subject: Subject) => {
            const percentage = Math.round((parseInt(subject.marks) / parseInt(subject.maxMarks)) * 100);
            return (
              <div key={subject.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{subject.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{subject.marks}/{subject.maxMarks}</span>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      subject.grade.includes('A') ? 'bg-green-100 text-green-800' :
                      subject.grade.includes('B') ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subject.grade}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.comments && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded"></div>
            Teacher's Feedback
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed italic">"{data.comments}"</p>
            <div className="text-right text-sm text-gray-600 mt-2">- {data.teacherName}</div>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            <div><strong>Attendance:</strong> {data.attendance}</div>
            <div><strong>Teacher:</strong> {data.teacherName}</div>
          </div>
          <div className="text-right text-xs text-gray-400">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-6">
          <div className="text-center">
            {data.teacherSignature ? (
              <img src={data.teacherSignature} alt="Teacher Signature" className="h-12 mb-2" />
            ) : (
              <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
            )}
            <div className="text-sm font-semibold">Class Teacher</div>
            <div className="text-xs text-gray-600">{data.teacherName}</div>
          </div>
          <div className="text-center">
            {data.principalSignature ? (
              <img src={data.principalSignature} alt="Principal Signature" className="h-12 mb-2" />
            ) : (
              <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
            )}
            <div className="text-sm font-semibold">Principal</div>
            <div className="text-xs text-gray-600">{data.principalName}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const KidsTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-2xl mx-auto bg-white overflow-hidden" style={{
    ...style,
    background: data.enableRainbow ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b, #eb4d4b, #6c5ce7)' : style.background,
    backgroundSize: data.enableRainbow ? '400% 400%' : 'auto',
    animation: data.enableRainbow ? 'rainbowGradient 3s ease infinite' : 'none'
  }}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white p-6 overflow-hidden">
      <div className="absolute top-2 right-2 text-3xl animate-bounce">⭐</div>
      <div className="absolute bottom-2 left-2 text-2xl animate-pulse">🎈</div>
      <div className="absolute top-1/2 right-8 text-2xl animate-spin">🌟</div>
      
      <div className="text-center relative z-10">
        <div className="text-4xl font-bold mb-2 drop-shadow-lg">
          {data.enableEmojis && '🏫 '}{data.schoolName}{data.enableEmojis && ' 📚'}
        </div>
        <div className="text-xl font-semibold bg-white/20 inline-block px-4 py-2 rounded-full">
          {data.enableEmojis && '🌈 '}Super Star Report Card{data.enableEmojis && ' ⭐'}
        </div>
        <div className="mt-2 text-pink-100">Academic Year: {data.year}</div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-b from-yellow-50 to-pink-50">
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
          {data.enableEmojis && '👦 '}{data.studentName}{data.enableEmojis && ' 👧'}
        </div>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <span className="bg-blue-100 px-3 py-1 rounded-full">Class: {data.className}-{data.section}</span>
          <span className="bg-green-100 px-3 py-1 rounded-full">Roll: {data.rollNo}</span>
          <span className="bg-purple-100 px-3 py-1 rounded-full">Attendance: {data.attendance}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-center mb-4 text-purple-600">
          {data.enableEmojis && '📊 '}My Amazing Grades{data.enableEmojis && ' 🎯'}
        </h3>
        <div className="space-y-4">
          {data.subjects.map((subject: Subject, index) => (
            <div key={subject.id} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-dashed border-purple-200 relative overflow-hidden">
              {data.enableStickers && (
                <div className="absolute top-2 right-2 text-xl">
                  {subject.grade.includes('A') ? '🏆' : subject.grade.includes('B') ? '⭐' : '💪'}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index % 5 === 0 ? 'bg-red-400' :
                    index % 5 === 1 ? 'bg-blue-400' :
                    index % 5 === 2 ? 'bg-green-400' :
                    index % 5 === 3 ? 'bg-yellow-400' : 'bg-purple-400'
                  }`}>
                    {subject.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-800">{subject.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">{subject.marks}</div>
                    <div className="text-xs text-gray-500">out of {subject.maxMarks}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white font-bold text-lg ${
                    subject.grade.includes('A') ? 'bg-green-400' :
                    subject.grade.includes('B') ? 'bg-blue-400' :
                    'bg-orange-400'
                  }`}>
                    {subject.grade}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.comments && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center mb-3 text-pink-600">
            {data.enableEmojis && '💌 '}Teacher's Special Message{data.enableEmojis && ' 💝'}
          </h3>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-2xl border-2 border-dashed border-pink-300 relative">
            {data.enableStickers && (
              <>
                <div className="absolute top-2 left-2 text-lg">💕</div>
                <div className="absolute bottom-2 right-2 text-lg">✨</div>
              </>
            )}
            <p className="text-center text-gray-700 font-semibold italic">"{data.comments}"</p>
            <div className="text-center text-purple-600 mt-2 font-bold">- {data.teacherName} {data.enableEmojis && '👩‍🏫'}</div>
          </div>
        </div>
      )}

      <div className="text-center mt-6 mb-8">
        <div className="inline-flex gap-4 text-sm">
          <span className="bg-yellow-200 px-3 py-1 rounded-full">Keep it up! {data.enableEmojis && '🌟'}</span>
          <span className="bg-green-200 px-3 py-1 rounded-full">You're awesome! {data.enableEmojis && '🎉'}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mt-8">
        <div className="text-center">
          {data.teacherSignature ? (
            <img src={data.teacherSignature} alt="Teacher Signature" className="h-12 mb-2" />
          ) : (
            <div className="border-t-2 border-purple-400 w-32 mb-2"></div>
          )}
          <div className="text-sm font-bold text-purple-600">Teacher</div>
          <div className="text-xs text-gray-600">{data.teacherName} {data.enableEmojis && '👩‍🏫'}</div>
        </div>
        <div className="text-center">
          {data.principalSignature ? (
            <img src={data.principalSignature} alt="Principal Signature" className="h-12 mb-2" />
          ) : (
            <div className="border-t-2 border-blue-400 w-32 mb-2"></div>
          )}
          <div className="text-sm font-bold text-blue-600">Principal</div>
          <div className="text-xs text-gray-600">{data.principalName} {data.enableEmojis && '👨‍💼'}</div>
        </div>
      </div>
    </div>
  </div>
);

const ElegantTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-4xl mx-auto bg-white" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    {/* Page 1 */}
    <div className="min-h-[297mm] p-8 border-2 border-gray-200">
      <div className="flex items-center justify-between border-b-4 border-gold pb-4 mb-8">
        {data.schoolLogo && (
          <img src={data.schoolLogo} alt="School Logo" className="w-20 h-20 object-contain" />
        )}
        <div className="text-center flex-1">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">{data.schoolName}</h1>
          <div className="text-sm text-gray-600 uppercase tracking-wider">Academic Excellence Report</div>
          <div className="text-xs text-gray-500 mt-1">Academic Session {data.year}</div>
        </div>
        <div className="w-20 flex justify-end">
          <div className="text-right text-xs text-gray-500">
            <div>Date:</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-gray-800 border-b border-gray-300 pb-1">Student Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Student Name:</span>
              <span className="font-semibold">{data.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class & Section:</span>
              <span className="font-semibold">{data.className} - {data.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Roll Number:</span>
              <span className="font-semibold">{data.rollNo}</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-gray-800 border-b border-gray-300 pb-1">Academic Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Class Teacher:</span>
              <span className="font-semibold">{data.teacherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Attendance:</span>
              <span className="font-semibold">{data.attendance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Subjects:</span>
              <span className="font-semibold">{data.subjects.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-serif font-bold text-xl text-gray-800 mb-4 text-center">Academic Performance Summary</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-400 px-4 py-3 text-left font-serif">Subject</th>
              <th className="border border-gray-400 px-4 py-3 text-center">Marks Obtained</th>
              <th className="border border-gray-400 px-4 py-3 text-center">Maximum Marks</th>
              <th className="border border-gray-400 px-4 py-3 text-center">Percentage</th>
              <th className="border border-gray-400 px-4 py-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject: Subject, index) => {
              const percentage = Math.round((parseInt(subject.marks) / parseInt(subject.maxMarks)) * 100);
              return (
                <tr key={subject.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">{subject.name}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{subject.marks}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{subject.maxMarks}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{percentage}%</td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-bold text-lg">{subject.grade}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-800 text-white font-bold">
              <td className="border border-gray-400 px-4 py-3">TOTAL</td>
              <td className="border border-gray-400 px-4 py-3 text-center">
                {data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0)}
              </td>
              <td className="border border-gray-400 px-4 py-3 text-center">
                {data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)}
              </td>
              <td className="border border-gray-400 px-4 py-3 text-center">
                {Math.round((data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0) / 
                data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)) * 100)}%
              </td>
              <td className="border border-gray-400 px-4 py-3 text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.comments && (
        <div className="mb-8">
          <h3 className="font-serif font-bold text-lg text-gray-800 mb-3">Class Teacher's Remarks</h3>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <p className="text-sm leading-relaxed font-serif italic">"{data.comments}"</p>
            <div className="text-right text-xs text-gray-600 mt-3">- {data.teacherName}</div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mt-12">
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-40 mb-2"></div>
          <div className="text-sm font-semibold">Class Teacher</div>
          <div className="text-xs text-gray-600">{data.teacherName}</div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-40 mb-2"></div>
          <div className="text-sm font-semibold">Principal</div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-40 mb-2"></div>
          <div className="text-sm font-semibold">Parent's Signature</div>
        </div>
      </div>
    </div>
  </div>
);

const CompactTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-xl mx-auto bg-white p-6" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-3">
        {data.schoolLogo && (
          <img src={data.schoolLogo} alt="School Logo" className="w-12 h-12 object-contain" />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-800">{data.schoolName}</h1>
          <div className="text-xs text-gray-600">Digital Report Card • {data.year}</div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-lg text-gray-800">{data.studentName}</div>
          <div className="text-sm text-gray-600">Class {data.className}-{data.section} • Roll No. {data.rollNo}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Attendance</div>
          <div className="font-bold text-green-600">{data.attendance}</div>
        </div>
      </div>
    </div>

    <div className="mb-4">
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 bg-gray-100 p-2 rounded-t">
        <div>Subject</div>
        <div className="text-center">Marks</div>
        <div className="text-center">Max</div>
        <div className="text-center">Grade</div>
      </div>
      {data.subjects.map((subject: Subject, index) => (
        <div key={subject.id} className={`grid grid-cols-4 gap-2 text-xs p-2 border-b ${
          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
        }`}>
          <div className="font-medium truncate">{subject.name}</div>
          <div className="text-center">{subject.marks}</div>
          <div className="text-center">{subject.maxMarks}</div>
          <div className="text-center">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              subject.grade.includes('A') ? 'bg-green-100 text-green-800' :
              subject.grade.includes('B') ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {subject.grade}
            </span>
          </div>
        </div>
      ))}
    </div>

    {data.comments && (
      <div className="mb-4">
        <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-400">
          <div className="text-xs font-semibold text-gray-700 mb-1">Teacher's Comments</div>
          <p className="text-xs text-gray-600 leading-relaxed">{data.comments}</p>
        </div>
      </div>
    )}

    <div className="mt-6 pt-3 border-t">
      <div className="flex justify-between items-end mb-4">
        <div className="text-center">
          {data.teacherSignature ? (
            <img src={data.teacherSignature} alt="Teacher Signature" className="h-8 mb-1" />
          ) : (
            <div className="border-t border-gray-400 w-20 mb-1"></div>
          )}
          <div className="text-xs font-semibold">Teacher</div>
          <div className="text-xs text-gray-500">{data.teacherName}</div>
        </div>
        <div className="text-center">
          {data.principalSignature ? (
            <img src={data.principalSignature} alt="Principal Signature" className="h-8 mb-1" />
          ) : (
            <div className="border-t border-gray-400 w-20 mb-1"></div>
          )}
          <div className="text-xs font-semibold">Principal</div>
          <div className="text-xs text-gray-500">{data.principalName}</div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400">
        Generated: {new Date().toLocaleDateString()}
      </div>
    </div>
  </div>
);

// New Template Components
const Nursery2PageTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-4xl mx-auto bg-white" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    {/* Page 1 */}
    <div className="min-h-[297mm] p-8 border-2 border-orange-200 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-100 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 right-8 w-8 h-8 bg-pink-100 rounded-full opacity-30"></div>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="flex items-center justify-center gap-6 mb-4">
          {data.schoolLogo && (
            <img src={data.schoolLogo} alt="School Logo" className="w-20 h-20 object-contain rounded-lg shadow-md" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-purple-800 mb-2">{data.schoolName}</h1>
            <div className="text-lg text-orange-600 font-semibold">🌟 Progress Report 🌟</div>
            <div className="text-sm text-gray-600">{data.termName} - {data.year}</div>
          </div>
          <div className="text-6xl">🎈</div>
        </div>
      </div>

      {/* Student Information in colorful boxes */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 border-4 border-dashed border-blue-300">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            👦 Student Details
          </h3>
          <div className="space-y-3 text-sm">
            <div><strong>Name:</strong> {data.studentName}</div>
            <div><strong>Class:</strong> {data.className} - {data.section}</div>
            <div><strong>Roll No:</strong> {data.rollNo}</div>
            <div><strong>Admission No:</strong> {data.admissionNumber}</div>
            {data.dateOfBirth && <div><strong>DOB:</strong> {new Date(data.dateOfBirth).toLocaleDateString()}</div>}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-6 border-4 border-dashed border-pink-300">
          <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
            📋 Academic Info
          </h3>
          <div className="space-y-3 text-sm">
            <div><strong>Teacher:</strong> {data.teacherName}</div>
            <div><strong>Attendance:</strong> {data.attendance}</div>
            <div><strong>Exam:</strong> {data.examType}</div>
            {data.parentName && <div><strong>Parent:</strong> {data.parentName}</div>}
          </div>
        </div>
      </div>

      {/* Subjects in a fun layout */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-center text-purple-800 mb-6 flex items-center justify-center gap-2">
          🌈 My Learning Journey 📚
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {data.subjects.map((subject: Subject, index: number) => {
            const colors = ['bg-red-100 border-red-300', 'bg-blue-100 border-blue-300', 'bg-green-100 border-green-300', 'bg-yellow-100 border-yellow-300', 'bg-purple-100 border-purple-300'];
            const emojis = ['📊', '🧪', '📖', '🌍', '🎨', '🎵', '⚽', '💻'];
            return (
              <div key={subject.id} className={`${colors[index % 5]} rounded-2xl p-4 border-4 border-dashed`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{emojis[index % 8]}</div>
                    <div>
                      <div className="font-bold text-lg">{subject.name}</div>
                      <div className="text-sm text-gray-600">Out of {subject.maxMarks}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-800">{subject.marks}</div>
                    <div className={`px-3 py-1 rounded-full text-white font-bold ${
                      subject.grade.includes('A') ? 'bg-green-500' :
                      subject.grade.includes('B') ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {subject.grade}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments Section */}
      {data.comments && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-6 border-4 border-dashed border-green-300">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              💝 Teacher's Message
            </h3>
            <p className="text-green-800 italic text-lg leading-relaxed">"{data.comments}"</p>
            <div className="text-right mt-3 text-green-700 font-semibold">- {data.teacherName}</div>
          </div>
        </div>
      )}
    </div>

    {/* Page 2 */}
    <div className="min-h-[297mm] p-8 border-2 border-orange-200 relative overflow-hidden page-break-before">
      {/* Activities and Fun Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">🎯 Fun Activities & Skills 🎪</h2>
        <div className="text-lg text-orange-600">Building Tomorrow's Leaders</div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl p-6 border-4 border-dashed border-yellow-300">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🎨 Creative Skills</h3>
          <div className="space-y-2 text-sm">
            <div>• Art & Craft: ⭐⭐⭐⭐⭐</div>
            <div>• Music & Dance: ⭐⭐⭐⭐</div>
            <div>• Story Telling: ⭐⭐⭐⭐⭐</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-6 border-4 border-dashed border-green-300">
          <h3 className="text-xl font-bold text-green-800 mb-4">⚽ Physical Skills</h3>
          <div className="space-y-2 text-sm">
            <div>• Sports & Games: ⭐⭐⭐⭐</div>
            <div>• Outdoor Play: ⭐⭐⭐⭐⭐</div>
            <div>• Motor Skills: ⭐⭐⭐⭐</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 border-4 border-dashed border-blue-300">
          <h3 className="text-xl font-bold text-blue-800 mb-4">🤝 Social Skills</h3>
          <div className="space-y-2 text-sm">
            <div>• Teamwork: ⭐⭐⭐⭐⭐</div>
            <div>• Sharing: ⭐⭐⭐⭐</div>
            <div>• Communication: ⭐⭐⭐⭐</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-6 border-4 border-dashed border-pink-300">
          <h3 className="text-xl font-bold text-pink-800 mb-4">🧠 Learning Skills</h3>
          <div className="space-y-2 text-sm">
            <div>• Concentration: ⭐⭐⭐⭐</div>
            <div>• Following Instructions: ⭐⭐⭐⭐⭐</div>
            <div>• Problem Solving: ⭐⭐⭐⭐</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      {(data.schoolAddress || data.schoolPhone || data.schoolEmail) && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-6 border-4 border-dashed border-purple-300">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              📞 Contact Us
            </h3>
            <div className="text-sm space-y-2">
              {data.schoolAddress && <div><strong>Address:</strong> {data.schoolAddress}</div>}
              {data.schoolPhone && <div><strong>Phone:</strong> {data.schoolPhone}</div>}
              {data.schoolEmail && <div><strong>Email:</strong> {data.schoolEmail}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="flex justify-between items-end mt-12">
        <div className="text-center">
          {data.teacherSignature ? (
            <img src={data.teacherSignature} alt="Teacher Signature" className="h-16 mb-2" />
          ) : (
            <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
          )}
          <div className="text-sm font-semibold">Class Teacher</div>
          <div className="text-xs text-gray-600">{data.teacherName}</div>
        </div>
        <div className="text-center">
          {data.principalSignature ? (
            <img src={data.principalSignature} alt="Principal Signature" className="h-16 mb-2" />
          ) : (
            <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
          )}
          <div className="text-sm font-semibold">Principal</div>
          <div className="text-xs text-gray-600">{data.principalName}</div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
          <div className="text-sm font-semibold">Parent's Signature</div>
          <div className="text-xs text-gray-600">Date: ___________</div>
        </div>
      </div>
    </div>
  </div>
);

const Academic4PageTemplate = ({ data, style, watermarkStyle }: any) => (
  <div className="w-full max-w-4xl mx-auto bg-white" style={style}>
    {data.watermark && <div style={watermarkStyle}>{data.watermark}</div>}
    
    {/* Page 1 - Cover Page */}
    <div className="min-h-[297mm] p-8 flex flex-col justify-center items-center relative">
      <div className="text-center space-y-8">
        {data.schoolLogo && (
          <img src={data.schoolLogo} alt="School Logo" className="w-32 h-32 mx-auto object-contain" />
        )}
        
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">{data.schoolName}</h1>
          {data.schoolAddress && (
            <p className="text-lg text-gray-600 mb-2">{data.schoolAddress}</p>
          )}
          {(data.schoolPhone || data.schoolEmail) && (
            <div className="text-md text-gray-600 space-y-1">
              {data.schoolPhone && <p>Phone: {data.schoolPhone}</p>}
              {data.schoolEmail && <p>Email: {data.schoolEmail}</p>}
            </div>
          )}
        </div>

        <div className="border-4 border-blue-600 rounded-lg p-8 bg-blue-50">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">ACADEMIC REPORT</h2>
          <div className="text-xl text-gray-700 space-y-2">
            <p><strong>{data.examType}</strong></p>
            <p>Academic Session: {data.year}</p>
            <p>Term: {data.termName}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Student Information</h3>
          <div className="text-lg text-left space-y-2">
            <p><strong>Name:</strong> {data.studentName}</p>
            <p><strong>Class & Section:</strong> {data.className} - {data.section}</p>
            <p><strong>Roll Number:</strong> {data.rollNo}</p>
            {data.admissionNumber && <p><strong>Admission Number:</strong> {data.admissionNumber}</p>}
            {data.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(data.dateOfBirth).toLocaleDateString()}</p>}
          </div>
        </div>
      </div>
    </div>

    {/* Page 2 - Academic Performance */}
    <div className="min-h-[297mm] p-8 page-break-before">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Academic Performance Summary</h2>
        <div className="text-lg text-gray-600">{data.examType} - {data.termName} {data.year}</div>
      </div>

      <div className="mb-8">
        <table className="w-full border-2 border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border-2 border-gray-600 px-4 py-3 text-left">Subject</th>
              <th className="border-2 border-gray-600 px-4 py-3 text-center">Full Marks</th>
              <th className="border-2 border-gray-600 px-4 py-3 text-center">Pass Marks</th>
              <th className="border-2 border-gray-600 px-4 py-3 text-center">Obtained Marks</th>
              <th className="border-2 border-gray-600 px-4 py-3 text-center">Grade</th>
              <th className="border-2 border-gray-600 px-4 py-3 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject: Subject, index: number) => {
              const percentage = Math.round((parseInt(subject.marks) / parseInt(subject.maxMarks)) * 100);
              const passMarks = Math.round(parseInt(subject.maxMarks) * 0.4);
              const remarks = percentage >= 90 ? 'Excellent' : percentage >= 80 ? 'Very Good' : percentage >= 70 ? 'Good' : percentage >= 60 ? 'Satisfactory' : percentage >= 40 ? 'Needs Improvement' : 'Poor';
              
              return (
                <tr key={subject.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-400 px-4 py-3 font-semibold">{subject.name}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center">{subject.maxMarks}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center">{passMarks}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center font-bold">{subject.marks}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center font-bold text-lg">{subject.grade}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center text-sm">{remarks}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-200 font-bold text-lg">
              <td className="border-2 border-gray-600 px-4 py-3">TOTAL</td>
              <td className="border-2 border-gray-600 px-4 py-3 text-center">
                {data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)}
              </td>
              <td className="border-2 border-gray-600 px-4 py-3 text-center">
                {Math.round(data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0) * 0.4)}
              </td>
              <td className="border-2 border-gray-600 px-4 py-3 text-center">
                {data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0)}
              </td>
              <td className="border-2 border-gray-600 px-4 py-3 text-center">
                {Math.round((data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0) / 
                data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)) * 100)}%
              </td>
              <td className="border-2 border-gray-600 px-4 py-3 text-center">
                {(() => {
                  const totalPercentage = Math.round((data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0) / 
                  data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)) * 100);
                  return totalPercentage >= 90 ? 'Excellent' : totalPercentage >= 80 ? 'Very Good' : totalPercentage >= 70 ? 'Good' : 'Satisfactory';
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grade Scale */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Grading Scale</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-green-100 p-3 rounded border">
            <strong>A+ (90-100%)</strong> - Excellent
          </div>
          <div className="bg-green-100 p-3 rounded border">
            <strong>A (80-89%)</strong> - Outstanding
          </div>
          <div className="bg-blue-100 p-3 rounded border">
            <strong>B+ (70-79%)</strong> - Very Good
          </div>
          <div className="bg-blue-100 p-3 rounded border">
            <strong>B (60-69%)</strong> - Good
          </div>
          <div className="bg-yellow-100 p-3 rounded border">
            <strong>C (50-59%)</strong> - Satisfactory
          </div>
          <div className="bg-orange-100 p-3 rounded border">
            <strong>D (40-49%)</strong> - Needs Improvement
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Attendance Record</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-lg"><strong>Attendance:</strong> {data.attendance}</p>
          </div>
          <div>
            <p className="text-lg"><strong>Class Teacher:</strong> {data.teacherName}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Page 3 - Teacher's Assessment */}
    <div className="min-h-[297mm] p-8 page-break-before">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Teacher's Assessment & Remarks</h2>
      </div>

      {/* Detailed Comments */}
      {data.comments && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Class Teacher's Comments</h3>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded">
            <p className="text-lg leading-relaxed italic">"{data.comments}"</p>
            <div className="text-right mt-4 font-semibold">- {data.teacherName}</div>
          </div>
        </div>
      )}

      {/* Skills Assessment */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Skills & Character Assessment</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded border">
              <h4 className="font-semibold text-green-800 mb-2">Academic Skills</h4>
              <div className="space-y-1 text-sm">
                <div>Reading Comprehension: ⭐⭐⭐⭐</div>
                <div>Mathematical Reasoning: ⭐⭐⭐⭐⭐</div>
                <div>Scientific Thinking: ⭐⭐⭐⭐</div>
                <div>Creative Expression: ⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded border">
              <h4 className="font-semibold text-blue-800 mb-2">Personal Qualities</h4>
              <div className="space-y-1 text-sm">
                <div>Responsibility: ⭐⭐⭐⭐⭐</div>
                <div>Initiative: ⭐⭐⭐⭐</div>
                <div>Cooperation: ⭐⭐⭐⭐⭐</div>
                <div>Leadership: ⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded border">
              <h4 className="font-semibold text-purple-800 mb-2">Social Skills</h4>
              <div className="space-y-1 text-sm">
                <div>Communication: ⭐⭐⭐⭐⭐</div>
                <div>Teamwork: ⭐⭐⭐⭐</div>
                <div>Empathy: ⭐⭐⭐⭐⭐</div>
                <div>Respect for Others: ⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded border">
              <h4 className="font-semibold text-yellow-800 mb-2">Work Habits</h4>
              <div className="space-y-1 text-sm">
                <div>Organization: ⭐⭐⭐⭐</div>
                <div>Time Management: ⭐⭐⭐⭐</div>
                <div>Attention to Detail: ⭐⭐⭐⭐⭐</div>
                <div>Persistence: ⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Recommendations for Improvement</h3>
        <div className="bg-orange-50 p-6 rounded border-l-4 border-orange-500">
          <ul className="space-y-2 text-sm">
            <li>• Continue practicing mathematics daily for better problem-solving skills</li>
            <li>• Encourage more reading to improve vocabulary and comprehension</li>
            <li>• Participate in group activities to enhance social skills</li>
            <li>• Focus on time management during examinations</li>
          </ul>
        </div>
      </div>

      {/* Parent Contact Information */}
      {(data.parentName || data.address || data.phoneNumber) && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Parent/Guardian Information</h3>
          <div className="bg-gray-100 p-6 rounded">
            {data.parentName && <p className="mb-2"><strong>Parent Name:</strong> {data.parentName}</p>}
            {data.address && <p className="mb-2"><strong>Address:</strong> {data.address}</p>}
            {data.phoneNumber && <p className="mb-2"><strong>Phone:</strong> {data.phoneNumber}</p>}
          </div>
        </div>
      )}
    </div>

    {/* Page 4 - Signatures and Official */}
    <div className="min-h-[297mm] p-8 flex flex-col justify-between page-break-before">
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Official Certification</h2>
        </div>

        <div className="text-center mb-12">
          <p className="text-lg">This report card certifies the academic performance of</p>
          <p className="text-2xl font-bold text-blue-800 my-4">{data.studentName}</p>
          <p className="text-lg">for the {data.termName} of Academic Year {data.year}</p>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Academic Achievement Summary</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Marks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.marks), 0) / 
                  data.subjects.reduce((sum: number, sub: Subject) => sum + parseInt(sub.maxMarks), 0)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Percentage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{data.attendance}</div>
                <div className="text-sm text-gray-600">Attendance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Next Term Guidelines</h3>
          <div className="bg-yellow-50 p-6 rounded border-l-4 border-yellow-500">
            <ul className="space-y-2 text-sm">
              <li>• Classes will resume on: _______________</li>
              <li>• Fee submission deadline: _______________</li>
              <li>• Parent-teacher meeting: _______________</li>
              <li>• Book collection date: _______________</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        {/* Official Signatures */}
        <div className="grid grid-cols-3 gap-8 text-center mt-16">
          <div>
            {data.teacherSignature ? (
              <img src={data.teacherSignature} alt="Teacher Signature" className="h-16 mx-auto mb-2" />
            ) : (
              <div className="border-t-2 border-gray-600 w-32 mx-auto mb-2"></div>
            )}
            <div className="font-semibold">Class Teacher</div>
            <div className="text-sm text-gray-600">{data.teacherName}</div>
            <div className="text-xs text-gray-500 mt-1">Date: ___________</div>
          </div>
          <div>
            {data.principalSignature ? (
              <img src={data.principalSignature} alt="Principal Signature" className="h-16 mx-auto mb-2" />
            ) : (
              <div className="border-t-2 border-gray-600 w-32 mx-auto mb-2"></div>
            )}
            <div className="font-semibold">Principal</div>
            <div className="text-sm text-gray-600">{data.principalName}</div>
            <div className="text-xs text-gray-500 mt-1">Date: ___________</div>
          </div>
          <div>
            <div className="border-t-2 border-gray-600 w-32 mx-auto mb-2"></div>
            <div className="font-semibold">Parent/Guardian</div>
            <div className="text-sm text-gray-600">{data.parentName}</div>
            <div className="text-xs text-gray-500 mt-1">Date: ___________</div>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-300">
          <div className="text-xs text-gray-500">
            This document is computer generated and does not require a signature.
            <br />
            For any queries, please contact: {data.schoolPhone || 'School Office'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReportCardEditor;

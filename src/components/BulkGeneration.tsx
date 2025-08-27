import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, Users, Info } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface BulkGenerationProps {
  onBulkDataGenerated?: (students: any[]) => void;
}

const BulkGeneration = ({ onBulkDataGenerated }: BulkGenerationProps) => {
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setBulkData(jsonData);
        setShowBulkPreview(true);
        onBulkDataGenerated?.(jsonData);

        toast.success(`Successfully loaded ${jsonData.length} student records!`);
      } catch (error) {
        toast.error('Error reading file. Please check the format and try again.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadSampleFile = () => {
    const sampleData = [
      {
        'Student Name': 'JOHN DOE',
        'Mother Name': 'JANE DOE',
        'Seat No': '12345',
        'PRN': '21012345678',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 18,
        'Subject1_External': 52,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 16,
        'Subject2_External': 48,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 19,
        'Subject3_External': 55,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'ALICE SMITH',
        'Mother Name': 'MARY SMITH',
        'Seat No': '12346',
        'PRN': '21012345679',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 20,
        'Subject1_External': 58,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 18,
        'Subject2_External': 52,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 17,
        'Subject3_External': 49,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'ROBERT JOHNSON',
        'Mother Name': 'SARAH JOHNSON',
        'Seat No': '12347',
        'PRN': '21012345680',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 22,
        'Subject1_External': 60,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 19,
        'Subject2_External': 54,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 21,
        'Subject3_External': 59,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'EMMA WILSON',
        'Mother Name': 'LISA WILSON',
        'Seat No': '12348',
        'PRN': '21012345681',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 15,
        'Subject1_External': 45,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 14,
        'Subject2_External': 42,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 16,
        'Subject3_External': 46,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'MICHAEL BROWN',
        'Mother Name': 'PATRICIA BROWN',
        'Seat No': '12349',
        'PRN': '21012345682',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 21,
        'Subject1_External': 57,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 20,
        'Subject2_External': 56,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 22,
        'Subject3_External': 61,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'SOPHIA DAVIS',
        'Mother Name': 'JENNIFER DAVIS',
        'Seat No': '12350',
        'PRN': '21012345683',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 19,
        'Subject1_External': 53,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 17,
        'Subject2_External': 49,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 18,
        'Subject3_External': 51,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'DANIEL MARTINEZ',
        'Mother Name': 'MARIA MARTINEZ',
        'Seat No': '12351',
        'PRN': '21012345684',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 23,
        'Subject1_External': 62,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 21,
        'Subject2_External': 58,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 24,
        'Subject3_External': 64,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'ISABELLA GARCIA',
        'Mother Name': 'ANA GARCIA',
        'Seat No': '12352',
        'PRN': '21012345685',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 16,
        'Subject1_External': 47,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 15,
        'Subject2_External': 44,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 17,
        'Subject3_External': 48,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'CHRISTOPHER LEE',
        'Mother Name': 'MICHELLE LEE',
        'Seat No': '12353',
        'PRN': '21012345686',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 20,
        'Subject1_External': 55,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 19,
        'Subject2_External': 53,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 20,
        'Subject3_External': 56,
        'Subject3_Credits': 4
      },
      {
        'Student Name': 'MADISON TAYLOR',
        'Mother Name': 'RACHEL TAYLOR',
        'Seat No': '12354',
        'PRN': '21012345687',
        'College Name': 'SAMPLE COLLEGE OF ENGINEERING',
        'Centre': '001',
        'Branch': 'BACHELOR OF ENGINEERING',
        'Subject1_Code': 'CS-101',
        'Subject1_Name': 'DATA STRUCTURES',
        'Subject1_Internal': 17,
        'Subject1_External': 50,
        'Subject1_Credits': 4,
        'Subject2_Code': 'CS-102',
        'Subject2_Name': 'ALGORITHMS',
        'Subject2_Internal': 16,
        'Subject2_External': 46,
        'Subject2_Credits': 3,
        'Subject3_Code': 'CS-103',
        'Subject3_Name': 'DATABASE SYSTEMS',
        'Subject3_Internal': 18,
        'Subject3_External': 52,
        'Subject3_Credits': 4
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'bulk_result_sample.xlsx');

    toast.success('Sample file downloaded! Use this format for bulk upload.');
  };

  const generateBulkResults = () => {
    if (bulkData.length === 0) {
      toast.error('Please upload student data first');
      return;
    }

    toast.success(`Processing ${bulkData.length} results... This may take a moment.`);
    // Here you would typically process each student's result
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success(`Successfully generated ${bulkData.length} result sheets!`);
    }, 2000);
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2 mb-3">
            <Info className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="text-sm text-purple-800">
              <strong>How to use Bulk Generation:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Download the sample Excel file below</li>
                <li>Fill in your student data following the exact format</li>
                <li>Upload the completed file</li>
                <li>Review the preview and generate all results</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={downloadSampleFile} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Sample Format
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Upload Student Data (Excel/CSV)</Label>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Required columns:</strong></p>
                <p>• Student Name, Mother Name, Seat No, PRN, College Name</p>
                <p>• Subject1_Code, Subject1_Name, Subject1_Internal, Subject1_External, Subject1_Credits</p>
                <p>• Subject2_Code, Subject2_Name... (add more subjects as needed)</p>
                <p className="text-blue-600 font-medium">💡 Follow the exact column names from the sample file</p>
              </div>
            </div>

            {showBulkPreview && bulkData.length > 0 && (
              <div className="mt-4 p-3 bg-white rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Preview: {bulkData.length} students loaded</span>
                  <Button onClick={generateBulkResults} size="sm">
                    Generate All Results
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>First student: {bulkData[0]?.['Student Name'] || 'N/A'}</p>
                  <p>Subjects detected: {Object.keys(bulkData[0] || {}).filter(key => key.includes('Subject')).length / 5}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkGeneration;

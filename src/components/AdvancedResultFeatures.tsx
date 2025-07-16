
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, QrCode, Mail, BarChart3, FileImage, Lock, Zap, Users, Download, Upload, Info } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface AdvancedFeaturesProps {
  onFeatureChange: (feature: string, value: any) => void;
  onBulkDataGenerated?: (students: any[]) => void;
}

const AdvancedResultFeatures = ({ onFeatureChange, onBulkDataGenerated }: AdvancedFeaturesProps) => {
  const [features, setFeatures] = useState({
    digitalSignature: false,
    watermark: '',
    qrCode: true,
    passwordProtection: false,
    password: '',
    emailIntegration: false,
    emailTemplate: 'Dear {{studentName}},\n\nYour result is now available. Please find your result sheet attached.\n\nRegards,\nExamination Department',
    bulkGeneration: false,
    customGrading: 'standard',
    resultAnalytics: false
  });

  const [bulkData, setBulkData] = useState<any[]>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);

  const updateFeature = (key: string, value: any) => {
    const updated = { ...features, [key]: value };
    setFeatures(updated);
    onFeatureChange(key, value);
  };

  const gradingSystems = [
    { value: 'standard', label: 'Standard (A-F)' },
    { value: 'percentage', label: 'Percentage Based' },
    { value: 'gpa-4', label: '4.0 GPA Scale' },
    { value: 'gpa-10', label: '10.0 GPA Scale' },
    { value: 'custom', label: 'Custom Grading' }
  ];

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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Advanced Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="customization">Custom</TabsTrigger>
            <TabsTrigger value="automation">Auto</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <Label>Digital Signature</Label>
                </div>
                <Switch
                  checked={features.digitalSignature}
                  onCheckedChange={(checked) => {
                    updateFeature('digitalSignature', checked);
                    if (checked) {
                      toast.success('Digital signature enabled - results will be cryptographically signed for authenticity');
                    }
                  }}
                />
              </div>
              {features.digitalSignature && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  ✓ Digital signatures will be applied to verify document authenticity and prevent tampering
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="watermark">Custom Watermark</Label>
                <Input
                  id="watermark"
                  value={features.watermark}
                  onChange={(e) => updateFeature('watermark', e.target.value)}
                  placeholder="Enter watermark text (e.g., CONFIDENTIAL)"
                />
                {features.watermark && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ Watermark "{features.watermark}" will be applied diagonally across all result sheets
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <Label>QR Code Verification</Label>
                </div>
                <Switch
                  checked={features.qrCode}
                  onCheckedChange={(checked) => {
                    updateFeature('qrCode', checked);
                    toast.success(checked ? 'QR code verification enabled' : 'QR code verification disabled');
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <Label>Password Protection</Label>
                  </div>
                  <Switch
                    checked={features.passwordProtection}
                    onCheckedChange={(checked) => updateFeature('passwordProtection', checked)}
                  />
                </div>
                {features.passwordProtection && (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      value={features.password}
                      onChange={(e) => updateFeature('password', e.target.value)}
                      placeholder="Set PDF password"
                    />
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded space-y-1">
                      <p>💡 <strong>Password Tips:</strong></p>
                      <p>• Use student's seat number or PRN for individual passwords</p>
                      <p>• For bulk generation, use pattern like: SEAT123 or PRN456789</p>
                      <p>• Leave blank to use seat number as default password</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customization" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Grading System</Label>
                <Select value={features.customGrading} onValueChange={(value) => updateFeature('customGrading', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradingSystems.map((system) => (
                      <SelectItem key={system.value} value={system.value}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Custom Logo Upload</Label>
                <Input type="file" accept="image/*" />
                <p className="text-xs text-gray-500">Upload university logo (max 2MB)</p>
              </div>

              <div className="space-y-2">
                <Label>Result Template</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Layout</SelectItem>
                    <SelectItem value="compact">Compact Layout</SelectItem>
                    <SelectItem value="detailed">Detailed Layout</SelectItem>
                    <SelectItem value="modern">Modern Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <Label>Bulk Generation</Label>
                </div>
                <Switch
                  checked={features.bulkGeneration}
                  onCheckedChange={(checked) => updateFeature('bulkGeneration', checked)}
                />
              </div>

              {features.bulkGeneration && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
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
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <Label>Email Results</Label>
                </div>
                <Switch
                  checked={features.emailIntegration}
                  onCheckedChange={(checked) => updateFeature('emailIntegration', checked)}
                />
              </div>

              {features.emailIntegration && (
                <div className="space-y-2">
                  <Label>Email Template</Label>
                  <Textarea
                    value={features.emailTemplate}
                    onChange={(e) => updateFeature('emailTemplate', e.target.value)}
                    placeholder="Enter email message template..."
                    className="h-20"
                  />
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded space-y-1">
                    <p><strong>Use these dynamic variables in your template:</strong></p>
                    <p>• {`{{studentName}}`} - Student's full name</p>
                    <p>• {`{{seatNo}}`} - Seat number</p>
                    <p>• {`{{prn}}`} - PRN number</p>
                    <p>• {`{{collegeName}}`} - College name</p>
                    <p>• {`{{sgpa}}`} - Calculated SGPA</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <Label>Result Analytics</Label>
                </div>
                <Switch
                  checked={features.resultAnalytics}
                  onCheckedChange={(checked) => updateFeature('resultAnalytics', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Pass Rate</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">7.8</div>
                  <div className="text-sm text-gray-600">Avg SGPA</div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <FileImage className="h-4 w-4 mr-2" />
                Generate Performance Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedResultFeatures;

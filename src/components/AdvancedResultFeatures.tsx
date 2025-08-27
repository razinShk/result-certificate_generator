
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, QrCode, Mail, BarChart3, FileImage, Lock, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedFeaturesProps {
  onFeatureChange: (feature: string, value: any) => void;
}

const AdvancedResultFeatures = ({ onFeatureChange }: AdvancedFeaturesProps) => {
  const [features, setFeatures] = useState({
    digitalSignature: false,
    watermark: '',
    qrCode: true,
    passwordProtection: false,
    password: '',
    emailIntegration: false,
    emailTemplate: 'Dear {{studentName}},\n\nYour result is now available. Please find your result sheet attached.\n\nRegards,\nExamination Department',
    customGrading: 'standard',
    resultAnalytics: false
  });

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

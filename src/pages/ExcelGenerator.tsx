
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, Plus, Trash2, Upload, Calculator, Palette, Copy, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface CellStyle {
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: string;
  textAlign?: string;
}

const ExcelGenerator = () => {
  const [tableData, setTableData] = useState<TableData>({
    headers: ['Name', 'Age', 'City', 'Email'],
    rows: [
      ['John Doe', '25', 'New York', 'john@example.com'],
      ['Jane Smith', '30', 'Los Angeles', 'jane@example.com'],
      ['Bob Johnson', '35', 'Chicago', 'bob@example.com']
    ]
  });
  const [csvData, setCsvData] = useState('');
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [cellStyles, setCellStyles] = useState<Record<string, CellStyle>>({});
  const [fileName, setFileName] = useState('generated_data');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Templates for quick start
  const templates = {
    budget: {
      headers: ['Category', 'Planned', 'Actual', 'Difference', 'Percentage'],
      rows: [
        ['Housing', '1500', '1450', '=C2-B2', '=C2/B2*100'],
        ['Food', '400', '450', '=C3-B3', '=C3/B3*100'],
        ['Transportation', '300', '280', '=C4-B4', '=C4/B4*100'],
        ['Total', '=SUM(B2:B4)', '=SUM(C2:C4)', '=SUM(D2:D4)', '=AVERAGE(E2:E4)']
      ]
    },
    inventory: {
      headers: ['Product', 'Quantity', 'Unit Price', 'Total Value', 'Reorder Level'],
      rows: [
        ['Laptop', '50', '800', '=B2*C2', '10'],
        ['Mouse', '200', '25', '=B3*C3', '50'],
        ['Keyboard', '150', '45', '=B4*C4', '30'],
        ['Total Inventory', '', '', '=SUM(D2:D4)', '']
      ]
    },
    sales: {
      headers: ['Month', 'Sales', 'Target', 'Achievement %', 'Bonus'],
      rows: [
        ['January', '15000', '12000', '=B2/C2*100', '=IF(D2>100,B2*0.05,0)'],
        ['February', '18000', '15000', '=B3/C3*100', '=IF(D3>100,B3*0.05,0)'],
        ['March', '22000', '18000', '=B4/C4*100', '=IF(D4>100,B4*0.05,0)'],
        ['Total', '=SUM(B2:B4)', '=SUM(C2:C4)', '=AVERAGE(D2:D4)', '=SUM(E2:E4)']
      ]
    }
  };

  // Common formulas
  const commonFormulas = [
    { name: 'SUM', syntax: '=SUM(A1:A10)', description: 'Add up values in a range' },
    { name: 'AVERAGE', syntax: '=AVERAGE(A1:A10)', description: 'Calculate average of values' },
    { name: 'COUNT', syntax: '=COUNT(A1:A10)', description: 'Count numeric values' },
    { name: 'MAX', syntax: '=MAX(A1:A10)', description: 'Find maximum value' },
    { name: 'MIN', syntax: '=MIN(A1:A10)', description: 'Find minimum value' },
    { name: 'IF', syntax: '=IF(A1>10,"High","Low")', description: 'Conditional logic' },
    { name: 'VLOOKUP', syntax: '=VLOOKUP(A1,B:D,2,FALSE)', description: 'Lookup values' },
    { name: 'CONCATENATE', syntax: '=CONCATENATE(A1," ",B1)', description: 'Join text' }
  ];

  const loadTemplate = (templateKey: string) => {
    const template = templates[templateKey as keyof typeof templates];
    setTableData(template);
    toast({
      title: "Template Loaded",
      description: `${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template has been loaded successfully!`,
    });
  };

  const addColumn = () => {
    setTableData({
      headers: [...tableData.headers, `Column ${tableData.headers.length + 1}`],
      rows: tableData.rows.map(row => [...row, ''])
    });
  };

  const addRow = () => {
    setTableData({
      ...tableData,
      rows: [...tableData.rows, new Array(tableData.headers.length).fill('')]
    });
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[index] = value;
    setTableData({ ...tableData, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex][cellIndex] = value;
    setTableData({ ...tableData, rows: newRows });
  };

  const removeRow = (index: number) => {
    setTableData({
      ...tableData,
      rows: tableData.rows.filter((_, i) => i !== index)
    });
  };

  const removeColumn = (index: number) => {
    setTableData({
      headers: tableData.headers.filter((_, i) => i !== index),
      rows: tableData.rows.map(row => row.filter((_, i) => i !== index))
    });
  };

  const parseCSV = () => {
    if (!csvData.trim()) return;
    
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    
    setTableData({ headers, rows });
    setCsvData('');
    toast({
      title: "CSV Imported",
      description: "Your CSV data has been imported successfully!",
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length > 0) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          setTableData({ headers, rows });
          toast({
            title: "File Imported",
            description: `Successfully imported ${file.name}!`,
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Could not read the file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
        setTableData({ headers, rows });
      };
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const applyCellStyle = (style: CellStyle) => {
    selectedCells.forEach(cellId => {
      setCellStyles(prev => ({
        ...prev,
        [cellId]: { ...prev[cellId], ...style }
      }));
    });
    setSelectedCells(new Set());
  };

  const getCellId = (rowIndex: number, cellIndex: number) => `${rowIndex}-${cellIndex}`;

  const handleCellClick = (rowIndex: number, cellIndex: number, event: React.MouseEvent) => {
    const cellId = getCellId(rowIndex, cellIndex);
    const newSelected = new Set(selectedCells);
    
    if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(cellId)) {
        newSelected.delete(cellId);
      } else {
        newSelected.add(cellId);
      }
    } else {
      newSelected.clear();
      newSelected.add(cellId);
    }
    
    setSelectedCells(newSelected);
  };

  const insertFormula = (formula: string) => {
    if (selectedCells.size === 1) {
      const cellId = Array.from(selectedCells)[0];
      const [rowIndex, cellIndex] = cellId.split('-').map(Number);
      updateCell(rowIndex, cellIndex, formula);
      setSelectedCells(new Set());
    }
  };

  const duplicateRow = (index: number) => {
    const newRows = [...tableData.rows];
    newRows.splice(index + 1, 0, [...newRows[index]]);
    setTableData({ ...tableData, rows: newRows });
  };

  const handleDownload = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheetData = [tableData.headers, ...tableData.rows];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Apply basic formatting
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          const cellId = getCellId(row - 1, col);
          const style = cellStyles[cellId];
          
          if (style && worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              fill: style.backgroundColor ? { fgColor: { rgb: style.backgroundColor.replace('#', '') } } : undefined,
              font: {
                color: style.textColor ? { rgb: style.textColor.replace('#', '') } : undefined,
                bold: style.fontWeight === 'bold'
              },
              alignment: { horizontal: style.textAlign || 'left' }
            };
          }
        }
      }
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      
      toast({
        title: "Download Complete",
        description: "Your Excel file has been downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your Excel file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            Advanced Excel Generator
          </h1>
          <p className="text-xl text-gray-600">Create powerful spreadsheets with formulas, imports, and advanced features</p>
        </div>

        <Tabs defaultValue="create" className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CSV Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="csvData">Paste CSV Data</Label>
                    <Textarea
                      id="csvData"
                      rows={6}
                      placeholder="Name,Age,City&#10;John,25,NYC&#10;Jane,30,LA"
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                    />
                  </div>
                  <Button onClick={parseCSV} className="w-full" variant="outline">
                    Import CSV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Table Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={addColumn} className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                  <Button onClick={addRow} className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                  <div className="space-y-2">
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="my_spreadsheet"
                    />
                  </div>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Columns:</span>
                      <Badge variant="secondary">{tableData.headers.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Rows:</span>
                      <Badge variant="secondary">{tableData.rows.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Selected:</span>
                      <Badge variant="outline">{selectedCells.size} cells</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Upload CSV or Excel File</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Supported formats: CSV, XLSX, XLS</p>
                  <p>Files will replace current data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Common Formulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {commonFormulas.map((formula, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{formula.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => insertFormula(formula.syntax)}
                          disabled={selectedCells.size !== 1}
                        >
                          Insert
                        </Button>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                        {formula.syntax}
                      </code>
                      <p className="text-xs text-gray-600">{formula.description}</p>
                    </div>
                  ))}
                </div>
                {selectedCells.size !== 1 && (
                  <p className="text-sm text-gray-500 mt-4">
                    Select exactly one cell to insert a formula
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(templates).map(([key, template]) => (
                <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {key === 'budget' && <BarChart3 className="h-5 w-5" />}
                      {key === 'inventory' && <FileText className="h-5 w-5" />}
                      {key === 'sales' && <Calculator className="h-5 w-5" />}
                      {key} Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {key === 'budget' && 'Track expenses with automatic calculations'}
                      {key === 'inventory' && 'Manage stock with value calculations'}
                      {key === 'sales' && 'Monitor sales performance with targets'}
                    </p>
                    <Button 
                      onClick={() => loadTemplate(key)}
                      className="w-full"
                      variant="outline"
                    >
                      Load Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="format" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Cell Formatting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-2">
                      {['#ffffff', '#f3f4f6', '#fef3c7', '#dbeafe', '#dcfce7'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                          onClick={() => applyCellStyle({ backgroundColor: color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2 mt-2">
                      {['#000000', '#374151', '#dc2626', '#059669', '#2563eb'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                          onClick={() => applyCellStyle({ textColor: color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Font Weight</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyCellStyle({ fontWeight: 'normal' })}
                      >
                        Normal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyCellStyle({ fontWeight: 'bold' })}
                      >
                        <strong>Bold</strong>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Text Align</Label>
                    <div className="flex gap-2 mt-2">
                      {['left', 'center', 'right'].map(align => (
                        <Button
                          key={align}
                          size="sm"
                          variant="outline"
                          onClick={() => applyCellStyle({ textAlign: align })}
                        >
                          {align}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedCells.size === 0 && (
                  <p className="text-sm text-gray-500 mt-4">
                    Select cells to apply formatting
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Table Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {tableData.headers.map((header, index) => (
                      <th key={index} className="border border-gray-300 p-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={header}
                            onChange={(e) => updateHeader(index, e.target.value)}
                            className="min-w-[120px]"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeColumn(index)}
                            disabled={tableData.headers.length <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => {
                        const cellId = getCellId(rowIndex, cellIndex);
                        const isSelected = selectedCells.has(cellId);
                        const style = cellStyles[cellId] || {};
                        
                        return (
                          <td 
                            key={cellIndex} 
                            className={`border border-gray-300 p-2 ${isSelected ? 'bg-blue-100' : ''}`}
                            onClick={(e) => handleCellClick(rowIndex, cellIndex, e)}
                          >
                            <div className="flex items-center gap-2">
                              <Input
                                value={cell}
                                onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                                className="min-w-[120px]"
                                style={{
                                  backgroundColor: style.backgroundColor,
                                  color: style.textColor,
                                  fontWeight: style.fontWeight,
                                  textAlign: style.textAlign as any
                                }}
                              />
                              {cellIndex === 0 && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => duplicateRow(rowIndex)}
                                    title="Duplicate row"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeRow(rowIndex)}
                                    disabled={tableData.rows.length <= 1}
                                    title="Delete row"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExcelGenerator;

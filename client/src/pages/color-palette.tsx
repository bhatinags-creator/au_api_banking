import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Palette, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Shuffle,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ColorPalette,
  AU_BRAND_COLORS,
  generateAllPalettes,
  generateComplementaryPalette,
  getContrastRatio,
  isAccessible,
  paletteToCSS,
  paletteToJSON,
  paletteToTailwind,
  hexToHsl,
  hslToHex
} from "@/lib/colorPalette";

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState(AU_BRAND_COLORS.primary);
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'tailwind'>('css');
  
  const { toast } = useToast();

  useEffect(() => {
    generatePalettes();
  }, [baseColor]);

  const generatePalettes = () => {
    const newPalettes = generateAllPalettes(baseColor);
    setPalettes(newPalettes);
    setSelectedPalette(newPalettes[0]);
  };

  const handleColorChange = (color: string) => {
    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(color)) {
      setBaseColor(color);
    }
  };

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 30) + 35; // 35-65%
    
    const randomColor = hslToHex({ h: hue, s: saturation, l: lightness });
    setBaseColor(randomColor);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const downloadPalette = (format: 'css' | 'json' | 'tailwind') => {
    if (!selectedPalette) return;
    
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (format) {
      case 'css':
        content = paletteToCSS(selectedPalette);
        filename = `${selectedPalette.name.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
        mimeType = 'text/css';
        break;
      case 'json':
        content = paletteToJSON(selectedPalette);
        filename = `${selectedPalette.name.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
        mimeType = 'application/json';
        break;
      case 'tailwind':
        content = paletteToTailwind(selectedPalette);
        filename = `tailwind-config-${selectedPalette.name.toLowerCase().replace(/\s+/g, '-')}.js`;
        mimeType = 'text/javascript';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  const getExportContent = (): string => {
    if (!selectedPalette) return '';
    
    switch (exportFormat) {
      case 'css': return paletteToCSS(selectedPalette);
      case 'json': return paletteToJSON(selectedPalette);
      case 'tailwind': return paletteToTailwind(selectedPalette);
      default: return '';
    }
  };

  const applyPreviewTheme = (palette: ColorPalette) => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--au-primary', palette.primary);
      root.style.setProperty('--color-primary', palette.primary);
    }
  };

  const resetPreviewTheme = () => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--au-primary', AU_BRAND_COLORS.primary);
      root.style.setProperty('--color-primary', AU_BRAND_COLORS.primary);
    }
  };

  const ColorSwatch = ({ color, label, size = 'md' }: { color: string; label: string; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className={`${sizeClasses[size]} rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform`}
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color, label)}
          title={`Click to copy ${color}`}
        />
        <div className="text-center">
          <div className="text-xs font-medium text-gray-900">{label}</div>
          <div className="text-xs font-mono text-gray-500">{color}</div>
        </div>
      </div>
    );
  };

  const AccessibilityIndicator = ({ foreground, background }: { foreground: string; background: string }) => {
    const contrast = getContrastRatio(foreground, background);
    const isAACompliant = contrast >= 4.5;
    const isAAACompliant = contrast >= 7;

    return (
      <div className="flex items-center gap-2">
        {isAAACompliant ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : isAACompliant ? (
          <CheckCircle className="w-4 h-4 text-yellow-600" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-red-600" />
        )}
        <span className="text-sm font-mono">
          {contrast.toFixed(2)} {isAAACompliant ? '(AAA)' : isAACompliant ? '(AA)' : '(Fail)'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-25">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--au-primary)] to-purple-600 bg-clip-text text-transparent">
                Color Palette Generator
              </h1>
              <p className="text-gray-600">Create beautiful, brand-consistent color schemes for AU Bank</p>
            </div>
          </div>
          
          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
            Brand Design Tool
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Base Color Input */}
            <Card className="bg-white shadow-lg border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Palette className="w-5 h-5" />
                  Base Color
                </CardTitle>
                <CardDescription>Choose your primary brand color to generate palettes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="base-color">Color Value</Label>
                    <Input
                      id="base-color"
                      type="color"
                      value={baseColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-12 w-full"
                      data-testid="input-base-color"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="base-color-hex">Hex Code</Label>
                    <Input
                      id="base-color-hex"
                      value={baseColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#603078"
                      className="font-mono"
                      data-testid="input-base-color-hex"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateRandomColor}
                    className="flex-1"
                    data-testid="button-random-color"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Random
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setBaseColor(AU_BRAND_COLORS.primary)}
                    className="flex-1"
                    data-testid="button-reset-color"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Mode */}
            <Card className="bg-white shadow-lg border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>Apply colors to see how they look on this page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="preview-mode"
                    checked={previewMode}
                    onChange={(e) => {
                      setPreviewMode(e.target.checked);
                      if (e.target.checked && selectedPalette) {
                        applyPreviewTheme(selectedPalette);
                      } else {
                        resetPreviewTheme();
                      }
                    }}
                    className="rounded"
                    data-testid="checkbox-preview-mode"
                  />
                  <Label htmlFor="preview-mode" className="font-medium">
                    Enable live preview mode
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="bg-white shadow-lg border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Download className="w-5 h-5" />
                  Export Palette
                </CardTitle>
                <CardDescription>Download in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={exportFormat === 'css' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportFormat('css')}
                    className={exportFormat === 'css' ? 'bg-purple-600 text-white' : ''}
                    data-testid="button-format-css"
                  >
                    CSS
                  </Button>
                  <Button
                    variant={exportFormat === 'json' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportFormat('json')}
                    className={exportFormat === 'json' ? 'bg-purple-600 text-white' : ''}
                    data-testid="button-format-json"
                  >
                    JSON
                  </Button>
                  <Button
                    variant={exportFormat === 'tailwind' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportFormat('tailwind')}
                    className={exportFormat === 'tailwind' ? 'bg-purple-600 text-white' : ''}
                    data-testid="button-format-tailwind"
                  >
                    Tailwind
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => downloadPalette(exportFormat)}
                    disabled={!selectedPalette}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    data-testid="button-download"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(getExportContent(), `${exportFormat.toUpperCase()} code`)}
                    disabled={!selectedPalette}
                    data-testid="button-copy-export"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Palette Display */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Generated Palettes */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {palettes.map((palette, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPalette?.name === palette.name 
                        ? 'ring-2 ring-purple-500 shadow-lg' 
                        : 'hover:shadow-md'
                    } bg-white border-purple-200`}
                    onClick={() => {
                      setSelectedPalette(palette);
                      if (previewMode) applyPreviewTheme(palette);
                    }}
                    data-testid={`card-palette-${palette.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-purple-800">{palette.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <ColorSwatch color={palette.primary} label="Primary" size="sm" />
                        <ColorSwatch color={palette.secondary} label="Secondary" size="sm" />
                        <ColorSwatch color={palette.accent} label="Accent" size="sm" />
                      </div>
                      <AccessibilityIndicator foreground={palette.text} background={palette.background} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Palette Details */}
              {selectedPalette && (
                <Card className="bg-white shadow-xl border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800">{selectedPalette.name} - Detailed View</CardTitle>
                    <CardDescription>Complete color palette with all variants and accessibility information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="colors" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-purple-100">
                        <TabsTrigger value="colors" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Colors</TabsTrigger>
                        <TabsTrigger value="shades" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Shades</TabsTrigger>
                        <TabsTrigger value="export" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Code</TabsTrigger>
                      </TabsList>

                      <TabsContent value="colors" className="space-y-6">
                        {/* Main Colors */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <ColorSwatch color={selectedPalette.primary} label="Primary" />
                          <ColorSwatch color={selectedPalette.secondary} label="Secondary" />
                          <ColorSwatch color={selectedPalette.accent} label="Accent" />
                          <ColorSwatch color={selectedPalette.info} label="Info" />
                        </div>

                        {/* Semantic Colors */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <ColorSwatch color={selectedPalette.success} label="Success" />
                          <ColorSwatch color={selectedPalette.warning} label="Warning" />
                          <ColorSwatch color={selectedPalette.error} label="Error" />
                          <ColorSwatch color={selectedPalette.text} label="Text" />
                        </div>

                        {/* Accessibility Check */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-3">Accessibility Compliance</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Text on Background</span>
                              <AccessibilityIndicator foreground={selectedPalette.text} background={selectedPalette.background} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Primary on Background</span>
                              <AccessibilityIndicator foreground={selectedPalette.primary} background={selectedPalette.background} />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="shades" className="space-y-4">
                        <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                          {Object.entries(selectedPalette.shades).map(([shade, color]) => (
                            <ColorSwatch key={shade} color={color} label={shade} size="sm" />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="export" className="space-y-4">
                        <Textarea
                          value={getExportContent()}
                          readOnly
                          rows={15}
                          className="font-mono text-sm"
                          data-testid="textarea-export-code"
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
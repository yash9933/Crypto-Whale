import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Type, BarChart3, MousePointer, Link, Zap, Square, MessageSquare } from "lucide-react";
import { applyModularColorTheme, colorThemes, defaultTheme, ModularColorTheme } from '@/lib/modularColors';

interface ModularColorPickerProps {
  className?: string;
}

const ModularColorPicker: React.FC<ModularColorPickerProps> = ({ className }) => {
  const handlePresetTheme = (themeName: string) => {
    const theme = colorThemes[themeName];
    if (theme) {
      applyModularColorTheme(theme);
    }
  };

  const handleCustomColor = (elementType: keyof ModularColorTheme, color: string) => {
    const currentTheme = { ...defaultTheme };
    currentTheme[elementType] = {
      ...currentTheme[elementType],
      hex: color,
      gradientFrom: color,
      gradientTo: color
    };
    applyModularColorTheme(currentTheme);
  };

  const elementTypes = [
    { key: 'titles' as keyof ModularColorTheme, label: 'Titles & Headers', icon: Type, description: 'Main titles, card headers, text highlights' },
    { key: 'charts' as keyof ModularColorTheme, label: 'Charts & Data', icon: BarChart3, description: 'Chart elements, data points, visualizations' },
    { key: 'buttons' as keyof ModularColorTheme, label: 'Buttons & Actions', icon: MousePointer, description: 'All buttons, form submissions, interactive elements' },
    { key: 'links' as keyof ModularColorTheme, label: 'Links & Navigation', icon: Link, description: 'All links, navigation, clickable text' },
    { key: 'icons' as keyof ModularColorTheme, label: 'Icons & Accents', icon: Zap, description: 'All icons, accents, decorative elements' },
    { key: 'borders' as keyof ModularColorTheme, label: 'Borders & Outlines', icon: Square, description: 'All borders, outlines, dividers' },
    { key: 'tooltips' as keyof ModularColorTheme, label: 'Tooltips & Overlays', icon: MessageSquare, description: 'All tooltips, popovers, overlay elements' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Modular Color System
        </CardTitle>
        <CardDescription>
          Change colors for specific UI elements across the entire app. Each element type can have its own color.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Preset Themes */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Preset Themes</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('mintgreen')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                Mint Green
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('royalblue')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                Royal Blue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('hotpink')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                Hot Pink
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('lime')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                Lime
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('blue')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Blue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePresetTheme('purple')}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                Purple
              </Button>
            </div>
          </div>

          {/* Individual Element Colors */}
          <div>
            <h4 className="text-sm font-medium mb-3">Customize Individual Elements</h4>
            <div className="space-y-4">
              {elementTypes.map((element) => {
                const IconComponent = element.icon;
                return (
                  <div key={element.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{element.label}</p>
                        <p className="text-xs text-gray-500">{element.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        defaultValue="#3DDC97"
                        onChange={(e) => handleCustomColor(element.key, e.target.value)}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        title={`Change ${element.label} color`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">How to Use</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Preset Themes:</strong> Apply complete color schemes instantly</li>
              <li>• <strong>Individual Colors:</strong> Use color pickers to customize specific element types</li>
              <li>• <strong>Real-time Updates:</strong> Changes apply immediately across the entire app</li>
              <li>• <strong>Persistent:</strong> Your color choices are saved automatically</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModularColorPicker;

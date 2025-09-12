import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, RotateCcw } from 'lucide-react';
import { COLOR_PRESETS, applyColorPreset } from '@/lib/colors';

interface ColorPickerProps {
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ className }) => {
  const handleColorChange = (preset: keyof typeof COLOR_PRESETS) => {
    applyColorPreset(preset);
  };

  const resetToDefault = () => {
    applyColorPreset('hotpink');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          App Color Theme
        </CardTitle>
        <CardDescription>
          Change the main color scheme of the entire application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('hotpink')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              Hot Pink
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('lime')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-lime-500"></div>
              Lime
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('blue')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Blue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('purple')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              Purple
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('orange')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              Orange
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorChange('red')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Red
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;

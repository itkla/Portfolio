"use client";

import { memo } from 'react';

export const PRESET_COLORS = [
    '#FF6B9D', // Pink
    '#4ECDC4', // Cyan
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#C4A1FF', // Purple
    '#FF9A76', // Orange
    '#FF6B6B', // Red
    '#FFFFFF', // White
] as const;

interface ColorPaletteProps {
    selectedColor: string;
    onColorSelect: (color: string) => void;
}

export const ColorPalette = memo(function ColorPalette({
    selectedColor,
    onColorSelect
}: ColorPaletteProps) {
    return (
        <div className="flex gap-1 flex-wrap">
            {PRESET_COLORS.map((color) => {
                const isSelected = selectedColor === color;

                return (
                    <button
                        key={color}
                        onClick={() => onColorSelect(color)}
                        className={`
              w-5 h-5 rounded transition-all duration-200
              border
              ${isSelected
                                ? 'border-white scale-110 shadow-lg'
                                : 'border-white/20 hover:border-white/40 hover:scale-105'
                            }
            `}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                    />
                );
            })}
        </div>
    );
});

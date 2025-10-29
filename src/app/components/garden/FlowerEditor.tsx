"use client";

import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { ColorPalette, PRESET_COLORS } from './ColorPalette';
import { Eraser, Paintbrush, RotateCcw } from 'lucide-react';

const GRID_SIZE = 16;

export type GridData = string[][];

interface FlowerEditorProps {
    onGridChange?: (grid: GridData) => void;
}

export const FlowerEditor = memo(function FlowerEditor({
    onGridChange
}: FlowerEditorProps) {
    const [grid, setGrid] = useState<GridData>(() =>
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('transparent'))
    );
    const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
    const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
    const [isDrawing, setIsDrawing] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onGridChange?.(grid);
    }, [grid, onGridChange]);

    const handleCellPaint = useCallback((row: number, col: number) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(r => [...r]);
            newGrid[row][col] = tool === 'brush' ? selectedColor : 'transparent';
            return newGrid;
        });
    }, [selectedColor, tool]);

    const handleMouseDown = useCallback((row: number, col: number) => {
        setIsDrawing(true);
        handleCellPaint(row, col);
    }, [handleCellPaint]);

    const handleMouseEnter = useCallback((row: number, col: number) => {
        if (isDrawing) {
            handleCellPaint(row, col);
        }
    }, [isDrawing, handleCellPaint]);

    const handleMouseUp = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const handleClear = useCallback(() => {
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('transparent')));
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool('brush')}
                        className={`
                            p-2 rounded-md transition-all duration-200
                            ${tool === 'brush'
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'text-white/60 hover:bg-white/10 hover:text-white/80 border border-transparent'
                            }
                        `}
                        aria-label="Brush tool"
                    >
                        <Paintbrush className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`
                            p-2 rounded-md transition-all duration-200
                            ${tool === 'eraser'
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'text-white/60 hover:bg-white/10 hover:text-white/80 border border-transparent'
                            }
                        `}
                        aria-label="Eraser tool"
                    >
                        <Eraser className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 rounded-md text-white/60 hover:bg-white/10 hover:text-white/80 transition-all duration-200"
                        aria-label="Clear canvas"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                <ColorPalette
                    selectedColor={selectedColor}
                    onColorSelect={(color) => setSelectedColor(color)}
                />
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div
                    ref={gridRef}
                    className="inline-grid gap-0 bg-white/5 p-2 rounded-lg border border-white/10 backdrop-blur-sm select-none"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cellColor, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                className="w-5 h-5 border border-white/10 cursor-crosshair transition-all duration-75 hover:border-white/30"
                                style={{
                                    backgroundColor: cellColor === 'transparent' ? 'rgba(255,255,255,0.02)' : cellColor
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-xs text-white/60">
                <span>16×16 Grid</span>
                <span className="flex items-center gap-2">
                    <span className="capitalize">{tool}</span>
                    <span>•</span>
                    <div
                        className="w-3 h-3 rounded-sm border border-white/30"
                        style={{ backgroundColor: selectedColor }}
                    />
                </span>
            </div>
        </div>
    );
});

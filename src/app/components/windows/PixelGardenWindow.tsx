"use client";

import { memo, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { FlowerGallery } from '../garden/FlowerGallery';
import { Plus, X, Paintbrush, Eraser, RotateCcw } from 'lucide-react';
import { ColorPalette, PRESET_COLORS } from '../garden/ColorPalette';
import { toast } from '@/hooks/use-toast';

const GRID_SIZE = 16;
type GridData = string[][];

export const PixelGardenWindow = memo(function PixelGardenWindow() {
    const t = useTranslations();
    const [isCreating, setIsCreating] = useState(false);
    const [isPlanting, setIsPlanting] = useState(false);
    const [grid, setGrid] = useState<GridData>(() =>
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('transparent'))
    );
    const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
    const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
    const [isDrawing, setIsDrawing] = useState(false);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);
    const [existingFlowers, setExistingFlowers] = useState<Array<{ x: number; y: number }>>([]);

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

    const handleNextToPlanting = useCallback(() => {
        setIsCreating(false);
        setIsPlanting(true);
        fetch('/api/flowers')
            .then(res => res.json())
            .then(data => {
                if (data.flowers) {
                    setExistingFlowers(data.flowers.map((f: { x: number; y: number }) => ({ x: f.x, y: f.y })));
                }
            })
            .catch(err => console.error('Failed to fetch flowers for collision detection:', err));
    }, []);

  const handleCanvasClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>, transformedCoords?: { x: number; y: number }) => {
    if (!isPlanting || isSubmitting) return;

    let x: number, y: number;

    if (transformedCoords) {
      x = transformedCoords.x;
      y = transformedCoords.y;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    }

    const COLLISION_THRESHOLD = 8; // 8% distance threshold
    const tooClose = existingFlowers.some(flower => {
      const distance = Math.sqrt(Math.pow(x - flower.x, 2) + Math.pow(y - flower.y, 2));
      return distance < COLLISION_THRESHOLD;
    });

        if (tooClose) {
            toast({
                title: 'Too close!',
                description: 'Please plant your flower in a different spot. This area is too crowded.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/flowers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gridData: grid,
                    name: name.trim() || null,
                    link: link.trim() || null,
                    x: Math.round(x),
                    y: Math.round(y),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save flower');
            }

            const result = await response.json();

            if (result.flower?.id) {
                const myFlowers = JSON.parse(localStorage.getItem('pixelGarden_myFlowers') || '[]');
                myFlowers.push(result.flower.id);
                localStorage.setItem('pixelGarden_myFlowers', JSON.stringify(myFlowers));
            }

            toast({
                title: t('pixelGarden.submitSuccess'),
                description: t('pixelGarden.submitSuccessDescription'),
            });

            handleClear();
            setName('');
            setLink('');
            setIsPlanting(false);
            setGalleryRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast({
                title: t('pixelGarden.submitError'),
                description: error instanceof Error ? error.message : t('pixelGarden.submitErrorDescription'),
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [grid, name, link, isPlanting, isSubmitting, existingFlowers, t, handleClear]);

    const handleSubmit = useCallback(() => {
        if (isSubmitting) return;
        handleNextToPlanting();
    }, [isSubmitting, handleNextToPlanting]);

    return (
        <div className="relative flex flex-col h-full bg-transparent overflow-hidden">
      <div
        className={`flex-1 overflow-auto ${isPlanting ? 'cursor-crosshair' : ''}`}
      >
        <FlowerGallery 
          refreshTrigger={galleryRefreshTrigger} 
          onCanvasClick={handleCanvasClick}
          isPlanting={isPlanting}
        />
      </div>

            {isPlanting && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white/90 text-sm font-medium shadow-lg pointer-events-none">
                    Click anywhere to plant your flower
                </div>
            )}

            {!isCreating && !isPlanting && (
                <button
                    onClick={() => setIsCreating(true)}
                    className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white/80 hover:text-white shadow-lg"
                    aria-label="Create flower"
                >
                    <Plus className="w-5 h-5" />
                </button>
            )}

            {isCreating && (
                <div className="absolute inset-0 flex items-start justify-start p-4 bg-black/20 backdrop-blur-sm overflow-auto">
                    <div className="w-full max-w-sm bg-neutral-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 flex flex-col gap-3 sticky top-0">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <h3 className="text-sm font-medium text-white/90">Create Flower</h3>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white/80"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <div
                                className="inline-grid gap-0 bg-white/5 p-1.5 rounded-lg border border-white/10 select-none"
                                style={{
                                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                                }}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {grid.map((row, rowIndex) =>
                                    row.map((cellColor, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                            className="w-4 h-4 border border-white/10 cursor-crosshair transition-all duration-75 hover:border-white/30"
                                            style={{
                                                backgroundColor: cellColor === 'transparent' ? 'rgba(255,255,255,0.02)' : cellColor
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setTool('brush')}
                                    className={`p-1.5 rounded transition-all ${tool === 'brush' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
                                    aria-label="Brush"
                                >
                                    <Paintbrush className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setTool('eraser')}
                                    className={`p-1.5 rounded transition-all ${tool === 'eraser' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
                                    aria-label="Eraser"
                                >
                                    <Eraser className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="p-1.5 rounded text-white/60 hover:bg-white/10 transition-all"
                                    aria-label="Clear"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <ColorPalette selectedColor={selectedColor} onColorSelect={setSelectedColor} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                                maxLength={50}
                            />
                            <input
                                type="url"
                                placeholder="Your link (optional)"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                                maxLength={200}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 hover:border-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t('pixelGarden.submitting') : 'Next: Plant Flower'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

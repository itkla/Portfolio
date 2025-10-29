"use client";

import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, Loader2, Flower2, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { GridData } from './FlowerEditor';

interface Flower {
    id: number;
    gridData: GridData;
    name: string | null;
    link: string | null;
    x: number;
    y: number;
    createdAt: string;
    updatedAt: string | null;
}

interface FlowerGalleryProps {
    refreshTrigger?: number;
    onCanvasClick?: (e: React.MouseEvent<HTMLDivElement>, transformedCoords?: { x: number; y: number }) => void;
    isPlanting?: boolean;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 0.7;

export const FlowerGallery = memo(function FlowerGallery({ refreshTrigger, onCanvasClick, isPlanting }: FlowerGalleryProps) {
    const t = useTranslations();
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [hoveredFlower, setHoveredFlower] = useState<Flower | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    const [loadedFlowers, setLoadedFlowers] = useState<Set<number>>(new Set());
    const [myFlowerIds, setMyFlowerIds] = useState<Set<number>>(new Set());
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(ZOOM_DEFAULT);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const flowerRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    useEffect(() => {
        const savedState = localStorage.getItem('pixelGarden_viewState');
        if (savedState) {
            try {
                const { zoom: savedZoom, offset } = JSON.parse(savedState);
                setZoom(savedZoom || ZOOM_DEFAULT);
                setScrollOffset(offset || { x: 0, y: 0 });
            } catch (e) {
                //
            }
        }

        let id = localStorage.getItem('pixelGarden_userId');
        if (!id) {
            id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
            localStorage.setItem('pixelGarden_userId', id);
        }
        setUserId(id);
        const myFlowers = localStorage.getItem('pixelGarden_myFlowers');
        if (myFlowers) {
            try {
                const flowerIds = JSON.parse(myFlowers);
                setMyFlowerIds(new Set(flowerIds));
            } catch (e) {
                //
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('pixelGarden_viewState', JSON.stringify({
            zoom,
            offset: scrollOffset,
        }));
    }, [zoom, scrollOffset]);

    const fetchFlowers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/flowers');
            if (!response.ok) {
                throw new Error('Failed to fetch flowers');
            }
            const data = await response.json();
            setFlowers(data.flowers || []);
        } catch (error) {
            toast({
                title: t('pixelGarden.fetchError'),
                description: error instanceof Error ? error.message : t('pixelGarden.fetchErrorDescription'),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchFlowers();
    }, [fetchFlowers, refreshTrigger]);

    const isFlowerInViewport = useCallback((flower: Flower) => {
        if (!containerRef.current) return true; // Load all initially

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const canvasWidth = rect.width * 2; // 200% canvas
        const canvasHeight = rect.height * 2;
        const flowerScreenX = (flower.x / 100) * canvasWidth * zoom + scrollOffset.x;
        const flowerScreenY = (flower.y / 100) * canvasHeight * zoom + scrollOffset.y;

        const margin = 200;

        return (
            flowerScreenX >= -margin &&
            flowerScreenX <= rect.width + margin &&
            flowerScreenY >= -margin &&
            flowerScreenY <= rect.height + margin
        );
    }, [scrollOffset, zoom]);

    useEffect(() => {
        const updateVisibleFlowers = () => {
            const newLoadedFlowers = new Set<number>();
            flowers.forEach(flower => {
                if (isFlowerInViewport(flower)) {
                    newLoadedFlowers.add(flower.id);
                }
            });
            setLoadedFlowers(prev => {
                if (prev.size !== newLoadedFlowers.size ||
                    ![...prev].every(id => newLoadedFlowers.has(id))) {
                    return newLoadedFlowers;
                }
                return prev;
            });
        };

        updateVisibleFlowers();

        const timeout = setTimeout(updateVisibleFlowers, 100);
        return () => clearTimeout(timeout);
    }, [flowers, scrollOffset, zoom, isFlowerInViewport]);

    const handleDelete = useCallback(async (id: number) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/flowers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete flower');
            }

            toast({
                title: t('pixelGarden.deleteSuccess'),
                description: t('pixelGarden.deleteSuccessDescription'),
            });

            setFlowers(prev => prev.filter(f => f.id !== id));

            setMyFlowerIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);

                const myFlowers = Array.from(newSet);
                localStorage.setItem('pixelGarden_myFlowers', JSON.stringify(myFlowers));

                return newSet;
            });
        } catch (error) {
            toast({
                title: t('pixelGarden.deleteError'),
                description: error instanceof Error ? error.message : t('pixelGarden.deleteErrorDescription'),
                variant: 'destructive',
            });
        } finally {
            setDeletingId(null);
        }
    }, [t]);

    const handleZoom = useCallback((delta: number) => {
        setZoom(prev => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev + delta)));
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            handleZoom(delta);
        }
    }, [handleZoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isPlanting || e.button !== 0) return;

        const target = e.target as HTMLElement;
        if (target.closest('.flower-item') || target.closest('button')) return;

        setIsPanning(true);
        setStartPan({
            x: e.clientX - scrollOffset.x,
            y: e.clientY - scrollOffset.y,
        });
    }, [isPlanting, scrollOffset]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning) {
            const newX = e.clientX - startPan.x;
            const newY = e.clientY - startPan.y;
            setScrollOffset({ x: newX, y: newY });
        }
    }, [isPanning, startPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
        if (!isTooltipHovered) {
            tooltipTimeoutRef.current = setTimeout(() => {
                setHoveredFlower(null);
                setTooltipPosition(null);
            }, 200);
        }
    }, [isTooltipHovered]);

    const handleFlowerMouseEnter = useCallback((flower: Flower, flowerElement: HTMLDivElement) => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }

        setHoveredFlower(flower);

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const flowerRect = flowerElement.getBoundingClientRect();

            setTooltipPosition({
                x: flowerRect.right - containerRect.left + 8,
                y: flowerRect.top - containerRect.top + (flowerRect.height / 2) - 20
            });
        }
    }, []);

    const handleFlowerMouseLeave = useCallback(() => {
        tooltipTimeoutRef.current = setTimeout(() => {
            if (!isTooltipHovered) {
                setHoveredFlower(null);
                setTooltipPosition(null);
            }
        }, 200);
    }, [isTooltipHovered]);

    const handleTooltipMouseEnter = useCallback(() => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }
        setIsTooltipHovered(true);
    }, []);

    const handleTooltipMouseLeave = useCallback(() => {
        setIsTooltipHovered(false);
        setHoveredFlower(null);
        setTooltipPosition(null);
    }, []);

    const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!onCanvasClick || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const transformedX = (clickX - scrollOffset.x) / zoom;
        const transformedY = (clickY - scrollOffset.y) / zoom;

        const canvasWidth = rect.width * 2;
        const canvasHeight = rect.height * 2;
        const percentX = (transformedX / canvasWidth) * 100;
        const percentY = (transformedY / canvasHeight) * 100;

        onCanvasClick(e, { x: percentX, y: percentY });
    }, [onCanvasClick, scrollOffset, zoom]);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const getFlowerAnimationDelay = useCallback((flower: Flower) => {
        return (flower.y / 100) * 0.5; // Max 0.5s delay spread across height
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-white/60">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-xs">{t('pixelGarden.loading')}</p>
                </div>
            </div>
        );
    }

    if (flowers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-white/60 max-w-xs text-center">
                    <Flower2 className="w-12 h-12 text-white/20" />
                    <p className="text-sm font-medium text-white/70">{t('pixelGarden.emptyGallery')}</p>
                    <p className="text-xs text-white/50">{t('pixelGarden.emptyGalleryDescription')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                ref={containerRef}
                className={`relative w-full h-full overflow-hidden ${isPanning ? 'cursor-grabbing' : isPlanting ? 'cursor-crosshair' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={handleContainerClick}
                onWheel={handleWheel}
            >
                <div
                    className="relative"
                    style={{
                        minWidth: '200%',
                        minHeight: '200%',
                        transform: `translate(${scrollOffset.x}px, ${scrollOffset.y}px) scale(${zoom})`,
                        transformOrigin: 'top left',
                        transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                    }}
                >
                    {flowers.map((flower) => {
                        const isVisible = loadedFlowers.has(flower.id);

                        const FlowerContent = (
                            <div
                                className={`flower-item group absolute cursor-pointer transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    left: `${flower.x}%`,
                                    top: `${flower.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    animationDelay: `${getFlowerAnimationDelay(flower)}s`,
                                }}
                                ref={(el) => {
                                    if (el) flowerRefs.current.set(flower.id, el);
                                }}
                                onMouseEnter={(e) => {
                                    const target = e.currentTarget;
                                    handleFlowerMouseEnter(flower, target);
                                }}
                                onMouseLeave={handleFlowerMouseLeave}
                            >
                                {isVisible && (
                                    <div className="flex items-center justify-center">
                                        <div
                                            className="inline-grid gap-0"
                                            style={{
                                                gridTemplateColumns: `repeat(16, 1fr)`,
                                                gridTemplateRows: `repeat(16, 1fr)`,
                                            }}
                                        >
                                            {flower.gridData.map((row, rowIndex) =>
                                                row.map((cellColor, colIndex) => (
                                                    <div
                                                        key={`${rowIndex}-${colIndex}`}
                                                        className="w-1 h-1"
                                                        style={{
                                                            backgroundColor: cellColor === 'transparent' ? 'transparent' : cellColor
                                                        }}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );

                        return flower.link ? (
                            <a
                                key={flower.id}
                                href={flower.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                {FlowerContent}
                            </a>
                        ) : (
                            <div key={flower.id}>
                                {FlowerContent}
                            </div>
                        );
                    })}
                </div>
            </div>

            {!isPlanting && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                        onClick={() => handleZoom(-ZOOM_STEP)}
                        disabled={zoom <= ZOOM_MIN}
                        className="p-2 transition-all duration-200 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleZoom(ZOOM_STEP)}
                        disabled={zoom >= ZOOM_MAX}
                        className="p-2 transition-all duration-200 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setZoom(ZOOM_DEFAULT)}
                        className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/20 text-xs text-center transition-all duration-200"
                        aria-label="Reset zoom to default"
                        title="Click to reset zoom"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                </div>
            )}

            {hoveredFlower && tooltipPosition && (
                <div
                    className="absolute z-50 animate-in fade-in duration-200 pointer-events-auto"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                    }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                >
                    <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-white/10 max-w-xs">
                        {hoveredFlower.name && (
                            <p className="font-semibold mb-1">{hoveredFlower.name}</p>
                        )}
                        {hoveredFlower.link && (
                            <p className="text-blue-300 mb-1 truncate">{hoveredFlower.link}</p>
                        )}
                        <p className="text-white/60 text-[10px]">{formatDate(hoveredFlower.createdAt)}</p>

                        {myFlowerIds.has(hoveredFlower.id) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(hoveredFlower.id);
                                }}
                                disabled={deletingId === hoveredFlower.id}
                                className="
                                w-full mt-1 px-2 py-1 rounded
                                bg-red-500/90 text-white text-xs
                                hover:bg-red-600
                                border border-white/20
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center gap-1
                                "
                                aria-label="Delete flower"
                            >
                                {deletingId === hoveredFlower.id ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
});

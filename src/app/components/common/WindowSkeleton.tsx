export function WindowSkeleton() {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            <div className="h-6 bg-neutral-700 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-700 rounded"></div>
                <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-700 rounded w-4/6"></div>
            </div>
            <div className="h-32 bg-neutral-700 rounded"></div>
        </div>
    );
}

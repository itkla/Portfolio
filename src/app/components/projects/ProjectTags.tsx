import { Badge } from '@/components/ui/badge';

interface ProjectTagsProps {
    tags: string[];
}

export function ProjectTags({ tags }: ProjectTagsProps) {
    return (
        <div className="rounded-xl border-neutral-700 p-2 mt-2">
            <div className="flex gap-2 mt-1 flex-wrap">
                {tags.map((tag) => (
                    <Badge key={tag} variant="project_tag">
                        #{tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
}

import { toast } from '@/hooks/use-toast';

export type NotificationType = 'default' | 'success' | 'warning' | 'destructive';

export function useNotifications() {
    return {
        notify: (title: string, description?: string) =>
            toast({ title, description }),
        success: (title: string, description?: string) =>
            toast({ title, description, variant: 'success' }),
        error: (title: string, description?: string) =>
            toast({ title, description, variant: 'destructive' }),
        warning: (title: string, description?: string) =>
            toast({ title, description, variant: 'warning' }),
        info: (title: string, description?: string) =>
            toast({ title, description, variant: 'default' }),
    };
}

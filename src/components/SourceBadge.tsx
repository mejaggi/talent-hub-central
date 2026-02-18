import { cn } from '@/lib/utils';
import type { TrainingSource } from '@/lib/mock-data';

export default function SourceBadge({ source }: { source: TrainingSource }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        source === 'Udemy'
          ? 'bg-badge-udemy text-badge-udemy-foreground'
          : 'bg-badge-csod text-badge-csod-foreground'
      )}
    >
      {source}
    </span>
  );
}

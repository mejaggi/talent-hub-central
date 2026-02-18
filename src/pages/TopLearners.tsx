import { useState } from 'react';
import { Trophy, Flame, Clock, BookOpen } from 'lucide-react';
import { mockTopLearners } from '@/lib/mock-data';
import SourceBadge from '@/components/SourceBadge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function LeaderboardCard({ learner, rank }: { learner: typeof mockTopLearners[0]; rank: number }) {
  const isTop3 = rank <= 3;
  const medalColor = rank === 1 ? 'text-chart-warning' : rank === 2 ? 'text-muted-foreground' : rank === 3 ? 'text-chart-csod' : '';

  return (
    <div className={cn(
      'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-elevated',
      isTop3 && 'shadow-card'
    )}>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg', isTop3 ? medalColor : 'text-muted-foreground')}>
        {isTop3 ? <Trophy className="h-6 w-6" /> : `#${rank}`}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
        {learner.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-card-foreground truncate">{learner.employeeName}</p>
        <p className="text-xs text-muted-foreground">{learner.department}</p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-bold text-card-foreground">{learner.coursesCompleted}</p>
          <p className="text-xs text-muted-foreground">Courses</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-card-foreground">{learner.totalHours}h</p>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        <div className="flex items-center gap-1 text-chart-warning">
          <Flame className="h-4 w-4" />
          <span className="font-semibold text-sm">{learner.streak}d</span>
        </div>
        <SourceBadge source={learner.source} />
      </div>
    </div>
  );
}

export default function TopLearners() {
  const [tab, setTab] = useState('all');

  const filteredLearners = tab === 'all'
    ? mockTopLearners
    : mockTopLearners.filter(l => l.source === tab);

  const totalHours = filteredLearners.reduce((s, l) => s + l.totalHours, 0);
  const totalCourses = filteredLearners.reduce((s, l) => s + l.coursesCompleted, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Top Learners</h1>
        <p className="text-sm text-muted-foreground">Recognizing our most dedicated learners</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="rounded-lg bg-accent/20 p-2.5"><Trophy className="h-5 w-5 text-chart-warning" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{filteredLearners.length}</p>
            <p className="text-xs text-muted-foreground">Top Learners</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="rounded-lg bg-accent/20 p-2.5"><Clock className="h-5 w-5 text-accent" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{Math.round(totalHours)}h</p>
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="rounded-lg bg-accent/20 p-2.5"><BookOpen className="h-5 w-5 text-accent" /></div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{totalCourses}</p>
            <p className="text-xs text-muted-foreground">Courses Completed</p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="Udemy">Udemy</TabsTrigger>
          <TabsTrigger value="CSOD">CSOD</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 space-y-3">
          {filteredLearners.map((l, i) => (
            <LeaderboardCard key={l.id} learner={l} rank={i + 1} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

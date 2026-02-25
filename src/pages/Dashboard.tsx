import { useState, useMemo } from 'react';
import { Download, BookOpen, Clock, Users, CheckCircle2, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { mockTrainings, type Training } from '@/lib/mock-data';
import { useSyncData } from '@/hooks/use-sync-data';
import StatCard from '@/components/StatCard';
import SourceBadge from '@/components/SourceBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function downloadCSV(data: Training[]) {
  const headers = ['ID', 'Training Name', 'Details', 'Employee', 'Email', 'Department', 'Start Date', 'Completion Date', 'Hours', 'Source', 'Skill', 'Status'];
  const rows = data.map(t => [t.id, t.trainingName, t.trainingDetails, t.employeeName, t.employeeEmail, t.department, t.startDate, t.completionDate, t.hoursConsumed, t.source, t.skillCategory, t.status]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trainings_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const { trainings, isSyncing, lastSyncedAt, triggerSync } = useSyncData(mockTrainings);

  const [yearFilter, setYearFilter] = useState<string>('all');
  const [daysFilter, setDaysFilter] = useState<number | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const skills = useMemo(() => [...new Set(trainings.map(t => t.skillCategory))].sort(), [trainings]);
  const years = useMemo(() => [...new Set(trainings.map(t => t.completionDate ? t.completionDate.slice(0, 4) : t.startDate.slice(0, 4)))].sort().reverse(), [trainings]);

  const filtered = useMemo(() => {
    let data = [...trainings];

    if (yearFilter !== 'all') {
      data = data.filter(t => (t.completionDate || t.startDate).startsWith(yearFilter));
    }
    if (daysFilter) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysFilter);
      data = data.filter(t => t.completionDate && new Date(t.completionDate) >= cutoff);
    }
    if (skillFilter !== 'all') {
      data = data.filter(t => t.skillCategory === skillFilter);
    }
    if (sourceFilter !== 'all') {
      data = data.filter(t => t.source === sourceFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t =>
        t.trainingName.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }

    return data;
  }, [trainings, yearFilter, daysFilter, skillFilter, sourceFilter, searchQuery]);

  const stats = useMemo(() => {
    const completed = filtered.filter(t => t.status === 'Completed');
    const totalHours = filtered.reduce((sum, t) => sum + t.hoursConsumed, 0);
    const uniquePeople = new Set(filtered.map(t => t.employeeName)).size;
    return {
      total: filtered.length,
      completed: completed.length,
      totalHours: Math.round(totalHours),
      uniquePeople,
    };
  }, [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Dashboard</h1>
          <p className="text-sm text-muted-foreground">Consolidated view across Udemy & CSOD</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={triggerSync} disabled={isSyncing} className="gap-2">
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </Button>
          <Button onClick={() => downloadCSV(filtered)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      {lastSyncedAt && (
        <p className="text-xs text-muted-foreground -mt-4">
          Last synced: {new Date(lastSyncedAt).toLocaleString()}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Trainings" value={stats.total} icon={BookOpen} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} trend={{ value: `${Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%`, positive: true }} />
        <StatCard title="Hours Consumed" value={stats.totalHours.toLocaleString()} icon={Clock} />
        <StatCard title="Active Learners" value={stats.uniquePeople} icon={Users} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {skills.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Udemy">Udemy</SelectItem>
            <SelectItem value="CSOD">CSOD</SelectItem>
          </SelectContent>
        </Select>

        {[30, 60, 90].map(days => (
          <Button
            key={days}
            variant={daysFilter === days ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDaysFilter(daysFilter === days ? null : days)}
          >
            Last {days} Days
          </Button>
        ))}

        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 w-[220px]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Training Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Details</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Start Date</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Completion</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Hours</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Skill</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{t.trainingName}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{t.trainingDetails}</td>
                  <td className="px-4 py-3 text-card-foreground">{t.employeeName}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.startDate}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.completionDate || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-card-foreground">{t.hoursConsumed}h</td>
                  <td className="px-4 py-3 text-center"><SourceBadge source={t.source} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.skillCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground text-center">
            Showing 50 of {filtered.length} records. Export CSV for full data.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-muted-foreground">
            No trainings match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { AlertTriangle, Send, Search, Filter, Mail } from 'lucide-react';
import { mockTrainings, defaultEmailTemplates, type Training } from '@/lib/mock-data';
import { sendO365Email } from '@/lib/api/o365-email';
import SourceBadge from '@/components/SourceBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export default function IncompleteTrainings() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [emailOpen, setEmailOpen] = useState(false);
  const [templateId, setTemplateId] = useState(defaultEmailTemplates[0].id);
  const [emailSubject, setEmailSubject] = useState(defaultEmailTemplates[0].subject);
  const [emailBody, setEmailBody] = useState(defaultEmailTemplates[0].body);

  const incompleteTrainings = useMemo(() => {
    let data = mockTrainings.filter(t => t.status === 'In Progress' || t.status === 'Not Started');

    if (statusFilter !== 'all') {
      data = data.filter(t => t.status === statusFilter);
    }
    if (sourceFilter !== 'all') {
      data = data.filter(t => t.source === sourceFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t =>
        t.trainingName.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.employeeEmail.toLowerCase().includes(q)
      );
    }
    return data;
  }, [statusFilter, sourceFilter, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === incompleteTrainings.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(incompleteTrainings.map(t => t.id)));
    }
  };

  const openEmailDialog = () => {
    if (selected.size === 0) {
      toast({ title: 'No employees selected', description: 'Please select at least one employee to send a nudge.', variant: 'destructive' });
      return;
    }
    const tpl = defaultEmailTemplates[0];
    setTemplateId(tpl.id);
    setEmailSubject(tpl.subject);
    setEmailBody(tpl.body);
    setEmailOpen(true);
  };

  const handleTemplateChange = (id: string) => {
    const tpl = defaultEmailTemplates.find(t => t.id === id);
    if (tpl) {
      setTemplateId(id);
      setEmailSubject(tpl.subject);
      setEmailBody(tpl.body);
    }
  };

  const handleSendEmail = async () => {
    const recipients = incompleteTrainings
      .filter(t => selected.has(t.id))
      .map(t => ({ name: t.employeeName, email: t.employeeEmail }));

    try {
      const result = await sendO365Email({
        to: recipients,
        subject: emailSubject,
        body: emailBody,
      });
      toast({
        title: 'Nudge emails sent!',
        description: `Sent to ${result.sent} employee(s) via MS O365.${result.failed > 0 ? ` ${result.failed} failed.` : ''}`,
      });
    } catch (err: any) {
      toast({ title: 'Email failed', description: err.message, variant: 'destructive' });
    }
    setEmailOpen(false);
    setSelected(new Set());
  };

  const statusColor = (status: string) =>
    status === 'In Progress'
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
      : 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incomplete Trainings</h1>
          <p className="text-sm text-muted-foreground">Track and nudge employees with pending or not-started trainings</p>
        </div>
        <Button onClick={openEmailDialog} className="gap-2">
          <Send className="h-4 w-4" />
          Send Nudge ({selected.size})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total Incomplete</p>
          <p className="text-2xl font-bold text-card-foreground">{incompleteTrainings.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {incompleteTrainings.filter(t => t.status === 'In Progress').length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Not Started</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {incompleteTrainings.filter(t => t.status === 'Not Started').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selected.size === incompleteTrainings.length && incompleteTrainings.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Training Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Details</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Assigned</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {incompleteTrainings.map(t => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selected.has(t.id)}
                      onCheckedChange={() => toggleSelect(t.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{t.trainingName}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{t.trainingDetails}</td>
                  <td className="px-4 py-3 text-card-foreground">{t.employeeName}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{t.employeeEmail}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.startDate}</td>
                  <td className="px-4 py-3 text-center"><SourceBadge source={t.source} /></td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={statusColor(t.status)}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {incompleteTrainings.length === 0 && (
          <div className="px-4 py-12 text-center text-muted-foreground">
            No incomplete trainings match the current filters.
          </div>
        )}
      </div>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Nudge Email
            </DialogTitle>
            <DialogDescription>
              Sending to {selected.size} employee(s) via MS O365
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Template</label>
              <Select value={templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultEmailTemplates.map(tpl => (
                    <SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Body</label>
              <Textarea
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                rows={8}
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {'{{name}}'} and {'{{course_name}}'} as placeholders
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} className="gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

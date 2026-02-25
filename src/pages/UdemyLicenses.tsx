import { useState, useMemo } from 'react';
import { Mail, UserX, AlertTriangle, CheckCircle2, Clock, Users, Search, Send } from 'lucide-react';
import { mockUdemyLicenses, defaultEmailTemplates, type UdemyLicense, type EmailTemplate } from '@/lib/mock-data';
import { revokeUdemyLicenses } from '@/lib/api/udemy-api';
import { sendO365Email, personalizeEmail } from '@/lib/api/o365-email';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function UdemyLicenses() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inactiveFilter, setInactiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const filtered = useMemo(() => {
    let data = [...mockUdemyLicenses];
    if (statusFilter !== 'all') data = data.filter(l => l.status === statusFilter);
    if (inactiveFilter !== 'all') {
      const days = parseInt(inactiveFilter);
      data = data.filter(l => l.daysInactive >= days);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(l => l.employeeName.toLowerCase().includes(q) || l.department.toLowerCase().includes(q));
    }
    return data;
  }, [statusFilter, inactiveFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: mockUdemyLicenses.length,
    active: mockUdemyLicenses.filter(l => l.status === 'Active').length,
    atRisk: mockUdemyLicenses.filter(l => l.status === 'At Risk').length,
    inactive: mockUdemyLicenses.filter(l => l.status === 'Inactive').length,
  }), []);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(l => l.id)));
    }
  };

  const openEmailDialog = () => {
    if (selectedIds.size === 0) {
      toast({ title: 'No users selected', description: 'Please select at least one user.', variant: 'destructive' });
      return;
    }
    setEmailDialogOpen(true);
  };

  const applyTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setEmailSubject(tpl.subject);
    setEmailBody(tpl.body);
  };

  const sendEmails = async () => {
    const recipients = filtered
      .filter(l => selectedIds.has(l.id))
      .map(l => ({ name: l.employeeName, email: l.employeeEmail }));

    try {
      const result = await sendO365Email({
        to: recipients,
        subject: emailSubject,
        body: emailBody,
      });
      toast({
        title: 'Emails sent',
        description: `${result.sent} email(s) sent via MS O365.${result.failed > 0 ? ` ${result.failed} failed.` : ''}`,
      });
    } catch (err: any) {
      toast({ title: 'Email failed', description: err.message, variant: 'destructive' });
    }
    setEmailDialogOpen(false);
    setSelectedIds(new Set());
  };

  const revokeSelected = async () => {
    const emails = filtered
      .filter(l => selectedIds.has(l.id))
      .map(l => l.employeeEmail);

    try {
      const result = await revokeUdemyLicenses(emails);
      toast({
        title: 'Licenses revoked',
        description: `${result.revoked} Udemy license(s) have been revoked.`,
      });
    } catch (err: any) {
      toast({ title: 'Revoke failed', description: err.message, variant: 'destructive' });
    }
    setRevokeDialogOpen(false);
    setSelectedIds(new Set());
  };

  const statusColor = (status: UdemyLicense['status']) => {
    if (status === 'Active') return 'text-chart-success';
    if (status === 'At Risk') return 'text-chart-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Udemy License Management</h1>
          <p className="text-sm text-muted-foreground">Monitor utilization, send nudges, and manage licenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEmailDialog} className="gap-2">
            <Mail className="h-4 w-4" /> Send Email
          </Button>
          <Button variant="destructive" onClick={() => {
            if (selectedIds.size === 0) { toast({ title: 'No users selected', variant: 'destructive' }); return; }
            setRevokeDialogOpen(true);
          }} className="gap-2">
            <UserX className="h-4 w-4" /> Revoke
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Licenses" value={stats.total} icon={Users} />
        <StatCard title="Active" value={stats.active} icon={CheckCircle2} />
        <StatCard title="At Risk" value={stats.atRisk} icon={AlertTriangle} />
        <StatCard title="Inactive" value={stats.inactive} icon={Clock} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={inactiveFilter} onValueChange={setInactiveFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Inactive Days" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="15">15+ days inactive</SelectItem>
            <SelectItem value="30">30+ days inactive</SelectItem>
            <SelectItem value="60">60+ days inactive</SelectItem>
            <SelectItem value="90">90+ days inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-[220px]" />
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-accent/20 px-4 py-2 text-sm text-accent-foreground">
          <span className="font-semibold">{selectedIds.size} selected</span>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Courses Started</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Completed</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Hours</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Days Inactive</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><Checkbox checked={selectedIds.has(l.id)} onCheckedChange={() => toggleSelect(l.id)} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-card-foreground">{l.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{l.employeeEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.department}</td>
                  <td className="px-4 py-3 text-right font-mono text-card-foreground">{l.coursesStarted}</td>
                  <td className="px-4 py-3 text-right font-mono text-card-foreground">{l.coursesCompleted}</td>
                  <td className="px-4 py-3 text-right font-mono text-card-foreground">{l.hoursSpent}h</td>
                  <td className="px-4 py-3 text-right font-mono text-card-foreground">{l.daysInactive}</td>
                  <td className={cn('px-4 py-3 font-semibold text-sm', statusColor(l.status))}>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5" /> Send Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Template</label>
              <Select onValueChange={(id) => { const t = defaultEmailTemplates.find(t => t.id === id); if (t) applyTemplate(t); }}>
                <SelectTrigger><SelectValue placeholder="Choose a template..." /></SelectTrigger>
                <SelectContent>
                  {defaultEmailTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email subject..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Body</label>
              <Textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} placeholder="Email body... Use {{name}} and {{course_name}} as placeholders." />
            </div>
            <p className="text-xs text-muted-foreground">
              Sending to {selectedIds.size} recipient(s). Placeholders: {'{{name}}'}, {'{{course_name}}'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={sendEmails} className="gap-2"><Send className="h-4 w-4" /> Send Emails</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Licenses</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Do you really want to revoke the license for the selected employees?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRevokeDialogOpen(false); setSelectedIds(new Set()); }}>No</Button>
            <Button variant="destructive" onClick={revokeSelected}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

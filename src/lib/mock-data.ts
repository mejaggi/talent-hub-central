export type TrainingSource = 'Udemy' | 'CSOD';

export interface Training {
  id: string;
  trainingName: string;
  trainingDetails: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  startDate: string;
  completionDate: string;
  hoursConsumed: number;
  source: TrainingSource;
  skillCategory: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

export interface UdemyLicense {
  id: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  licenseAssigned: string;
  lastActive: string;
  coursesStarted: number;
  coursesCompleted: number;
  hoursSpent: number;
  daysInactive: number;
  status: 'Active' | 'Inactive' | 'At Risk';
}

export interface TopLearner {
  id: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  coursesCompleted: number;
  totalHours: number;
  source: TrainingSource;
  avatar: string;
  streak: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'nudge_complete' | 'inactive_15' | 'inactive_30' | 'inactive_60' | 'inactive_90' | 'custom';
}

const skills = ['Leadership', 'Data Analytics', 'Cloud Computing', 'Project Management', 'Cybersecurity', 'AI & ML', 'Communication', 'Agile', 'DevOps', 'UX Design'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Product', 'Legal'];
const names = [
  'Sarah Chen', 'James Wilson', 'Priya Sharma', 'Michael Brown', 'Emily Davis',
  'Raj Patel', 'Lisa Anderson', 'David Kim', 'Maria Garcia', 'Alex Thompson',
  'Fatima Hassan', 'John O\'Brien', 'Yuki Tanaka', 'Carlos Rivera', 'Anna Kowalski',
  'Robert Lee', 'Samantha Clark', 'Hassan Ali', 'Jennifer Wu', 'Thomas Moore',
  'Aisha Mohammed', 'Kevin Zhang', 'Rachel Green', 'Omar Syed', 'Laura Martinez',
];

const udemyCourses = [
  { name: 'Complete Python Bootcamp', details: 'From zero to hero in Python programming', skill: 'Data Analytics' },
  { name: 'AWS Solutions Architect', details: 'Prepare for AWS certification', skill: 'Cloud Computing' },
  { name: 'Machine Learning A-Z', details: 'Hands-on ML with Python & R', skill: 'AI & ML' },
  { name: 'Agile Project Management', details: 'Scrum Master certification prep', skill: 'Agile' },
  { name: 'Docker & Kubernetes', details: 'Container orchestration masterclass', skill: 'DevOps' },
  { name: 'React - The Complete Guide', details: 'Build modern web applications', skill: 'DevOps' },
  { name: 'Data Science Bootcamp', details: 'Statistics, ML, and data visualization', skill: 'Data Analytics' },
  { name: 'Cybersecurity Fundamentals', details: 'Network security and ethical hacking', skill: 'Cybersecurity' },
];

const csodCourses = [
  { name: 'Leadership Excellence Program', details: 'Develop leadership competencies', skill: 'Leadership' },
  { name: 'Effective Communication', details: 'Business communication and presentation', skill: 'Communication' },
  { name: 'Project Management Professional', details: 'PMP certification training', skill: 'Project Management' },
  { name: 'Compliance & Ethics Training', details: 'Annual compliance requirements', skill: 'Leadership' },
  { name: 'UX Research Methods', details: 'User research and usability testing', skill: 'UX Design' },
  { name: 'Strategic Thinking Workshop', details: 'Critical thinking for business leaders', skill: 'Leadership' },
  { name: 'Data-Driven Decision Making', details: 'Analytics for business leaders', skill: 'Data Analytics' },
  { name: 'Change Management', details: 'Leading organizational change', skill: 'Project Management' },
];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function generateTrainings(): Training[] {
  const trainings: Training[] = [];
  let id = 1;

  for (let year = 2023; year <= 2025; year++) {
    const count = year === 2025 ? 30 : 50;
    for (let i = 0; i < count; i++) {
      const isUdemy = Math.random() > 0.45;
      const courses = isUdemy ? udemyCourses : csodCourses;
      const course = courses[Math.floor(Math.random() * courses.length)];
      const person = names[Math.floor(Math.random() * names.length)];
      const startDate = randomDate(new Date(year, 0, 1), new Date(year, 11, 1));
      const start = new Date(startDate);
      const completionDate = randomDate(start, new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000));
      const isCompleted = Math.random() > 0.15;

      trainings.push({
        id: `TR-${String(id++).padStart(4, '0')}`,
        trainingName: course.name,
        trainingDetails: course.details,
        employeeName: person,
        employeeEmail: person.toLowerCase().replace(/[' ]/g, '.') + '@company.com',
        department: departments[Math.floor(Math.random() * departments.length)],
        startDate,
        completionDate: isCompleted ? completionDate : '',
        hoursConsumed: Math.round((Math.random() * 40 + 2) * 10) / 10,
        source: isUdemy ? 'Udemy' : 'CSOD',
        skillCategory: course.skill,
        status: isCompleted ? 'Completed' : (Math.random() > 0.5 ? 'In Progress' : 'Not Started'),
      });
    }
  }

  return trainings;
}

function generateUdemyLicenses(): UdemyLicense[] {
  return names.map((name, i) => {
    const daysInactive = [0, 2, 5, 8, 16, 22, 35, 45, 65, 95][Math.floor(Math.random() * 10)];
    const status: UdemyLicense['status'] = daysInactive > 30 ? 'Inactive' : daysInactive > 14 ? 'At Risk' : 'Active';
    const lastActive = new Date();
    lastActive.setDate(lastActive.getDate() - daysInactive);

    return {
      id: `UL-${String(i + 1).padStart(3, '0')}`,
      employeeName: name,
      employeeEmail: name.toLowerCase().replace(/[' ]/g, '.') + '@company.com',
      department: departments[Math.floor(Math.random() * departments.length)],
      licenseAssigned: randomDate(new Date(2024, 0, 1), new Date(2024, 6, 1)),
      lastActive: lastActive.toISOString().split('T')[0],
      coursesStarted: Math.floor(Math.random() * 8),
      coursesCompleted: Math.floor(Math.random() * 5),
      hoursSpent: Math.round(Math.random() * 60 * 10) / 10,
      daysInactive,
      status,
    };
  });
}

function generateTopLearners(): TopLearner[] {
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('');
  return names.slice(0, 15).map((name, i) => ({
    id: `TL-${i + 1}`,
    employeeName: name,
    employeeEmail: name.toLowerCase().replace(/[' ]/g, '.') + '@company.com',
    department: departments[Math.floor(Math.random() * departments.length)],
    coursesCompleted: Math.floor(Math.random() * 15) + 3,
    totalHours: Math.round((Math.random() * 120 + 10) * 10) / 10,
    source: (Math.random() > 0.5 ? 'Udemy' : 'CSOD') as TrainingSource,
    avatar: initials(name),
    streak: Math.floor(Math.random() * 30),
  })).sort((a, b) => b.totalHours - a.totalHours);
}

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Complete Training Nudge',
    subject: 'You\'re almost there! Complete your training',
    body: 'Hi {{name}},\n\nWe noticed you have started but not yet completed your training: {{course_name}}. You\'re making great progress!\n\nPlease take some time to finish your course. Your development matters to us.\n\nBest regards,\nTMD Team',
    category: 'nudge_complete',
  },
  {
    id: 'tpl-2',
    name: '15 Days Inactive',
    subject: 'We miss you on Udemy!',
    body: 'Hi {{name}},\n\nIt\'s been 15 days since you last accessed your Udemy license. Don\'t let your learning momentum slow down!\n\nLog in today and continue your development journey.\n\nBest regards,\nTMD Team',
    category: 'inactive_15',
  },
  {
    id: 'tpl-3',
    name: '30 Days Inactive',
    subject: 'Your Udemy license needs attention',
    body: 'Hi {{name}},\n\nYour Udemy license has been inactive for 30 days. As part of our talent development initiative, we encourage you to utilize this valuable resource.\n\nPlease note that continued inactivity may result in license reallocation.\n\nBest regards,\nTMD Team',
    category: 'inactive_30',
  },
  {
    id: 'tpl-4',
    name: '60 Days Inactive',
    subject: 'Action Required: Udemy License Review',
    body: 'Hi {{name}},\n\nYour Udemy license has been unused for 60 days. We want to ensure our learning resources are being utilized effectively.\n\nPlease respond to this email or log into Udemy within the next 7 days to retain your license.\n\nBest regards,\nTMD Team',
    category: 'inactive_60',
  },
  {
    id: 'tpl-5',
    name: '90 Days Inactive - Final Notice',
    subject: 'Final Notice: Udemy License Revocation',
    body: 'Hi {{name}},\n\nThis is a final notice regarding your Udemy license which has been inactive for 90 days.\n\nUnless you log in and begin using your license within the next 48 hours, it will be revoked and reassigned.\n\nIf you have questions, please contact the TMD team.\n\nBest regards,\nTMD Team',
    category: 'inactive_90',
  },
];

export const mockTrainings = generateTrainings();
export const mockUdemyLicenses = generateUdemyLicenses();
export const mockTopLearners = generateTopLearners();

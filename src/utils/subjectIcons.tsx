import React from 'react';
import {
  BookOpen,
  Code,
  Calculator,
  Atom,
  Brain,
  Globe,
  Compass,
  Music,
  PenTool,
  FlaskConical,
  Database,
  Sparkles,
  Layers,
  Briefcase,
  LucideIcon,
} from 'lucide-react';

export interface SubjectIconOption {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export const SUBJECT_ICON_OPTIONS: SubjectIconOption[] = [
  { id: 'book', label: 'General / Literature', Icon: BookOpen },
  { id: 'code', label: 'Computer Science / Programming', Icon: Code },
  { id: 'calculator', label: 'Mathematics / Statistics', Icon: Calculator },
  { id: 'atom', label: 'Physics / Science', Icon: Atom },
  { id: 'flask', label: 'Chemistry / Labs', Icon: FlaskConical },
  { id: 'brain', label: 'Psychology / Neuroscience', Icon: Brain },
  { id: 'globe', label: 'Languages / History / Geography', Icon: Globe },
  { id: 'briefcase', label: 'Business / Economics', Icon: Briefcase },
  { id: 'compass', label: 'Engineering / Design', Icon: Compass },
  { id: 'pen', label: 'Writing / Arts', Icon: PenTool },
  { id: 'music', label: 'Music / Audio', Icon: Music },
  { id: 'database', label: 'Data Science / Systems', Icon: Database },
  { id: 'sparkles', label: 'Elective / Specialized', Icon: Sparkles },
  { id: 'layers', label: 'Interdisciplinary', Icon: Layers },
];

export const getSubjectIconComponent = (iconId?: string): LucideIcon => {
  if (!iconId) return BookOpen;
  const match = SUBJECT_ICON_OPTIONS.find(opt => opt.id === iconId);
  return match ? match.Icon : BookOpen;
};

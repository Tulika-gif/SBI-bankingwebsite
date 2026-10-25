import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Send, Zap, Smartphone, CreditCard, Layers } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface QuickActionProps {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'Eye' | 'Send' | 'Zap' | 'Smartphone' | 'CreditCard' | 'Layers';
  path: string;
  onClick?: () => void;
}

const ICONS = {
  Eye,
  Send,
  Zap,
  Smartphone,
  CreditCard,
  Layers,
};

export const QuickActionCard: React.FC<QuickActionProps> = ({
  id,
  title,
  subtitle,
  iconName,
  path,
  onClick,
}) => {
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  const IconComponent = ICONS[iconName];

  const handleClick = () => {
    announce(`Selected ${title}`);
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-[#DCE8FA] shadow-xs hover:shadow-md hover:border-[#1458F5] transition-all text-center group focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] relative overflow-hidden"
      aria-label={`${title}: ${subtitle}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EDF5FF] group-hover:bg-[#1458F5] text-[#1458F5] group-hover:text-white flex items-center justify-center transition-all duration-200 mb-3 shadow-xs">
        <IconComponent className="w-6 h-6 stroke-[2]" />
      </div>

      <span className="text-sm font-bold text-[#102451] group-hover:text-[#1458F5] transition-colors leading-snug">
        {title}
      </span>
      <span className="text-[11px] text-[#64748B] mt-1 line-clamp-1">
        {subtitle}
      </span>
    </button>
  );
};

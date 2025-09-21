import React from 'react';

interface MiniCalendarProps {
  days?: number;
  bookedDays?: number[];
  highlight?: 'today' | 'tomorrow' | number;
  className?: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  days = 7,
  bookedDays = [],
  highlight,
  className
}) => {
  // Generate array of day numbers (simplified)
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  const getDayStatus = (dayIndex: number) => {
    if (highlight === 'today' && dayIndex === 0) return 'today';
    if (highlight === 'tomorrow' && dayIndex === 1) return 'tomorrow';
    if (typeof highlight === 'number' && dayIndex === highlight) return 'highlighted';
    if (bookedDays.includes(dayIndex)) return 'booked';
    return 'empty';
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case 'today':
        return '#FFD700';
      case 'tomorrow':
        return '#00D4FF';
      case 'highlighted':
        return '#00FF88';
      case 'booked':
        return 'rgba(255, 215, 0, 0.6)';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '3px',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {dayNumbers.map((day, index) => {
        const status = getDayStatus(index);
        const color = getDayColor(status);
        const isActive = status === 'today' || status === 'tomorrow' || status === 'highlighted' || status === 'booked';

        return (
          <div
            key={day}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: color,
              border: isActive ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              animation: status === 'today' ? 'pulse 2s ease-in-out infinite' : undefined
            }}
            title={`Day ${day}${status === 'booked' ? ' - Booked' : ''}`}
          />
        );
      })}

      {/* Animation styles moved to CSS module or inline */}
    </div>
  );
};
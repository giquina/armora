export interface Achievement {
  id: string;
  name: string;
  status: 'unlocked' | 'in_progress' | 'locked';
  progress?: number;
  reward: string;
  description: string;
  requirement?: string;
}

export interface AchievementBanner {
  id: string;
  type: 'discount' | 'feature' | 'status';
  value: string;
  status: 'shown' | 'minimized' | 'dismissed' | 'claimed';
  shownAt: Date;
  interactionCount: number;
  position: 'top-center' | 'top-right-mini';
}

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'First Assignment Discount',
    status: 'unlocked',
    reward: '50% off',
    description: 'Your first Assignment (up to £15)',
  },
  {
    id: '2',
    name: 'Profile Complete',
    status: 'in_progress',
    progress: 70,
    reward: 'Priority protection assignment',
    description: 'Complete your safety profile',
    requirement: 'Fill all profile sections',
  },
  {
    id: '3',
    name: 'Frequent Rider',
    status: 'locked',
    reward: 'VIP trial',
    description: 'Unlock VIP status',
    requirement: '5 Assignments',
  },
];

export const getUnlockedCount = (): number => {
  return achievements.filter(a => a.status === 'unlocked').length;
};

export const getTotalCount = (): number => {
  return achievements.length;
};

export const getNextAchievement = (): Achievement | null => {
  return achievements.find(a => a.status === 'in_progress') || 
         achievements.find(a => a.status === 'locked') || 
         null;
};
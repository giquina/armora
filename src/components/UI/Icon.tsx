import { ReactNode,  FC  } from 'react';

type IconName =
  | 'shield'
  | 'clock'
  | 'check-circle'
  | 'info'
  | 'lock'
  | 'arrow-right'
  | 'chevron-left'
  | 'save'
  | 'user'
  | 'list';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  title?: string;
}

const paths: Record<IconName, ReactNode> = {
  shield: (
    <path d="M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3z" fill="currentColor" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" />
      <path d="M11 11h2v6h-2z" fill="currentColor" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  'arrow-right': (
    <path d="M5 12h10M13 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  'chevron-left': (
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  save: (
    <>
      <path d="M5 4h10l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 4v6h10V8" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="8" y="14" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 22c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  list: (
    <>
      <circle cx="6" cy="7" r="1.5" fill="currentColor" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="6" cy="17" r="1.5" fill="currentColor" />
      <path d="M10 7h10M10 12h10M10 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export const Icon: FC<IconProps> = ({ name, size = 18, title, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role={title ? 'img' : 'presentation'}
    aria-hidden={title ? undefined : true}
    focusable="false"
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    {paths[name]}
  </svg>
);

export default Icon;

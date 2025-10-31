import React from 'react';

type IconProps = { className?: string };

export const LoaderIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const WandIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.71 0L11.5 9.51a.5.5 0 0 1-.71 0L9.51 8.23a.5.5 0 0 1 0-.71l7.14-7.14a1.21 1.21 0 0 0 0-1.71Z" /><path d="m14.29 5.29-2.72 2.72a.5.5 0 0 0 0 .71l1.28 1.28a.5.5 0 0 0 .71 0l2.72-2.72" /><path d="M11 5.5 2.5 14" /><path d="m21.5 14-9-9" /><path d="M9.5 15.5 2.5 21" /><path d="m15 8.5-4 4" /><path d="M12.5 2.5 4 11" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export const MicIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

export const MicOffIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 1 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M12 2a3 3 0 0 0-3 3v7" /><path d="M9 9a3 3 0 0 0 3 3" /><line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

export const ChevronUpIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06 0L10 9.06l-3.71 3.73a.75.75 0 11-1.06-1.06l4.24-4.25a.75.75 0 011.06 0l4.24 4.25a.75.75 0 010 1.06z" clipRule="evenodd" /></svg>
);

export const ChevronDownIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
);

export const InformationCircleIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
);

export const PlusCircleIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>
);

export const MagnifyingGlassIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
);

export const PencilIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
);

export const CheckIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
);

export const XMarkIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
);

export const ArrowDownTrayIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
);

export const HeartIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-22.045 22.045 0 01-2.582-1.9l-.019-.01-.005-.003h-.002a.739.739 0 01-.69-1.06l.83-1.42a.738.738 0 011.248-.387l.044.074a19.58 19.58 0 002.682 2.082l.006.004.01.006.01.005a.75.75 0 01.023.982l-.828 1.42zm1.698-1.062l.828-1.42a.75.75 0 01.982-.023l.01.005.01.006.006.004a19.58 19.58 0 002.682-2.082l.044-.074a.738.738 0 011.248.387l.83 1.42a.739.739 0 01-.69 1.06h-.002l-.005.003-.019.01a22.045 22.045 0 01-2.582 1.9 22.045 22.045 0 01-2.582 1.9l-.019.01-.005.003-.002.001a.75.75 0 01-1.042-.458 20.758 20.758 0 01-.682-1.162zM10 4.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" /></svg>
);

export const CoffeeIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3.5A1.5 1.5 0 014.5 2h5.25a1.5 1.5 0 011.424 1.011L11.832 5H14.5A1.5 1.5 0 0116 6.5v3.332A3.496 3.496 0 0114.5 13H5.495a3.5 3.5 0 01-1.495-6.666V3.5z" /><path d="M4.5 4a.5.5 0 00-.5.5v2.667a.5.5 0 00.5.5h6.532l.333-1H4.5z" /><path d="M2.5 14.5a.5.5 0 000 1h12a.5.5 0 000-1h-12z" /></svg>
);

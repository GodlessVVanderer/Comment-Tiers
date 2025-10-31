import React from 'react';

export const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const WandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.981A10.501 10.501 0 0118 16.5a10.5 10.5 0 01-10.5-10.5c0-1.77.42-3.44 1.172-4.944a.75.75 0 01.856-.238zM14.25 2.25a.75.75 0 01.75.75v.31a.75.75 0 01-.75.75h-.31a.75.75 0 01-.75-.75v-.31a.75.75 0 01.75-.75h.31zM16.5 4.5a.75.75 0 01.75.75v.31a.75.75 0 01-.75.75h-.31a.75.75 0 01-.75-.75v-.31a.75.75 0 01.75-.75h.31zM18.75 2.25a.75.75 0 01.75.75v.31a.75.75 0 01-.75.75h-.31a.75.75 0 01-.75-.75v-.31a.75.75 0 01.75-.75h.31zM18.75 6.75a.75.75 0 01.75.75v.31a.75.75 0 01-.75.75h-.31a.75.75 0 01-.75-.75v-.31a.75.75 0 01.75-.75h.31zM16.5 9a.75.75 0 01.75.75v.31a.75.75 0 01-.75.75h-.31a.75.75 0 01-.75-.75v-.31a.75.75 0 01.75-.75h.31z"
      clipRule="evenodd"
    />
  </svg>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
    />
  </svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);

export const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 18.26 18.26 0 01-4.43-3.17C4.784 15.89 3 12.864 3 9.75c0-2.89 2.31-5.25 5.25-5.25.928 0 1.797.242 2.57.668a8.26 8.26 0 012.38 2.38c.426.773.668 1.642.668 2.57 0 3.114-1.784 6.14-3.235 7.428a18.26 18.26 0 01-4.43 3.17 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001c.003 0 .005 0 .007 0z" />
    </svg>
);

export const ChatBubbleBottomCenterTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.352 0 9.75-3.694 9.75-8.25s-4.398-8.25-9.75-8.25T3 6.444c0 4.556 4.398 8.25 9.75 8.25.833 0 1.643-.097 2.417-.279a6.721 6.721 0 003.583 1.029 6.707 6.707 0 001.196-.106.75.75 0 01.834.621 4.482 4.482 0 01-1.442 4.182.75.75 0 01-.834.219 5.228 5.228 0 00-2.203-1.125.75.75 0 01-.434-.92 6.712 6.712 0 00-.63-1.878.75.75 0 01.434-.92c.609-.273 1.164-.622 1.68-.992.75.75 0 01.219-.834 4.482 4.482 0 01-4.182-1.442.75.75 0 01-.621.834zM16.5 9.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zM10.5 9.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zM7.5 9.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

export const ArrowDownTrayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 18.75a.75.75 0 01.75.75v.001c0 .414.336.75.75.75h15a.75.75 0 00.75-.75v-.001a.75.75 0 011.5 0v.001a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-.001a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h15a3 3 0 013 3v15a3 3 0 01-3 3h-15a3 3 0 01-3-3V4.5zM3 16.5v-3.825a.75.75 0 01.24-.53l2.54-2.541a.75.75 0 011.06 0l.22.221a.75.75 0 010 1.06l-2.07 2.071a.75.75 0 01-1.06 0L3 16.5zm4.006-2.59a.75.75 0 00-1.06 0l-1.023 1.023a.75.75 0 000 1.06l1.023 1.023a.75.75 0 101.06-1.06L5.59 16.5l1.416-1.416a.75.75 0 000-1.061zM10.44 15.22a.75.75 0 101.06-1.06l-1.416-1.416a.75.75 0 00-1.06 0l-.22.22a.75.75 0 000 1.06l1.646 1.646zm3.22-3.22a.75.75 0 00-1.06 0l-1.023 1.023a.75.75 0 000 1.06l1.023 1.023a.75.75 0 101.06-1.06L12.19 13.5l1.47-1.47zm3.284-2.614a.75.75 0 00-1.061 0l-2.54 2.541a.75.75 0 000 1.06l.22.22a.75.75 0 001.06 0l2.07-2.071a.75.75 0 000-1.06l-2.07-2.071a.75.75 0 10-1.06 1.06l2.07 2.07a.75.75 0 010 1.06l-2.54 2.54a.75.75 0 11-1.06-1.06l.22-.22a.75.75 0 011.06 0l1.47 1.47a.75.75 0 010 1.06l-1.023 1.023a.75.75 0 01-1.06 0l-1.023-1.023a.75.75 0 010-1.06l1.47-1.47a.75.75 0 011.06 0l.22.22a.75.75 0 010 1.06l-1.47 1.47a.75.75 0 11-1.06-1.06l1.47-1.47a.75.75 0 000-1.06l-3.07-3.071a.75.75 0 00-1.06 0l-.22.221a.75.75 0 000 1.06l1.47 1.47a.75.75 0 010 1.06l-1.023 1.023a.75.75 0 11-1.06-1.06l1.023-1.023a.75.75 0 000-1.06l-1.47-1.47a.75.75 0 10-1.06 1.06l1.47 1.47.22.22a.75.75 0 010 1.06l-1.47 1.47a.75.75 0 01-1.06 0l-1.023-1.023a.75.75 0 010-1.06l1.47-1.47a.75.75 0 011.06 0l.22.22a.75.75 0 010 1.06l-1.47 1.47a.75.75 0 11-1.06-1.06l1.47-1.47a.75.75 0 000-1.06L3.24 8.76a.75.75 0 01-.24-.53V4.5z" clipRule="evenodd" />
    </svg>
);

export const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5a.75.75 0 00-1.5 0v8.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V8.25a.75.75 0 01.75-.75H12a.75.75 0 000-1.5H5.25z" />
        <path d="M10.5 3a.75.75 0 00-.75.75V4.5a.75.75 0 001.5 0V4.5A.75.75 0 0010.5 3zm3.75 0a.75.75 0 00-.75.75V4.5a.75.75 0 001.5 0V4.5a.75.75 0 00-.75-.75zM12 3a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V4.5A.75.75 0 0112 3zm3.75 3a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
    </svg>
);

export const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const CoffeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M10.5 3A.75.75 0 009.75 2.25H8.25A.75.75 0 007.5 3v.75a.75.75 0 00.75.75h1.5A.75.75 0 0010.5 3V3z" />
    <path fillRule="evenodd" d="M11.25 2.25A.75.75 0 0012 3v.75a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 0011.25 2.25zM15 3a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V3zM4.5 9.75A2.25 2.25 0 016.75 7.5h10.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-7.5zM21 9.75A3.75 3.75 0 0017.25 6H6.75A3.75 3.75 0 003 9.75v7.5A3.75 3.75 0 006.75 21h10.5A3.75 3.75 0 0021 17.25v-7.5z" clipRule="evenodd" />
  </svg>
);

export const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5z" />
    </svg>
);

export const StopCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.5 6a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6z" clipRule="evenodd" />
    </svg>
);

// FIX: Add ClockIcon and export it.
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
);

export const SpeakerWaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

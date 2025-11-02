// FIX: Replaced placeholder text with a functional React component.
import React from 'react';

const NotificationPermissionBanner: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(true);
    
    const handleRequestPermission = () => {
        // In a real extension, you'd use chrome.notifications.requestPermission
        console.log("Requesting notification permission...");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="p-2 bg-blue-100 border-b border-blue-200 text-center text-sm">
            <p>Enable notifications to be alerted when analysis is complete.</p>
            <button onClick={handleRequestPermission} className="font-bold text-blue-600 mx-2">Enable</button>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 mx-2">Dismiss</button>
        </div>
    );
};

export default NotificationPermissionBanner;

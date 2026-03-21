import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function useDeadlineNotifications() {
    const { upcomingDeadlines } = usePage().props;

    useEffect(() => {
        if (!upcomingDeadlines || upcomingDeadlines.length === 0) return;
        
        // Notify only once per session to prevent spamming on every navigation
        const hasNotified = sessionStorage.getItem('deadline_notified');
        if (hasNotified) return;

        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === 'granted') {
            showNotifications(upcomingDeadlines);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotifications(upcomingDeadlines);
                }
            });
        }
    }, [upcomingDeadlines]);

    const showNotifications = (deadlines) => {
        const todayCount = deadlines.filter(d => d.is_today).length;
        const tomorrowCount = deadlines.filter(d => d.is_tomorrow).length;

        if (todayCount > 0) {
            new Notification('Deadlines Due Today', {
                body: `You have ${todayCount} ticket(s) due today! Open SimpleDesk to view them.`,
            });
        } else if (tomorrowCount > 0) {
            new Notification('Upcoming Deadlines', {
                body: `You have ${tomorrowCount} ticket(s) due tomorrow.`,
            });
        }
        
        sessionStorage.setItem('deadline_notified', 'true');
    };
}

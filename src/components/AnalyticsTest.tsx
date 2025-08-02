// src/components/AnalyticsTest.tsx
// This is a test component to verify Google Analytics is working
// Remove this file in production

import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsTest() {
    const { trackEvent, trackPageView, isAvailable } = useAnalytics();

    const handleTestEvent = () => {
        trackEvent('test_event', {
            event_category: 'test',
            event_label: 'manual_test',
            value: 1
        });
        console.log('Test event sent');
    };

    const handleTestPageView = () => {
        trackPageView('/test-page');
        console.log('Test page view sent');
    };

    if (!isAvailable) {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                margin: '20px 0'
            }}>
                <h3>⚠️ Google Analytics Not Available</h3>
                <p>This could be due to:</p>
                <ul>
                    <li>Ad blockers blocking the script</li>
                    <li>Privacy settings blocking tracking</li>
                    <li>Network issues or firewall restrictions</li>
                    <li>Content Security Policy restrictions</li>
                </ul>
                <p>Check the browser console for more details.</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            margin: '20px 0'
        }}>
            <h3>✅ Google Analytics Available</h3>
            <p>Analytics is loaded and ready to track events.</p>
            <div style={{ marginTop: '10px' }}>
                <button
                    onClick={handleTestEvent}
                    style={{
                        padding: '8px 16px',
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Send Test Event
                </button>
                <button
                    onClick={handleTestPageView}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Send Test Page View
                </button>
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Check the browser console and Network tab to see the requests being sent.
            </p>
        </div>
    );
}

export default AnalyticsTest;

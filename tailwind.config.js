/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary colors from design
                primary: {
                    yellow: '#F5BE49', // Adjusted to match the "Todays Appointments" card background
                    orange: '#F5A623',
                    blackjet: '#000000', // Jet black for dark cards
                },
                // Neutral colors
                dark: {
                    DEFAULT: '#000000', // Black for "Action Tokens" / "Pending Dues" cards
                    light: '#2A2A2A',
                },
                // Status colors
                success: {
                    DEFAULT: '#4CAF50', // Green for buttons
                    light: '#E8F5E9',
                },
                danger: {
                    DEFAULT: '#FF5252', // Red for "Due"
                    light: '#FFEBEE',
                },
                warning: {
                    DEFAULT: '#FFA726',
                    light: '#FFF3E0',
                },
                // Background colors
                background: {
                    DEFAULT: '#F4F5F7', // Light grey background for the main area
                    white: '#FFFFFF',
                },
                // Text colors
                text: {
                    primary: '#1A1A1A',
                    secondary: '#8E8E8E', // Lighter grey for secondary text
                    light: '#999999',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'card': '12px',
                'button': '8px',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'queue-card': '0 2px 16px 0 rgba(0, 0, 0, 0.14)',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
        },
    },
    plugins: [],
}

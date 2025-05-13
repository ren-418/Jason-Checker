export default function Cross({ className, ...props }) {
    return (
        <svg {...props} className={className} viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.390915" y="3.38313" width="3.37857" height="19.8181" rx="1.68929" transform="rotate(-45 0.390915 3.38313)" fill="currentColor" stroke="currentColor" strokeWidth="0.198593" />
            <rect x="14.4044" y="0.99414" width="3.37857" height="19.8181" rx="1.68929" transform="rotate(45 14.4044 0.99414)" fill="currentColor" stroke="currentColor" strokeWidth="0.198593" />
            <rect x="6.89148" y="5.26244" width="7.06726" height="3.14725" transform="rotate(45 6.89148 5.26244)" fill="currentColor" />
        </svg>

    );
}
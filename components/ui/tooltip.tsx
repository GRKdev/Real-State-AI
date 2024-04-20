export const Tooltip = ({ children, message }: { children: React.ReactNode, message: string }) => {
    return (
        <div className="tooltip-container">
            {children}
            {message && <span className="tooltip-text">{message}</span>}
        </div>
    );
};

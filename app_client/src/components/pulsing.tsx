export function Pulsing(props: { className?: string }) {
    return (
        <div className={`relative inline-flex ${props.className}`}>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
    )
}

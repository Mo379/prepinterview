import { Ban, CircleCheck, Info, TriangleAlert } from "lucide-react"

export function handleAlertColors(custom_error: any) {
    var alert_type: any = 'destructive'

    if (custom_error && 'alert_type' in custom_error) {
        alert_type = custom_error.alert_type;
    }
    if (!['success', 'destructive', 'warning', 'info'].includes(alert_type)) {
        alert_type = 'destructive';
        console.error(`Alert type value: ${alert_type} is unknown.`);
    }
    if (alert_type === 'success') {
        return 'success'
    }
    if (alert_type === 'destructive') {
        return 'destructive'
    }
    if (alert_type === 'warning') {
        return 'warning'
    }
    if (alert_type === 'info') {
        return 'info'
    }

}
function InlineAlertComponent(props: { custom_error: any }) {
    var alert_type = 'destructive'
    var alert_message = 'Something went wrong!'
    if ('alert_type' in props.custom_error) {
        alert_type = props.custom_error.alert_type
    }
    if ('message' in props.custom_error) {
        alert_message = props.custom_error.message
    }
    const alertColor = handleAlertColors(props.custom_error)
    return (
        <>
            {alert_type === 'success' && (
                <p className={`flex flex-row mt-1 text-sm text-${alertColor} ml-4`}>
                    <CircleCheck size={20} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> {alert_message}
                </p>
            )}
            {alert_type === 'destructive' && (
                <p className={`flex flex-row mt-1 text-sm text-${alertColor} ml-4`}>
                    <TriangleAlert size={20} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> {alert_message}
                </p>
            )}
            {alert_type === 'warning' && (
                <p className={`flex flex-row mt-1 text-sm text-${alertColor} ml-4`}>
                    <Ban size={20} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> {alert_message}
                </p>
            )}
            {alert_type === 'info' && (
                <p className={`flex flex-row mt-1 text-sm text-${alertColor} ml-4`}>
                    <Info size={20} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> {alert_message}
                </p>
            )}
        </>
    )
}

export default InlineAlertComponent

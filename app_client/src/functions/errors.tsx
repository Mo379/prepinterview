export function redToGreen(ratio: number) {
    // Ensure the ratio is within bounds [0, 1]
    if (String(ratio) !== 'NaN') {
        ratio = Math.max(0, Math.min(1, ratio));

        // Calculate the red and green channels
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        const blue = 0;  // Blue remains 0 for a red-green gradient

        // Return the color in rgb() format
        return `rgb(${red}, ${green}, ${blue})`;
    }
    return ''
}

export function handleGeneralError(setError: Function, set: any, response: Response, data: any, action_fail_message: string) {
    if (!response.ok) {
        const message = data.message ? data.message : action_fail_message;
        const variant = data.toast_variant ? data.toast_variant : 'destructive';
        if (Number(data.silent) === 0) {
            set(() => ({
                toast: {
                    title: `Something went wrong: ${action_fail_message}`,
                    description: message,
                    variant: variant
                },
            }));
        }
        if (data.errors) {
            data.errors.forEach(({ name, type, message, alert_type }: any) => {
                setError(name, { type, message, alert_type })
            })
        }
        throw new Error(message);
    }
}

export function handleGeneralSuccess(set: any, response: Response, data: any, action_success_message: string, routeto: string | null) {
    if (response.ok) {
        const message = data.message ? data.message : action_success_message;
        const variant = data.toast_variant ? data.toast_variant : 'default';
        if (Number(data.silent) === 0) {
            set(() => ({
                toast:
                {
                    title: action_success_message,
                    description: message,
                    variant: variant
                },
            }));
        }
        if (routeto) {
            set(() => ({
                routeto: '/',
            }));
        }
    }
}

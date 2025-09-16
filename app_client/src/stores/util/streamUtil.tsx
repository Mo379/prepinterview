import { useGeneralTutorStore } from '../generalTutorStore';

import { myjsonrepair } from '../serviceStore';
import { useNoteStore } from '../noteStore';


export const handleSubmit = async (
    requestTicket: any,
    request_body: any,
    flavour: string,
) => {
    if (!requestTicket || !request_body) {
        return;
    }

    // Kick off the fetch/stream
    const response = await fetch(requestTicket.lambda_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(requestTicket.access_token),
        },
        body: JSON.stringify(requestTicket),
    });
    const streamResponse = response.body;
    if (!streamResponse) {
        return;
    }

    // Determine how to track the "current lesson HID" based on flavour
    let initialLessonHid: string;
    let getCurrentLessonHid: () => string;
    switch (flavour) {
        case 'rabiits_general_tutor': {
            initialLessonHid = 'memo'
            getCurrentLessonHid = () => { return '' }
            const lesson = useGeneralTutorStore.getState().generalTutorLesson;
            initialLessonHid = typeof lesson === 'object' && 'hid' in lesson ? lesson.hid : 'memo';
            getCurrentLessonHid = () => {
                const cur = useGeneralTutorStore.getState().generalTutorLesson;
                return typeof cur === 'object' && 'hid' in cur ? cur.hid : '';
            };
            break;
        }
        default: {
            // Fallback: no valid flavour, so we do nothing
            return;
        }
    }

    const reader = streamResponse.getReader();
    const decoder = new TextDecoder();
    let content: string = '';

    while (true) {
        const { value } = await reader.read();
        if (!value) {
            break;
        }
        var chunkValue = ''
        chunkValue = decoder.decode(value);
        content += chunkValue;

        const currentHid = getCurrentLessonHid();
        if (currentHid !== initialLessonHid) {
            // If the user has switched lessons in the meantime, abort processing further chunks
            continue;
        }

        let finalContent: string | any | false = false;

        // Determine how to parse `content` into `finalContent`
        if (flavour === 'rabiits_general_tutor') {
            // Always parse JSON for assessments
            const repaired = myjsonrepair(content);
            finalContent = repaired ? JSON.parse(repaired) : finalContent

            if (!finalContent) {
                continue;
            }

            // Once we have a valid `finalContent`, dispatch to the appropriate store/action
            switch (flavour) {
                case 'rabiits_general_tutor': {
                    if (
                        request_body.rabiit_hid
                    ) {
                        useNoteStore.getState().setRabiitContent(
                            request_body.rabiit_hid,
                            finalContent,
                        );
                    }
                    break;
                }
            }
        }
    }
}

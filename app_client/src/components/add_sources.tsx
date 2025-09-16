import React, { useEffect, useRef, useState } from 'react';
import { FilePlus, FileUp, Globe, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleClientID, YtAPIKey } from '@/stores/serviceStore';
import useDrivePicker from 'react-google-drive-picker'
import { useUserStore } from '@/stores/userStore';
import { useShallow } from 'zustand/shallow';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import InlineAlertComponent, { handleAlertColors } from './errors';
import { Textarea } from './ui/textarea';
import { useSourceStore } from '@/stores/sourceStore';
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}


export function FileUploader(props: { setOpenParent: any, is_general_tutor: any, object_hid: any, uploadProgress: any, setUploadProgress: any }) {
    const { uploadSource, confirmFileUpload } = useSourceStore(
        useShallow((state) => ({
            uploadSource: state.uploadSource,
            confirmFileUpload: state.confirmFileUpload,
            sourceLoading: state.loading,
        })),
    )
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const { setError } = useForm<any>()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
        const supportedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            'text/plain',
            'text/markdown',
            'image/jpeg',   // for .jpeg and .jpg
            'image/png',    // for .png
        ];

        const filteredFiles = files.filter(file => supportedTypes.includes(file.type));
        // Handle upload logic here
        const formData = new FormData();
        filteredFiles.forEach((file) => {
            // Here “files” is the key your backend will look for (e.g. in Django: request.FILES.getlist('files'))
            formData.append("Uploadfiles", file);
        });
        props.setOpenParent(false)
        uploadSource(setError, formData, props.is_general_tutor, props.object_hid)
            .then(async (uploadResponses) => {
                // Clear file input after upload
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // helper to round to 1 decimal place
                for (let i = 0; i < filteredFiles.length; i++) {
                    const file = filteredFiles[i];
                    const { presiged_post: presignedPost, hid } = uploadResponses[i];

                    // ← start at 5%
                    props.setUploadProgress((prev: any) => ({
                        ...prev,
                        [hid]: 5,
                    }));

                    // build S3 form
                    const s3FormData = new FormData();
                    Object.entries(presignedPost.fields).forEach(([key, value]) => {
                        s3FormData.append(key, String(value));
                    });
                    s3FormData.append('file', file);

                    // upload via XHR to get progress events
                    await new Promise<void>((resolve) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', presignedPost.url, true);

                        // onprogress gives loaded & total bytes
                        xhr.upload.onprogress = (event) => {
                            if (!event.lengthComputable) return;
                            const pct = event.loaded / event.total;
                            // map [0–100%] → [5–100%]
                            const progress = 5 + pct * 95;
                            props.setUploadProgress((prev: any) => ({
                                ...prev,
                                [hid]: progress,
                            }));
                        };

                        xhr.onload = () => {
                            if (xhr.status === 204) {
                                confirmFileUpload(setError, hid);
                                console.log(`Successfully uploaded ${file.name} to S3`);
                            } else {
                                console.error(`Failed to upload ${file.name} (status ${xhr.status})`);
                            }
                            resolve();
                        };
                        xhr.onerror = () => {
                            console.error(`XHR error uploading ${file.name}`);
                            resolve();
                        };

                        xhr.send(s3FormData);
                    });
                }
            });
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(files);
    };

    return (
        <div
            className={`
        flex flex-col justify-center text-center border
        ${isDragging ? 'border-primary' : 'border-dashed border-primary/35'}
        w-[95%] min-h-[150px] !mt-4 mx-auto rounded-xl p-8 transition-colors duration-200
      `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileSelector}
        >
            <input
                type="file"
                multiple
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt,.jpeg,.png,.jpg,.pptx"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="flex flex-col cursor-pointer">
                <Button type="button" className="w-12 h-12 rounded-full m-auto" variant="ghost">
                    <Upload />
                </Button>
                <span>Upload Sources</span>
                <span className="text-primary/45 text-sm">Drag & drop or <span className="underline">choose file</span> to upload</span>
                <span className="text-primary/45 text-xs mt-8">
                    Supported file types: PDF, Doc, Word, txt, jpeg, png.
                </span>
            </div>
        </div>
    );
};

export function DocsPicker(props: { open: boolean, setOpen: any, setOpenParent: any, is_general_tutor: any, object_hid: any, uploadProgress: any, setUploadProgress: any }) {
    const { confirmFileUpload, uploadSource } = useSourceStore(
        useShallow((state) => ({
            confirmFileUpload: state.confirmFileUpload,
            uploadSource: state.uploadSource,
        })),
    )
    const { userGoogleAuthResponse, setGoogleAuthResponse } = useUserStore(
        useShallow((state) => ({
            userGoogleAuthResponse: state.userGoogleAuthResponse,
            setGoogleAuthResponse: state.setGoogleAuthResponse,
        })),
    )
    const [openPicker, authResponse] = useDrivePicker();
    const { setError } = useForm<any>()

    useEffect(() => {
        if (authResponse) {
            setGoogleAuthResponse({ ...authResponse, init_time: Math.floor(Date.now() / 1000) });
        }
    }, [authResponse]);

    const customViewsArray = [
        window?.google?.picker?.ViewId?.DOCUMENTS,
        window?.google?.picker?.ViewId?.PRESENTATIONS,
        window?.google?.picker?.ViewId?.DOCS_IMAGES,
    ].filter(Boolean); // remove undefined values
    const handleOpenPicker = () => {
        const commonConfig: any = {
            clientId: GoogleClientID,
            developerKey: YtAPIKey,
            customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
            viewId: 'PDFS',
            showUploadView: false,
            showUploadFolders: false,
            supportDrives: false,
            multiselect: true,
            customViews: customViewsArray,
            callbackFunction: (picker_data: any) => {
                if (picker_data.action != 'loaded') {
                    props.setOpen(true)
                } else {
                    props.setOpen(false)
                }
                if (picker_data.action === 'picked') {
                    const formData = new FormData();
                    let token = useUserStore.getState().userGoogleAuthResponse.access_token
                    formData.append("PickerFiles", JSON.stringify({ ...picker_data, token: token }));
                    props.setOpenParent(false)
                    uploadSource(setError, formData, props.is_general_tutor, props.object_hid).then(async (uploadResponses) => {
                        const pickedDocs = picker_data.docs;

                        // helper to round to 1 decimal place

                        for (let i = 0; i < pickedDocs.length; i++) {
                            const doc = pickedDocs[i];
                            const source_info = uploadResponses[i];
                            const presignedPost = source_info.presiged_post;
                            const hid = source_info.hid;

                            props.setUploadProgress((prev: any) => ({
                                ...prev,
                                [hid]: 5,
                            }));

                            // build the Drive URL
                            const isGoogleDoc = doc.mimeType?.startsWith("application/vnd.google-apps");
                            const url = isGoogleDoc
                                ? `https://www.googleapis.com/drive/v3/files/${doc.id}/export?mimeType=application/pdf`
                                : `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`;

                            // ---- DOWNLOAD WITH PROGRESS ----
                            const fileResponse = await fetch(url, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            if (!fileResponse.ok) {
                                console.error(`Failed to fetch ${doc.name}: ${fileResponse.status} ${fileResponse.statusText}`);
                                continue;
                            }

                            const contentLength = Number(fileResponse.headers.get("Content-Length")) || 0;
                            const reader = fileResponse.body!.getReader();
                            const chunks: Uint8Array[] = [];
                            let receivedLength = 0;

                            while (true) {
                                const { done, value } = await reader.read();
                                if (done) break;
                                chunks.push(value!);
                                receivedLength += value!.length;

                                // map download 0–100% into 5→50
                                const pct = contentLength
                                    ? (receivedLength / contentLength)
                                    : 1;
                                const downloadProgress = Math.min(50, 5 + pct * 45);

                                props.setUploadProgress((prev: any) => ({
                                    ...prev,
                                    [hid]: downloadProgress,
                                }));
                            }

                            const blob = new Blob(chunks);
                            const file = new File([blob], doc.name, { type: doc.mimeType });

                            // ---- UPLOAD WITH PROGRESS ----
                            const s3FormData = new FormData();
                            Object.entries(presignedPost.fields).forEach(([k, v]) => {
                                s3FormData.append(k, String(v));
                            });
                            s3FormData.append("file", file);

                            await new Promise<void>((resolve, _) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open("POST", presignedPost.url, true);

                                xhr.upload.onprogress = (event) => {
                                    if (!event.lengthComputable) return;
                                    const pct = event.loaded / event.total;
                                    const upProgress = 50 + pct * 50; // 50→100
                                    props.setUploadProgress((prev: any) => ({
                                        ...prev,
                                        [hid]: upProgress,
                                    }));
                                };

                                xhr.onload = () => {
                                    if (xhr.status === 204) {
                                        confirmFileUpload(setError, hid);
                                        console.log(`Uploaded ${doc.name} → S3`);
                                        resolve();
                                    } else {
                                        console.error(`Upload failed (${xhr.status}) for ${doc.name}`);
                                        resolve();  // resolve anyway so next doc runs
                                    }
                                };
                                xhr.onerror = () => {
                                    console.error(`XHR error uploading ${doc.name}`);
                                    resolve();
                                };
                                xhr.send(s3FormData);
                            });
                        }
                    });
                }
            },
        }

        const now = Math.floor(Date.now() / 1000);
        let token = undefined
        if (
            userGoogleAuthResponse?.access_token &&
            userGoogleAuthResponse.init_time + userGoogleAuthResponse.expires_in > now
        ) {
            token = userGoogleAuthResponse.access_token
        }
        if (token) {
            // only hand off a token when you know it’s still valid
            openPicker({ ...commonConfig, token })
        } else {
            // drop the token field entirely so the Picker triggers a fresh OAuth flow
            openPicker(commonConfig)
        }
    }

    return (
        <div>
            <Button
                onClick={handleOpenPicker}
                variant='ghost'
                className='w-fit h-8 rounded-full mt-4'>
                <FileUp /> Select Files
            </Button>
        </div>
    );
}

export function SourceDocumentUrl(props: { setOpen: any, setOpenParent: any, is_general_tutor: any, object_hid: any, uploadProgress: any, setUploadProgress: any }) {
    const { uploadSource, confirmFileUpload, sourceLoading } = useSourceStore(
        useShallow((state) => ({
            uploadSource: state.uploadSource,
            confirmFileUpload: state.confirmFileUpload,
            sourceLoading: state.loading,
        })),
    )

    const FormSchema = z.object({
        name: z.string().min(5, 'min 5 characters for document names!'),
        url: z.string().url('Please enter a valid document URL.'),

    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (document_data) => {
        if (document_data.url && document_data.name) {
            if (!errors.url && !errors.name) {
                const formData = new FormData();
                formData.append('DocumentURL', JSON.stringify({ 'url': document_data.url, 'name': document_data.name }));


                uploadSource(setError, formData, props.is_general_tutor, props.object_hid).then(async (uploadResponses) => {
                    const source_info = uploadResponses;
                    const presignedPost = source_info.presiged_post;

                    props.setUploadProgress((prev: any) => ({
                        ...prev,
                        [source_info.hid]: 5,
                    }));
                    // Download file with progress
                    const fileResponse = await fetch(`${document_data.url}`);
                    if (!fileResponse.ok) {
                        console.error(`Failed to download file from ${document_data.url}`);
                        return;
                    }

                    const contentLength = +fileResponse.headers.get("Content-Length")!;
                    const reader = fileResponse.body?.getReader();
                    const chunks: Uint8Array[] = [];
                    let receivedLength = 0;

                    while (true) {
                        const { done, value } = await reader!.read();
                        if (done) break;
                        if (value) {
                            chunks.push(value);
                            receivedLength += value.length;
                            const downloadProgress = Math.min(50, 5 + (receivedLength / contentLength) * 45);
                            props.setUploadProgress((prev: any) => ({
                                ...prev,
                                [source_info.hid]: downloadProgress,
                            }));
                        }
                    }

                    const blob = new Blob(chunks);
                    const file = new File([blob], document_data.name);

                    // Prepare S3 upload
                    const s3FormData = new FormData();
                    Object.entries(presignedPost.fields).forEach(([key, value]) => {
                        s3FormData.append(key, String(value));
                    });
                    s3FormData.append('file', file);

                    // Upload to S3 with progress
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', presignedPost.url, true);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = event.loaded / event.total;
                            props.setUploadProgress((prev: any) => ({
                                ...prev,
                                [source_info.hid]: 50 + percent * 50,
                            }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status === 204) {
                            confirmFileUpload(setError, source_info.hid);
                            console.log(`Successfully uploaded ${document_data.name} to S3`);
                        } else {
                            console.error(`Failed to upload ${document_data.name} to S3`);
                        }
                        props.setOpen(false);
                        props.setOpenParent(false);
                    };

                    xhr.onerror = () => {
                        console.error(`Failed to upload ${document_data.name} to S3`);
                        props.setOpen(false);
                        props.setOpenParent(false);
                    };

                    xhr.send(s3FormData);
                });

                props.setOpenParent(false);
            }
        }
    };

    return (
        <div className={`
            flex flex-row justify-start
            border border-primary/20 !min-w-[90%] min-h-[90px]
            m-auto rounded-xl p-4
        `}>
            <div className='flex flex-col w-full'>
                <div className='flex flex-row text-sm text-primary/65 justify-between min-w-full'>
                    <div className='flex flex-row'>
                        <FilePlus className='w-4 h-4 mt-auto mb-auto' />
                        <span className='mt-auto mb-auto ml-2'>
                            Document URL
                        </span>
                    </div>
                    <Button type='button' className='block w-fit ml-auto mt-2' variant={'ghost'} onClick={() => props.setOpen(null)}> <X /></Button>
                </div>
                <div className="flex flex-row gap-1">
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                                <div className='flex flex-col text-xs text-primary/75 justify-start text-left'>
                                    <span>Paste in a URL to a public document</span>
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="Document name *"
                                        id="name"
                                        {...register("name")}
                                        className={`
                                            border border-${errors.name && handleAlertColors(errors.name)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.name && (
                                        <InlineAlertComponent custom_error={errors.name} />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="Document url *"
                                        id="url"
                                        {...register("url")}
                                        className={`
                                            border border-${errors.url && handleAlertColors(errors.url)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.url && (
                                        <InlineAlertComponent custom_error={errors.url} />
                                    )}
                                </div>
                                <div className='flex flex-col text-xs text-primary/45 justify-start text-left'>
                                    <span>Notes </span>
                                    <ul className="list-disc list-inside ml-4 text-[10px]">
                                        <li>Only the following file types are allowed (pdf, txt, word, slides)</li>
                                        <li>Only public documents are supported</li>
                                    </ul>
                                </div>
                                <div className='w-full flex flex-row justify-between my-4'>
                                    <div className='w-40'>
                                        {sourceLoading.uploadSource ? (
                                            <Button disabled className="w-full ">
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type='submit' className='w-full '
                                            > Add Source </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function SourceWebsiteUrl(props: { setOpen: any, setOpenParent: any, is_general_tutor: any, object_hid: any }) {
    const { uploadSource, sourceLoading } = useSourceStore(
        useShallow((state) => ({
            uploadSource: state.uploadSource,
            sourceLoading: state.loading,
        })),
    )
    const FormSchema = z.object({
        name: z.string().min(5, 'Longer input required!'),
        url: z.string().url('Please enter a valid URL.'),

    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (data) => {
        if (data.url) {
            if (!errors.url && !errors.name) {
                const formData = new FormData();
                formData.append('WebsiteURL', JSON.stringify({ name: data.name, content: data.url }));
                uploadSource(setError, formData, props.is_general_tutor, props.object_hid).then(
                    props.setOpen(false)
                )
                props.setOpenParent(false)
            }
        }
    }
    return (
        <div className={`
            flex flex-row justify-start
            border border-primary/20 !min-w-[90%] min-h-[90px]
            m-auto rounded-xl p-4
        `}>
            <div className='flex flex-col w-full'>
                <div className='flex flex-row text-sm text-primary/65 justify-between min-w-full'>
                    <div className='flex flex-row'>
                        <Globe className='w-4 h-4 mt-auto mb-auto' />
                        <span className='mt-auto mb-auto ml-2'>
                            Web Page
                        </span>
                    </div>
                    <Button type='button' className='block w-fit ml-auto mt-2' variant={'ghost'} onClick={() => props.setOpen(null)}> <X /></Button>
                </div>
                <div className="flex flex-row gap-1">
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                                <div className='flex flex-col text-xs text-primary/75 justify-start text-left'>
                                    <span>Paste in a Web URL below to upload as a source</span>
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="Source Name *"
                                        id="name"
                                        {...register("name")}
                                        className={`
                                            border border-${errors.name && handleAlertColors(errors.name)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.name && (
                                        <InlineAlertComponent custom_error={errors.name} />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="Web url *"
                                        id="url"
                                        {...register("url")}
                                        className={`
                                            border border-${errors.url && handleAlertColors(errors.url)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.url && (
                                        <InlineAlertComponent custom_error={errors.url} />
                                    )}
                                </div>
                                <div className='flex flex-col text-xs text-primary/45 justify-start text-left'>
                                    <span>Notes </span>
                                    <ul className="list-disc list-inside ml-4 text-[10px]">
                                        <li>Only the visible text on the website will be imported at this moment</li>
                                        <li>Paid articles and content behind walls are not supported</li>
                                    </ul>
                                </div>
                                <div className='w-full flex flex-row justify-between my-4'>
                                    <div className='w-40'>
                                        {sourceLoading.uploadSource ? (
                                            <Button disabled className="w-full ">
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type='submit' className='w-full '
                                            > Add Source </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function SourceRawText(props: { setOpen: any, setOpenParent: any, is_general_tutor: any, object_hid: any }) {
    const { uploadSource, sourceLoading } = useSourceStore(
        useShallow((state) => ({
            uploadSource: state.uploadSource,
            sourceLoading: state.loading,
        })),
    )
    const FormSchema = z.object({
        name: z.string().min(5, 'Longer input required!'),
        rawText: z.string().min(5, 'Longer input required!'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (data) => {
        if (data.rawText) {
            if (!errors.rawText && !errors.name) {
                const formData = new FormData();
                formData.append('RawText', JSON.stringify({ name: data.name, content: data.rawText }));
                uploadSource(setError, formData, props.is_general_tutor, props.object_hid).then(
                )
                props.setOpen(false)
                props.setOpenParent(false)
            }
        }
    }
    return (
        <div className={`
            flex flex-row justify-start
            border border-primary/20 !min-w-[90%] min-h-[90px]
            m-auto rounded-xl p-4
        `}>
            <div className='flex flex-col w-full'>
                <div className='flex flex-row text-sm text-primary/65 justify-between min-w-full'>
                    <div className='flex flex-row'>
                        <Upload className='w-4 h-4 mt-auto mb-auto' />
                        <span className='mt-auto mb-auto ml-2'>
                            Paste Text
                        </span>
                    </div>
                    <Button type='button' className='block w-fit ml-auto mt-2' variant={'ghost'} onClick={() => props.setOpen(null)}> <X /></Button>
                </div>
                <div className="flex flex-row gap-1">
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                                <div className='flex flex-col text-xs text-primary/75 justify-start text-left'>
                                    <span>Paste your copied text below to upload as a source</span>
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="Source Name *"
                                        id="name"
                                        {...register("name")}
                                        className={`
                                            border border-${errors.name && handleAlertColors(errors.name)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.name && (
                                        <InlineAlertComponent custom_error={errors.name} />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Textarea
                                        placeholder="Raw Text *"
                                        id="rawText"
                                        {...register("rawText")}
                                        className={`
                                            border border-${errors.rawText && handleAlertColors(errors.rawText)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.rawText && (
                                        <InlineAlertComponent custom_error={errors.rawText} />
                                    )}
                                </div>
                                <div className='w-full flex flex-row justify-between my-4'>
                                    <div className='w-40'>
                                        {sourceLoading.uploadSource ? (
                                            <Button disabled className="w-full ">
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type='submit' className='w-full '
                                            > Add Source </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

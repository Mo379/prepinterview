import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Rabbit } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useNoteStore } from '@/stores/noteStore';
import { useForm } from 'react-hook-form';

// SelectionButtonWrapper.tsx — additions near the top of the component
//function getLinearTextNodes(root: HTMLElement): Text[] {
//    const walker = document.createTreeWalker(
//        root,
//        NodeFilter.SHOW_TEXT,
//        {
//            acceptNode: (node: any) => {
//                const el = node.parentElement;
//                if (!el) return NodeFilter.FILTER_REJECT;
//
//                // Skip hidden/empty
//                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
//
//                // Skip code-like blocks and katex output
//                if (el.closest('code, pre, kbd, samp')) return NodeFilter.FILTER_REJECT;
//                if (el.closest('.katex')) return NodeFilter.FILTER_REJECT;
//
//                return NodeFilter.FILTER_ACCEPT;
//            }
//        } as any,
//        false
//    );
//    const nodes: Text[] = [];
//    let n: Node | null;
//    while ((n = walker.nextNode())) nodes.push(n as Text);
//    return nodes;
//}
//
//function getSelectionAnchors(containerEl: HTMLElement | null) {
//    if (!containerEl) return null;
//    const sel = window.getSelection();
//    if (!sel || sel.rangeCount === 0) return null;
//
//    const range = sel.getRangeAt(0);
//    if (range.collapsed) return null;
//
//    const nodes = getLinearTextNodes(containerEl);
//    let start: number | null = null;
//    let end: number | null = null;
//    let acc = 0;
//
//    for (const node of nodes) {
//        const len = node.nodeValue!.length;
//
//        if (range.startContainer === node) start = acc + range.startOffset;
//        if (range.endContainer === node) end = acc + range.endOffset;
//
//        acc += len;
//    }
//
//    if (start == null || end == null) return null;
//    if (start > end) [start, end] = [end, start];
//
//    const fullText = nodes.map(n => n.nodeValue!).join('');
//    const exact = fullText.slice(start, end);
//    const prefix = fullText.slice(Math.max(0, start - 32), start);
//    const suffix = fullText.slice(end, Math.min(fullText.length, end + 32));
//
//    return { start, end, exact, prefix, suffix, fullTextLen: fullText.length };
//}

const SelectionButtonWrapper = (props: { children: any, is_general_tutor: boolean, lesson_hid: string }) => {
    const {
        setRabiitsSheet,
        rabiits,
        getRabiits,
    } = useNoteStore(
        useShallow((state) => ({
            setRabiitsSheet: state.setRabiitsSheet,
            rabiits: state.rabiits,
            getRabiits: state.getRabiits,
        })),
    )

    const [buttonVisible, setButtonVisible] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const containerRef: any = useRef(null);
    const selectionRangeRef: any = useRef(null);

    const handleMouseUp = (show_buttons: boolean) => {
        // Get the current selection
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) {
            setButtonVisible(false);
            return;
        }

        // Ensure the selection starts within our container
        if (
            containerRef.current &&
            !containerRef.current.contains(selection.anchorNode)
        ) {
            setButtonVisible(false);
            return;
        }

        // Retrieve selected text and trim whitespace
        const text = selection.toString().trim();
        if (!text) {
            setButtonVisible(false);
            return;
        }

        // Get the first range of the selection
        const range = selection.getRangeAt(0);
        selectionRangeRef.current = range;

        const rect = range.getBoundingClientRect();

        // Calculate button position: here we place it above and centered over the selection
        setButtonPosition({
            x: rect.left,
            y: rect.top + window.scrollY - 40,
        });

        if (show_buttons) {
            setButtonVisible(true);
        }
        useNoteStore.setState(({ highlightedText: typeof text === 'string' ? text : '' }))
    };
    const updateButtonPosition = () => {
        if (selectionRangeRef.current) {
            const rect = selectionRangeRef.current.getBoundingClientRect();
            setButtonPosition({
                x: rect.left,
                y: rect.top + window.scrollY - 40,
            });
        }
    };

    const { setError } = useForm<any>()

    useEffect(() => {
        const scrollableDiv = document.getElementById('chat_page_top');

        const handleMouseUpWrapper = () => handleMouseUp(true);
        const handleTouchEndWrapper = () => {
            setTimeout(() => handleMouseUp(false), 100);
        };

        if (scrollableDiv) {
            document.addEventListener('mouseup', handleMouseUpWrapper);
            document.addEventListener('touchend', handleTouchEndWrapper);
            scrollableDiv.addEventListener('scroll', updateButtonPosition);

            return () => {
                document.removeEventListener('mouseup', handleMouseUpWrapper);
                document.removeEventListener('touchend', handleTouchEndWrapper);
                scrollableDiv.removeEventListener('scroll', updateButtonPosition);
            };
        }

        return;
    }, []);



    return (
        <div ref={containerRef} className='z-50'>
            {props.children}
            {buttonVisible && (
                <>
                    <div
                        className={`
                            fixed -top-2 left-0 rounded m-0 z-10
                            p-1 m-0 rounded-xl
                            flex flex-row gap-1 mb-1
                            border border-input bg-background shadow-sm
                        `}
                        style={{
                            transform: `translate3d(${buttonPosition.x}px, ${buttonPosition.y - 5}px, 0)`
                        }}
                    >
                        <Button
                            variant={'outline'}
                            className={`
                                rounded m-0
                                border-1 border-primary/35
                                p-1 m-0 rounded-xl
                                flex flex-row
                            `}
                            onClick={() => {
                                const selection = window.getSelection();
                                const text = selection?.toString().trim();
                                if (selection && text) {
                                    setRabiitsSheet(true)
                                    if (rabiits === null) {
                                        getRabiits(setError, props.is_general_tutor, props.lesson_hid)
                                        setButtonVisible(false)
                                    }
                                }
                            }}
                        >
                            <Rabbit className='!w-4 !h-4 stroke-primary' />
                        </Button>
                        {/*
                        <Button
                            variant={'outline'}
                            className={`
                                rounded m-0
                                border-1 border-primary/35
                                p-1 m-0 rounded-xl
                                flex flex-row
                            `}
                            onClick={() => {
                                const anchors = getSelectionAnchors(containerRef.current);
                                if (!anchors) return;
                                useNoteStore.getState().addHighlightNote({
                                    ...anchors,
                                    color: 'red',
                                    createdAt: Date.now(),
                                });
                                setButtonVisible(false);
                            }}
                        >
                            <StickyNote className='!w-4 !h-4 stroke-red-500' />
                        </Button>
                        <Button
                            variant={'outline'}
                            className={`
                                rounded m-0
                                border-1 border-primary/35
                                p-1 m-0 rounded-xl
                                flex flex-row
                            `}
                            onClick={() => {
                                const anchors = getSelectionAnchors(containerRef.current);
                                if (!anchors) return;
                                useNoteStore.getState().addHighlightNote({
                                    ...anchors,
                                    color: 'yellow',
                                    createdAt: Date.now(),
                                });
                                setButtonVisible(false);
                            }}
                        >
                            <StickyNote className='!w-4 !h-4 stroke-yellow-500' />
                        </Button>
                        <Button
                            variant={'outline'}
                            className={`
                                rounded m-0
                                border-1 border-primary/35
                                p-1 m-0 rounded-xl
                                flex flex-row
                            `}
                            onClick={() => {
                                const anchors = getSelectionAnchors(containerRef.current);
                                if (!anchors) return;
                                console.log(anchors)
                                useNoteStore.getState().addHighlightNote({
                                    ...anchors,
                                    color: 'green',
                                    createdAt: Date.now(),
                                });
                                setButtonVisible(false);
                            }}
                        >
                            <StickyNote className='!w-4 !h-4 stroke-green-500' />
                        </Button>
                        */}
                    </div>
                </>
            )
            }
        </div >
    );
};

export default SelectionButtonWrapper;

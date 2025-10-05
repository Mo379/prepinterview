import { formatMath } from "@/stores/serviceStore"
import { useUserStore } from "@/stores/userStore"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Markdown from "react-markdown"
import { useParams } from "react-router-dom"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { useShallow } from "zustand/shallow"
import rehypeHighlight from 'rehype-highlight';
import { Button } from "./ui/button"


export function BlogList() {
    const { getBlogList } = useUserStore(
        useShallow((state) => ({
            getBlogList: state.blogList,
        })),
    )
    const [blogList, setBlogList] = useState<any>(undefined)
    const { setError } = useForm<any>()
    useEffect(() => {
        getBlogList(setError).then((data: any) => {
            setBlogList(data)
        })
    }, [])
    return (
        <div>
            <h1 className='w-full text-center m-auto'>Blog</h1>
            <div className="flex flex-col w-full justify-center m-auto mt-8 gap-2">
                {Array.isArray(blogList) && blogList.length > 0 && (
                    blogList.map((blog_item: any, blog_index: number) => {
                        // Defensive checks
                        const title = blog_item?.title ?? "Untitled";
                        const createdAt = blog_item?.created_at
                            ? new Date(blog_item.created_at)
                            : null;

                        const formattedDate = createdAt && !isNaN(createdAt.getTime())
                            ? createdAt.toLocaleString(undefined, {
                                year: "2-digit",
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Unknown date";

                        return (
                            <a key={`blog_${blog_index}`} href={`/blog/${blog_item.slug}`} className='w-![80%] md:!w-[40%] m-auto'>
                                <Button variant={'outline'} key={`blog_${blog_index}`} className="w-full">
                                    <div className="flex flex-row w-full justify-between text-primary">
                                        <div className="w-fit">{title}</div>
                                        <div className="w-fit text-primary/65 text-sm">{formattedDate}</div>
                                    </div>
                                </Button>
                            </a>
                        );
                    })
                )}
            </div>

        </div>
    )
}

export function BlogDetail() {
    const { blogDetail } = useUserStore(
        useShallow((state) => ({
            blogDetail: state.blogDetail,
        })),
    )
    const [blog, setBlog] = useState<any>(undefined)
    const { slug } = useParams();
    const { setError } = useForm<any>()
    useEffect(() => {
        if (slug) {
            blogDetail(setError, slug).then((data: any) => {
                setBlog(data)
            })
        }
    }, [])
    return (
        <div>
            <h1 className='w-full text-center m-auto'>{blog?.title ? blog?.title : '...'}</h1>
            <h2 className='w-full text-center m-auto'>
                {new Date(blog?.created_at).toLocaleString(undefined, {
                    year: '2-digit',
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </h2>
            <div className='flex flex-row justify-center mb-[50px] mt-4'>
                <a href={`/blog/`} className='w-fit m-auto'>
                    <Button variant={'outline'} className="w-44 text-primary">
                        Back to Blog
                    </Button>
                </a>
            </div>


            <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
                <div className={`
                    flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto
                    max-w-prose prose prose-slate prose-sm dark:prose-invert
                `}
                >
                    <div className="mb-4">
                        <Markdown
                            className={`!inline markdown`}
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[
                                rehypeRaw,
                                rehypeKatex as any,
                                [rehypeHighlight, { ignoreMissing: true, plainTextInjection: true }],
                            ]}
                        >
                            {formatMath(blog?.article ? blog?.article : '...')}
                        </Markdown>
                        <div className='flex flex-row justify-center mb-[50px] mt-4'>
                            <a href={`/blog/`} className='w-fit m-auto'>
                                <Button variant={'outline'} className="w-44 text-primary">
                                    Back to Blog
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


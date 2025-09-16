import { useLayoutEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

type HighlightRange = {
  id: string;
  start: number;   // inclusive, absolute char index in *rendered* text flow
  end: number;     // exclusive
  color?: string;  // optional css color for background
};

type Props = {
  source: string;
  components?: Parameters<typeof Markdown>[0]["components"];
  ranges: HighlightRange[];
  className?: string;
};

export default function MarkdownWithPostHighlights({
  source,
  components,
  ranges,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    // 1) Clear previous highlights (idempotent re-runs)
    for (const el of Array.from(rootRef.current.querySelectorAll<HTMLElement>("[data-highlight-id]"))) {
      // unwrap: replace the span with its text node
      const parent = el.parentNode;
      if (!parent) continue;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    }

    // 2) Flatten all text nodes (depth-first, DOM order)
    const textNodes: { node: Text; start: number; end: number }[] = [];
    let offset = 0;

    const walker = document.createTreeWalker(rootRef.current, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // Skip empty/whitespace-only nodes to keep indices stable
        if (!node.nodeValue || node.nodeValue.length === 0) return NodeFilter.FILTER_REJECT;
        // Skip script/style tags just in case
        const p = node.parentElement;
        if (p && (p.tagName === "SCRIPT" || p.tagName === "STYLE" || p.tagName === "NOSCRIPT")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let n: Node | null = walker.nextNode();
    while (n) {
      const t = n as Text;
      const len = t.nodeValue!.length;
      textNodes.push({ node: t, start: offset, end: offset + len });
      offset += len;
      n = walker.nextNode();
    }

    if (textNodes.length === 0 || ranges.length === 0) return;

    // 3) Apply highlights in ascending order by start
    const sorted = [...ranges].sort((a, b) => a.start - b.start);

    function wrapPortion(textNode: Text, from: number, to: number, meta: HighlightRange) {
      // from/to are offsets within *this* text node (0..textNode.length)
      let middle = textNode;

      if (from > 0) {
        middle = middle.splitText(from);
      }
      if (to < middle.nodeValue!.length) {
        middle.splitText(to);
      }

      const wrapper = document.createElement("span");
      wrapper.setAttribute("data-highlight-id", meta.id);
      if (meta.color) {
        wrapper.style.background = meta.color;
      } else {
        // default style if no color passed
        wrapper.style.background = "rgba(255, 235, 59, 0.6)"; // soft yellow
      }
      wrapper.style.borderRadius = "0.25rem";
      wrapper.style.padding = "0 2px";

      middle.parentNode!.replaceChild(wrapper, middle);
      wrapper.appendChild(middle);
    }

    for (const r of sorted) {
      if (r.end <= r.start) continue;

      // Find all text nodes that overlap [r.start, r.end)
      const overlapping = textNodes.filter(
        (tn) => !(r.end <= tn.start || r.start >= tn.end)
      );

      for (const tn of overlapping) {
        const localStart = Math.max(0, r.start - tn.start);
        const localEnd = Math.min(tn.end, r.end) - tn.start;

        // If the original node was already split/wrapped earlier,
        // tn.node may no longer be in the DOM or its length changed.
        // Guard by ensuring it's still connected and has enough length.
        if (!tn.node.isConnected) continue;
        const currentLen = tn.node.nodeValue?.length ?? 0;
        if (localStart >= currentLen || localEnd <= 0 || localStart >= localEnd) continue;

        wrapPortion(tn.node, localStart, localEnd, r);
      }
    }
  }, [ranges, source, components]);

  return (
    <div ref={rootRef} className={className}>
      <Markdown
        className="!inline text-[12px]"
        components={components}
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex as any,
          [rehypeHighlight, { ignoreMissing: true, plainTextInjection: true }],
        ]}
      >
        {source}
      </Markdown>
    </div>
  );
}


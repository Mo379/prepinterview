import { useNoteStore } from "@/stores/noteStore";
import type { Root, Parent } from "hast";

type Color = "red" | "yellow" | "green";
type Range = {
  id: string;
  start: number;
  end: number;
  color: Color;
  exact?: string;
  prefix?: string;
  suffix?: string;
};

const COLOR_CLASS: Record<Color, string> = {
  red: "bg-red-200 dark:bg-red-300",
  yellow: "bg-yellow-200 dark:bg-yellow-300",
  green: "bg-green-200 dark:bg-green-300",
};

const SKIP_TAGS = new Set(["code", "pre", "kbd", "samp", "script", "style"]);

function normalizeText(str: string): string {
  // normalize spaces & linebreaks consistently
  return str.replace(/\s+/g, " ");
}

function hasSkippedAncestor(ancestors: any[]): boolean {
  for (const anc of ancestors) {
    if (anc?.type === "element") {
      const tag = (anc as any).tagName;
      if (tag && SKIP_TAGS.has(tag)) return true;
      const cls = (anc.properties?.className ?? []) as string[];
      if (Array.isArray(cls) && cls.some((c) => c.includes("katex"))) return true;
    }
  }
  return false;
}

export function rehypeHighlightSelections({ ranges = [], debug = false }: { ranges?: Range[]; debug?: boolean }) {
  return (tree: Root) => {
    // === Step 1. Build canonical fullText ===
    let fullText = "";

    function collect(node: Parent, ancestors: any[]) {
      if (!("children" in node)) return;
      for (const child of node.children as any[]) {
        if (child.type === "text") {
          if (hasSkippedAncestor(ancestors.concat(node))) continue;
          const norm = normalizeText(child.value || "")
              .replace(/\s+__id__outline_section_\d+/g, "");
          if (norm.trim()) fullText += norm;
        } else if (child.type === "element" || child.type === "root") {
          collect(child as Parent, ancestors.concat(node));
        }
      }
    }
    collect(tree as Parent, []);

    // === Step 2. Normalize ranges ===
    const docLen = fullText.length;
    const processed = ranges
      .map((r) => {
        let { start, end } = r;
        if (end > docLen || start > docLen || fullText.slice(start, end) !== (r.exact || "")) {
          // try re-anchor using exact+prefix+suffix
          if (r.exact) {
            const re = new RegExp(escapeRegex(r.prefix || "") + escapeRegex(r.exact) + escapeRegex(r.suffix || ""));
            const match = re.exec(fullText);
            if (match) {
              const absStart = match.index + (r.prefix?.length || 0);
              const absEnd = absStart + r.exact.length;
              start = absStart;
              end = absEnd;
              if (debug) console.log("Re-anchored", r.exact, start, end);
            }
          }
        }
        return { ...r, start: Math.max(0, start), end: Math.min(docLen, end) };
      })
      .filter((r) => r.end > r.start)
      .sort((a, b) => a.start - b.start);

    // === Step 3. Apply highlights ===
    let cursor = 0;
    function transform(node: Parent, ancestors: any[]) {
      if (!("children" in node)) return;
      const newChildren: any[] = [];

      for (const child of node.children as any[]) {
        if (child.type === "text") {
          const isEligible = !hasSkippedAncestor(ancestors.concat(node));
          if (!isEligible) {
            newChildren.push(child);
            continue;
          }

          const norm = normalizeText(child.value || "")
              .replace(/\s+__id__outline_section_\d+/g, "");
          if (!norm.trim()) {
            newChildren.push(child);
            continue;
          }

          const startAbs = cursor;
          const endAbs = cursor + norm.length;
          let pos = 0;
          const splits: any[] = [];

          while (pos < norm.length) {
            const covering = processed.find((r) => r.start < endAbs && r.end > startAbs + pos);
            if (!covering) {
              splits.push({ type: "text", value: norm.slice(pos) });
              pos = norm.length;
              break;
            }

            const relStart = Math.max(0, covering.start - startAbs);
            const relEnd = Math.min(norm.length, covering.end - startAbs);

            if (pos < relStart) {
              splits.push({ type: "text", value: norm.slice(pos, relStart) });
              pos = relStart;
            }

            splits.push({
              type: "element",
              tagName: "mark",
              properties: {
                  className: [COLOR_CLASS[covering.color], "px-0.5", "rounded-sm", "hover:cursor-pointer "],
                  onclick: ()=>{
                      alert('hello')
                      useNoteStore.setState(({openHighlightPopup: true}))
                  }
              },
              children: [{ type: "text", value: norm.slice(relStart, relEnd) }],
            });
            pos = relEnd;
          }

          newChildren.push(...splits);
          cursor = endAbs;
        } else if (child.type === "element" || child.type === "root") {
          transform(child as Parent, ancestors.concat(node));
          newChildren.push(child);
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    }
    transform(tree as Parent, []);
  };
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


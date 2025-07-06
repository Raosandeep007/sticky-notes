import { StickyBoardApp } from "~/components/sticky-board/sticky-board";
import { useParams } from "react-router";
import { LoadingState } from "~/components/sticky-board/loading-state";
import { Analytics } from "@vercel/analytics/react";

export function meta() {
  return [
    { title: "Sticky Notes" },
    { name: "description", content: "Sticky Notes App" },
  ];
}

export default function DynamicStickyBoard() {
  const params = useParams();

  if (!params.id) {
    return <LoadingState />;
  }

  return (
    <>
      <Analytics />
      <StickyBoardApp boardId={params.id} />
    </>
  );
}

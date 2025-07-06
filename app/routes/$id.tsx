import { StickyBoardApp } from "~/components/sticky-board/sticky-board";
import { useParams } from "react-router";
import { LoadingState } from "~/components/sticky-board/loading-state";

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
      <StickyBoardApp boardId={params.id} />
    </>
  );
}

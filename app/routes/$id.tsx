import { StickyBoardApp } from "~/components/sticky-board/sticky-board";
import type { Route } from "./+types/$id";
import { useParams } from "react-router";
import { LoadingState } from "~/components/sticky-board/loading-state";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.id} - Sticky Notes` },
    { name: "description", content: `Sticky Notes App - ${params.id}` },
  ];
}

export function loader({ params }: Route.LoaderArgs): { id: string } {
  return {
    id: params.id,
  };
}

export default function DynamicStickyBoard({
  loaderData,
}: Route.ComponentProps) {
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

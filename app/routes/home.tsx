import { StickyBoardApp } from "~/components/sticky-board/sticky-board";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sticky Notes" },
    { name: "description", content: "Welcome to Sticky Notes!" },
  ];
}

export default function Home() {
  return (
    <>
      <StickyBoardApp />
    </>
  );
}

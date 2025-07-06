import { useSharedState } from "@airstate/react";
import { useCallback } from "react";

interface CreatedLink {
  id: string;
  url: string;
  createdAt: string;
  lastVisited?: string;
  visitCount: number;
  title?: string;
  [key: string]: any; // Index signature for useSharedState compatibility
}

export function useCreatedLinks() {
  const [links, setLinks, isReady] = useSharedState<CreatedLink[]>([], {
    key: "created-links-2",
  });

  const addLink = useCallback(
    (id: string, title?: string) => {
      const url = `${window.location.origin}/${id}`;
      const existingLinkIndex = links.findIndex((link) => link.id === id);

      if (existingLinkIndex >= 0) {
        // Update existing link
        setLinks((prev) =>
          prev.map((link, index) =>
            index === existingLinkIndex
              ? {
                  ...link,
                  lastVisited: new Date().toISOString(),
                  visitCount: link.visitCount + 1,
                  title: title || link.title,
                }
              : link
          )
        );
      } else {
        // Add new link
        const newLink: CreatedLink = {
          id,
          url,
          createdAt: new Date().toISOString(),
          lastVisited: new Date().toISOString(),
          visitCount: 1,
          title,
        };
        setLinks((prev) => [newLink, ...prev]);
      }
    },
    [setLinks]
  );

  const removeLink = useCallback(
    (id: string) => {
      setLinks((prev) => prev.filter((link) => link.id !== id));
    },
    [setLinks]
  );

  const clearAllLinks = useCallback(() => {
    setLinks([]);
  }, [setLinks]);

  const updateLinkTitle = useCallback(
    (id: string, title: string) => {
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, title } : link))
      );
    },
    [setLinks]
  );

  const getLinkById = useCallback(
    (id: string) => {
      return links.find((link) => link.id === id);
    },
    [links]
  );

  return {
    links,
    addLink,
    removeLink,
    clearAllLinks,
    updateLinkTitle,
    getLinkById,
    totalLinks: links.length,
    isReady,
  };
}

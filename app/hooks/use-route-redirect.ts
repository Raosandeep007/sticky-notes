import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCryptoId } from "./use-crypto-id";
import { useCreatedLinks } from "./use-created-links";

export function useRouteRedirect() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useCryptoId();
  const { addLink, isReady } = useCreatedLinks();
  const processedRoutes = useRef(new Set<string>());

  useEffect(() => {
    // Only perform routing actions when data is ready
    if (!isReady) return;

    const currentPath = location.pathname;
    const routeKey = `${currentPath}-${params.id || id}`;

    // Prevent duplicate processing
    if (processedRoutes.current.has(routeKey)) return;
    processedRoutes.current.add(routeKey);

    if (currentPath === "/") {
      navigate(`/${id}`, { replace: true });
      // Track the newly created link
      addLink(id, "New Workspace");
    } else if (params.id) {
      console.log("App component initialized with existing ID:", params.id);
      // Track visit to existing link
      addLink(params.id);
    }
  }, [location.pathname, params.id, navigate, id, addLink, isReady]);

  return {
    currentId: params.id || id,
    location,
    params,
    isReady,
  };
}

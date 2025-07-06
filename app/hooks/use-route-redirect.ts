import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCryptoId } from "./use-crypto-id";

// Call this function when a user clicks a button or performs an action you want to track

export function useRouteRedirect() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useCryptoId();
  const processedRoutes = useRef(new Set<string>());

  useEffect(() => {
    const currentPath = location.pathname;
    const routeKey = `${currentPath}-${params.id || id}`;

    if (processedRoutes.current.has(routeKey)) return;
    processedRoutes.current.add(routeKey);

    if (currentPath === "/") {
      navigate(`/${id}`, { replace: true });
      posthog.capture("route_redirect to new ID", {
        from: currentPath,
        to: `/${id}`,
        id,
      });
    } else if (params.id) {
      console.log("App component initialized with existing ID:", params.id);
      posthog.capture("route_redirect to existing ID", {
        from: currentPath,
        to: `/${params.id}`,
        id: params.id,
      });
    }
  }, [location.pathname, params.id, navigate, id]);

  return {
    currentId: params.id || id,
    location,
    params,
  };
}

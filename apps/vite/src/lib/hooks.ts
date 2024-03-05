import { useEffect, useRef } from "react";

/**
 * Set the title of the document while the component is mounted.
 * @param title The title to set.
 */
export const useTitle = (title: string) => {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;

    if (document.title !== title) document.title = title;

    const current = originalTitle.current;
    return () => {
      if (current !== null) document.title = current;
    };
  }, [documentDefined, title]);
};

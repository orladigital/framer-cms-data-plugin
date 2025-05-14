import { useState } from "react";

export function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const controlLoading = (control: boolean) => {
    if (typeof control !== "boolean") return;
    setIsLoading(control);
  };

  return { isLoading, controlLoading };
} 
import { useState } from "react";

export function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function controlLoading(control: boolean) {
    if (typeof control !== "boolean") return;
    setIsLoading(control);
  }

  function LoadingComponent() {
    if (!isLoading) return null;

    return (
      <div className="bg-black opacity-80 absolute right-0 h-[100%] w-[100%] bottom-0 flex  justify-center items-center ">
        <p className="text-white font-extrabold opacity--100 h-4">Loading...</p>
      </div>
    );
  }

  return { controlLoading, LoadingComponent };
}

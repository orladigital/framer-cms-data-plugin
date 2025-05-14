import { isLoading } from "./useLoading";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function LoadingComponent({ 
  message = "Loading...", 
}: LoadingProps) {
  if (!isLoading) return null;

  return (
    <div className={"absolute inset-0 flex justify-center items-center"}>
      <p className="text-white font-extrabold">{message}</p>
    </div>
  );
}

 

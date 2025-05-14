
interface LoadingProps {
  message?: string;
  className?: string;
  loading: boolean;
}

export function LoadingComponent({ 
  message = "Loading...", 
  className = "bg-black opacity-80" ,
  loading = false
}: LoadingProps) {
  
  if (!loading) return null;

  return (
    <div className={`absolute inset-0 flex justify-center items-center ${className}`}>
      <p className="text-white font-extrabold">{message}</p>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div 
      className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"
      role="status"
      aria-label="Carregando..."
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
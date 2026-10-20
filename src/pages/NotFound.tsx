import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: Ruta no encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-md p-8 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-5xl font-bold font-quran-arabic text-primary">404</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          La página solicitada no existe o ha sido movida.
        </p>
        <Button asChild className="rounded-xl">
          <Link to="/">Volver al lector</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

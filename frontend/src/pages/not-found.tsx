import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wrench, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-5 rounded-full">
            <Wrench className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-8xl font-serif font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.<br />
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-none px-8 h-12">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 h-12">
              Book a Repair
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

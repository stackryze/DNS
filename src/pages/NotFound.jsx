import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or may have moved.</p>
      <Button asChild variant="outline" className="mt-6">
        <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>
      </Button>
    </div>
  );
}

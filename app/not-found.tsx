import {Container} from "@/presentation/components/ui/container";
import {Button} from "@/presentation/components/ui/button";

/** 404 bergaya brand — bagian 4 (bagian 16) issue.md. */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-eyebrow uppercase tracking-eyebrow text-muted">404</p>
      <h1 className="mt-4 font-display text-h1">Page Not Found</h1>
      <p className="mt-4 max-w-[56ch] text-body-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8">
        <Button href="/" variant="dark" size="lg">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}

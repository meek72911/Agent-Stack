import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog - AgentStack",
  description: "AgentStack blog - coming soon.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Coming soon! We'll be sharing insights about AI automation, 
          workflow optimization, and agency growth strategies.
        </p>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Subscribe to our newsletter to get notified when we publish our first articles.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

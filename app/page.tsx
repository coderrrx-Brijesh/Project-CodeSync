import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, Users, History, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center mb-6">
          <Code2 className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold">CodeSync</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A state-of-the-art platform for real-time collaborative code editing,
          designed for seamless teamwork and pair programming.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/editor">Start Coding</Link>
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6">
            <Users className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-muted-foreground">
              Code together in real-time with your team members, seeing changes instantly.
            </p>
          </Card>
          <Card className="p-6">
            <History className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Version History</h3>
            <p className="text-muted-foreground">
              Track changes and maintain a complete history of your code evolution.
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Instant Sync</h3>
            <p className="text-muted-foreground">
              Changes sync instantly across all connected devices with zero delay.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
import WorkSync from "@/components/WorkSync";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <WorkSync />
      </div>
    </main>
  );
}

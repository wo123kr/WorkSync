import WorkSync from "@/components/WorkSync";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-16 px-4 md:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-6xl">
        <WorkSync />
      </div>
    </main>
  );
}

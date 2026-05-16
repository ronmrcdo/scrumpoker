export default function Loading() {
  return (
    <div className="h-dvh flex flex-col bg-background">
      <div className="h-14 border-b border-border bg-card animate-pulse" />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <p className="text-sm">Loading room…</p>
        </div>
      </div>
    </div>
  );
}

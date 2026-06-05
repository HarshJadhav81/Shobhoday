export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-beige">
      <h1 className="font-display text-4xl text-charcoal mb-4">{title}</h1>
      <p className="font-body text-slate">This page is under construction.</p>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ title, subtitle, align = 'left', className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : ''} ${className}`}>
      <h2 className="font-display text-charcoal text-4xl md:text-6xl lg:text-[64px] leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`font-body text-slate text-lg mt-3 ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

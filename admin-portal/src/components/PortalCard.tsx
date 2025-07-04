import Link from 'next/link';

interface PortalCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  isActive?: boolean;
  isComingSoon?: boolean;
}

export function PortalCard({
  href,
  icon,
  title,
  description,
  isActive = false,
  isComingSoon = false,
}: PortalCardProps) {
  const Component = isComingSoon ? 'div' : Link;

  return (
    <Component
      href={isComingSoon ? '#' : href}
      className={`
        block bg-ignis-card border rounded-lg p-6 transition-all
        ${isActive ? 'border-ignis-green' : 'border-ignis-border'}
        ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:border-ignis-green hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10'}
      `}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-ignis-green mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      {isComingSoon && (
        <span className="inline-block mt-3 px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded">
          Coming Soon
        </span>
      )}
    </Component>
  );
}
/**
 * Button - Server Component
 *
 * RENDU SERVEUR: Composant bouton réutilisable.
 * Peut être utilisé comme <button> ou <Link>.
 */

import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-accent-primary text-bg-primary hover:bg-accent-hover hover:shadow-lg hover:shadow-accent-primary/20 focus:ring-accent-primary',
    secondary:
      'bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary focus:ring-accent-primary',
    ghost:
      'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary focus:ring-border',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Si href est fourni, rendre un Link
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  // Sinon, rendre un button
  return (
    <button type={type} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

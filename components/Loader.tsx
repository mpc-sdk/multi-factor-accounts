import Icons from '@/components/Icons';

export function Loader({className}: {className?: string}) {
  return <Icons.spinner className={`h-4 w-4 animate-spin ${className}`} />;
}

export default function LoaderText({text}: {text: string}) {
  return <span className="flex items-center">
    <Loader className="mr-2" />
    <span>{text}</span>
  </span>;
}

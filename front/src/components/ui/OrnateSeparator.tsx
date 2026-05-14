type OrnateSeparatorProps = {
  label: string;
};

export default function OrnateSeparator({ label }: OrnateSeparatorProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-3 my-6"
    >
      <span className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
      <span className="text-xs uppercase tracking-widest text-gray-500 font-serif italic">
        {label}
      </span>
      <span className="flex-1 h-px bg-linear-to-l from-transparent via-gray-300 to-transparent" />
    </div>
  );
}
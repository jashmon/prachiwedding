type OrnamentProps = {
  className?: string;
  label?: string;
};

export function Ornament({ className = "", label }: OrnamentProps) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="ornament-line" />
      {label ? <span className="ornament-label">{label}</span> : null}
    </div>
  );
}

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Поиск',
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card ring-1 ring-slate-200 max-w-xs">
      <span className="text-xs text-slate-400">Поиск</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-6 flex-1 border-none bg-transparent text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none"
      />
    </div>
  )
}



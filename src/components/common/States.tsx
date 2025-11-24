type StateProps = {
  message: string
}

export function LoadingState({ message }: StateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
      {message}
    </div>
  )
}

export function ErrorState({ message }: StateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-700">
      {message}
    </div>
  )
}






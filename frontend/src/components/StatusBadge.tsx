const colors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  applied: 'bg-blue-100 text-blue-700',
  screen: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-200 text-gray-500',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}

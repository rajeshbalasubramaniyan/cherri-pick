export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🍒</div>
        <p className="font-body text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}

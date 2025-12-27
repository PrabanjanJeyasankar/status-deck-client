export function Logo({
  size = 24,
  color = '#FFFFFF',
}: {
  size?: number
  color?: string
}) {
  const ringCount = 2
  const rings = Array.from({ length: ringCount })

  return (
    <div
      className='relative inline-block'
      style={{ width: size, height: size }}>
      <span
        className='absolute inset-0 rounded-none'
        style={{ transform: 'scale(1)', backgroundColor: color }}
      />

      {rings.map((_, i) => (
        <span
          key={i}
          className='absolute inset-0 rounded-none opacity-50 animate-wave'
          style={{ animationDelay: `${i * 200}ms`, backgroundColor: color }}
        />
      ))}
    </div>
  )
}

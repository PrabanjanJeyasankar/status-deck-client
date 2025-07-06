export function Logo({ size = 24 }: { size?: number }) {
  const ringCount = 2
  const rings = Array.from({ length: ringCount })

  return (
    <div className='relative inline-block' style={{ width: size, height: size }}>
      <span className='absolute inset-0 rounded-full bg-black' style={{ transform: 'scale(1)' }} />

      {rings.map((_, i) => (
        <span
          key={i}
          className='absolute inset-0 rounded-full bg-black opacity-50 animate-wave'
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  )
}

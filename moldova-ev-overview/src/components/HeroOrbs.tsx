/**
 * Decorative animated background orbs for the hero section.
 * Pure CSS animation, no JS, zero layout impact.
 */
export default function HeroOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {/* Large primary orb — bottom-left */}
      <div
        className="orb-a absolute rounded-full"
        style={{
          width: 660,
          height: 660,
          bottom: -220,
          left: -160,
          background: 'radial-gradient(circle at 40% 40%, rgba(45,212,191,0.13) 0%, transparent 65%)',
        }}
      />
      {/* Medium orb — top-right */}
      <div
        className="orb-b absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          top: -100,
          right: -100,
          background: 'radial-gradient(circle at 60% 50%, rgba(45,212,191,0.08) 0%, transparent 65%)',
        }}
      />
      {/* Small accent orb — mid-right */}
      <div
        className="orb-c absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          top: '35%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Tiny spark — upper-left */}
      <div
        className="orb-b absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          top: '15%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
          animationDuration: '20s',
          animationDelay: '-8s',
        }}
      />
    </div>
  )
}

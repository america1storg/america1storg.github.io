import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
      <div className="min-h-screen" style={{ background: '#020208', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
          background: 'rgba(2, 2, 8, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-icon.png" alt="America First" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">America First</span>
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/articles" className="hover:text-blue-400 transition-colors">Articles</Link>
                <Link href="/about" className="text-blue-400">About</Link>
                <Link href="/admin" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all text-sm font-semibold border border-white/10">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Who We Are</p>
          <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            <span className="text-white">About</span><br />
            <span style={{ color: '#3b82f6' }}>America First</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/70 max-w-[650px]">
            Nonpartisan civic education for <strong className="text-white font-semibold">informed citizenship</strong>
          </p>
        </header>

        {/* Content */}
        <main className="px-[6vw] max-w-[1100px] mx-auto pb-24 space-y-16">
          {/* Mission Section */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>Our Mission</h2>
            <p className="text-xl text-white/80 leading-relaxed">
              America First is a nonpartisan civic education organization in formation,
              committed to restoring logical reasoning, fairness, and principled
              decision-making in American civic life. We do not support any political
              party—we support truth, data, analysis, and the Constitution.
            </p>
          </section>

          {/* What We Believe */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>What We Believe</h2>
            <div className="space-y-6 text-xl text-white/80 leading-relaxed">
              <p>
                Our mission is to educate Americans and legal residents on the principles
                that make this country great. We believe in upholding the law, protecting
                national interests, and promoting informed, fact-based public discourse.
              </p>
              <p>
                We stand for America—its prosperity, its people, and its future—above all
                foreign interests. While we support global cooperation, we do not support
                compromising America's strength, resources, or values in the process. Our
                work is rooted in the belief that every nation puts its own interests
                first—and America should be no different.
              </p>
              <p>
                We welcome diversity, unity, and civic responsibility. But for those who
                serve, lead, or aspire to represent this nation—loyalty must be to America
                first.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#3b82f6' }}>Our Values</h2>
            <ul className="space-y-5">
              {[
                { title: 'Truth & Data', desc: 'Every position must be backed by facts, evidence, and rigorous analysis' },
                { title: 'Constitutional Principles', desc: 'The Constitution is the foundation of American governance and civic life' },
                { title: 'Nonpartisan Approach', desc: 'We support principles, not parties; logic, not tribalism' },
                { title: 'National Interest', desc: 'America\'s prosperity, security, and values come first' },
                { title: 'Civic Responsibility', desc: 'Informed citizenship is the bedrock of democracy' }
              ].map((value) => (
                <li key={value.title} className="flex gap-4 items-start">
                  <span style={{ color: '#ef4444' }} className="text-2xl font-bold mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold text-lg">{value.title}:</strong>
                    <span className="text-white/70 text-lg ml-2">{value.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>Contact Us</h2>
            <p className="text-xl text-white/80">
              For inquiries, please contact us at:{' '}
              <a
                href="mailto:americafirstusateam@gmail.com"
                className="text-blue-400 hover:underline font-semibold"
              >
                americafirstusateam@gmail.com
              </a>
            </p>
          </section>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/articles"
              className="inline-block px-10 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-bold text-xl shadow-lg"
            >
              Read Our Articles →
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-[6vw] py-12 max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-6 text-white/20 text-sm border-t border-white/4 mt-12">
          <span>© 2025 <strong className="text-white/50">America First</strong></span>
          <span>Truth · Data · Constitution</span>
        </footer>
      </div>
  );
}

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-red-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-sm hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">About America First</h1>
          <p className="text-xl text-gray-200">
            Nonpartisan civic education for informed citizenship
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              America First is a nonpartisan civic education organization in formation,
              committed to restoring logical reasoning, fairness, and principled
              decision-making in American civic life. We do not support any political
              party—we support truth, data, analysis, and the Constitution.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">What We Believe</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
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

          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Values</h2>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">•</span>
                <span>
                  <strong>Truth & Data:</strong> Every position must be backed by facts,
                  evidence, and rigorous analysis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">•</span>
                <span>
                  <strong>Constitutional Principles:</strong> The Constitution is the
                  foundation of American governance and civic life
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">•</span>
                <span>
                  <strong>Nonpartisan Approach:</strong> We support principles, not
                  parties; logic, not tribalism
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">•</span>
                <span>
                  <strong>National Interest:</strong> America's prosperity, security, and
                  values come first
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">•</span>
                <span>
                  <strong>Civic Responsibility:</strong> Informed citizenship is the
                  bedrock of democracy
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-700">
              For inquiries, please contact us at:{' '}
              <a
                href="mailto:americafirstusateam@gmail.com"
                className="text-blue-600 hover:underline"
              >
                americafirstusateam@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Read Our Articles →
          </Link>
        </div>
      </main>
    </div>
  );
}

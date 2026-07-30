'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const contentY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-900/90 backdrop-blur-sm text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="America First Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold">America First</span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/articles" className="hover:text-gray-200 transition-colors">
                Articles
              </Link>
              <Link href="/about" className="hover:text-gray-200 transition-colors">
                About
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Parallax */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Stars */}
        <motion.div
          style={{ y: starsY }}
          className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-red-950"
        >
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo-full-transparent.png"
                alt="America First"
                width={400}
                height={200}
                className="w-auto h-32 md:h-48"
                priority
              />
            </div>
            <p className="text-2xl md:text-3xl mb-4 font-semibold text-gray-100">
              Civic Education • Constitutional Principles • Truth & Data
            </p>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A nonpartisan organization committed to restoring logical reasoning,
              fairness, and principled decision-making in American civic life
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex gap-6 justify-center flex-wrap"
          >
            <Link
              href="/articles"
              className="px-8 py-4 bg-white text-blue-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              Read Articles
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="text-white text-sm">Scroll to explore</div>
            <div className="text-3xl">↓</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section with Fade-In */}
      <motion.section
        style={{ y: contentY, opacity: contentOpacity }}
        className="min-h-screen flex items-center bg-white py-24"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-blue-900 mb-6">Our Mission</h2>
            <div className="w-24 h-1 bg-red-700 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Truth & Data',
                icon: '📊',
                description:
                  'We support fact-based analysis and evidence-driven public discourse. Every claim backed by data, every position rooted in reality.',
              },
              {
                title: 'Constitutional Principles',
                icon: '📜',
                description:
                  'Upholding the law and the Constitution as the foundation of American governance and civic life.',
              },
              {
                title: 'Nonpartisan Education',
                icon: '🎓',
                description:
                  'We do not support any political party—we support logical reasoning, fairness, and principled decision-making.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-gradient-to-br from-blue-50 to-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-900 to-red-900 py-24 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">What We Stand For</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              We stand for America—its prosperity, its people, and its future—above all
              foreign interests. We believe every nation puts its own interests first, and
              America should be no different.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              'National sovereignty and security',
              'Economic prosperity for all Americans',
              'Diversity, unity, and civic responsibility',
              'Loyalty to America for those who serve and lead',
              'Global cooperation without compromising American values',
              'Informed, fact-based public discourse',
            ].map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-all"
              >
                <div className="text-3xl">✓</div>
                <p className="text-lg font-medium">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[60vh] flex items-center bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-blue-900 mb-6">
              Join the Conversation
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Read our latest articles on civic education, constitutional principles, and
              fact-based analysis of current events.
            </p>
            <Link
              href="/articles"
              className="inline-block px-12 py-4 bg-blue-900 text-white rounded-lg font-bold text-xl hover:bg-blue-800 transition-all hover:scale-105 shadow-xl"
            >
              Explore Articles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo-icon.png"
                  alt="America First"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <h3 className="text-2xl font-bold">America First</h3>
              </div>
              <p className="text-gray-400">
                Nonpartisan civic education for informed citizenship
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/articles" className="block text-gray-400 hover:text-white">
                  Articles
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white">
                  About Us
                </Link>
                <Link href="/admin" className="block text-gray-400 hover:text-white">
                  Admin Login
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">americafirstusateam@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} America First. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

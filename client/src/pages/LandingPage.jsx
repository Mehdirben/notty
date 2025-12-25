import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Code2,
  Image,
  Lock,
  Zap,
  ArrowRight,
  Github,
  Twitter
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Multiple Notebooks',
      description: 'Organize your thoughts into separate notebooks for work, personal, or any category you need.'
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: 'Todo Lists',
      description: 'Create interactive todo lists within your notes to track tasks and stay productive.'
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Code Blocks',
      description: 'Write and highlight code in multiple languages with beautiful syntax highlighting.'
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: 'Rich Media',
      description: 'Embed images and media to make your notes more visual and engaging.'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your notes are protected with secure authentication and encryption.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Built for speed with instant sync and real-time saving.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold gradient-text">Notty</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Link
              to="/login"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-primary-600 to-purple-600 rounded-full font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              Welcome to the future of note-taking
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Your Ideas,{' '}
            <span className="gradient-text">Beautifully</span>
            <br />
            Organized
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-500 dark:text-dark-400 mb-12 max-w-2xl mx-auto"
          >
            Notty is a modern note-taking platform with rich text editing, code blocks,
            todo lists, and more. Capture your thoughts with style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold text-lg text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center gap-2"
            >
              Start Taking Notes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Hero Image/Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-5xl mx-auto mt-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-2xl blur-xl" />
            <div className="relative glass-dark rounded-2xl p-2">
              <div className="bg-dark-900 rounded-xl overflow-hidden">
                {/* Mock Window Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-dark-800 border-b border-dark-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-dark-400 text-sm">Notty - Your Ideas, Beautifully Organized</div>
                </div>
                {/* Mock App Preview */}
                <div className="flex h-96">
                  {/* Sidebar */}
                  <div className="w-64 bg-dark-800/50 border-r border-dark-700 p-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600" />
                      <span className="font-semibold">My Workspace</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary-500/20 rounded-lg text-primary-400">
                        <span>📓</span> Personal Notes
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:bg-dark-700/50 rounded-lg">
                        <span>💼</span> Work Projects
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:bg-dark-700/50 rounded-lg">
                        <span>💡</span> Ideas
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Notty! 🎉</h2>
                    <div className="text-dark-400 space-y-3">
                      <p>Start capturing your ideas with our powerful rich text editor.</p>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-primary-500" defaultChecked />
                        <span className="line-through text-dark-500">Create your first notebook</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-primary-500" />
                        <span>Write your first note</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-primary-500" />
                        <span>Try code blocks</span>
                      </div>
                      <div className="bg-dark-800 p-4 rounded-lg mt-4">
                        <code className="text-green-400">console.log("Hello, Notty!");</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-32 bg-white/50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{' '}
              <span className="gradient-text">capture ideas</span>
            </h2>
            <p className="text-gray-500 dark:text-dark-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to help you organize your thoughts and boost productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-dark-800 transition-all shadow-sm dark:shadow-none"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-dark-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/30 to-purple-600/30 rounded-3xl blur-2xl" />
            <div className="relative glass-dark rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to organize your thoughts?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of users who trust Notty for their note-taking needs.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold text-lg text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold">Notty</span>
          </div>
          <p className="text-gray-400 dark:text-dark-500 text-sm">
            © 2024 Notty. Built with ❤️ for productivity lovers.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 dark:text-dark-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 dark:text-dark-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

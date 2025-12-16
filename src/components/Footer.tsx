"use client";

import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted text-sm"
          >
            © {currentYear} Sam. All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted text-sm"
          >
            Built with{" "}
            <span className="text-primary">Next.js</span>,{" "}
            <span className="text-primary">Tailwind</span>, and{" "}
            <span className="text-primary">Framer Motion</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

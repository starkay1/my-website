'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { casesData } from '@/data/cases';
import type { Case } from '@/types';

interface CasesListProps {
  cases: Case[];
}

export default function CasesList({ cases }: CasesListProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={caseItem.coverImage}
                  alt={caseItem.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/cases/${caseItem.slug}`}
                    className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="h-6 w-6" />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-sm rounded-full">
                    {caseItem.category}
                  </span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {caseItem.publishedAt}
                  </div>
                </div>
                
                <Link href={`/cases/${caseItem.slug}`}>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors cursor-pointer">
                    {caseItem.title}
                  </h3>
                </Link>
                
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {caseItem.location}
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {caseItem.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {caseItem.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
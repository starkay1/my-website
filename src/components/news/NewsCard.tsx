"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image?: string
  publishedAt: Date
  category?: string
  slug: string
  locale?: string
}

export function NewsCard({
  id,
  title,
  excerpt,
  image,
  publishedAt,
  category,
  slug,
  locale = "en"
}: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
            {category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-sm text-gray-500">
            {formatDate(publishedAt)}
          </time>
          <Link
            href={`/${locale}/news/${slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default NewsCard;
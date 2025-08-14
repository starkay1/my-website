"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { useTranslations } from "next-intl"

export interface OfficeImage {
  id: string
  src: string
  alt: string
  title: string
  description: string
}

export interface OfficeTourProps {
  images?: OfficeImage[]
  className?: string
}

const defaultImages: OfficeImage[] = [
  {
    id: "1",
    src: "/office/reception.jpg",
    alt: "接待区",
    title: "现代化接待区",
    description: "温馨舒适的接待环境，为客户提供专业的咨询服务"
  },
  {
    id: "2",
    src: "/office/meeting-room.jpg",
    alt: "会议室",
    title: "高端会议室",
    description: "配备先进设备的会议室，确保高效的商务洽谈"
  },
  {
    id: "3",
    src: "/office/workspace.jpg",
    alt: "工作区",
    title: "开放式工作区",
    description: "现代化的办公环境，激发团队创新与协作"
  },
  {
    id: "4",
    src: "/office/lounge.jpg",
    alt: "休息区",
    title: "员工休息区",
    description: "舒适的休息空间，促进员工交流与放松"
  },
  {
    id: "5",
    src: "/office/kitchen.jpg",
    alt: "茶水间",
    title: "现代茶水间",
    description: "设施齐全的茶水间，为员工提供便利的生活服务"
  },
  {
    id: "6",
    src: "/office/exterior.jpg",
    alt: "办公楼外观",
    title: "办公楼外观",
    description: "位于市中心的现代化办公楼，交通便利"
  }
]

export function OfficeTour({ images = defaultImages, className = "" }: OfficeTourProps) {
  const t = useTranslations('about')
  const [selectedImage, setSelectedImage] = useState<OfficeImage | null>(null)

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            办公环境
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            现代化的办公环境，为团队提供舒适的工作空间
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // 如果图片加载失败，使用占位图
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(image.title)}`
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {image.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 图片预览模态框 */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={800}
                  height={600}
                  className="rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(selectedImage.title)}`
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-gray-200">
                    {selectedImage.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
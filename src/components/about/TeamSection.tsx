"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"

export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  image: string
  linkedin?: string
  email?: string
}

export interface TeamSectionProps {
  members?: TeamMember[]
  className?: string
}

const defaultMembers: TeamMember[] = [
  {
    id: "1",
    name: "张伟",
    position: "首席执行官",
    bio: "拥有15年夜生活行业经验，致力于为客户提供最优质的娱乐场所咨询服务。",
    image: "/team/ceo.jpg",
    linkedin: "https://linkedin.com/in/zhangwei",
    email: "zhang.wei@spaceplus.com"
  },
  {
    id: "2",
    name: "李娜",
    position: "运营总监",
    bio: "专注于运营管理和客户关系维护，确保每个项目的成功实施。",
    image: "/team/coo.jpg",
    linkedin: "https://linkedin.com/in/lina",
    email: "li.na@spaceplus.com"
  },
  {
    id: "3",
    name: "王强",
    position: "技术总监",
    bio: "负责技术创新和数字化解决方案，推动行业技术发展。",
    image: "/team/cto.jpg",
    linkedin: "https://linkedin.com/in/wangqiang",
    email: "wang.qiang@spaceplus.com"
  },
  {
    id: "4",
    name: "陈美",
    position: "市场总监",
    bio: "负责品牌推广和市场策略，建立强大的市场影响力。",
    image: "/team/cmo.jpg",
    linkedin: "https://linkedin.com/in/chenmei",
    email: "chen.mei@spaceplus.com"
  }
]

export function TeamSection({ members = defaultMembers, className = "" }: TeamSectionProps) {
  const t = useTranslations('about')

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            我们的团队
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            由经验丰富的专业人士组成的团队，致力于为您提供最优质的服务
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，使用默认头像
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=256&background=667eea&color=fff`
                  }}
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {member.bio}
                </p>
                
                <div className="flex space-x-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
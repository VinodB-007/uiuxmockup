import { projectType } from '@/type/types'
import React from 'react'
import Image from 'next/image'
import { Link } from 'lucide-react'

type props = {
  project: projectType
}

function ProjectCard ({ project }:props) {
  return (
    <Link href={ '/project/'+project?.projectId}>
    <div className='ronded-2xl p-4 '>
      <Image
        src={project?.screenshot as string}
        alt={project.projectName as string }
        width={300}
        height={200}
        className='rounded-xl object-contain h-[200px] w-full bg-black'
      />
      <div className='p-2'>
        <h2>{project?.projectName}</h2>
        <p className='text-sm text-gray-500'>{project?.createdOn}</p>
      </div>
    </div>
    </Link>
  )
}

export default ProjectCard

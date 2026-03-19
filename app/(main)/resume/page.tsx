import { getResume } from '@/actions/resume'
import ResumeBuilder from './_components/resume-builder'
import ResumeBackground from '@/components/3d/resume-background'

const ResumePage = async () => {
  const resume = await getResume()

  return (
    <div className="relative min-h-screen overflow-hidden w-full">
      {/* 3D Background */}
      <ResumeBackground />
      
      <div className="relative z-10 w-full">
        <ResumeBuilder
          initialContent={resume?.content}
          initialFormData={resume?.formData}
        />
      </div>
    </div>
  )
}

export default ResumePage
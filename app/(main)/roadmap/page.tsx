import RoadmapGeneratorHero from './_components/roadmap-generator-hero'
import RoadmapBackground from '@/components/3d/roadmap-background'

const RoadmapPage = () => {
  return (
    <div className='min-h-screen bg-black pt-24 pb-20 relative overflow-hidden'>
      {/* 3D Background */}
      <RoadmapBackground />

      {/* Decorative background matching other tools */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className='container mx-auto px-4 relative z-10'>
        <RoadmapGeneratorHero />
      </div>
    </div>
  );
};

export default RoadmapPage

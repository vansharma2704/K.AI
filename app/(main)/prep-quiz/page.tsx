import React from 'react'
import { getRecentQuizzes } from '@/actions/quiz'
import { Button } from '@/components/ui/button'
import { PlusCircle, Target, Award, Clock } from 'lucide-react'
import Link from 'next/link'
import DeleteQuizButton from './_components/delete-quiz-button'

export default async function PrepQuizDashboard() {
  const { success, data } = await getRecentQuizzes();
  const recentQuizzes = success ? data : [];

  return (
    <div className='min-h-screen bg-black pt-24 pb-20 relative overflow-hidden'>
      {/* Decorative background mapping */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className='container mx-auto px-4 relative z-10 max-w-5xl'>
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">AI Prep Quiz</h1>
                <p className="text-muted-foreground text-lg">Generate hyper-specific mock quizzes strictly tailored to your target skills.</p>
            </div>
            
            <Link href="/prep-quiz/start">
                <Button size="lg" className="rounded-full shadow-[0_0_20px_-5px_var(--color-primary)] font-bold px-8">
                    <PlusCircle className="mr-2 w-5 h-5" /> Generate Test
                </Button>
            </Link>
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Assessments</h2>
            
            {recentQuizzes && recentQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentQuizzes.map((quiz: any) => (
                        <div key={quiz.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-default relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             
                             <div className="relative z-10">
                                 <div className="flex items-center gap-2 mb-4">
                                     <Target className="w-5 h-5 text-primary" />
                                     <h3 className="text-lg font-bold text-white truncate">{quiz.category.replace('Prep Quiz: ', '')}</h3>
                                 </div>
                                 
                                 <div className="flex justify-between items-end mt-6">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-500 font-bold text-2xl">{Math.round(quiz.quizScore)}%</span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                         <Link href={`/prep-quiz/result/${quiz.id}`}>
                                            <Button variant="ghost" className="text-xs hover:bg-white/10 h-8">View Analytics</Button>
                                        </Link>
                                        <DeleteQuizButton 
                                            quizId={quiz.id} 
                                            showText={false}
                                            className="h-8 w-8 p-0 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                        />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center border overflow-hidden rounded-3xl border-dashed border-white/20 bg-white/5">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                        <Clock className="w-8 h-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Quizzes Taken</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">You haven't generated any Prep Quizzes yet. Generate your first one to test your knowledge!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

"use client";
import HeroV2 from "@/components/hero-v2";
import FAQSection from "@/components/faq-section";
import { Card, CardContent } from "@/components/ui/card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const revealVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <HeroV2 />
      
      {/* Stats Bar - Enhanced with scroll reveal */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariant}
        className="w-full py-16 md:py-20 border-y border-primary/20 relative overflow-hidden"
      >
        {/* Animated gradient lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,174,63,0.03),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            { [
              { label: "Success Rate", value: "98%" },
              { label: "Active Users", value: "10k+" },
              { label: "Industries", value: "50+" },
              { label: "AI Support", value: "24/7" },
            ].map((stat, i) => (
                <div key={i} className="text-center space-y-2 group cursor-pointer relative p-6 rounded-2xl glass border-white/5">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h3 className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">{stat.value}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wider relative z-10">{stat.label}</p>
                </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section - With scroll reveal */}
      <motion.section 
        id="features" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariant}
        className="w-full py-20 md:py-32 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-primary/20 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>AI-Powered Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Tools for the <span className="text-primary">Modern Professional</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Our suite of AI-powered tools is designed to help you succeed in every aspect of your career journey.
            </p>
          </div>
          
          <HoverEffect items={features} className="max-w-7xl mx-auto" />
        </div>
      </motion.section>

      {/* Success Stories - With staggered reveal */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariant}
        className="w-full py-20 md:py-32 bg-gradient-to-b from-black via-black to-primary/5 border-y border-primary/20 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[550px] h-[550px] bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-primary" />
                <span>Client Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Success <span className="text-primary">Stories</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Discover how professionals like you achieved their career goals with Senpai
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonial.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                    <Card className="relative bg-black/40 backdrop-blur-xl border-primary/50 rounded-3xl transition-all duration-500 h-full overflow-hidden group">
                      <div className="absolute -inset-px bg-gradient-to-br from-primary/20 to-transparent opacity-100 transition-opacity duration-500" />
                      
                      <CardContent className="pt-8 pb-8 px-8 relative z-10">
                        <div className="flex flex-col h-full">
                          <div className="mb-6">
                            <Quote className="w-10 h-10 text-primary/30" />
                          </div>
                          
                          <p className="text-base text-gray-300 leading-relaxed mb-6 flex-grow italic">
                            "{item.quote}"
                          </p>
                          
                          <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                            <div className="relative">
                              <Image
                                width={48}
                                height={48}
                                src={item.image}
                                alt={item.author}
                                className="relative rounded-full object-cover grayscale-0 transition-all duration-500 ring-2 ring-primary/20"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white text-base tracking-tight">{item.author}</p>
                              <p className="text-xs text-primary font-medium tracking-wide uppercase">{item.role}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <FAQSection />

    </div>
  );
}

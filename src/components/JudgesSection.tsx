'use client';

import { motion, useTransform, useScroll } from 'framer-motion';
import { useState, useRef } from 'react';
import { Modal } from './ui/Modal';
import { Spotlight } from './ui/spotlight';
import { Card3D, ParallaxSection, ParallaxLayer } from './ParallaxEffect';

const JudgesSection = () => {
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Efectos de paralaje para elementos de fondo
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  interface Judge {
    name: string;
    title: string;
    bio: string;
    image: string;
    delay: number;
    color: string;
    twitter: string;
    longBio: string;
    achievements: string[];
    expertise: string[];
    companies: string[];
  }
  
  const judges: Judge[] = [
    {
      name: '@saranormous',
      title: 'Tech Innovator',
      bio: 'Founder and tech visionary leading the future of development platforms.',
      longBio: `Sarah Drasner is a renowned developer advocate, designer, and engineer with expertise in web technologies and cloud computing. She's known for her contributions to the Vue.js ecosystem and has authored several influential books on web animation and SVG. Sarah frequently speaks at conferences worldwide, sharing her knowledge on modern web development techniques and best practices.`,
      image: 'https://unavatar.io/twitter/saranormous',
      delay: 0,
      color: '#00ffcc',
      twitter: 'https://twitter.com/saranormous',
      achievements: [
        'Multiple award-winning author on web animation and SVG',
        'Former VP of Developer Experience at Netlify',
        'Core team member of Vue.js',
        'Creator of popular open-source animation libraries'
      ],
      expertise: [
        'Web Animation', 'UI/UX Design', 'JavaScript Frameworks', 'Developer Experience'
      ],
      companies: ['Netlify', 'Microsoft', 'Vue.js', 'CSS-Tricks']
    },
    {
      name: '@theo',
      title: 'Developer Advocate',
      bio: 'Creator and educator empowering the next generation of developers.',
      longBio: `Theo is a respected developer advocate and content creator focused on modern web technologies. Known for his engaging educational content and direct teaching style, he has built a strong community around technologies like TypeScript, React, and server-side frameworks. His ability to break down complex topics has helped thousands of developers level up their skills and stay current with the rapidly evolving tech landscape.`,
      image: 'https://unavatar.io/twitter/theo',
      delay: 0.1,
      color: '#7000ff',
      twitter: 'https://twitter.com/theo',
      achievements: [
        'Built a community of over 500,000 developers worldwide',
        'Creator of popular educational content in web development',
        'Speaker at major tech conferences globally',
        'Established unique teaching methodologies for complex concepts'
      ],
      expertise: [
        'TypeScript', 'React Ecosystem', 'Backend Development', 'Educational Content Creation'
      ],
      companies: ['Vercel', 'PlanetScale', 't3.gg', 'Ping.gg']
    },
    {
      name: '@youyuxi',
      title: 'Framework Creator',
      bio: 'Creator of innovative tools that power modern web development.',
      longBio: `Evan You is the creator of Vue.js, one of the most popular JavaScript frameworks in the world. His work has revolutionized front-end development by providing a progressive framework that's both powerful and approachable. Before creating Vue, Evan worked at Google and Meteor Development Group. His contributions to open source have significantly shaped the modern web development ecosystem, emphasizing developer experience and performance.`,
      image: 'https://unavatar.io/twitter/youyuxi',
      delay: 0.2,
      color: '#ff00c3',
      twitter: 'https://twitter.com/youyuxi',
      achievements: [
        'Creator of Vue.js with over 200,000 GitHub stars',
        'Pioneered the concept of progressive JavaScript frameworks',
        'Developed Vite, a next-generation build tool',
        'Recipient of multiple open source community awards'
      ],
      expertise: [
        'JavaScript Frameworks', 'Build Tools', 'Performance Optimization', 'Developer Experience'
      ],
      companies: ['Vue Technology LLC', 'Google', 'Meteor Development Group']
    },
    {
      name: '@thisiskp_',
      title: 'Product Designer',
      bio: 'Design leader creating experiences that shape how we interact with technology.',
      longBio: `KP is a product designer known for creating intuitive, user-centered experiences that blend aesthetics with functionality. With years of experience working with top tech companies, KP has developed a unique approach to design that prioritizes accessibility and inclusivity. Their expertise spans UI/UX design, design systems, and product strategy, making them a valuable voice in evaluating how technology can effectively serve diverse user needs.`,
      image: 'https://unavatar.io/twitter/thisiskp_',
      delay: 0.3,
      color: '#00a3ff',
      twitter: 'https://twitter.com/thisiskp_',
      achievements: [
        'Led design for products used by millions worldwide',
        'Pioneer in accessibility-first design methodologies',
        'Created internationally recognized design systems',
        'Advisor to multiple tech startups on UX strategy'
      ],
      expertise: [
        'UI/UX Design', 'Accessibility', 'Design Systems', 'Product Strategy'
      ],
      companies: ['Major Tech Companies', 'Design Consultancies', 'Startups']
    },
    {
      name: '@levelsio',
      title: 'Indie Hacker',
      bio: 'Serial entrepreneur and creator of innovative digital products.',
      longBio: `Pieter Levels is a Dutch entrepreneur known for building multiple successful products as a solo founder, including Nomad List and Remote OK. His approach to building in public, rapid iteration, and focusing on profitability from day one has inspired a generation of independent makers. Pieter is recognized for his minimalist approach to business, challenging conventional startup wisdom by creating profitable ventures without external funding or large teams.`,
      image: 'https://unavatar.io/twitter/levelsio',
      delay: 0.4,
      color: '#ffcc00',
      twitter: 'https://twitter.com/levelsio',
      achievements: [
        'Built 12+ profitable products as a solo founder',
        'Created Nomad List, the largest digital nomad community',
        'Built Remote OK, one of the top remote job boards globally',
        'Pioneered the "building in public" movement'
      ],
      expertise: [
        'Bootstrapped Startups', 'Solo Entrepreneurship', 'Remote Work', 'Community Building'
      ],
      companies: ['Nomad List', 'Remote OK', 'Rebase', 'OpeningHours']
    },
    {
      name: '@OfficialLoganK',
      title: 'Tech Entrepreneur',
      bio: 'Founder and builder of developer tools used by millions.',
      longBio: `Logan Kilpatrick is a developer advocate and educator passionate about making technology accessible to everyone. With experience working for leading tech companies, Logan has developed a deep understanding of what makes developer tools successful. His expertise in machine learning, programming languages, and developer experience gives him unique insights into how technology can be both powerful and user-friendly.`,
      image: 'https://unavatar.io/twitter/OfficialLoganK',
      delay: 0.5,
      color: '#00ffcc',
      twitter: 'https://twitter.com/OfficialLoganK',
      achievements: [
        'Led developer relations at major AI research organizations',
        'Key contributor to educational initiatives in programming',
        'Speaker at top-tier technology conferences worldwide',
        'Mentor to hundreds of emerging engineers and students'
      ],
      expertise: [
        'Machine Learning', 'Developer Relations', 'Programming Languages', 'Technical Education'
      ],
      companies: ['OpenAI', 'Apple', 'Julia Computing', 'Educational Organizations']
    },
    {
      name: '@alexalbert__',
      title: 'AI Researcher',
      bio: 'Leading AI expert pushing the boundaries of machine learning applications.',
      longBio: `Alex Albert is an AI researcher and technologist working at the intersection of machine learning and product development. With publications in top AI conferences and experience building AI-powered applications, Alex brings both theoretical knowledge and practical implementation skills to evaluating cutting-edge projects. Their work focuses on making advanced AI capabilities accessible and useful in real-world applications.`,
      image: 'https://unavatar.io/twitter/alexalbert__',
      delay: 0.6,
      color: '#7000ff',
      twitter: 'https://twitter.com/alexalbert__',
      achievements: [
        'Published research in top-tier AI conferences',
        'Developed AI models used by millions of users',
        'Creator of innovative applications using natural language processing',
        'Pioneered techniques at the intersection of AI and product development'
      ],
      expertise: [
        'Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Applied AI'
      ],
      companies: ['Research Labs', 'AI Startups', 'Tech Giants']
    },
    {
      name: '@bentossell',
      title: 'No-Code Pioneer',
      bio: 'Empowering creators to build without traditional coding through innovative platforms.',
      longBio: `Ben Tossell is a pioneer in the no-code movement, making software development accessible to non-technical creators through his platform Makerpad, which was later acquired by Zapier. As a writer, builder, and community leader, Ben has demonstrated how powerful tools can be created without traditional programming. His expertise in evaluating tools based on their ability to solve real problems makes him an invaluable judge for both technical and non-technical innovations.`,
      image: 'https://unavatar.io/twitter/bentossell',
      delay: 0.7,
      color: '#ff00c3',
      twitter: 'https://twitter.com/bentossell',
      achievements: [
        'Founded Makerpad, acquired by Zapier in 2021',
        'Created the largest no-code education platform',
        'Built a community of 100,000+ no-code builders',
        'Demonstrated enterprise-level applications built without traditional coding'
      ],
      expertise: [
        'No-Code Development', 'Community Building', 'Product Strategy', 'Business Automation'
      ],
      companies: ['Makerpad', 'Zapier', 'Product Hunt', 'Investment Platforms']
    }
  ];

  const handleJudgeClick = (judge: Judge) => {
    setSelectedJudge(judge);
  };

  const handleCloseModal = () => {
    setSelectedJudge(null);
  };

  return (
    <ParallaxSection id="judges" className="snap-section bg-black relative overflow-hidden h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-[#7000ff]/5 via-black to-black opacity-40"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      
      {/* Parallax Background Elements */}
      <ParallaxLayer depth={0.8} speed={-0.5} className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ backgroundImage: "url('/constellation.svg')", backgroundSize: "cover", y: bgY1 }}
        />
      </ParallaxLayer>
      
      <ParallaxLayer depth={0.5} speed={0.2} className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          style={{ backgroundImage: "url('/circuit-board.svg')", backgroundSize: "cover", y: bgY2 }}
        />
      </ParallaxLayer>
      
      {/* Spotlight Effect */}
      <Spotlight
        className="top-10 left-0 md:left-60 md:-top-20"
        fill="#7000ff"
      />
      
      <div ref={containerRef} className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 pt-24 md:pt-20"
        >
          <motion.span
            className="inline-block text-xl md:text-2xl font-bold px-6 py-2 rounded-full border border-purple-500/30 mb-6 relative overflow-hidden mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#00ffcc] via-[#7000ff] to-[#ff00c3]">
              WORLD-CLASS EXPERTS
            </span>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md -z-5"></div>
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Meet Our <span className="gradient-text">Judges</span>
          </h2>
          
          <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-2">
            Industry leaders who will be evaluating submissions and providing valuable feedback
          </p>
        </motion.div>

        {/* Nueva visualización de jueces más profesional con carrusel de 2 filas */}
        <div className="w-full h-[65vh] flex flex-col">
          <div className="flex-1 overflow-y-auto hide-scrollbar px-2 py-2 overflow-x-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-min mt-6">
              {judges.map((judge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: judge.delay * 0.5 }}
                  onMouseEnter={() => {}}
                  onClick={() => handleJudgeClick(judge)}
                  className="cursor-pointer h-full"
                >
                  <Card3D 
                    depth={20}
                    glare={true}
                    borderColor={`border-${judge.color}/30`}
                    glowColor={`after:bg-${judge.color}/10`}
                    className="h-full"
                  >
                    <div className="flex flex-col bg-black/60 backdrop-blur-md rounded-xl overflow-hidden h-full">
                      {/* Image Container - Square and takes full width */}
                      <div className="w-full aspect-square relative">
                        <div 
                          className="absolute inset-0 z-10 transition-opacity duration-300"
                          style={{ 
                            background: `linear-gradient(to bottom, transparent 50%, ${judge.color}40)`,
                            opacity: 0.8 
                          }}
                        />
                        {/* Border overlay */}
                        <div 
                          className="absolute inset-0 border-b-2 z-20"
                          style={{ borderColor: judge.color }} 
                        />
                        {/* Judge Image */}
                        <img
                          src={judge.image}
                          alt={judge.name}
                          className="w-full h-full object-cover absolute inset-0"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 text-center">
                        <h3 className="text-sm md:text-base font-bold truncate" style={{ color: judge.color }}>
                          {judge.name}
                        </h3>
                        
                        <p className="text-white text-xs md:text-sm font-medium truncate">
                          {judge.title}
                        </p>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Judge Details */}
      <Modal 
        isOpen={!!selectedJudge} 
        onClose={handleCloseModal}
        title=""
        maxWidth="max-w-5xl"
      >
        {selectedJudge && (
          <div className="relative">
            {/* Background elements for the modal */}
            <div 
              className="absolute inset-0 opacity-20 rounded-xl z-0 overflow-hidden"
              style={{ 
                backgroundImage: `radial-gradient(circle at 50% 50%, ${selectedJudge.color}50 0%, transparent 70%)`,
                filter: 'blur(40px)'
              }}
            />
            
            <div className="absolute top-0 right-0 w-64 h-64 opacity-30 z-0" 
              style={{ 
                background: `radial-gradient(circle at center, ${selectedJudge.color}90, transparent 70%)`,
                filter: 'blur(60px)'
              }}
            />
            
            {/* Content container */}
            <div className="relative z-10">
              {/* Header with name and title */}
              <div className="flex items-center mb-8">
                <div>
                  <h2 className="text-4xl font-bold mb-1 break-words" style={{ color: selectedJudge.color }}>
                    {selectedJudge.name}
                  </h2>
                  <p className="text-white/80 text-xl break-words">{selectedJudge.title}</p>
                </div>
              </div>
              
              {/* Main content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Image and quick stats */}
                <div className="col-span-1">
                  <div className="rounded-xl overflow-hidden border-4 mb-6" style={{ borderColor: selectedJudge.color }}>
                    <img 
                      src={selectedJudge.image} 
                      alt={selectedJudge.name} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-bold mb-3 text-white/90">Expertise</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedJudge.expertise.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 rounded-full text-xs font-medium" 
                          style={{ 
                            backgroundColor: `${selectedJudge.color}20`,
                            color: selectedJudge.color 
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 text-white/90">Companies</h3>
                    <div className="text-white/70 text-sm">
                      {selectedJudge.companies.join(' • ')}
                    </div>
                  </div>
                </div>
                
                {/* Biography and achievements */}
                <div className="col-span-2">
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Biography</h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedJudge.longBio}
                    </p>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Key Achievements</h3>
                    <ul className="space-y-2">
                      {selectedJudge.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span 
                            className="inline-block w-4 h-4 mt-1.5 mr-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selectedJudge.color }}
                          />
                          <span className="text-white/80">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Botones centrados y alineados */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                    <motion.a 
                      href={selectedJudge.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium transition-all"
                      style={{ 
                        background: `linear-gradient(45deg, ${selectedJudge.color}, ${selectedJudge.color}AA)`,
                        boxShadow: `0 4px 20px ${selectedJudge.color}50`
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: `0 8px 25px ${selectedJudge.color}70`
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Logo de X (antes Twitter) */}
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Follow on X
                    </motion.a>
                    
                    <motion.button
                      onClick={handleCloseModal}
                      className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ParallaxSection>
  );
};

export default JudgesSection; 
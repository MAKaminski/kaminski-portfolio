import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Referral {
  id: number;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  content: string;
  rating: number;
  date: string;
  avatar?: string;
}

const referrals: Referral[] = [
  {
    id: 1,
    name: "Dawn Goad",
    title: "",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/dawn-jeffries-goad/",
    content: `I had the pleasure of working with Michael, and I can confidently say he is an outstanding Product Engineer. He has exceptional communication skills and a unique ability to break down complex technical challenges into clear, actionable solutions, making collaboration seamless across teams.

What truly makes Michael stand out is his problem solving mindset. He doesn't just fix issues; he digs deep to identify root causes and proactively implements long-term solutions that improve both product performance and processes. His understanding of regulatory compliance is particularly impressive. He recognizes its critical role in product development and ensures that every solution aligns with industry standards.

Beyond his technical expertise, Michael is also highly skilled in documenting processes and simplifying complex systems so that both technical and non-technical users can understand them. He has a knack for translating intricate engineering concepts into clear, accessible documentation that enhances efficiency, knowledge sharing, and overall user experience.

Michael's expertise, attention to detail, and commitment to excellence make him an invaluable asset to any team. I highly recommend him to anyone looking for a skilled and strategic engineer who drives meaningful impact.`,
    rating: 5,
    date: "2025",
    avatar: "/images/dawn.jpeg"
  },
  {
    id: 2,
    name: "Brien Mizell",
    title: "Senior Technical Product Engineer",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/brienmizell/",
    content: `I've had the privilege of working with Michael at Momnt, and he is truly one of the most capable and driven professionals I've encountered. His ability to optimize complex data pipelines, streamline operations, and align technology with business goals is outstanding. Whether tackling intricate technical challenges or supporting colleagues with thoughtful insights, Michael consistently goes above and beyond.

Beyond his technical expertise in SQL, Python, and data engineering, his collaborative spirit and problem-solving mindset are what sets Michael apart. He's always the first to jump in when help is needed, ensuring that both strategic and operational goals are met efficiently. His leadership and analytical skills have directly contributed to business success, and his positive attitude makes him a pleasure to work with.

Any organization looking for a highly skilled, adaptable, and dedicated professional would be lucky to have Michael on their team. I highly recommend him for any opportunity that requires both deep technical acumen and strategic vision.`,
    rating: 5,
    date: "2025",
    avatar: "/images/mizell.jpeg"
  },
  {
    id: 3,
    name: "Abby Martin",
    title: "Senior Product Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/martin-abby/",
    content: `I had the pleasure of working with Michael ("Kaminski") at Momnt, where he played a crucial role in managing complex data, optimizing pipelines, and ensuring seamless operations. Beyond his technical expertise, Michael is a great collaborator who brings a positive attitude and problem-solving mindset to every project. He's always appreciative of others and a fantastic team player. Any organization would be lucky to have him!`,
    rating: 5,
    date: "2025",
    avatar: "/images/Abby.jpeg"
  },
  {
    id: 4,
    name: "EJ Shramek",
    title: "Director of Project Management",
    company: "Superior Contracting & Maintenance",
    linkedinUrl: "https://www.linkedin.com/in/ejshramek/",
    content: `I worked very closely with Michael during his time as CFO for Superior Contracting & Maintenance and would not hesitate to recommend him for Senior and Executive leadership roles.

Michael's superpower is a double whammy of emotional intelligence and strategic vision. A true servant leader that endeavors to learn and understand his team and employees and their motivators/drivers as part of the business, Michael places a premium on a positive culture to drive results from a happy, encouraged, and supported team. With a strategic vision and passion for technology, Michael brings a unique touch to his roles, often finding new tech and applications to streamline operational workflows before most people even become aware of the platform(s). 

Michael is a perennial educator and facilitator. Over the years, I have watched Michael teach corporate financing and business to dozens of coworkers (myself included) simply because they asked and he truly believes education, personal/professional development, and understanding the "why" build great leaders and greater companies. 

Michael is a first round draft pick and will be an outstanding impact player and leader for any company lucky enough to have him.`,
    rating: 5,
    date: "2025",
    avatar: "/images/Shramek.jpeg"
  },
  {
    id: 5,
    name: "Kyle McDonald",
    title: "Senior Financial Analyst",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/mcdonaldkyle/",
    content: `In my professional career, I have never come across someone as willing & able to use their knowledge and technical skill set to advance the company as a whole as Michael.

In our time together at Momnt, he consistently went above and beyond to help others solve complex problems. When coworkers would post questions on our internal messaging system, Michael was usually the first to reach out with answers. And if he didn't know at the time, he would research the issue and come back with solutions - all while outperforming in his own job duties. 

What most impressed me about Michael was his drive. It became clear early on that he was not motivated by public accolades or promotions - he simply wanted to do the best job possible at any task in front of him for the benefit of the company. 

Any business looking for someone highly skilled in coding (SQL, Python,etc.), statistics, data analysis, financial modeling, strategy, and countless other hard & soft skills would greatly benefit from having Michael on staff.`,
    rating: 5,
    date: "2025",
    avatar: "/images/McDonald.jpeg"
  },
  {
    id: 6,
    name: "Daniel Walker",
    title: "Director of Construction",
    company: "Superior Contracting & Maintenance",
    linkedinUrl: "https://www.linkedin.com/in/daniel-walker-479646205/",
    content: `I had the privilege of working closely with Michael Kaminski during their time as CFO at Superior Contracting & Maintenance, and I can confidently say that they are one of the most talented and versatile leaders I've had the pleasure of working with.

Michael carries a deep acumen for finance with a forward-thinking approach to technology and innovation. His leadership extended well beyond traditional financial management playing a pivotal role in aligning financial goals with technology investments, streamlining operations, and guiding the organization through complex transformations.

Michael is a natural problem solver, with a keen understanding of how to leverage technology to optimize business processes and drive efficiency, willing to do so without leaving any option undiscovered and placing a one of a kind drive into discovering solutions. Whether it was overseeing large-scale system upgrades or aligning financial and technological strategies, Michael shows a remarkable aptitude for organization and leadership in any capacity.

Michael has a unique talent of meshing a 'Big Picture' mindset while maintaining a true genuine, compassionate approach to management.

I have no doubt that Michael would excel in any senior leadership role.`,
    rating: 5,
    date: "2025",
    avatar: "/images/Walker.jpeg"
  },
  {
    id: 7,
    name: "Peter Doro",
    title: "Product Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/peter-doro2000/",
    content: `I had the pleasure of working alongside Kaminski, and I can confidently say he is one of the most intelligent and results-driven professionals I've encountered. His ability to engineer high-performance data solutions and drive efficiency at scale is truly impressive.

His leadership in managing a development team while directly supporting executive leadership showcased his ability to balance both strategic and technical initiatives seamlessly. His efforts directly lead to tens of millions in capital being generated or saved that otherwise would have never come to fruition.

One of his standout achievements was leading critical reporting and credit functions for Capital Markets transactions, facilitating deals exceeding $300M in unsecured loans. His expertise in Python, SQL, AWS, and data engineering was instrumental in enhancing risk, compliance, and operational workflows.

Beyond his technical expertise, Kaminski is a problem solver who thrives in high-stakes environments. His contributions in integrating external risk datasets and engineering scalable infrastructure resulted in millions in recovered revenue and improved business intelligence. Any organization would be fortunate to have him on their team, and I highly recommend him for any role that requires a blend of strategic thinking and deep technical acumen.`,
    rating: 5,
    date: "2025",
    avatar: "/images/Doro.jpeg"
  },
  {
    id: 8,
    name: "Jessica Almariri",
    title: "Compliance Analyst",
    company: "Momnt",
    linkedinUrl: "  https://www.linkedin.com/in/jessica-almariri-b3684a10/",
    content: `Michael helped our group every time we needed him. He is a great communicator and handles multiple projects while always makes room for others. I recommend him highly and it was such a pleasure to work with him.`,
    rating: 5,
    date: "2025",
    avatar: "/images/Almariri.jpeg"
  },
  {
    id: 9,
    name: "Vedran Karačić",
    title: "Software Developer",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/vedrankaracic/",
    content: `Kickass product manager and an all round fun coworker that anyone would be lucky to have.`,
    rating: 5,
    date: "2025",
    avatar: "/images/Vedran.jpeg"
  },
  {
    id: 10,
    name: "Natalie Uribe",
    title: "Enterprise Admin, Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/natalie-uribe-aab000a1/",
    content: `I've had the pleasure of working alongside Michael, and I can confidently say his ability to align technology with business strategy is truly impressive, consistently driving innovation and efficiency. Any organization would be fortunate to have him. `,
    rating: 5,
    date: "2025",
    avatar: "/images/Natalie.jpeg"
  },
  {
    id: 11,
    name: "Michael Hill",
    title: "Manager, GPS EFA",
    company: "Deloitte",
    linkedinUrl: "https://www.linkedin.com/in/michael-hill-0391991b/",
    content: `I had the pleasure of working with Michael Kaminski on various levels during my graduate career at Georgia State University. One was a highly complex project for the University's Portfolio Management Team. Michael, the President of the team, was a highly effective leader that received the best work from each individual team member. It was his leadership skills that ultimately drove the team to success. 
 
I recommend Michael Kaminski for any leadership role in a financial setting.`,
    rating: 5,
    date: "2011",
    avatar: "/images/Hill.jpeg"
  },
  {
    id: 12,
    name: "Genna Brown",
    title: "CIO",
    company: "Financial Success",
    linkedinUrl: "https://www.linkedin.com/in/genna-brown-11385ab/",
    content: `Michael is an excellent and organized Chief Investment Officer of Robinson's student managed equity portfolio. The portfolio is doing extremely well and the team is working together as a cohesive group. That's what the CIO is supposed to do and he is executing extremely well.`,
    rating: 5,
    date: "2011",
    avatar: "/images/Brown.jpeg"
  }
];

const ReferralCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % referrals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % referrals.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + referrals.length) % referrals.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Colleagues Say About Michael Kaminski
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by executives and board members across finance, technology, and strategic consulting.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        {referrals[currentIndex].avatar ? (
                          <img
                            src={referrals[currentIndex].avatar}
                            alt={referrals[currentIndex].name}
                            className="w-16 h-16 rounded-full object-cover shadow-lg"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl ${referrals[currentIndex].avatar ? 'hidden' : ''}`}>
                          {referrals[currentIndex].name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {referrals[currentIndex].name}
                            </h3>
                            <p className="text-gray-600">
                              {referrals[currentIndex].title} at {referrals[currentIndex].company}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(referrals[currentIndex].rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <a
                              href={referrals[currentIndex].linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Linkedin size={20} />
                            </a>
                          </div>
                        </div>
                        
                        <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                          "{referrals[currentIndex].content}"
                        </blockquote>
                        
                        <div className="mt-6 text-sm text-gray-500">
                          {referrals[currentIndex].date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {referrals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to work with Michael Kaminski?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule a Consultation
            </a>
            <a
              href="https://www.linkedin.com/in/michaelxaxkaminski"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCarousel; 
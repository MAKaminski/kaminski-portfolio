// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const referrals: Referral[] =`  and  `export const getReferral`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getReferral` sentinel.

export interface Referral {
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

export const referrals: Referral[] = [
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

export const getReferral = (id: number): Referral | undefined =>
  referrals.find((r) => r.id === id);

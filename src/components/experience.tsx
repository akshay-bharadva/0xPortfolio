import Link from "next/link";
import { PropsWithChildren, ReactElement, ReactNode } from "react";
import { BsArrowUpRight } from "react-icons/bs";

type Props = PropsWithChildren;

type ExperienceType = {
  orgName: string;
  orgHref: string;
  position: string;
  from: string;
  to: string;
  desc: ReactNode;
  techStack: string[];
};

const MyExperience: ExperienceType[] = [
  {
    orgName: "SigNoz Inc.",
    orgHref: "https://signoz.io/",
    position: "Freelance Open Source Contributor",
    from: "April 2023",
    to: "Present",
    desc: (
      <>
        Signoz is an open-source observability platform that helps engineers
        monitor and troubleshoot complex distributed systems.
        <br/>
        As a developer with SigNoz, I developed pages such as <span className="text-indigo-600 font-semibold">&ldquo;/pricing&rdquo;</span>, <span className="text-indigo-600 font-semibold">&ldquo;/team&rdquo;</span>, <span className="text-indigo-600 font-semibold">&ldquo;/enterprise&rdquo;</span>, and many more...
        <br/>
        My recent work of upgrading Landing page to new was great, checkout the landing page at <Link className="flex gap-1 items-center text-indigo-700 hover:text-indigo-900 font-bold underline hover:bg-yellow-200" href={"https://signoz.io/"}>signoz.io <BsArrowUpRight/></Link>
      </>
    ),
    techStack: ["React.js", "Docusaurus"],
  },
  {
    orgName: "Digipie Technologies LLP.",
    orgHref: "https://digipie.net/",
    position: "React Developer",
    from: "Dec 2022",
    to: "Aug 2023",
    desc: (
      <>
        <ul>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Developed project/feature with Javascript stack ReactJS, Redux,
            Redux-thunk, NextJS for frontend and NestJS, ExpressJS, NodeJS for
            backend, and also used databases both relational and non-relational
            such as MongoDB, and PostgreSQL.
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Developed high-quality, secure, and reliable feature/functionality
            according to the client’s requirements and delivered to the client
            on time.
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            The current Project consists of redux-observable with high-level
            coding structure patterns and easily accessible directory and file
            structure.{" "}
          </li>
        </ul>
      </>
    ),
    techStack: ["React.js", "Next.js", "Node.js", "MongoDB"],
  },
  {
    orgName: "Finlogic Technologies India Pvt. Ltd.",
    orgHref: "https://njtechnologies.in/",
    position: "Senior Executive, Fullstack Developer",
    from: "May 2022",
    to: "Nov 2022",
    desc: (
      <>
        <ul>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Develop and Support the SPRING MVC and REST Application in
            association with other Team Members
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Develop a REACT Application and Integrated it with the REST API
            according to client requirements given by the system analyst.
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            The current Project consists of microservice architecture with React
            as a Front-end application & spring boot as a backend service with a
            centralized Postgres database.
          </li>
        </ul>
      </>
    ),
    techStack: ["React.js", "Java", "Spring Boot", "SQL", "Postgres", "MySQL"],
  },
  {
    orgName: "Finlogic Technologies India Pvt. Ltd.",
    orgHref: "https://njtechnologies.in/",
    position: "Fullstack Developer - Intern",
    from: "Jan 2022",
    to: "Apr 2022",
    desc: (
      <>
        <ul>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            During this internship, I learned how to develop front and back end
            with java technologies, HTML5, CSS3, JS (ES6), and AJAX. Apart from
            frontend and backend development, I learned SQL & PL/SQL, how to
            create views, functions, procedures, triggers for particular table
            events, etc.
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Developed Functionality for Teacher/Metor module to Modify And
            Insert Dynamic Questions for Exams with ease and integrated Rich
            text editor.
          </li>
          <li className="ml-5 mb-2 list-disc text-gray-800">
            Worked on UI/UX development in JSP, and React. Worked on various
            sections on Admin and User Modules.
          </li>
        </ul>
      </>
    ),
    techStack: ["JSP", "Java", "Spring MVC", "SQL/PL-SQL", "MySQL"],
  },
];

export default function Experience({ children }: Props) {
  return (
    <section className="my-8">
      <h2 className="text-3xl font-black text-black font-space mb-6 border-b-4 border-black pb-2"> {/* Adjusted title style */}
        Experience
      </h2>
      <div className="relative pl-5 py-10 flex flex-col after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-black after:top-0 after:left-[3px]"> {/* Timeline thicker */}
        {MyExperience.map((experience) => (
          <div
            key={experience.position}
            className="pl-10 relative mb-10 last-of-type:mb-0 group bg-white p-6 border-2 border-black rounded-none shadow-[6px_6px_0px_#000]" // Card style for each experience
          >
            <span className="absolute w-5 h-5 rounded-none border-2 border-black bg-yellow-400 top-7 -left-[11px] group-hover:bg-indigo-500 transition z-20 transform rotate-45" /> {/* Pointy marker */}
            <Link
              href={experience.orgHref}
              className=""
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              <p className="font-space text-sm text-gray-600 font-semibold">
                {experience.from} - {experience.to}
              </p>
              <h3 className="text-2xl text-black font-bold font-space mb-1 group-hover:text-indigo-700 transition flex items-center">
                {experience.orgName} <BsArrowUpRight className="inline-block ml-1 group-hover:translate-x-1 transition-transform" />
              </h3>
            </Link>
            <p className="font-space text-lg text-gray-800 font-semibold mb-3">{experience.position}</p>
            <div className="font-space text-sm text-gray-700 leading-relaxed mb-4">{experience.desc}</div>
            <p className="font-space my-1">
              {experience.techStack.map((tech) => (
                <small
                  key={tech}
                  className="flex-inline rounded-none bg-gray-200 border border-black px-2 py-1 text-xs mr-2 mb-1 font-semibold text-black shadow-[1px_1px_0px_#000]" // Brutalist tag
                >
                  {tech}
                </small>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
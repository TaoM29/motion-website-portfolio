export type Project = {
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In progress';
  url?: string;
  tags: string[];
};

// Personal facts: job-application/CV, PROJECTS.md and SKILLS.md (September 2026).
// Interests: supplied directly by Taofik. Project status retains the source's limits.
export const portfolio = {
  name: 'Taofik Muhriz',
  introduction: 'Data scientist. Curious builder. A people person, on and off the court.',
  about: 'I’m Taofik — a data scientist who enjoys turning complex information into something people can use. My work brings together machine learning, thoughtful analysis, and software development. I like understanding the problem, building a solution, and questioning how well it really works.',
  background: 'I completed a five-year MSc in Data Science at NMBU (2021–2026), specialising in Business Analytics. My master’s thesis explored predictions from lung CT scans and received an A. Alongside my studies, work in healthcare and hospitality taught me to collaborate, communicate clearly, and stay calm when things get busy.',
  skills: [
    { name: 'Data science & machine learning', description: 'Python, R, PyTorch, scikit-learn, computer vision, and model validation.' },
    { name: 'Data platforms & analysis', description: 'SQL, PostgreSQL, Supabase, data pipelines, time series, and Streamlit.' },
    { name: 'Software & applied AI', description: 'TypeScript, React, Next.js, API integrations, and AI-assisted development.' },
    { name: 'From questions to useful answers', description: 'Problem framing, data quality, reproducible analysis, and clear communication.' },
  ],
  interests: ['Tennis', 'Strength training', 'Running', 'Time with friends'],
  contact: [
    { label: 'tawfik.muhriz@gmail.com', href: 'mailto:tawfik.muhriz@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/TaoM29' },
    { label: '+47 970 33 359', href: 'tel:+4797033359' },
  ],
  projects: [
    {
      title: 'Reading between the CT slices',
      category: 'Master’s thesis / 2026',
      description: 'Built and evaluated a research pipeline to predict mucus plug burden from lung CT images. Combined image features and machine learning with patient-level evaluation, cross-validation, and careful checks for data leakage. Awarded an A.',
      status: 'Completed',
      tags: ['Python', 'PyTorch', 'Computer vision', 'Research'],
    },
    {
      title: 'Personal Performance Intelligence',
      category: 'Personal project / Data platform',
      description: 'Building a platform that brings training, nutrition, and tennis data together. Includes Strava synchronisation, structured imports, and reproducible descriptive analysis. The focus is on trustworthy data and clear limitations; predictive features are not part of the current product.',
      status: 'In progress',
      tags: ['Next.js', 'PostgreSQL', 'Python', 'Supabase'],
    },
    {
      title: 'AL-TAWFIQ Trading Group',
      category: 'Client work / Web platform',
      description: 'Developed a bilingual English–Arabic website with responsive layouts, support for both reading directions, and technical SEO. The public website has launched; customer-data and subscription features remain under development as part of the same engagement.',
      status: 'In progress',
      tags: ['Next.js', 'TypeScript', 'Arabic / English', 'Client collaboration'],
    },
    {
      title: 'Energy & weather insights',
      category: 'Data analysis / 2025',
      description: 'Created a data flow from collection and quality checks to an interactive Streamlit application. Explored trends, seasonality, forecasting, and relationships between weather and energy data.',
      status: 'Completed',
      tags: ['Streamlit', 'Time series', 'Forecasting', 'Visualisation'],
    },
    {
      title: 'Morris Marine',
      category: 'Client work / Website',
      description: 'Developing a responsive website for a maritime business, turning company information and service offerings into clear navigation and reusable page components. The frontend is taking shape; the site has not yet launched.',
      status: 'In progress',
      tags: ['React', 'Next.js', 'TypeScript', 'Web development'],
    },
    {
      title: 'Automated KPI reporting',
      category: 'Applied AI / Automation',
      description: 'Developing an LLM-assisted workflow that extracts and structures information into consistent KPI reports. The work centres on clear inputs, useful KPI definitions, and quality checks on generated output.',
      status: 'In progress',
      tags: ['LLMs', 'Automation', 'Reporting'],
    },
  ] as Project[],
};

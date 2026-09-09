export type Project = {
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In progress';
  url?: string;
  image?: { src: string; alt: string; width: number; height: number; caption?: string; fit?: 'cover' | 'artwork' };
  tags: string[];
};

export type ProjectWithImage = Project & { image: NonNullable<Project['image']> };

export function hasProjectImage(project: Project): project is ProjectWithImage {
  return Boolean(project.image);
}

// Personal facts: job-application/CV, PROJECTS.md and SKILLS.md (September 2026).
// Age, interests and completed KPI status: supplied directly by Taofik.
// Reviewed the ten most recently modified CV PDFs on 2026-09-09; project notes clarify older CV claims.
export const portfolio = {
  name: 'Taofik Muhriz',
  introduction: 'I’m a data scientist with an MSc from NMBU. I work on machine learning, data tools, and websites and enjoy working with the people who use them.',
  about: 'I’m 24, based in Fredrikstad, and I enjoy turning data into insight that people can use. I’m happiest working on a product from end to end: understanding the question, exploring the data, building the solution, and following it through to a finished product.',
  aboutWork: 'My projects range from analysing lung CT scans to building websites for clients. I like getting into the technical details and talking with the people I’m building for. Those conversations help me work out what matters, make better choices, and improve the result as I go.',
  background: 'I completed a five-year MSc in Data Science at NMBU (2021–2026), specialising in Business Analytics. My master’s thesis explored predictions from lung CT scans and received an A. Alongside my studies, work in healthcare and hospitality taught me to collaborate, communicate clearly, and stay calm when things get busy.',
  skills: [
    { name: 'Data analysis & statistics', description: 'Python, pandas, NumPy and R for exploring data, regression and statistical modelling. I turn findings into clear insights, with attention to data quality and uncertainty.' },
    { name: 'Machine learning & computer vision', description: 'PyTorch, scikit-learn and OpenCV for predictive modelling, deep learning and image analysis. My work includes feature engineering, model training and optimisation.' },
    { name: 'Model evaluation & research', description: 'Cross-validation, model comparison and error analysis. I assess reliability and generalisation, and communicate methods, findings and limitations clearly.' },
    { name: 'Time series, dashboards & reporting', description: 'Time series analysis, forecasting and interactive Streamlit dashboards. I work with trends, seasonal patterns and KPI reporting, and have basic Power BI knowledge.' },
    { name: 'Data engineering & integrations', description: 'Python and SQL for data pipelines, ETL and API integrations. I connect information from different sources and prepare reliable data for analysis and reporting.' },
    { name: 'Databases & data modelling', description: 'PostgreSQL and Supabase for database design, data modelling and access control. I focus on organising data so it is consistent, secure and easy to work with.' },
    { name: 'Web development', description: 'TypeScript, React, Next.js and Tailwind CSS for responsive websites and applications. I work with reusable components, accessibility and multilingual design.' },
    { name: 'SEO optimisation', description: 'Technical SEO, page structure, metadata and multilingual search visibility. I work on making websites easier for search engines to understand and people to find.' },
    { name: 'AI engineering & LLMs', description: 'LLM-based information extraction, prompt design and report automation. I build AI workflows with clear inputs and quality checks, and use AI-assisted development across my projects.' },
    { name: 'Harness engineering & agent workflows', description: 'I’m researching and applying ways to give AI agents clear context, useful tools and well-defined tasks, with coordination, review and testing throughout development.' },
    { name: 'Testing & delivery', description: 'Git, GitHub, Docker and automated testing. My experience includes version control, quality assurance, and website deployment and configuration with Vercel and Cloudflare.' },
    { name: 'Business analysis & product development', description: 'Requirements analysis, process improvement and translating business needs into technical solutions. I enjoy working from the first question through development, delivery and feedback.' },
    { name: 'Academic foundations', description: 'A foundation in statistics, signal processing, algorithms and deep learning from my Data Science studies. I also have basic familiarity with dbt and cloud platforms.' },
    { name: 'Communication & collaboration', description: 'Explaining technical work, coordinating tasks and working with clients and colleagues. I value clear communication and shared priorities, and speak Norwegian, English and Arabic.' },
  ],
  interests: ['Tennis', 'Strength training', 'Running', 'Time with friends'],
  contact: [
    { label: 'tawfik.muhriz@gmail.com', href: 'mailto:tawfik.muhriz@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/TaoM29' },
    { label: '+47 970 33 359', href: 'tel:+4797033359' },
  ],
  projects: [
    {
      title: 'Predicting mucus plugs from lung CT scans',
      image: { src: '/images/projects/lung-ct-illustration.png', alt: 'AI-generated illustration inspired by lung CT imaging', width: 1536, height: 1024, caption: 'AI-generated illustration of Lung CT images', fit: 'artwork' },
      category: 'Master’s thesis',
      description: 'For my master’s thesis, I built a pipeline from raw lung CT images to estimates of mucus plug burden. I compared CNN models using fivefold cross-validation, evaluated predictions at patient level, and examined data leakage, uncertainty and generalisation. The thesis received an A.',
      status: 'Completed',
      tags: ['Python', 'PyTorch', 'Computer vision', 'Research'],
    },
    {
      title: 'Personal Performance Intelligence',
      image: { src: '/images/projects/personal-performance-overview.png', alt: 'Personal Performance Intelligence overview design showing training, tennis, nutrition and activity summaries', width: 2880, height: 1800, caption: 'Overview design of a personal performance intelligence in development' },
      category: 'Personal project',
      description: 'I’m building a platform around my own interests in training, nutrition and tennis. It brings together Strava activity sync, Lifesum file imports and tennis records, with authenticated access and descriptive reports that can be traced back to their source. I’m continuing to develop the analysis, with particular attention to missing data and what the results can support.',
      status: 'In progress',
      tags: ['Next.js', 'PostgreSQL', 'Python', 'Supabase'],
    },
    {
      title: 'AL-TAWFIQ Trading Group',
      image: { src: '/images/projects/altawfiq-en.png', alt: 'English homepage of the AL-TAWFIQ website I developed', width: 1440, height: 960, caption: 'English and Arabic web development' },
      category: 'Client work',
      description: 'I built the company’s website in English and Arabic, including layouts that work in both reading directions. The public site is live. I’m continuing to work on customer data and subscriptions as part of the same project.',
      status: 'In progress',
      tags: ['Next.js', 'TypeScript', 'Arabic / English', 'Client collaboration'],
    },
    {
      title: 'Energy & weather insights',
      image: { src: '/images/projects/energy-weather-dashboard.png', alt: 'Home page of my Energy & Weather Dashboard, with tools for exploring weather, energy production, consumption and forecasting', width: 2880, height: 1624, caption: 'Energy and weather exploration in Streamlit' },
      category: 'Data analysis',
      description: 'I brought energy and weather data together in a Streamlit app, from collecting and checking the data to presenting the results. I explored seasonal patterns, forecasts, and the relationship between weather and energy use.',
      status: 'Completed',
      tags: ['Streamlit', 'Time series', 'Forecasting', 'Visualisation'],
    },
    {
      title: 'Morris Marine',
      image: { src: '/images/projects/morris-marine.png', alt: 'Current homepage of the Morris Marine website I am developing', width: 1440, height: 960, caption: 'A client website in development' },
      category: 'Client work',
      description: 'I’m making a website for a maritime business, organising its company information and services into clear pages. The layout and navigation are implemented, and I’m still working on the site before launch.',
      status: 'In progress',
      tags: ['React', 'Next.js', 'TypeScript', 'Web development'],
    },
    {
      title: 'Automated KPI reporting',
      category: 'Report automation',
      description: 'I built a language-model workflow to extract and organise information for KPI status reports, replacing a manual reporting process. I defined the KPIs, prompts and input rules, then checked the output for consistency and clarity.',
      status: 'Completed',
      tags: ['LLMs', 'Automation', 'Reporting'],
    },
    {
      title: 'Liver cirrhosis risk modelling',
      category: 'Predictive modelling',
      description: 'I developed a predictive model using structured patient data to explore liver cirrhosis risk. My work covered data cleaning, feature engineering, statistical modelling and evaluation, including how the data and model choices affected the reliability of predictions.',
      status: 'Completed',
      tags: ['Patient data', 'Feature engineering', 'Statistical modelling', 'Model evaluation'],
    },
    {
      title: 'Digital strategy for Cryos International',
      category: 'Academic team project',
      description: 'In a team of four, I analysed Cryos International’s digital maturity, processes and systems. We proposed more standardised ways of working and better integrated data, weighing business needs against cost, risk and scalability. I contributed to coordination, quality checks and presenting our recommendations. The project received an A.',
      status: 'Completed',
      tags: ['Business Analytics', 'Enterprise architecture', 'Process improvement', 'Teamwork'],
    },
  ] as Project[],
};

export type Project = {
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In progress';
  url?: string;
  image?: { src: string; alt: string; width: number; height: number; caption?: string; fit?: 'cover' | 'artwork' };
  summary?: { label: string; text: string }[];
  details?: { label: string; text: string }[];
  detailLabel?: string;
  tagsLabel?: string;
  alternateImage?: { src: string; alt: string; label: string };
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
  introduction: 'I’m a data scientist with an MSc from NMBU. I build machine-learning models, data tools and websites, from exploring the problem to delivering the product.',
  about: 'I’m 24, based in Fredrikstad, and I enjoy turning data into insight that people can use. I’m happiest working on a product from end to end: understanding the question, exploring the data, building the solution, and following it through to a finished product.',
  aboutWork: 'My projects range from analysing lung CT scans to building websites for clients. I like getting into the technical details and talking with the people I’m building for. Those conversations help me work out what matters, make better choices, and improve the result as I go.',
  background: 'I completed a five-year MSc in Data Science at NMBU (2021–2026), specialising in Business Analytics. Alongside my studies, work in healthcare and hospitality taught me to collaborate, communicate clearly, and stay calm when things get busy.',
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
  outsideWork: [
    'Outside work, I spend a lot of time playing tennis, strength training and running. I enjoy the competition, and training helps me clear my head and stay focused.',
    'I also play poker, DJ and listen to a lot of house music.',
    'I like being around people and making time for friends. Keeping a balance between work, training and a social life matters to me.',
  ],
  contact: [
    { label: 'tawfik.muhriz@gmail.com', href: 'mailto:tawfik.muhriz@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/TaoM29' },
    { label: '+47 970 33 359', href: 'tel:+4797033359' },
  ],
  projects: [
    {
      title: 'Predicting mucus plugs from lung CT scans',
      summary: [{"label": "Problem", "text": "Explore whether lung CT scans can be used to estimate mucus plug burden."}, {"label": "My contribution", "text": "Built the image-processing and modelling pipeline, compared CNNs using fivefold cross-validation, and evaluated predictions at patient level."}, {"label": "Outcome", "text": "Completed the thesis with an A, examining data leakage, uncertainty and generalisation."}, {"label": "Publication", "text": "Preparing a paper for submission to a suitable conference."}],
      details: [{"label": "From images to estimates", "text": "My work covered the pipeline from raw lung CT images to estimates of mucus plug burden, including model training and comparison."}, {"label": "Evaluation", "text": "I used fivefold cross-validation and evaluated predictions at patient level. The research examined data leakage, uncertainty and generalisation."}, {"label": "Research outcome", "text": "The completed thesis received an A. The card image is an AI-generated illustration, not a patient scan or a model result."}, {"label": "Publication in progress", "text": "A paper based on the thesis is being prepared for submission to a suitable conference."}],
      detailLabel: "Read research details",
      image: { src: '/images/projects/lung-ct-illustration.png', alt: 'AI-generated illustration inspired by lung CT imaging', width: 1536, height: 1024, caption: 'AI-generated illustration of Lung CT images', fit: 'artwork' },
      category: 'Master’s thesis',
      description: 'For my master’s thesis, I built a pipeline from raw lung CT images to estimates of mucus plug burden. I compared CNN models using fivefold cross-validation, evaluated predictions at patient level, and examined data leakage, uncertainty and generalisation. The thesis received an A. A paper based on the thesis is being prepared for submission to a suitable conference.',
      status: 'Completed',
      tags: ['Python', 'PyTorch', 'Computer vision', 'Research', 'Cross-validation', 'Data pipelines', 'Model evaluation'],
    },
    {
      title: 'Personal Performance Intelligence',
      summary: [{"label": "Purpose", "text": "Bring my training, nutrition and tennis records together for analysis."}, {"label": "Implemented", "text": "Strava activity sync, Lifesum imports, tennis records, authenticated access and reports traceable to their source."}, {"label": "In progress", "text": "Developing the analysis and handling missing data."}],
      details: [{"label": "Data imports", "text": "Strava activity sync, Lifesum file imports and tennis records bring different sources into the platform."}, {"label": "Access and reporting", "text": "Authenticated access protects the records. Descriptive reports can be traced back to their source data."}, {"label": "Continuing development", "text": "I’m developing the analysis with attention to missing data and what the available records can support. The screenshot shows the overview design."}],
      detailLabel: "View project details",
      image: { src: '/images/projects/personal-performance-overview.png', alt: 'Personal Performance Intelligence overview design showing training, tennis, nutrition and activity summaries', width: 2880, height: 1800, caption: 'Overview design — training, nutrition and tennis in one place.' },
      category: 'Personal project',
      description: 'I’m building a platform around my own interests in training, nutrition and tennis. It brings together Strava activity sync, Lifesum file imports and tennis records, with authenticated access and descriptive reports that can be traced back to their source. I’m continuing to develop the analysis, with particular attention to missing data and what the results can support.',
      status: 'In progress',
      tags: ['Next.js', 'PostgreSQL', 'Python', 'Supabase', 'API integration', 'Authentication'],
    },
    {
      title: 'AL-TAWFIQ Trading Group',
      summary: [{"label": "Purpose", "text": "Present the company’s information in English and Arabic."}, {"label": "My contribution", "text": "Built the website with layouts that work in both reading directions."}, {"label": "Delivered", "text": "The public website is live."}],
      details: [{"label": "Bilingual development", "text": "I built English and Arabic versions of the website, with left-to-right and right-to-left layouts."}, {"label": "Interface", "text": "Responsive layouts and navigation support the company’s content across screen sizes. Use the language buttons to compare the homepage designs."}],
      detailLabel: "View project details",
      alternateImage: {"src": "/images/projects/altawfiq-ar.png", "alt": "Arabic homepage of the AL-TAWFIQ website", "label": "Arabic"},
      image: { src: '/images/projects/altawfiq-en.png', alt: 'English homepage of the AL-TAWFIQ website I developed', width: 1440, height: 960, caption: 'English and Arabic web development' },
      category: 'Client work',
      description: 'I built the company’s website in English and Arabic, including layouts that work in both reading directions. The public site is live.',
      status: 'Completed',
      tags: ['Next.js', 'TypeScript', 'Arabic / English', 'Client collaboration', 'Responsive design', 'RTL layouts'],
    },
    {
      title: 'Energy & weather insights',
      summary: [{"label": "Purpose", "text": "Explore energy production, consumption and weather across Norway’s five electricity price areas."}, {"label": "My contribution", "text": "Built a Next.js and FastAPI dashboard with Elhub and Open-Meteo data, weather-adjusted demand studies and forecast evaluation."}, {"label": "In progress", "text": "Continuing to develop the analysis and interface, with new demand profiles, anomaly studies and forecast reliability views."}],
      details: [{"label": "Energy and weather", "text": "Explore production, consumption and weather across NO1–NO5, with regional maps, snow drift views, demand peaks and daily profiles for weekdays, weekends and seasons."}, {"label": "Demand studies", "text": "Saved studies examine household demand in relation to weather and calendar effects, flag unusual observations and explore persistent changes. Temporal validation, uncertainty and limitations accompany the results; these are retrospective analyses, not live alerts or causal claims."}, {"label": "Forecast evaluation", "text": "Compare saved benchmarks, forecast errors and interval coverage across regions and horizons. Feature comparisons assess what calendar, demand history and weather add to prediction, alongside reproducible results and exports."}, {"label": "Interface and evidence", "text": "Redesigned the dashboard with light and dark themes, simpler navigation, charts first and expandable methods. Data sources, coverage, freshness, accessible tables and downloads make the evidence inspectable."}, {"label": "Continuing development", "text": "I’m continuing to refine the statistical analysis and user experience in the Next.js and FastAPI application."}],
      detailLabel: "View analysis details",
      url: 'https://norwegian-energy-dashboard.vercel.app',
      image: { src: '/images/projects/energy-weather-dashboard.png', alt: 'Energy overview dashboard showing Norwegian production, consumption, regional price areas and supply and demand trends', width: 2880, height: 1626, caption: 'Energy overview across Norway’s regions' },
      category: 'Data analysis',
      description: 'I’m developing a Norwegian energy and weather dashboard with Next.js and FastAPI, combining Elhub and Open-Meteo data across five electricity price areas. It includes weather-adjusted demand studies, daily profiles, peaks, anomaly and change analysis, and forecast reliability and feature comparisons. The redesigned interface brings charts, uncertainty, data coverage and reproducible evidence together, with further analysis and interface improvements in progress.',
      status: 'In progress',
      tags: ['Next.js', 'FastAPI', 'Python', 'Time series', 'Statistical modelling', 'Forecast evaluation', 'Visualisation', 'Data validation'],
    },
    {
      title: 'Morrise Marine Service',
      summary: [{"label": "Purpose", "text": "Organise a maritime company’s information and services into clear pages."}, {"label": "My contribution", "text": "Built the website, including page layout and navigation."}, {"label": "Delivered", "text": "The website is complete."}],
      details: [{"label": "Client website", "text": "I built the site for a maritime business, organising company information and services into clear pages."}, {"label": "Delivery", "text": "The completed website brings together the company’s information and services with clear page layouts and navigation."}],
      detailLabel: "View project details",
      image: { src: '/images/projects/morrise-marine-service.png', alt: 'Morrise Marine Service homepage showing a cargo ship and maritime services', width: 2880, height: 1616, caption: 'Completed maritime client website' },
      category: 'Client work',
      description: 'I built a website for a maritime business, organising its company information and services into clear pages with straightforward navigation. The website is complete.',
      status: 'Completed',
      tags: ['React', 'Next.js', 'TypeScript', 'Web development', 'Information architecture', 'Responsive design'],
    },
    {
      title: 'ISP customer & operations platform',
      summary: [{"label": "Current stage", "text": "System architecture and infrastructure integration planning."}],
      details: [{"label": "Customer portal", "text": "Planned: secure login, package changes, usage tracking, payments and invoices, and renewal, payment and usage notifications."}, {"label": "Administration", "text": "Planned: customer, subscription, package and payment management, service status, role-based access and reporting."}, {"label": "Network integration", "text": "Planned: provisioning, bandwidth limits, quotas, subscription expiry and service restrictions through PPPoE, RADIUS or router APIs."}],
      detailLabel: "View planned functionality",
      tagsLabel: "Planned technologies",
      category: 'Client work',
      description: 'I’m designing a customer and operations platform for a company’s internet services. It will bring subscriptions, usage, billing and service administration into one system.',
      status: 'In progress',
      tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Authentication & authorization', 'Backend APIs', 'Network integration', 'System architecture'],
    },
    {
      title: 'Automated KPI reporting',
      summary: [{"label": "Purpose", "text": "Replace a manual process for preparing KPI status reports."}, {"label": "My contribution", "text": "Built an LLM workflow, defined KPIs, prompts and input rules, and checked the output for consistency and clarity."}],
      details: [{"label": "Workflow", "text": "The language-model workflow extracts and organises information for KPI status reports."}, {"label": "My contribution", "text": "I defined the KPIs, prompts and input rules, then checked the generated output for consistency and clarity."}, {"label": "Outcome", "text": "Delivered a workflow to replace the manual reporting process."}],
      detailLabel: "View workflow details",
      category: 'Report automation',
      description: 'I built a language-model workflow to extract and organise information for KPI status reports, replacing a manual reporting process. I defined the KPIs, prompts and input rules, then checked the output for consistency and clarity.',
      status: 'Completed',
      tags: ['LLMs', 'Automation', 'Reporting', 'Prompt design', 'Information extraction', 'Quality assurance'],
    },
    {
      title: 'Liver cirrhosis risk modelling',
      summary: [{"label": "Purpose", "text": "Explore liver cirrhosis risk using structured patient data."}, {"label": "My contribution", "text": "Cleaned the data, engineered features, and developed and evaluated predictive models."}],
      details: [{"label": "Preparation", "text": "My work covered cleaning structured patient data and engineering features for predictive modelling."}, {"label": "Modelling and evaluation", "text": "I used statistical modelling and evaluation to examine how data and model choices affected the reliability of predictions."}],
      detailLabel: "View modelling details",
      category: 'Predictive modelling',
      description: 'I developed a predictive model using structured patient data to explore liver cirrhosis risk. My work covered data cleaning, feature engineering, statistical modelling and evaluation, including how the data and model choices affected the reliability of predictions.',
      status: 'Completed',
      tags: ['Patient data', 'Feature engineering', 'Statistical modelling', 'Model evaluation', 'Data cleaning', 'Predictive modelling'],
    },
    {
      title: 'Digital strategy for Cryos International',
      summary: [{"label": "Team recommendation", "text": "More standardised processes and better integrated systems, weighing cost, risk and scalability."}, {"label": "My contribution", "text": "Coordination, quality checks and presentation of the recommendations."}, {"label": "Outcome", "text": "The team project received an A."}],
      details: [{"label": "Team analysis", "text": "In a team of four, I analysed digital maturity, processes and systems."}, {"label": "Recommendation", "text": "We proposed more standardised ways of working and better integrated data, considering business needs, cost, risk and scalability."}, {"label": "My contribution", "text": "I contributed to coordination, quality checks and presenting our recommendations. The project received an A."}],
      detailLabel: "View strategy details",
      category: 'Academic team project',
      description: 'In a team of four, I analysed Cryos International’s digital maturity, processes and systems. We proposed more standardised ways of working and better integrated data, weighing business needs against cost, risk and scalability. I contributed to coordination, quality checks and presenting our recommendations. The project received an A.',
      status: 'Completed',
      tags: ['Business Analytics', 'Enterprise architecture', 'Process improvement', 'Teamwork', 'Digital maturity assessment', 'Systems integration', 'Stakeholder communication'],
    },
  ] as Project[],
};

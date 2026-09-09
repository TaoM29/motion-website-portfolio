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
  introduction: 'I’m a data scientist with an MSc from NMBU. I work on machine learning, data tools, and websites — and enjoy working with the people who use them.',
  about: 'I like being involved from the first question to the finished result. That has taken me from analysing lung CT scans for my master’s thesis to building websites for clients. I enjoy the technical detail, but also the conversations that help me understand what someone needs.',
  background: 'I completed a five-year MSc in Data Science at NMBU (2021–2026), specialising in Business Analytics. My master’s thesis explored predictions from lung CT scans and received an A. Alongside my studies, work in healthcare and hospitality taught me to collaborate, communicate clearly, and stay calm when things get busy.',
  skills: [
    { name: 'Data science & machine learning', description: 'Python, R, PyTorch, scikit-learn, computer vision, and model validation.' },
    { name: 'Data platforms & analysis', description: 'SQL, PostgreSQL, Supabase, data pipelines, time series, and Streamlit.' },
    { name: 'Software & applied AI', description: 'TypeScript, React, Next.js, API integrations, and AI-assisted development.' },
    { name: 'How I work', description: 'Understanding requirements, checking data quality, keeping analyses reproducible, and explaining the results.' },
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
      category: 'Master’s thesis, 2026',
      description: 'For my master’s thesis, I trained and compared models that estimate mucus plug burden from lung CT images. I evaluated predictions at patient level and checked for data leakage. The thesis received an A.',
      status: 'Completed',
      tags: ['Python', 'PyTorch', 'Computer vision', 'Research'],
    },
    {
      title: 'Personal Performance Intelligence',
      category: 'Personal project',
      description: 'I’m building a place to bring training, nutrition, and tennis records together. So far, the work includes Strava activity sync, data imports, and descriptive reports that can be traced back to their source. The analysis side is still developing.',
      status: 'In progress',
      tags: ['Next.js', 'PostgreSQL', 'Python', 'Supabase'],
    },
    {
      title: 'AL-TAWFIQ Trading Group',
      category: 'Client work',
      description: 'I built the company’s website in English and Arabic, including layouts that work in both reading directions. The public site is live. I’m continuing to work on customer data and subscriptions as part of the same project.',
      status: 'In progress',
      tags: ['Next.js', 'TypeScript', 'Arabic / English', 'Client collaboration'],
    },
    {
      title: 'Energy & weather insights',
      category: 'Data analysis, 2025',
      description: 'I brought energy and weather data together in a Streamlit app, from collecting and checking the data to presenting the results. I explored seasonal patterns, forecasts, and the relationship between weather and energy use.',
      status: 'Completed',
      tags: ['Streamlit', 'Time series', 'Forecasting', 'Visualisation'],
    },
    {
      title: 'Morris Marine',
      category: 'Client work',
      description: 'I’m making a website for a maritime business, organising its company information and services into clear pages. The layout and navigation are implemented, and I’m still working on the site before launch.',
      status: 'In progress',
      tags: ['React', 'Next.js', 'TypeScript', 'Web development'],
    },
    {
      title: 'Automated KPI reporting',
      category: 'Report automation',
      description: 'I’m using a language model to help turn information into consistent KPI reports. Much of the work is in defining what should go into each report and checking that the output is reliable.',
      status: 'In progress',
      tags: ['LLMs', 'Automation', 'Reporting'],
    },
  ] as Project[],
};

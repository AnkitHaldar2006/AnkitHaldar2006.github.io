/**
 * Portfolio Data Model for Ankit Haldar
 * BCA Student & Aspiring Data Scientist
 */

const PORTFOLIO_DATA = {
  profile: {
    name: 'Ankit Haldar',
    title: 'Aspiring Data Scientist & BCA Student',
    eyebrow: 'Data Science & ML Enthusiast',
    bio: "I'm Ankit Haldar, an aspiring data scientist currently pursuing my Bachelor of Computer Applications (BCA) at Techno College Hooghly (2025–2035, Freshman). I analyze datasets, build machine learning models, and explore how data tells meaningful stories to drive smart decisions. From exploratory data analysis to predictive modeling, I solve problems with precision, mathematics, and code.",
    basedIn: 'Kolkata, India',
    degree: 'BCA (Techno College Hooghly, 2025–2035)',
    focus: 'Data Science & Machine Learning',
    availability: 'Worldwide / Remote',
    email: 'haldarankit2006@gmail.com',
    github: 'https://github.com/AnkitHaldar2006',
    linkedin: 'https://www.linkedin.com/in/ankit-haldar-77b823373/',
    kaggle: 'https://kaggle.com'
  },
  projects: [
    {
      id: '01',
      title: 'Editorial Portfolio Website',
      category: 'Web Development & UI/UX',
      subtitle: 'High-performance responsive portfolio with editorial typography',
      description: 'Modern, fully responsive personal portfolio designed to showcase technical skills, data projects, and achievements with high-performance animations and editorial styling.',
      image: 'assets/images/project1.png',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX'],
      metrics: {
        performance: '100% Score',
        responsiveness: 'All Devices',
        architecture: 'Vanilla JS/CSS'
      },
      details: 'Engineered from scratch using modern semantic HTML5, CSS3 styling systems, and vanilla JavaScript for smooth animations and responsive layouts without bloated dependencies.'
    },
    {
      id: '02',
      title: 'Data Analysis with Python',
      category: 'Data Science & Analytics',
      subtitle: 'Exploratory data analysis, statistical evaluation & visual storytelling',
      description: 'Comprehensive exploratory data analysis (EDA) pipeline utilizing Pandas, NumPy, and Matplotlib to extract statistical insights and uncover hidden data patterns.',
      image: 'assets/images/project2.png',
      tags: ['Python', 'Pandas', 'Matplotlib', 'NumPy', 'Data Analysis'],
      metrics: {
        recordsAnalyzed: '50K+ Rows',
        visualizations: '25+ Plots',
        methodology: 'EDA & Stats'
      },
      details: 'Conducted systematic exploratory data analysis on real-world datasets. The pipeline implements data cleaning, missing value imputation, outlier detection, distribution analysis, correlation heatmaps, and statistical visualization to support data-driven decisions.'
    },
    {
      id: '03',
      title: 'C++ Logic & Console Engine',
      category: 'C++ & Object-Oriented Programming',
      subtitle: 'Modular console-based game engines & algorithmic puzzle systems',
      description: 'Collection of structured console-based interactive applications and mini-games engineered in C++ to master Object-Oriented Programming (OOP) and algorithmic problem-solving.',
      image: 'assets/images/project3.png',
      tags: ['C++', 'OOP', 'Data Structures', 'Algorithms', 'Logic Building'],
      metrics: {
        standard: 'C++17 / C++20',
        architecture: 'Modular OOP',
        latency: '< 5ms Response'
      },
      details: 'Engineered object-oriented game loops, input validation systems, and state machines in modern C++. Implemented core OOP paradigms including encapsulation, inheritance, and polymorphism to ensure robust logic building and high memory efficiency.'
    }
  ],
  skills: [
    { name: 'Python', icon: 'python' },
    { name: 'C & C++', icon: 'code' },
    { name: 'Pandas & NumPy', icon: 'database' },
    { name: 'Matplotlib & Scikit-learn', icon: 'graph' },
    { name: 'Data Analysis & EDA', icon: 'chart' },
    { name: 'Machine Learning', icon: 'brain' },
    { name: 'Git & GitHub', icon: 'git' },
    { name: 'VS Code & Jupyter', icon: 'layers' }
  ],
  education: [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Techno College Hooghly',
      timeline: '2025 – 2035',
      location: 'Hooghly, West Bengal, India'
    }
  ],
  certifications: [
    {
      name: 'Python for Everybody',
      issuer: 'Coursera / University of Michigan',
      status: 'Pursuing — In Progress'
    },
    {
      name: 'Data Science Foundations',
      issuer: 'NPTEL / IIT',
      status: 'Upcoming — Enrolling Soon'
    },
    {
      name: 'Introduction to Machine Learning',
      issuer: 'Google / Kaggle',
      status: 'Upcoming — Planned'
    },
    {
      name: 'Web Development Bootcamp',
      issuer: 'Udemy',
      status: 'In Progress'
    }
  ]
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;

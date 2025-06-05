import React, {useEffect, useState} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import publicApi from '../api';
import MenuBar from './MenuBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { differenceInMonths} from 'date-fns';
import { FaArrowLeft, FaShareAlt, FaLightbulb, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaRuler, FaDollarSign, FaUserTie, FaBuilding, FaUser, FaChevronDown } from 'react-icons/fa';

function ProjectDetails() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedChallenges, setExpandedChallenges] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [activePage, setActivePage] = useState('');
    const [allProjects, setAllProjects] = useState([])

    useEffect(() => {
    const fetchAll = async () => {
        try {
        const { data } = await publicApi.get('/projects/')
        setAllProjects(data)
        } catch (err) { console.error(err) }
    }
    fetchAll()
    }, [])

    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await publicApi.get(`/projects/${id}/`);
                if (response.status === 200) {
                    setProject(response.data);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [id]);

    
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!project) {
        return <div className="text-center py-20">Loading...</div>;
    }
    const similarProjects = allProjects.filter(
        p => p.category === project.category && p.id !== project.id
    )



    const formatDuration = (start,end) =>{
        const months = differenceInMonths(new Date(end), new Date(start));
        const years = Math.floor(months / 12);
        const rem = months % 12;
        return[
            years?`${years} year${years > 1 ? 's' : ''}` : null,
            rem?`${rem} month${rem > 1 ? 's' : ''}` : null,
        ].filter(Boolean).join(" ") || '0 months';
    }

    const toggleChallenge = idx =>{
        setExpandedChallenges(prev => 
            prev.includes(idx) 
                ? prev.filter(i => i !== idx) 
                : [...prev, idx]
        );
    }

    const specs = [
        {icon: FaRuler, label: 'Project Size', value: project.project_size},
        {icon: FaDollarSign, label: 'Budget', value: `$${project.budget}`},
        {icon:FaCalendarAlt, label:'Timeline', value:`${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.completion_date).toLocaleDateString()}`},
        {icon: FaUser, label: 'Client', value: project.client_name},
        {icon: FaMapMarkerAlt, label: 'Location', value: project.location},
        {icon: FaBuilding, label:'Category', value:project.category.charAt(0).toUpperCase() + project.category.slice(1)},

    ]

  return (
    <div className='min-h-screen font-sans text-gray-800'>
        <MenuBar
            isScrolled={scrolled}
            activePage={activePage}
            setActivePage={setActivePage}
            setIsQuoteModalOpen={() => {}}
            setIsContactModalOpen={() => {}}
        />
        <main>
            
            <section className="pt-20 relative h-screen">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                    src={project.main_image}
                    alt={project.title}
                    className="w-full h-auto md:h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
                    <div className="max-w-3xl text-white">
                    <span className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        {project.title}
                    </h1>
                    <div className="flex flex-wrap items-center text-lg mb-6">
                        <div className="flex items-center mr-8 mb-2">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{project.location}</span>
                        </div>
                        <div className="flex items-center mr-8 mb-2">
                            <FaCalendarAlt className="mr-2" />
                            <span>
                                Completed: {new Date(project.completion_date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaClock className="mr-2" />
                            <span>
                                Duration: {formatDuration(project.start_date, project.completion_date)}
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            <section className="sticky top-16 bg-white shadow-md z-40">
                <div className="container mx-auto px-6">
                    <div className="flex overflow-x-auto py-4 no-scrollbar">
                    {['overview','phases','gallery','challenges'].map(tab => (
                        <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`!rounded-button px-6 py-2 mr-4 whitespace-nowrap font-medium cursor-pointer ${
                            activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                        >
                        {tab.charAt(0).toUpperCase()+tab.slice(1)}
                        </button>
                    ))}
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-6 py-12">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left two-thirds: dynamic overview text */}
                        <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                        <div className="prose prose-lg max-w-none mb-8">
                            {/* If you want to split paragraphs, you can .split('\n').map(...) */}
                            {(()=>{
                                const sentences = project.overview
                                    ? project.overview.match(/[^.!?]+[.!?]*/g)
                                    : [];
                                const paragraphs = [];
                                for (let i = 0; i<(sentences? sentences.length : 0); i+=2) {
                                    paragraphs.push(
                                        (sentences[i] || '') + (sentences[i + 1]? " " +sentences[i + 1] : '')
                                    );
                                }
                                return paragraphs.map((paragraph, index) => (
                                    <p key ={index} className="text-gray-700 mb-10">
                                        {paragraph.trim()}                              
                                    </p>
                                ));

                            })()}
                        </div>
                        </div>

                        {/* Right one-third: dynamic specs */}
                        <div className="lg:col-span-1 bg-gray-50 p-8 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Project Specifications</h3>
                        <div className="space-y-4">
                            {specs.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <Icon className="text-blue-600" />
                                </div>
                                <div className="ml-4">
                                <h4 className="font-medium text-gray-900">{label}</h4>
                                <p className="text-gray-600">{value}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                )}
                {/* Construction Phases Tab */}
                {activeTab === 'phases' && (
                <div>
                    <h2 className="text-3xl font-bold mb-8">Construction Phases</h2>
                    <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 hidden md:block"></div>
                    
                    {/* Phases */}
                    <div className="space-y-12">
                        {project.phases.map((phase, index) => (
                        <div key={index} className="flex flex-col md:flex-row">
                            <div className="md:w-64 flex-shrink-0 mb-4 md:mb-0">
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-md z-10 flex items-center justify-center">
                                <span className="text-blue-600 font-bold">{index + 1}</span>
                                </div>
                                <div className="ml-4">
                                <h3 className="font-bold text-xl">{phase.title}</h3>
                                {/* if you have a duration field, uncomment: */}
                                {/* <p className="text-gray-600">{phase.duration}</p> */}
                                </div>
                            </div>
                            </div>
                            <div className="md:ml-12 bg-white rounded-lg shadow-sm p-6 flex-grow">
                            {/* if you have a status field, uncomment: */}
                            {/*
                            <div className="flex items-center mb-4">
                                <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    phase.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                                >
                                {phase.status === 'completed' ? 'Completed' : 'In Progress'}
                                </span>
                            </div>
                            */}
                            <p className="text-gray-700">{phase.description}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                )}
                {/* Project Gallery Tab */}
                {activeTab === 'gallery' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Project Gallery</h2>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.gallery.map((img, idx) => (
                            <div
                            key={idx}
                            className="group relative overflow-hidden rounded-lg shadow-md bg-white"
                            >
                            <div className="h-64 overflow-hidden">
                                <img
                                src={img.image}
                                alt={`Gallery image ${idx + 1}`}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                {img.caption && (
                                <p className="text-white text-lg mb-4">
                                    {img.caption}
                                </p>
                                )}
                                <button
                                onClick={() => window.open(img.image, '_blank')}
                                className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                                >
                                View Full Size
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                {/* Challenges & Solutions Tab */}
                {activeTab === 'challenges' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Challenges & Solutions</h2>
                        <div className="space-y-6">
                        {project.challenges.map((challenge, index) => (
                            <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                            >
                            <button
                                onClick={() => toggleChallenge(index)}
                                className="!rounded-button whitespace-nowrap w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            >
                                <h3 className="text-xl font-bold">{challenge.title}</h3>
                                <FaChevronDown
                                className={`text-blue-600 transform transition-transform ${
                                    expandedChallenges.includes(index) ? 'rotate-180' : ''
                                }`}
                                />
                            </button>

                            {expandedChallenges.includes(index) && (
                                <div className="px-6 py-4 border-t border-gray-100">
                                <p className="text-gray-700 mb-4">{challenge.description}</p>
                                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                    <div className="flex items-start">
                                    <FaLightbulb className="text-green-600 flex-shrink-0 mt-1 mr-3" />
                                    <div>
                                        <p className="text-green-700 font-medium">Solution</p>
                                        <p className="text-green-600">{challenge.solution}</p>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                )}

            </div>
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8">Similar Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {similarProjects.map(proj => (
                        <div
                        key={proj.id}
                        className="group relative overflow-hidden rounded-lg shadow-lg bg-white transition-transform duration-300 hover:-translate-y-2"
                        >
                        <div className="h-56 overflow-hidden">
                            <img
                            src={proj.main_image}
                            alt={proj.title}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white text-2xl font-bold">{proj.title}</h3>
                            <p className="text-blue-200 mb-2">
                            {proj.category.charAt(0).toUpperCase() + proj.category.slice(1)}
                            </p>
                            <div className="flex justify-between text-white text-sm mt-2">
                            <span>
                                <FaMapMarkerAlt className="mr-2" />
                                {proj.location}
                            </span>
                            <span>
                                <FaClock className="mr-2" />
                                {formatDuration(proj.start_date, proj.completion_date)}
                            </span>
                            </div>
                            <Link
                                to={`/projects/${proj.id}`}
                                className="!rounded-button whitespace-nowrap mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors inline-block cursor-pointer"
                            >
                            View Project
                            </Link>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                            <p className="text-blue-600 text-sm uppercase tracking-wider mb-2">
                            {proj.category.charAt(0).toUpperCase() + proj.category.slice(1)}
                            </p>
                            <div className="flex justify-between text-gray-500 text-sm">
                            <span>
                                <FaMapMarkerAlt className="mr-2" />
                                {proj.location}
                            </span>
                            <span>
                                <FaClock className="mr-2" />
                                {formatDuration(proj.start_date, proj.completion_date)}
                            </span>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
            
            
        </main>
        <Footer setActivePage={setActivePage} setIsContactModalOpen={() => {}} />
        <ScrollToTop />

    </div>
  )
}

export default ProjectDetails
import React, {useState, useEffect} from 'react'
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer';
import QuoteModal from '../components/QuoteModal';
import ContactModal from '../components/ContactModal';
import ScrollToTop from '../components/ScrollToTop';
import publicApi from '../api';
import {GiStarMedal, GiLightBulb, GiTeamIdea} from 'react-icons/gi';
import { FaHandshake } from "react-icons/fa";
import aboutus from '../assets/aboutus.png';
import bckimgabout from '../assets/bckimgabout.jpg';
import ourapproach from '../assets/ourapproach.jpg';

function About() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [scrolled, setScrolled]               = useState(false);
    const [activePage, setActivePage]           = useState('about');
    const [quoteModalOpen, setQuoteModalOpen]   = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [quoteSent, setQuoteSent] = useState(false)
    const [quote, setQuote] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        location: '',
        budget: '',
        description: '',
    })
    const handleQuoteChange = e => {
        const { name, value } = e.target;
        setQuote(prev => ({ ...prev, [name]: value }));
    };

    
    const handleQuoteSuccess = () => {
        setQuoteSent(true);
    };
    const handleQuoteClose = () => {
        setQuoteModalOpen(false);
        setQuoteSent(false);
        setQuote({
        name: '', email: '', phone: '', projectType: '',
        location: '', budget: '', description: ''
        });
    };
    const [messageSent, setMessageSent] = useState(false)
    const [contact, setContact] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
    const handleContactChange = e => setContact({ ...contact, [e.target.name]: e.target.value })
    const handleContactSuccess = () => {
        setMessageSent(true);
    };

    // When the parent closes the modal, reset that “thank you” state:
    const handleContactClose = () => {
        setContactModalOpen(false);
        setMessageSent(false);
        setContact({ name: '', email: '', phone: '', subject: '', message: '' });
    };
        
    useEffect(() => {
            const onScroll = () => setScrolled(window.scrollY > 50);
            window.addEventListener('scroll', onScroll);
            return () => window.removeEventListener('scroll', onScroll);
        }, []);
    useEffect(() => {
        const fetchTeam = async () => {
        try {
            const { data } = await publicApi.get('/team/');
            setTeamMembers(data);
        } catch (err) {
            console.error('Error fetching team members:', err);
        }
        };
        fetchTeam();
    }, []);
  return (
    <div className='min-h-screen font-sans text-gray-900'>
        <MenuBar
            isScrolled={scrolled}
            activePage={activePage}
            setActivePage={setActivePage}
            setIsQuoteModalOpen={setQuoteModalOpen}
            setIsContactModalOpen={setContactModalOpen}
        />
        <section className="relative pt-32 pb-20 bg-blue-900 text-white">
            <div className="absolute inset-0 opacity-20">
            <img
                src={bckimgabout}
                alt="About Samthafs"
                className="w-full h-full object-cover object-top"
            />
            </div>
            <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
                <h1 className="text-5xl font-bold mb-6">About Samthafs</h1>
                <p className="text-xl mb-8">Building excellence through innovation, integrity, and exceptional craftsmanship since 2005.</p>
            </div>
            </div>
        </section>
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                <img 
                    src={aboutus} 
                    alt="Our Story" 
                    className="rounded-lg shadow-xl w-full h-auto"
                />
                </div>
                <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Founded in 2005 by Samson Oluwole, Samthafs began with a vision to create a construction company that would set new standards for quality, innovation, and client satisfaction in the industry.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                    Starting with a small team of dedicated professionals, we quickly established a reputation for excellence in the commercial construction sector. As our portfolio grew, so did our capabilities, expanding into residential and industrial construction.
                </p>
                <p className="text-lg text-gray-600">
                    Today, with over 150 team members and more than 250 successful projects completed, Samthafs stands as a leader in the construction industry, known for our unwavering commitment to quality, innovative solutions, and client-focused approach.
                </p>
                </div>
            </div>
            </div>
        </section>
              
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide every project we undertake and every relationship we build.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                    <GiStarMedal className='text-5xl'/>
                </div>
                <h3 className="text-xl font-bold mb-4">Excellence</h3>
                <p className="text-gray-600">We are committed to delivering the highest standards of quality in every aspect of our work, from planning to execution.</p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                    <GiLightBulb className='text-5xl'/>
                </div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p className="text-gray-600">We continuously seek innovative solutions and embrace new technologies to enhance our construction processes and outcomes.</p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                    <FaHandshake className='text-5xl'/>
                </div>
                <h3 className="text-xl font-bold mb-4">Integrity</h3>
                <p className="text-gray-600">We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners.</p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                    <GiTeamIdea className='text-5xl'/>
                </div>
                <h3 className="text-xl font-bold mb-4">Collaboration</h3>
                <p className="text-gray-600">We believe in the power of teamwork and foster strong relationships with clients, partners, and communities.</p>
                </div>
            </div>
            </div>
        </section>
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Leadership Team</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the experienced professionals who guide our company’s vision and operations.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map(member => (
                <div
                    key={member.id}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="h-80 overflow-hidden">
                    {/* use the `image` field directly */}
                    <img
                        src={member.image}
                        alt={member.full_name}
                        className="w-full h-full object-cover object-top"
                    />
                    </div>
                    <div className="p-6">
                    {/* map fields exactly */}
                    <h3 className="text-xl font-bold mb-1">{member.full_name}</h3>
                    <p className="text-blue-600 text-sm uppercase tracking-wider mb-4">
                        {member.role}
                    </p>
                    <p className="text-gray-600">{member.description}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-6">Our Approach</h2>
                <p className="text-lg text-gray-600 mb-6">
                    At Samthafs, we believe that successful construction projects begin with a deep understanding of our clients' vision and objectives. Our client-centered approach ensures that every project we undertake is tailored to meet specific needs and expectations.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                    We combine technical expertise with creative problem-solving to overcome challenges and deliver innovative solutions. Our integrated team of architects, engineers, and construction professionals works collaboratively throughout the project lifecycle.
                </p>
                <p className="text-lg text-gray-600">
                    Quality control is embedded in every phase of our process, with rigorous standards and regular inspections ensuring that the final result exceeds expectations. We are committed to sustainable practices and incorporate eco-friendly solutions whenever possible.
                </p>
                </div>
                <div className="lg:w-1/2">
                <img 
                    src={ourapproach}
                    alt="Our Approach" 
                    className="rounded-lg shadow-xl w-full h-auto"
                />
                </div>
            </div>
            </div>
        </section>
        <section className="py-20 bg-blue-600 text-white">
            <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
                <p className="text-xl mb-8">We're always looking for talented professionals who share our passion for excellence in construction. Explore career opportunities with Samthafs.</p>
                <button
                    onClick={() => setContactModalOpen(true)}
                    className="!rounded-button whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold transition-colors inline-block cursor-pointer">
                    Contact Us About Careers
                </button>
            </div>
            </div>
        </section>




        <Footer
            setActivePage={setActivePage}
            setIsContactModalOpen={setContactModalOpen}
        />
        <ContactModal
            isOpen={contactModalOpen}
            onClose={handleContactClose}
            formData={contact}
            onChange={handleContactChange}
            onSuccess={handleContactSuccess}
            isMessageSent={messageSent}
        />
        <QuoteModal
            isOpen={quoteModalOpen}
            onClose={handleQuoteClose}
            formData={quote}
            onChange={handleQuoteChange}
            onSuccess={handleQuoteSuccess}
            isQuoteSent={quoteSent}
        />
        
        <ScrollToTop />

    </div>
  )
}

export default About
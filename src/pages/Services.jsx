import React, {useState, useEffect} from 'react'
import publicApi from '../api';
import { services } from '../constants';
import { FaCheck, FaUser, FaQuoteLeft } from 'react-icons/fa'
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer';
import QuoteModal from '../components/QuoteModal';
import ContactModal from '../components/ContactModal';
import ScrollToTop from '../components/ScrollToTop';
import servicesimg from '../assets/servicesimg.png'; // Assuming you have a services image


function Services() {
    const [testimonials, setTestimonials] = useState([]);
    const [scrolled, setScrolled]               = useState(false);
    const [activePage, setActivePage]           = useState('services');
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
    const handleQuoteChange = (e) => {
        const { name, value } = e.target;
        setQuote((prev) => ({ ...prev, [name]: value }));
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

    // Called by ContactModal when the user successfully sends
    const handleContactSuccess = () => {
        setIsMessageSent(true);
    };

    // When the parent closes the modal, reset that “thank you” state:
    const handleContactClose = () => {
        setContactModalOpen(false);
        setMessageSent(false);
        setContact({ name: '', email: '', phone: '', subject: '', message: '' });
    };
    

    

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await publicApi.get("/testimonials/");
                if (response.status === 200) {
                    setTestimonials(response.data);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };
        fetchTestimonials();
    }, []);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
  return (
    <div className="min-h-screen font-sans text-gray-800">
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
                src={servicesimg}
                alt="Construction services"
                className="w-full h-full object-cover object-top"
            />
            </div>
            <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
                <h1 className="text-5xl font-bold mb-6">Our Construction Services</h1>
                <p className="text-xl mb-8">Comprehensive construction solutions delivered with excellence, innovation, and unwavering commitment to quality.</p>
            </div>
            </div>
        </section>
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Comprehensive Construction Solutions</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    From concept to completion, we offer a full range of construction services tailored to your specific needs and vision.
                </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {services.map(service => (
                    <div
                    key={service.id}
                    className="flex flex-col md:flex-row gap-8 bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                    <div className="md:w-2/5 overflow-hidden">
                        <img 
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="md:w-3/5 p-8">
                        <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                            <service.Icon className="text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                            <FaCheck className="text-blue-600 mt-1 mr-3" />
                            <span>{feature}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Construction Process</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">A systematic approach that ensures efficiency, quality, and client satisfaction at every stage of your project.</p>
            </div>
            
            <div className="relative">
                {/* Process Timeline */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
                
                <div className="space-y-12">
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Initial Consultation</h3>
                    <p className="text-gray-600">We begin by understanding your vision, requirements, and objectives through detailed discussions and site visits.</p>
                    </div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">1</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12"></div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">2</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Planning & Design</h3>
                    <p className="text-gray-600">Our architects and engineers develop detailed plans and designs that align with your goals while optimizing functionality and aesthetics.</p>
                    </div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Pre-Construction</h3>
                    <p className="text-gray-600">We handle permits, establish timelines, secure materials, and prepare the site to ensure a smooth construction process.</p>
                    </div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">3</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12"></div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">4</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Construction</h3>
                    <p className="text-gray-600">Our skilled teams execute the project with precision, adhering to the highest standards of quality and safety throughout the build.</p>
                    </div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Quality Assurance</h3>
                    <p className="text-gray-600">Rigorous inspections and quality control measures are implemented at every stage to ensure excellence in execution.</p>
                    </div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">5</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12"></div>
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white z-10 mx-auto mb-8 md:mb-0">
                    <span className="font-bold">6</span>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                    <h3 className="text-2xl font-bold mb-3">Project Completion</h3>
                    <p className="text-gray-600">Final inspections, client walkthrough, and handover of your completed project, along with all necessary documentation.</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Hear from those who have experienced the Samthafs difference firsthand.
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md">
                    <div className="text-blue-600 mb-4">
                        <FaQuoteLeft className="inline-block text-2xl" />
                    </div>
                    <p className="text-gray-600 mb-6">"{testimonial.client_testimonial}"</p>
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <FaUser className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                        <h4 className="font-bold">{testimonial.client_name}</h4>
                        <p className="text-sm text-gray-500">
                            Project Completed: {new Date(testimonial.completion_date).toLocaleDateString()}
                        </p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
        <section className="py-20 bg-blue-600 text-white">
            <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">Ready to Discuss Your Project?</h2>
                <p className="text-xl mb-8">Contact us today to schedule a consultation with our expert team and take the first step toward bringing your construction vision to life.</p>
                <button
                onClick={() => setQuoteModalOpen(true)}
                className="!rounded-button whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold transition-colors inline-block cursor-pointer">
                Request a Free Quote
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

export default Services
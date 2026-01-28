import React, { useState, useEffect } from 'react';
import logo from "./assets/logo.png";
import discordIcon from "./assets/discordIcon.jpg";
import instagramIcon from "./assets/instagramIcon.jpg";
import linkedinIcon from "./assets/linkedinIcon.png";
import rubricIcon from "./assets/rubricIcon.png";
import { Menu, X, Users, Calendar, Trophy, MessageSquare, Award, BookOpen, ChevronRight, Sparkles, Zap, Target, ArrowRight, Clock, MapPin, Archive } from 'lucide-react';
import eventsData from './data/events.json';

const isEventPast = (dateString, timeString) => {
    const [month, day, year] = dateString.split(' ').map((part, i) => {
        if (i === 1) return parseInt(part.replace(',', ''));
        if (i === 2) return parseInt(part);
        return part;
    });

    const monthMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const monthIndex = monthMap[month];
    const timeStr = timeString.split(' - ')[0].trim();
    const parts = timeStr.match(/(\d+):(\d+)\s(AM|PM)/);

    if (!parts) return false; // if time format is invalid, assume not past

    let hour = parseInt(parts[1]);
    const minute = parseInt(parts[2]);
    const period = parts[3];

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const eventDate = new Date(year, monthIndex, day, hour, minute);
    const now = new Date();

    return now > eventDate;
};

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {event.image && (
                        <div className="mb-6 rounded-2xl overflow-hidden h-64 md:h-80 bg-gray-100">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" style={{ color: '#812990' }} />
                            <span className="text-gray-700 font-medium">{event.startDate} - {event.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" style={{ color: '#812990' }} />
                            <span className="text-gray-700 font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" style={{ color: '#812990' }} />
                            <span className="text-gray-700 font-medium">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {event.tags && event.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-sm font-medium text-purple-700 bg-purple-100">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About This Event</h3>
                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    </div>

                    {event.whatToExpect && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">What to Expect</h3>
                            <ul className="space-y-2">
                                {event.whatToExpect.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-purple-600 font-bold mt-1">✓</span>
                                        <span className="text-gray-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {event.requirements && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements</h3>
                            <p className="text-gray-600">{event.requirements}</p>
                        </div>
                    )}

                    {!isEventPast(event.endDate, event.time) ? (
                        <button
                            className="w-full px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}
                        >
                            Register Now
                        </button>
                    ) : (
                        <div className="w-full px-6 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 text-center">
                            Event Completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ClubWebsite = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [stats, setStats] = useState({ students: 0, events: 0, community: 0 });
    const [scrolled, setScrolled] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (activeSection === 'home') {
            const targets = { students: 37, events: 7, community: 0 };
            const duration = 2000;
            const steps = 60;
            const interval = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setStats({
                    students: Math.floor(targets.students * progress),
                    events: Math.floor(targets.events * progress),
                    community: Math.floor(targets.community * progress)
                });

                if (currentStep >= steps) {
                    setStats(targets);
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [activeSection]);

    const navigation = [
        { name: 'Home', id: 'home' },
        { name: 'Team', id: 'team' },
        { name: 'Events', id: 'events' },
        { name: 'CTFs', id: 'ctfs' },
        { name: 'Sponsors', id: 'sponsors' },
        { name: 'Getting Started', id: 'started' },
        { name: 'Rubric', id: 'rubric' }
    ];

    const getRankStyle = (rank) => {
        if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
        if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #808080)';
        if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #8B4513)';
        return '#812990';
    };

    const getRankColor = (rank) => {
        if (rank === 1) return '#FFD700';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return '#812990';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex w-full items-center h-16">
                        <div className="flex w-full items-center h-16">
                            <div className="flex items-center space-x-3 flex-shrink-0">
                                <img
                                    src={logo}
                                    alt="WiCyS Logo"
                                    className="h-10 w-auto"
                                />
                                <span className="text-xl font-bold text-white whitespace-nowrap">
                                    WiCyS UAlberta Chapter
                                </span>
                            </div>

                            <div className="hidden lg:flex flex-1 justify-center items-center space-x-8">
                                {navigation.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`text-sm font-medium transition-all duration-300 ${activeSection === item.id
                                            ? "text-white"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="lg:hidden ml-auto">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden bg-gray-800 border-t border-gray-700">
                        <div className="px-4 py-3 space-y-1">
                            {navigation.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === item.id
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {activeSection === 'home' && (
                <div className="pt-16">
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-green-50">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#812990' }}></div>
                            <div className="absolute top-60 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#b7d14f' }}></div>
                        </div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                            <div className="text-center">
                                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 border border-purple-100">
                                    <Sparkles size={16} className="text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">Welcome to the Future of Cybersecurity</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight text-center">
                                    <span className="text-gray-900">Join the</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-green-500 bg-clip-text text-transparent">
                                        WiCyS
                                    </span>
                                    <br />
                                    <span className="text-gray-900">Community</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                                    Join a thriving community of cybersecurity enthusiasts. Learn, compete, and grow with hands-on experiences and industry experts.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        onClick={() => setActiveSection('started')}
                                        className="group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                                        style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <span>Get Started</span>
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('events')}
                                        className="px-8 py-4 rounded-2xl font-semibold bg-white text-gray-900 border-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        style={{ borderColor: '#812990' }}
                                    >
                                        Explore Events
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                                <div className="text-center">
                                    <div className="text-7xl md:text-8xl font-bold mb-4" style={{ color: '#1976d2' }}>
                                        {stats.students}
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-2">High School Students Helped</div>
                                    <p className="text-gray-500">The next generation of cybersecurity professionals</p>
                                </div>

                                <div className="text-center">
                                    <div className="text-7xl md:text-8xl font-bold mb-4" style={{ color: '#1976d2' }}>
                                        {stats.events}
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Events Hosted</div>
                                    <p className="text-gray-500">Workshops, CTFs, and meetups</p>
                                </div>

                                <div className="text-center">
                                    <div className="text-7xl md:text-8xl font-bold mb-4" style={{ color: '#1976d2' }}>
                                        {stats.community}
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Community Members Supported</div>
                                    <p className="text-gray-500">Supporting lifelong learning in our community</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-24 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">What We Offer</h2>
                                <p className="text-xl text-gray-600">Everything you need to excel in cybersecurity</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-auto">
                                <div className="md:col-span-4 md:row-span-2 group relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 rounded-full blur-2xl" style={{ backgroundColor: '#b7d14f' }}></div>
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm">
                                            <Trophy className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-4xl font-bold mb-4 text-white">CTF Competitions</h3>
                                        <p className="text-xl text-purple-100 mb-6 max-w-lg">Challenge yourself with weekly capture the flag events. Compete with peers, solve complex security challenges, and climb the leaderboard.</p>
                                        <div className="flex items-center gap-8 text-white">
                                            <div>
                                                <div className="text-4xl font-bold">{stats.community}+</div>
                                                <div className="text-purple-200">Winners</div>
                                            </div>
                                            <div>
                                                <div className="text-4xl font-bold">15+</div>
                                                <div className="text-purple-200">Challenges</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: '#b7d14f' }}>
                                        <MessageSquare className="w-8 h-8 text-gray-900" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Guest Speakers</h3>
                                    <p className="text-gray-600">Learn from industry professionals and cybersecurity experts</p>
                                </div>

                                <div className="md:col-span-2 group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: '#812990' }}>
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Vibrant Community</h3>
                                    <p className="text-gray-600">Connect with like-minded individuals in cybersecurity</p>
                                </div>

                                <div className="md:col-span-3 md:row-span-2 group relative rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden" style={{ background: 'linear-gradient(135deg, #b7d14f 0%, #a0c43f 100%)' }}>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-gray-900">
                                            <BookOpen className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-4xl font-bold mb-4 text-gray-900">Hands-on Workshops</h3>
                                        <p className="text-xl text-gray-800 mb-6 max-w-md">Build practical skills through interactive learning sessions. From beginner to advanced topics.</p>
                                        <div className="flex items-center gap-8 text-gray-900">
                                            <div>
                                                <div className="text-4xl font-bold">{stats.events}+</div>
                                                <div className="text-gray-700">Events</div>
                                            </div>
                                            <div>
                                                <div className="text-4xl font-bold">100%</div>
                                                <div className="text-gray-700">Hands-on</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-3 group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl" style={{ backgroundColor: '#b7d14f' }}></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: '#812990' }}>
                                            <Award className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-white">Certifications</h3>
                                        <p className="text-gray-300 mb-6">Earn recognition for your cybersecurity achievements</p>
                                        <div className="border-l-4 pl-4 mt-4" style={{ borderColor: '#b7d14f' }}>
                                            <p className="text-gray-400 italic">"The certification program helped me land my dream job in security"</p>
                                            <p className="text-sm text-gray-500 mt-2">- Alex Chen, Graduate</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: '#b7d14f' }}>
                                        <Calendar className="w-8 h-8 text-gray-900" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Weekly Meetups</h3>
                                    <p className="text-gray-600">Join regular sessions every Thursday at 6 PM</p>
                                </div>

                                <div className="md:col-span-1 bg-purple-600 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center">
                                    <div className="text-2xl font-bold text-white">{stats.students}+</div>
                                    <div className="text-purple-200 text-xs text-center">
                                        Students
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#b7d14f' }}></div>
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#b7d14f' }}></div>
                        </div>
                        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                            <p className="text-xl text-purple-100 mb-10">Join hundreds of students mastering cybersecurity</p>
                            <button
                                onClick={() => setActiveSection('started')}
                                className="px-10 py-5 rounded-2xl font-bold text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                                style={{ backgroundColor: '#b7d14f' }}
                            >
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'team' && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">Meet Our Team</h1>
                            <p className="text-xl text-gray-600">The passionate individuals driving WiCyS forward</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((member) => (
                                <div key={member} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-purple-400 to-green-400 shadow-xl group-hover:scale-105 transition-transform duration-300"></div>
                                        <div className="absolute bottom-0 right-1/3 w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: '#b7d14f' }}></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Member {member}</h3>
                                    <p className="text-purple-600 font-semibold mb-4">Leadership Role</p>
                                    <p className="text-gray-600">Passionate about cybersecurity education and community building</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'events' && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">Events</h1>
                            <p className="text-xl text-gray-600">Join us for workshops, CTFs, and networking opportunities</p>
                        </div>

                        <div className="mb-24">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}>
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                            </div>

                            <div className="space-y-6">
                                {eventsData.events
                                    .filter(event => !isEventPast(event.endDate, event.time))
                                    .map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className="w-full text-left group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
                                        >
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}>
                                                            <Calendar className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                                                            <p className="text-gray-500">{event.startDate} - {event.endDate} • {event.time}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.tags.map((tag, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-full text-sm font-medium text-purple-700 bg-purple-100">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                                                    style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}>
                                                    Learn More
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                            </div>

                            {eventsData.events.filter(event => !isEventPast(event.endDate, event.time)).length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No upcoming events at the moment. Check back soon!</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#b7d14f' }}>
                                    <Archive className="w-6 h-6 text-gray-900" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Past Events</h2>
                            </div>

                            <div className="space-y-6">
                                {eventsData.events
                                    .filter(event => isEventPast(event.endDate, event.time))
                                    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
                                    .map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className="w-full text-left group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-300 opacity-75 hover:opacity-100"
                                        >
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#b7d14f' }}>
                                                            <Calendar className="w-6 h-6 text-gray-900" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                                                            <p className="text-gray-500">{event.date} • {event.time}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.tags.map((tag, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="px-6 py-3 rounded-xl font-semibold text-gray-600 shadow-md group-hover:shadow-lg transition-all duration-300 bg-gray-100">
                                                    View Details
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                            </div>

                            {eventsData.events.filter(event => isEventPast(event.endDate, event.time)).length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No past events yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                </div>
            )}

            {activeSection === 'ctfs' && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">Capture The Flag</h1>
                            <p className="text-xl text-gray-600">Test your skills in our competitive cybersecurity challenges</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-10 shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#b7d14f' }}></div>
                                <Trophy className="w-20 h-20 mb-6 relative z-10" />
                                <h3 className="text-3xl font-bold mb-4 relative z-10">Current Competition</h3>
                                <p className="text-purple-100 mb-6 text-lg relative z-10">Winter CTF 2025 is live! Solve challenges across multiple categories and climb the leaderboard.</p>
                                <div className="flex items-center space-x-4 mb-8 relative z-10">
                                    <div>
                                        <div className="text-3xl font-bold">47</div>
                                        <div className="text-purple-200 text-sm">Participants</div>
                                    </div>
                                    <div className="w-px h-12 bg-purple-400"></div>
                                    <div>
                                        <div className="text-3xl font-bold">15</div>
                                        <div className="text-purple-200 text-sm">Challenges</div>
                                    </div>
                                    <div className="w-px h-12 bg-purple-400"></div>
                                    <div>
                                        <div className="text-3xl font-bold">3d</div>
                                        <div className="text-purple-200 text-sm">Remaining</div>
                                    </div>
                                </div>
                                <button className="px-8 py-4 rounded-2xl font-bold text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-xl relative z-10"
                                    style={{ backgroundColor: '#b7d14f' }}>
                                    Join Competition
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                                <Award className="w-20 h-20 mb-6" style={{ color: '#b7d14f' }} />
                                <h3 className="text-3xl font-bold mb-4 text-gray-900">Leaderboard</h3>
                                <p className="text-gray-600 mb-6 text-lg">Check out our top performers and rising stars</p>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((rank) => (
                                        <div key={rank} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                                                    style={{ background: getRankStyle(rank) }}>
                                                    {rank}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">Player {rank}</div>
                                                    <div className="text-sm text-gray-500">{1000 - rank * 150} points</div>
                                                </div>
                                            </div>
                                            {rank <= 3 && <Trophy className="w-6 h-6" style={{ color: getRankColor(rank) }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'started' && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Getting Started</h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Your complete guide to learning cybersecurity. Whether you're a beginner or looking to sharpen your skills, we've curated the best resources to help you on your journey.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 mb-20">
                            <div className="flex items-start justify-center gap-4">
                                <a
                                    href="https://discord.gg/9pduz6bhE3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform duration-300 w-24 flex flex-col items-center"
                                    title="Join our Discord"
                                >
                                    <img
                                        src={discordIcon}
                                        alt="Discord"
                                        className="w-16 h-16 object-contain rounded-xl shadow-lg hover:shadow-xl"
                                    />
                                    <span className="h-6 mt-2 text-sm text-gray-800 text-center"></span>
                                </a>

                                <button
                                    onClick={() => setActiveSection("rubric")}
                                    className="hover:scale-110 transition-transform duration-300 w-24 flex flex-col items-center"
                                    title="Join as an official member"
                                >
                                    <img
                                        src={rubricIcon}
                                        alt="Join as an official member"
                                        className="w-16 h-16 object-contain rounded-xl shadow-lg hover:shadow-xl"
                                    />
                                    <span className="h-6 mt-2 text-sm text-gray-800 text-center leading-tight">
                                        Join as official member
                                    </span>
                                </button>

                                <a
                                    href="https://www.instagram.com/wicys.ualberta"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform duration-300 w-24 flex flex-col items-center"
                                    title="Follow us on Instagram"
                                >
                                    <img
                                        src={instagramIcon}
                                        alt="Instagram"
                                        className="w-16 h-16 object-contain rounded-xl shadow-lg hover:shadow-xl"
                                    />
                                    <span className="h-6 mt-2 text-sm text-gray-800 text-center"></span>
                                </a>

                                <a
                                    href="https://www.linkedin.com/company/wicys-university-of-alberta-student-chapter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform duration-300 w-24 flex flex-col items-center"
                                    title="Connect on LinkedIn"
                                >
                                    <img
                                        src={linkedinIcon}
                                        alt="LinkedIn"
                                        className="w-16 h-16 object-contain rounded-xl shadow-lg hover:shadow-xl"
                                    />
                                    <span className="h-6 mt-2 text-sm text-gray-800 text-center"></span>
                                </a>
                            </div>
                        </div>

                        <div className="space-y-16">
                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}>
                                        <span className="text-white font-bold text-lg">🖥</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Virtual Machines (VMs)</h2>
                                        <p className="text-gray-600">Isolated environments to practice penetration testing safely and legally.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Kali Linux', description: 'Pre-loaded with 600+ security tools for ethical hacking and penetration testing.', link: 'https://www.kali.org/' },
                                        { name: 'VulnHub', description: 'Download vulnerable VMs to practice real-world exploitation in a sandboxed environment.', link: 'https://www.vulnhub.com/' },
                                        { name: 'Exploit.Education', description: 'VMs designed to teach a variety of computer security issues from basics to advanced.', link: 'https://exploit.education/' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#b7d14f' }}>
                                        <span className="text-gray-900 font-bold text-lg">⚙</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Penetration Testing Tools</h2>
                                        <p className="text-gray-600">Essential utilities for network scanning, exploitation, and vulnerability assessment.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Nmap', description: 'Network scanner for discovering hosts, open ports, services, and vulnerabilities.', link: 'https://nmap.org/' },
                                        { name: 'Metasploit', description: 'Exploit framework with a vast library for developing and executing attacks.', link: 'https://www.metasploit.com/' },
                                        { name: 'Burp Suite', description: 'Web application security testing tool for finding vulnerabilities in web apps.', link: 'https://portswigger.net/burp' },
                                        { name: 'Wireshark', description: 'Network protocol analyzer for capturing and inspecting packet-level traffic.', link: 'https://www.wireshark.org/' },
                                        { name: 'Ghidra', description: 'Reverse engineering tool by the NSA for analyzing binary files and malware.', link: 'https://ghidra-sre.org/' },
                                        { name: 'Pwntools', description: 'CTF framework for writing exploits and working with binary exploitation.', link: 'https://github.com/Gallopsled/pwntools' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1976d2' }}>
                                        <span className="text-white font-bold text-lg">🚩</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">CTF Practice Platforms</h2>
                                        <p className="text-gray-600">Hands-on platforms for practicing and competing in capture-the-flag challenges.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'PicoCTF', description: 'Beginner-friendly CTF hosted by Carnegie Mellon. The largest CTF in the world.', link: 'https://picoctf.org/' },
                                        { name: 'HackTheBox', description: 'Realistic penetration testing labs with machines at various difficulty levels.', link: 'https://www.hackthebox.com/' },
                                        { name: 'TryHackMe', description: 'Structured learning paths and guided rooms for beginners to advanced players.', link: 'https://tryhackme.com/' },
                                        { name: 'CTFLearn', description: 'Large collection of beginner-friendly challenges across cryptography, web, and binary.', link: 'https://ctflearn.com/' },
                                        { name: 'OverTheWire', description: 'Classic wargames and challenges including the famous Bandit series for Linux.', link: 'https://overthewire.org/' },
                                        { name: 'RootMe', description: 'Hacking and InfoSec learning platform with challenges and virtual labs.', link: 'https://www.root-me.org/' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #b7d14f 0%, #a0c43f 100%)' }}>
                                        <span className="text-gray-900 font-bold text-lg">📚</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Cybersecurity Learning Platforms</h2>
                                        <p className="text-gray-600">Structured courses and learning environments for developing cybersecurity expertise.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Network Academy', description: 'Cisco-created courses covering various areas of information security.', link: 'https://skillsforall.cisco.com/' },
                                        { name: 'Pwn College', description: 'Comprehensive course for binary exploitation starting from basics to advanced.', link: 'https://pwn.college/' },
                                        { name: 'PortSwigger Labs', description: 'Hands-on labs for learning web vulnerabilities and security testing.', link: 'https://portswigger.net/web-security' },
                                        { name: 'CryptoHack', description: 'Interactive platform for learning cryptography through hands-on challenges.', link: 'https://cryptohack.org/' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FF6B6B' }}>
                                        <span className="text-white font-bold text-lg">📖</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Guides & References</h2>
                                        <p className="text-gray-600">Comprehensive wikis and guides for understanding CTF concepts and techniques.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'CTF101', description: 'Wiki and guidebook serving as a great introduction to CTF categories.', link: 'https://ctf101.org/' },
                                        { name: 'CTF Wiki', description: 'Another comprehensive wiki with helpful CTF information and techniques.', link: 'https://ctf-wiki.mahaloz.re/' },
                                        { name: 'CTF Field Guide', description: 'Useful guides covering basic skills needed for CTF competitions.', link: 'https://trailofbits.github.io/ctf/' },
                                        { name: 'AwesomeCTF', description: 'Long list of resources, guides, and CTFs for practice across all topics.', link: 'https://github.com/apsdehal/awesome-ctf' },
                                        { name: 'LiveOverflow', description: 'YouTube channel and website devoted to hacking, penetration testing, and CTFs.', link: 'https://liveoverflow.com/' },
                                        { name: 'CTFTime Resources', description: 'Community-maintained guides with comprehensive information on CTF topics.', link: 'https://ctftime.org/' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FF0000' }}>
                                        <span className="text-white font-bold text-lg">📺</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">YouTube Channels</h2>
                                        <p className="text-gray-600">Video tutorials and explanations for learning cybersecurity and CTF techniques.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'LiveOverflow', description: 'In-depth tutorials on hacking, exploitation, and CTF walkthroughs.', link: 'https://www.youtube.com/@LiveOverflow' },
                                        { name: 'John Hammond', description: 'Beginner-friendly guides explaining CTF concepts step-by-step clearly.', link: 'https://www.youtube.com/@_JohnHammond' },
                                        { name: 'IppSec', description: 'Detailed video tutorials and walkthroughs of HackTheBox and other platforms.', link: 'https://www.youtube.com/@IppSec' },
                                        { name: 'Network Chuck', description: 'Focus on networking and security fundamentals in information security field.', link: 'https://www.youtube.com/@NetworkChuck' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#4CAF50' }}>
                                        <span className="text-white font-bold text-lg">🏆</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">CTF Tracking & Communities</h2>
                                        <p className="text-gray-600">Follow competitions, track progress, and connect with the global CTF community.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'CTFTime', description: 'Track upcoming CTFs, create a team profile, and access an archive of past CTF writeups.', link: 'https://ctftime.org/' },
                                        { name: 'Major League Cyber', description: 'Platform for creating a profile and tracking your progress in CTF competitions.', link: 'https://majorleaguecyber.org/' },
                                        { name: 'WeChall', description: 'Another tracking site for monitoring your CTF progress and rankings.', link: 'https://www.wechall.net/' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#9C27B0' }}>
                                        <span className="text-white font-bold text-lg">🔬</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Specialized Topics</h2>
                                        <p className="text-gray-600">Deep dives into specific areas like cryptography, forensics, and reverse engineering.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Cryptopals', description: 'Hands-on cryptography challenges and exercises for learning crypto basics.', link: 'https://cryptopals.com/' },
                                        { name: 'Nightmare', description: 'In-depth guide covering binary exploitation and pwning with CTF examples.', link: 'https://github.com/guyinatuxedo/nightmare' },
                                        { name: 'CyberChef', description: 'Web app for encryption, encoding, decoding, and data analysis on the fly.', link: 'https://gchq.github.io/CyberChef/' },
                                        { name: 'Ciphey', description: 'Tool that automatically decrypts data and decodes encodings without knowing the key.', link: 'https://github.com/Ciphey/Ciphey' }
                                    ].map((resource, i) => (
                                        <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                                            <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                                            <p className="text-sm text-gray-600">{resource.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 py-16 bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-8 md:p-12 border border-purple-100">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join the Community?</h3>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Connect with fellow cybersecurity enthusiasts, participate in our CTFs, and gain recognition for your achievements.
                                </p>
                                <button
                                    onClick={() => setActiveSection('rubric')}
                                    className="px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}
                                >
                                    Become an Official Member
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'rubric' && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Join Our Community</h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                                Ready to become part of the WiCyS UAlberta community? Whether you're a current student, alumni, faculty member, or cybersecurity enthusiast, we have a membership option for you.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-12 shadow-lg border border-purple-100">
                            <div className="max-w-2xl mx-auto text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Membership Options</h2>
                                <p className="text-lg text-gray-600 mb-10">
                                    Choose the membership level that's right for you:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-purple-200">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">General Member</h3>
                                        <p className="text-gray-600 mb-6">For University of Alberta students passionate about cybersecurity</p>
                                        <Zap className="w-8 h-8 mx-auto" style={{ color: '#812990' }} />
                                    </div>

                                    <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-green-200">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Affiliate Member</h3>
                                        <p className="text-gray-600 mb-6">For alumni, faculty, and non-affiliated cybersecurity students and professionals</p>
                                        <Users className="w-8 h-8 mx-auto" style={{ color: '#b7d14f' }} />
                                    </div>
                                </div>

                                <a
                                    href="https://campus.hellorubric.com/?s=11472"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-10 py-5 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
                                    style={{ background: 'linear-gradient(135deg, #812990 0%, #9d3ba8 100%)' }}
                                >
                                    Become a Member Today
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {['sponsors'].includes(activeSection) && (
                <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
                            {navigation.find(n => n.id === activeSection)?.name}
                        </h1>
                        <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
                            <p className="text-xl text-gray-600">Content coming soon...</p>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl" style={{ background: 'linear-gradient(135deg, #812990 0%, #b7d14f 100%)' }}>
                                C
                            </div>
                            <span className="text-2xl font-bold">WiCyS UAlberta Student Chapter</span>
                        </div>
                        <p className="text-gray-400 mb-4">© 2025 Women in Cybersecurity University of Alberta Student Chapter. All rights reserved.</p>
                        <p className="text-sm font-semibold" style={{ color: '#b7d14f' }}>wicys@ualberta.ca</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClubWebsite;
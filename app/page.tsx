'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Github, Linkedin, Mail, Briefcase, MessageCircle, Sparkles, ExternalLink, 
  CheckCircle, Calendar, BookOpen, Send, Loader2, User, AtSign 
} from 'lucide-react';

export default function Home() {
  // --- States for Supabase Data ---
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  // --- States for AI Chat ---
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- States for Contact Form ---
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    // Fetch Projects
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      } catch (err: any) {
        setErrorProjects(err.message);
      } finally {
        setLoadingProjects(false);
      }
    }

    // Fetch Experiences
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase.from('experiences').select('*').order('id', { ascending: true }); // Chronological usually
        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        console.error("Error loading experiences", err);
      } finally {
        setLoadingExperiences(false);
      }
    }

    // Fetch Resources
    async function fetchResources() {
      try {
        const { data, error } = await supabase.from('resources').select('*').order('id', { ascending: false });
        if (error) throw error;
        setResources(data || []);
      } catch (err) {
        console.error("Error loading resources", err);
      } finally {
        setLoadingResources(false);
      }
    }

    fetchProjects();
    fetchExperiences();
    fetchResources();
  }, []);

  // Auto-scroll Chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // Handle Chat Send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || chatLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Empty response'}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([contactForm]);

      if (error) throw error;
      
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 4000); // Hide success msg after 4s
    } catch (err) {
      alert("Error sending message. Please check your Supabase RLS settings.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* --- Navigation Header --- */}
      <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Yanis Mahmoud</h1>
          <div className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
            <a href="#experience" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Calendar size={16} /> Experience
            </a>
            <a href="#projects" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Briefcase size={16} /> Projects
            </a>
            <a href="#resources" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <BookOpen size={16} /> Resources
            </a>
            <a href="#assistant" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <MessageCircle size={16} /> AI Assistant
            </a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100">
            Consultant in Management & Islamic Finance
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Building Strategies,<br />Driven by Values.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Welcome to my professional space. I combine modern project management methodologies with ethical finance principles to deliver sustainable value.
          </p>
          <div className="flex justify-center gap-4">
             <a href="#projects" className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm">
               View Portfolio
             </a>
             <a href="#contact" className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 hover:border-slate-300 transition-colors">
               <Mail size={16} className="text-teal-600" /> Contact Me
             </a>
          </div>
        </div>
      </section>

      {/* --- Experience Section (Timeline Style) --- */}
      <section id="experience" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Career Path</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Professional Experience</h2>
          </div>

          {loadingExperiences ? (
            <p className="text-center text-slate-400">Loading timeline...</p>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-6 space-y-12">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-10">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] top-1 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow"></div>
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="text-xl font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-sm text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded">{exp.date}</span>
                    </div>
                    <p className="text-slate-500 font-medium mb-3">{exp.company}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{exp.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Portfolio</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Selected Projects</h2>
          </div>

          {loadingProjects && <p className="text-center text-slate-500">Loading projects...</p>}
          {errorProjects && <p className="text-red-500 text-center">{errorProjects}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 relative">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div> 
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                            {project.status || 'Completed'}
                        </span>
                    </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h4>
                  <p className="text-slate-500 text-sm flex-1 mb-4">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 font-medium text-sm inline-flex items-center gap-1 group-hover:underline">
                      View Project Details <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- Resources Section --- */}
      <section id="resources" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Library</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Resources & Articles</h2>
          </div>

          {loadingResources ? (
            <p className="text-center text-slate-400">Loading resources...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((res) => (
                <a 
                  key={res.id} 
                  href={res.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-6 bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">{res.title}</h4>
                      <p className="text-sm text-slate-500">{res.description}</p>
                    </div>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-teal-500 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- AI Assistant Section --- */}
      <section id="assistant" className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Interactive</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">AI Knowledge Assistant</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
                Ask questions about my experience, skills, or Islamic finance concepts.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <h4 className="text-white font-medium">Yanis AI Assistant</h4>
            </div>

            <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="text-teal-600" size={24} />
                    </div>
                  <p className="text-slate-500 font-medium">Salam! How can I help you today?</p>
                  <p className="text-sm text-slate-400 mt-1">Try: "Tell me about Yanis's experience in finance."</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-700 rounded-bl-none border border-slate-200 shadow-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-none text-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-slate-100 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading || !input.trim()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm">
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Contact</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Get in Touch</h2>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><User size={14}/> Name</label>
                <input 
                  type="text" 
                  required 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><AtSign size={14}/> Email</label>
                <input 
                  type="email" 
                  required 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><MessageCircle size={14}/> Message</label>
              <textarea 
                required 
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none" 
                placeholder="Your message..."
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between">
              {contactSuccess && (
                <div className="flex items-center gap-2 text-teal-600 text-sm font-medium">
                  <CheckCircle size={16}/> Message sent successfully!
                </div>
              )}
              <button 
                type="submit" 
                disabled={contactLoading}
                className="ml-auto flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {contactLoading ? 'Sending...' : 'Send Message'} <Send size={16}/>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-2">Yanis Mahmoud</h4>
            <p className="text-slate-400 mb-6 text-sm">Consultant in Project Management & Islamic Finance</p>
            
            <div className="flex justify-center gap-6 mb-8">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20}/></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20}/></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Mail size={20}/></a>
            </div>

            <div className="border-t border-slate-800 pt-6 text-xs text-slate-500">
                 © {new Date().getFullYear()} Yanis Mahmoud. All rights reserved. Built with Node.js & Supabase.
            </div>
        </div>
      </footer>

    </main>
  );
}
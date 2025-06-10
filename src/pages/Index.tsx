
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, GraduationCap, Search, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'eligibility' | 'courses' | 'fees' | 'scholarships' | 'contact' | 'general';
}

// Simulated knowledge base - In real implementation, this would be vector embeddings
const knowledgeBase: Document[] = [
  {
    id: '1',
    title: 'B.Tech Eligibility Criteria',
    content: 'For B.Tech admission, candidates must have completed 12th grade with Physics, Chemistry, and Mathematics. Minimum 75% marks required in 12th grade. Valid JEE Main score is mandatory. Age limit is 25 years for general category.',
    type: 'eligibility'
  },
  {
    id: '2',
    title: 'Available Courses',
    content: 'We offer B.Tech in Computer Science, Electronics, Mechanical, Civil, Chemical Engineering. M.Tech programs available in all branches. MBA, MCA, and PhD programs also offered. Duration: B.Tech (4 years), M.Tech (2 years), MBA (2 years).',
    type: 'courses'
  },
  {
    id: '3',
    title: 'Fee Structure',
    content: 'B.Tech annual fees: ₹1,50,000. M.Tech annual fees: ₹80,000. MBA annual fees: ₹2,00,000. Hostel fees: ₹50,000 per year. Mess fees: ₹40,000 per year. One-time admission fee: ₹10,000.',
    type: 'fees'
  },
  {
    id: '4',
    title: 'Scholarship Programs',
    content: 'Merit scholarships for top 10% students. Need-based financial aid available. Sports scholarships for state/national level players. SC/ST/OBC fee concessions as per government norms. Girl student scholarships available.',
    type: 'scholarships'
  },
  {
    id: '5',
    title: 'Contact Information',
    content: 'Admission Office: +91-9876543210. Email: admissions@college.edu. Address: College Road, Education City, State - 123456. Office Hours: 9 AM to 5 PM, Monday to Saturday. Online portal: www.college.edu/admissions',
    type: 'contact'
  }
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your College Admission Assistant. I can help you with information about eligibility criteria, courses offered, fees, scholarships, and contact details. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated RAG search function
  const searchRelevantDocuments = (query: string): Document[] => {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(' ');
    
    return knowledgeBase.filter(doc => {
      const contentLower = doc.content.toLowerCase();
      const titleLower = doc.title.toLowerCase();
      
      return keywords.some(keyword => 
        contentLower.includes(keyword) || titleLower.includes(keyword)
      );
    }).slice(0, 3); // Return top 3 relevant documents
  };

  // Simulated LLM response generation
  const generateResponse = (query: string, relevantDocs: Document[]): string => {
    if (relevantDocs.length === 0) {
      return "I don't have specific information about that topic. Please ask about eligibility criteria, courses offered, fees, scholarships, or contact information.";
    }

    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('eligibility') || queryLower.includes('criteria') || queryLower.includes('requirement')) {
      const eligibilityDoc = relevantDocs.find(doc => doc.type === 'eligibility');
      return eligibilityDoc ? eligibilityDoc.content : relevantDocs[0].content;
    }
    
    if (queryLower.includes('course') || queryLower.includes('program') || queryLower.includes('branch')) {
      const courseDoc = relevantDocs.find(doc => doc.type === 'courses');
      return courseDoc ? courseDoc.content : relevantDocs[0].content;
    }
    
    if (queryLower.includes('fee') || queryLower.includes('cost') || queryLower.includes('price')) {
      const feeDoc = relevantDocs.find(doc => doc.type === 'fees');
      return feeDoc ? feeDoc.content : relevantDocs[0].content;
    }
    
    if (queryLower.includes('scholarship') || queryLower.includes('financial aid') || queryLower.includes('concession')) {
      const scholarshipDoc = relevantDocs.find(doc => doc.type === 'scholarships');
      return scholarshipDoc ? scholarshipDoc.content : relevantDocs[0].content;
    }
    
    if (queryLower.includes('contact') || queryLower.includes('phone') || queryLower.includes('email') || queryLower.includes('address')) {
      const contactDoc = relevantDocs.find(doc => doc.type === 'contact');
      return contactDoc ? contactDoc.content : relevantDocs[0].content;
    }
    
    return relevantDocs[0].content;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing time
    setTimeout(() => {
      // RAG workflow simulation
      const relevantDocs = searchRelevantDocuments(inputValue);
      const response = generateResponse(inputValue, relevantDocs);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What are the eligibility criteria for B.Tech?",
    "What courses do you offer?",
    "What are the fees for different programs?",
    "Are there any scholarships available?",
    "How can I contact the admission office?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                College Admission FAQ Chatbot
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Get instant answers powered by AI & RAG technology
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 relative z-10">
        {/* Chat Container */}
        <Card className="h-[600px] bg-white/90 backdrop-blur-lg border-0 shadow-2xl transform hover:shadow-3xl transition-all duration-500 animate-scale-in">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`relative ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white transform hover:scale-105' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white transform hover:scale-105'
                  } p-3 rounded-full shadow-lg transition-transform duration-300`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                    {message.sender === 'bot' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-md'
                      : 'bg-white/95 text-gray-800 rounded-tl-md border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <MessageCircle className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-4 animate-fade-in">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white/95 p-4 rounded-2xl rounded-tl-md shadow-lg backdrop-blur-sm border border-gray-100">
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 animate-fade-in delay-300">
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Quick questions you can ask:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-700 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about admissions, courses, fees, scholarships..."
                  className="flex-1 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in delay-100">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Search className="w-10 h-10 text-blue-600 mx-auto" />
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">RAG Technology</h3>
              <p className="text-gray-600 text-sm">Advanced search through comprehensive admission knowledge base</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in delay-200">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <FileText className="w-10 h-10 text-purple-600 mx-auto" />
                <div className="absolute inset-0 bg-purple-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Knowledge Base</h3>
              <p className="text-gray-600 text-sm">Comprehensive collection of admission information and resources</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in delay-300">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Bot className="w-10 h-10 text-green-600 mx-auto" />
                <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">Instant answers to all your questions, available 24/7</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

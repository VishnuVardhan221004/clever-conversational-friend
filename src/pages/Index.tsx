
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, GraduationCap, Search } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">College Admission FAQ Chatbot</h1>
              <p className="text-sm text-gray-600">Get instant answers about admissions, courses, and more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Chat Container */}
        <Card className="h-[600px] bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-md'
                      : 'bg-gray-100 text-gray-800 rounded-tl-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 mb-3">Quick questions you can ask:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about admissions, courses, fees, scholarships..."
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <Search className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">RAG Technology</h3>
              <p className="text-sm text-gray-600">Advanced search through admission documents</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Knowledge Base</h3>
              <p className="text-sm text-gray-600">Comprehensive admission information</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <Bot className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Instant answers to your questions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

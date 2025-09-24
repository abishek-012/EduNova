"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  transcripts?: string[]
  studentData?: {
    name: string
    class: string
    batch: string
    subjects: string[]
  }
}

export default function AIAssistant({ transcripts = [], studentData }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI study assistant. I have access to your class transcripts and can help you with questions about your coursework, assignments, and study materials. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock transcript data for demonstration
  const mockTranscripts = [
    "Data Structures Lecture 1: Introduction to Arrays and Linked Lists...",
    "Algorithms Lecture 2: Sorting algorithms - Bubble sort, Quick sort, Merge sort...",
    "Database Systems Lecture 3: SQL queries, JOIN operations, normalization...",
    ...transcripts,
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response based on transcripts and student data
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, mockTranscripts, studentData)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (query: string, transcripts: string[], studentData?: any): string => {
    const lowerQuery = query.toLowerCase()

    // Check for specific topics in transcripts
    if (lowerQuery.includes("data structure") || lowerQuery.includes("array") || lowerQuery.includes("linked list")) {
      return "Based on your Data Structures lecture transcript, arrays provide O(1) access time but O(n) insertion/deletion, while linked lists offer O(1) insertion/deletion but O(n) access time. Would you like me to explain any specific operations or help with your assignment?"
    }

    if (lowerQuery.includes("algorithm") || lowerQuery.includes("sort")) {
      return "From your Algorithms lecture, we covered several sorting algorithms: Bubble sort (O(n²)), Quick sort (average O(n log n)), and Merge sort (O(n log n)). Quick sort is generally faster in practice due to better cache performance. Which sorting algorithm would you like to discuss further?"
    }

    if (lowerQuery.includes("database") || lowerQuery.includes("sql")) {
      return "According to your Database Systems lecture transcript, SQL JOIN operations combine data from multiple tables. INNER JOIN returns matching records, LEFT JOIN returns all records from left table, and RIGHT JOIN returns all records from right table. Do you need help with a specific query?"
    }

    if (lowerQuery.includes("assignment") || lowerQuery.includes("homework")) {
      return `Based on your current assignments, you have pending work in Binary Tree Implementation and upcoming deadlines. I can help you understand the concepts from your lecture transcripts. Which assignment would you like assistance with?`
    }

    if (lowerQuery.includes("grade") || lowerQuery.includes("performance")) {
      return `Your current academic performance shows strong results with an average of 86% across subjects. Your Database Systems grade (89%) is particularly strong. Would you like study tips for improving in any specific area?`
    }

    if (lowerQuery.includes("attendance")) {
      return "I notice your Database Systems attendance is at 74%, which needs attention. Based on the lecture transcripts, you've missed some important topics on normalization. Would you like me to summarize those concepts for you?"
    }

    // General response
    return "I can help you with questions about your coursework based on your lecture transcripts. Try asking me about specific topics like data structures, algorithms, databases, or your assignments. I'm here to support your learning!"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Study Assistant
          <Badge variant="secondary" className="ml-auto">
            {mockTranscripts.length} Transcripts Available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about your coursework, assignments, or study materials..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            AI assistant with access to your lecture transcripts and academic data
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

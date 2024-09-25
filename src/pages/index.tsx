"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  content: string;
  isUser: boolean;
}

export default function Component() {
  const [isChat, setIsChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage: Message = { content: input, isUser: true };
    setMessages([...messages, newMessage]);
    setInput("");

    if (!isChat) {
      setIsChat(true);
      // Simulate v0's response
      setTimeout(() => {
        const v0Response: Message = {
          content:
            "Hello! I'm v0, your AI assistant. How can I help you today?",
          isUser: false,
        };
        setMessages((prev) => [...prev, v0Response]);
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">v0 Clone</CardTitle>
      </CardHeader>
      <CardContent>
        {!isChat ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Ask v0 anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-lg p-6"
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start ${
                    message.isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        message.isUser
                          ? "/placeholder-user.jpg"
                          : "/placeholder-v0.jpg"
                      }
                    />
                    <AvatarFallback>
                      {message.isUser ? "U" : "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
      {isChat && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}

export type Attachment = { 
  name: string; 
  data: string; 
  type: 'image' | 'text'; 
  mimeType: string; 
};

export type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  images?: { name: string; data: string; mimeType: string }[];
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  toqanConversationId?: string;
  agentId?: string; // Optional: Link chat to an agent
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  icon?: string;
  isExample?: boolean;
  isPinned?: boolean;
  owner?: string;
  files?: { name: string; url: string; size: number }[];
  updatedAt: number;
};

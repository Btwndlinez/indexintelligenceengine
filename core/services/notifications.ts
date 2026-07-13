export interface Notification {
  id: string;
  organizationId: string;
  userId?: string;
  type: 'alert' | 'opportunity' | 'reminder' | 'system' | 'campaign';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

const inMemory: Notification[] = [];

export async function send(n: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
  const notification: Notification = {
    ...n,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  inMemory.unshift(notification);
  return notification;
}

export async function list(organizationId: string, limit = 20): Promise<Notification[]> {
  return inMemory.filter(n => n.organizationId === organizationId).slice(0, limit);
}

export async function markRead(id: string): Promise<void> {
  const n = inMemory.find(x => x.id === id);
  if (n) n.read = true;
}

export async function markAllRead(organizationId: string): Promise<void> {
  for (const n of inMemory) {
    if (n.organizationId === organizationId) n.read = true;
  }
}

export async function countUnread(organizationId: string): Promise<number> {
  return inMemory.filter(n => n.organizationId === organizationId && !n.read).length;
}

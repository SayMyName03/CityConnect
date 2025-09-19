export interface IssueDTO {
  _id: string;
  title: string;
  category: 'pothole' | 'streetlight' | 'garbage' | 'water-leak' | 'other';
  description: string;
  location: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  upvotes: number;
  reportedAt?: string;
  photoUrl?: string | null;
}

export type CreateIssueInput = {
  title: string;
  category: IssueDTO['category'];
  description: string;
  location?: string;
  photoUrl?: string | null;
  locality?: string;
};

const BASE = '/api';

export async function listIssues(): Promise<IssueDTO[]> {
  const res = await fetch(`${BASE}/issues`);
  if (!res.ok) throw new Error('Failed to load issues');
  return res.json();
}

export async function createIssue(input: CreateIssueInput): Promise<IssueDTO> {
  const res = await fetch(`${BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    // try to parse JSON error message
    let body: any = null;
    try {
      body = await res.json();
    } catch (_) {
      body = await res.text();
    }
    const msg = body && body.error ? body.error : (typeof body === 'string' ? body : 'Failed to create issue');
    throw new Error(msg);
  }
  return res.json();
}

export async function updateIssueStatus(id: string, status: IssueDTO['status']): Promise<IssueDTO> {
  const res = await fetch(`${BASE}/issues/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function upvoteIssue(id: string): Promise<IssueDTO> {
  const res = await fetch(`${BASE}/issues/${id}/upvote`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to upvote');
  return res.json();
}

// New entities
export interface IssueTypeDTO {
  _id: string;
  key: string;
  label: string;
}

export interface LocalityDTO {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
}

export async function listIssueTypes(): Promise<IssueTypeDTO[]> {
  const res = await fetch(`${BASE}/issue-types`);
  if (!res.ok) throw new Error('Failed to load issue types');
  return res.json();
}

export async function listLocalities(): Promise<LocalityDTO[]> {
  const res = await fetch(`${BASE}/localities`);
  if (!res.ok) throw new Error('Failed to load localities');
  return res.json();
}

export async function listUsers(): Promise<UserDTO[]> {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

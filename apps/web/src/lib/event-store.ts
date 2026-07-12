/**
 * In-memory event store for MVP.
 * Replace with Postgres queries when database is connected.
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string | null;
  timezone: string;
  venue: string;
  address: string;
  city: string;
  neighborhood: string;
  industry_tags: string[];
  source_url: string | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  quality_score: number;
  created_by: string | null;
  reviewed_by: string | null;
  created_at: string;
}

const events: Event[] = [
  {
    id: 'evt-001',
    title: 'Toronto AI Meetup: LLMs in Production',
    description: 'Monthly meetup for engineers building with LLMs. This month: monitoring, evaluation, and cost optimization strategies.',
    start_at: '2026-07-20T18:00:00.000Z',
    end_at: '2026-07-20T21:00:00.000Z',
    timezone: 'America/Toronto',
    venue: 'MaRS Discovery District',
    address: '101 College St, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Discovery District',
    industry_tags: ['ai', 'engineering'],
    source_url: 'https://torontoai.com/meetup',
    status: 'approved',
    quality_score: 92,
    created_by: null,
    reviewed_by: 'admin-001',
    created_at: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'evt-002',
    title: 'Founder Office Hours — Fintech Edition',
    description: 'One-on-one sessions with experienced fintech founders. Get feedback on your pitch, product, and go-to-market.',
    start_at: '2026-07-22T09:00:00.000Z',
    end_at: '2026-07-22T17:00:00.000Z',
    timezone: 'America/Toronto',
    venue: 'OneEleven',
    address: '325 Front St W, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Entertainment District',
    industry_tags: ['fintech', 'founder'],
    source_url: 'https://oneeleven.com/founder-hours',
    status: 'approved',
    quality_score: 88,
    created_by: null,
    reviewed_by: 'admin-001',
    created_at: '2026-06-05T14:00:00.000Z',
  },
  {
    id: 'evt-003',
    title: 'Toronto SaaS Growth Summit',
    description: 'A full-day conference on B2B SaaS growth strategies, PLG tactics, and revenue operations.',
    start_at: '2026-07-25T08:00:00.000Z',
    end_at: '2026-07-25T18:00:00.000Z',
    timezone: 'America/Toronto',
    venue: 'Metro Toronto Convention Centre',
    address: '255 Front St W, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Entertainment District',
    industry_tags: ['saas', 'growth'],
    source_url: 'https://torontosaas.com/summit',
    status: 'approved',
    quality_score: 90,
    created_by: null,
    reviewed_by: 'admin-001',
    created_at: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 'evt-004',
    title: 'AI in Healthcare Networking Night',
    description: 'Connect with professionals at the intersection of AI and healthcare. Researchers, clinicians, and founders welcome.',
    start_at: '2026-07-28T17:30:00.000Z',
    end_at: '2026-07-28T20:00:00.000Z',
    timezone: 'America/Toronto',
    venue: 'Health Innovation Hub',
    address: '790 Bay St, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Bay Street Corridor',
    industry_tags: ['ai', 'healthcare'],
    source_url: null,
    status: 'pending',
    quality_score: 75,
    created_by: 'user-submit-1',
    reviewed_by: null,
    created_at: '2026-07-01T11:00:00.000Z',
  },
  {
    id: 'evt-005',
    title: 'Angel Investors Roundtable — Toronto',
    description: 'Private roundtable for accredited angel investors in Toronto. Discuss deal flow, portfolio strategy, and syndication.',
    start_at: '2026-08-02T12:00:00.000Z',
    end_at: '2026-08-02T14:00:00.000Z',
    timezone: 'America/Toronto',
    venue: 'Yorkville Club',
    address: '150 Bloor St W, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Yorkville',
    industry_tags: ['investing', 'founder'],
    source_url: null,
    status: 'pending',
    quality_score: 82,
    created_by: 'user-submit-2',
    reviewed_by: null,
    created_at: '2026-07-02T15:00:00.000Z',
  },
  {
    id: 'evt-006',
    title: 'Women in Tech Toronto: Leadership Panel',
    description: 'Hear from women leaders in Toronto tech about career growth, building inclusive teams, and navigating leadership.',
    start_at: '2026-08-05T18:00:00.000Z',
    end_at: '2026-08-05T20:30:00.000Z',
    timezone: 'America/Toronto',
    venue: 'Microsoft Canada',
    address: '81 Bay St, Toronto, ON',
    city: 'Toronto',
    neighborhood: 'Financial District',
    industry_tags: ['tech', 'leadership'],
    source_url: 'https://womenintechto.com/panel',
    status: 'draft',
    quality_score: 0,
    created_by: 'admin-001',
    reviewed_by: null,
    created_at: '2026-07-03T08:00:00.000Z',
  },
];

// Generate unique IDs for new events
let nextId = 7;

export function getEventsStore() {
  return {
    listApproved(): Event[] {
      return events
        .filter((e) => e.status === 'approved')
        .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    },

    listPending(): Event[] {
      return events
        .filter((e) => e.status === 'pending')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    getById(id: string): Event | undefined {
      return events.find((e) => e.id === id);
    },

    approve(id: string, reviewerId: string, decision: 'approve' | 'reject', notes?: string): Event | null {
      const event = events.find((e) => e.id === id);
      if (!event || event.status !== 'pending') return null;
      event.status = decision === 'approve' ? 'approved' : 'rejected';
      event.reviewed_by = reviewerId;
      return event;
    },

    create(data: Omit<Event, 'id' | 'created_at'>): Event {
      const id = `evt-${String(nextId++).padStart(3, '0')}`;
      const event: Event = {
        ...data,
        id,
        created_at: new Date().toISOString(),
      };
      events.push(event);
      return event;
    },
  };
}
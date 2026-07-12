import { auth } from '@clerk/nextjs/server';
import { success, unauthorized, notFound, validationError } from '@/lib/api-utils';
import { getEventsStore } from '@/lib/event-store';

/**
 * POST /v1/admin/events/:id/approve
 * Approve or reject a pending event. Writes an audit log entry.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const { id } = await params;

  let body: { decision?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return validationError([{ field: 'body', reason: 'Invalid JSON' }]);
  }

  const { decision, notes } = body;

  if (!decision || !['approve', 'reject'].includes(decision)) {
    return validationError([{ field: 'decision', reason: 'Must be "approve" or "reject"' }]);
  }

  const store = getEventsStore();
  const event = store.approve(id, session.userId, decision as 'approve' | 'reject', notes);

  if (!event) {
    return notFound('Pending event');
  }

  return success({
    event_id: event.id,
    status: event.status,
    reviewed_by: session.userId,
    reviewed_at: new Date().toISOString(),
  });
}
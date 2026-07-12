import { auth } from '@clerk/nextjs/server';
import { success, unauthorized } from '@/lib/api-utils';
import { getEventsStore } from '@/lib/event-store';

/**
 * GET /v1/admin/events/pending
 * Lists events awaiting admin approval, newest first.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const store = getEventsStore();
  const items = store.listPending();

  const startIndex = cursor ? parseInt(cursor, 10) || 0 : 0;
  const page = items.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex + limit < items.length
      ? String(startIndex + limit)
      : null;

  return success(
    {
      items: page.map((e) => ({
        event_id: e.id,
        title: e.title,
        start_at: e.start_at,
        source: e.source_url,
        quality_score: e.quality_score,
        status: e.status,
      })),
    },
    200,
    nextCursor
  );
}
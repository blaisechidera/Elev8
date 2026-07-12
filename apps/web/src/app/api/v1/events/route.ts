import { auth } from '@clerk/nextjs/server';
import { success, unauthorized } from '@/lib/api-utils';
import { getEventsStore } from '@/lib/event-store';

/**
 * GET /v1/events
 * Returns approved events, sorted by date ascending.
 * Supports optional query filters: date_from, date_to, industry, radius_km.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');
  const industry = searchParams.get('industry');
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const store = getEventsStore();
  let items = store.listApproved();

  // Apply filters
  if (dateFrom) {
    const from = new Date(dateFrom);
    items = items.filter((e) => new Date(e.start_at) >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo);
    items = items.filter((e) => new Date(e.start_at) <= to);
  }
  if (industry) {
    const ind = industry.toLowerCase();
    items = items.filter((e) =>
      e.industry_tags.some((t) => t.toLowerCase().includes(ind))
    );
  }

  // Pagination (cursor-based with index offset)
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
        venue: e.venue,
        neighborhood: e.neighborhood,
        industry_tags: e.industry_tags,
        quality_score: e.quality_score,
      })),
    },
    200,
    nextCursor
  );
}
import { auth } from '@clerk/nextjs/server';
import { success, unauthorized, notFound } from '@/lib/api-utils';
import { getEventsStore } from '@/lib/event-store';

/**
 * GET /v1/events/:id
 * Returns full event detail for a given approved event.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const { id } = await params;
  const store = getEventsStore();
  const event = store.getById(id);

  if (!event || event.status !== 'approved') {
    return notFound('Event');
  }

  return success({
    event_id: event.id,
    title: event.title,
    description: event.description,
    start_at: event.start_at,
    end_at: event.end_at,
    timezone: event.timezone,
    venue: event.venue,
    address: event.address,
    city: event.city,
    neighborhood: event.neighborhood,
    industry_tags: event.industry_tags,
    source_url: event.source_url,
    quality_score: event.quality_score,
  });
}
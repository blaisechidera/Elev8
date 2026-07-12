import { describe, it, expect } from 'vitest';

/**
 * Contract tests for Event endpoints (US-008 + US-010).
 * These validate the response envelope shape and field contracts.
 * Run against the event store directly (no server needed).
 */

import { getEventsStore } from '@/lib/event-store';
import type { Event } from '@/lib/event-store';

describe('Event Store — Data contracts', () => {
  it('should have seeded approved events', () => {
    const store = getEventsStore();
    const approved = store.listApproved();
    expect(approved.length).toBeGreaterThanOrEqual(3);
    for (const event of approved) {
      expect(event.status).toBe('approved');
      expect(event.title).toBeTruthy();
      expect(event.start_at).toBeTruthy();
      expect(event.industry_tags).toBeInstanceOf(Array);
    }
  });

  it('approved events response shape matches contract', () => {
    const store = getEventsStore();
    const items = store.listApproved().map((e: Event) => ({
      event_id: e.id,
      title: e.title,
      start_at: e.start_at,
      venue: e.venue,
      neighborhood: e.neighborhood,
      industry_tags: e.industry_tags,
      quality_score: e.quality_score,
    }));

    for (const item of items) {
      expect(item).toHaveProperty('event_id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('start_at');
      expect(item).toHaveProperty('venue');
      expect(item).toHaveProperty('neighborhood');
      expect(item).toHaveProperty('industry_tags');
      expect(item).toHaveProperty('quality_score');
      expect(typeof item.quality_score).toBe('number');
      expect(Array.isArray(item.industry_tags)).toBe(true);
    }
  });

  it('should list pending events for admin', () => {
    const store = getEventsStore();
    const pending = store.listPending();
    expect(pending.length).toBeGreaterThanOrEqual(2);
    for (const event of pending) {
      expect(event.status).toBe('pending');
    }
  });

  it('pending events response shape matches admin contract', () => {
    const store = getEventsStore();
    const items = store.listPending().map((e: Event) => ({
      event_id: e.id,
      title: e.title,
      start_at: e.start_at,
      source: e.source_url,
      quality_score: e.quality_score,
      status: e.status,
    }));

    for (const item of items) {
      expect(item).toHaveProperty('event_id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('start_at');
      expect(item).toHaveProperty('source');
      expect(item).toHaveProperty('quality_score');
      expect(item).toHaveProperty('status');
      expect(item.status).toBe('pending');
    }
  });

  it('should approve a pending event and update status', () => {
    const store = getEventsStore();
    const pending = store.listPending();
    const target = pending[0];

    const result = store.approve(target.id, 'admin-test', 'approve');
    expect(result).not.toBeNull();
    expect(result!.status).toBe('approved');
    expect(result!.reviewed_by).toBe('admin-test');
  });

  it('should reject a pending event', () => {
    const store = getEventsStore();
    const pending = store.listPending();
    const target = pending[0]; // first remaining pending

    const result = store.approve(target.id, 'admin-test', 'reject');
    expect(result).not.toBeNull();
    expect(result!.status).toBe('rejected');
  });

  it('should return null for non-existent event approval', () => {
    const store = getEventsStore();
    const result = store.approve('evt-nonexistent', 'admin-test', 'approve');
    expect(result).toBeNull();
  });

  it('should return event by ID', () => {
    const store = getEventsStore();
    const approved = store.listApproved();
    const target = approved[0];

    const event = store.getById(target.id);
    expect(event).toBeDefined();
    expect(event!.id).toBe(target.id);
    expect(event!.title).toBe(target.title);
  });

  it('should return undefined for non-existent event by ID', () => {
    const store = getEventsStore();
    const event = store.getById('evt-nonexistent');
    expect(event).toBeUndefined();
  });

  it('should create a new draft event', () => {
    const store = getEventsStore();
    const newEvent = store.create({
      title: 'Test Event',
      description: 'A test event for validation',
      start_at: '2026-08-10T18:00:00.000Z',
      end_at: null,
      timezone: 'America/Toronto',
      venue: 'Test Venue',
      address: '123 Test St',
      city: 'Toronto',
      neighborhood: 'Test Neighbourhood',
      industry_tags: ['tech', 'test'],
      source_url: null,
      status: 'draft',
      quality_score: 50,
      created_by: 'test-user',
      reviewed_by: null,
    });

    expect(newEvent).toBeDefined();
    expect(newEvent.id).toMatch(/^evt-\d{3}$/);
    expect(newEvent.status).toBe('draft');
    expect(newEvent.title).toBe('Test Event');
  });
});
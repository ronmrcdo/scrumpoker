-- Create a view that masks votes when room is not revealed.
-- Users can always see their own vote, but other players' votes
-- are hidden until the facilitator reveals.
create or replace view public.players_masked as
select
  p.id,
  p.room_id,
  p.user_id,
  p.name,
  p.role,
  case
    when r.is_revealed then p.vote
    when p.user_id = auth.uid() then p.vote
    when p.vote is not null then '***'::text
    else null
  end as vote,
  p.created_at
from public.players p
join public.rooms r on r.id = p.room_id;

grant select on public.players_masked to anon, authenticated;

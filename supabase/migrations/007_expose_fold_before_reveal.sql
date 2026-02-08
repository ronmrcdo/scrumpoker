-- Update players_masked view to expose FOLD votes before reveal.
-- Fold is a signal (not a secret estimate), so it should be visible
-- immediately to prompt the Dealer to clarify requirements.
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
    when p.vote = 'FOLD' then 'FOLD'::text
    when p.vote is not null then '***'::text
    else null
  end as vote,
  p.created_at
from public.players p
join public.rooms r on r.id = p.room_id;

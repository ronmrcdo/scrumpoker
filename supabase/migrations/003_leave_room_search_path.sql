-- Fix search_path for security definer function to prevent schema injection
create or replace function public.leave_room(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_facilitator_id uuid;
  v_next_player uuid;
begin
  select facilitator_id into v_facilitator_id
    from public.rooms where id = p_room_id;

  -- Remove the player
  delete from public.players
    where room_id = p_room_id and user_id = v_user_id;

  -- If they were facilitator, promote next player
  if v_facilitator_id = v_user_id then
    select user_id into v_next_player
      from public.players
      where room_id = p_room_id
      order by created_at
      limit 1;

    if v_next_player is not null then
      update public.rooms set facilitator_id = v_next_player where id = p_room_id;
      update public.players set role = 'FACILITATOR'
        where room_id = p_room_id and user_id = v_next_player;
    end if;
  end if;
end;
$$;

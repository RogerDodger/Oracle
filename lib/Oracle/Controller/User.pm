package Oracle::Controller::User;
use Oracle::Base 'Mojolicious::Controller';

sub login ($c) {
   state $insert = q{
      insert into users (name) values (?)
      on conflict (name) do update set visited=current_timestamp
      returning id
   };

   if (!$c->user) {
      return $c->reply->exception("No username given")
         unless length $c->paramo('username');

      $c->session->{__user_id} =
         $c->db->query($insert, $c->paramo('username'))->hash->{id};
   }

   $c->render(json => { user => $c->user });
}

sub logout ($c) {
   if ($c->user) {
      delete $c->session->{__user_id};
      delete $c->stash->{__user};
   }

   $c->render(json => { user => undef });
}

sub me ($c) {
   $c->render(json => { user => $c->user });
}

1;

package Oracle::Controller::User;
use Oracle::Base 'Mojolicious::Controller';

sub login ($c) {
   state $select = q{select * from users where name = ?};
   state $insert = q{insert into users (id, name) values (?, ?) returning id};

   srand(time);

   if (!$c->user) {
      return $c->reply->exception("No username given")
         unless length $c->paramo('username');

      $c->session->{__user_id} = (
         $c->db->query($select, $c->paramo('username'))->hash //
         $c->db->query($insert, int rand 1e14, $c->paramo('username'))->hash
      )->{id};
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

package Oracle;
use Oracle::Base 'Mojolicious';

use Oracle::Pg;

# This method will run once at server start
sub startup ($self) {
   $self->plugin('Oracle::Config');
   $self->plugin('PlainRoutes', { autoname => 1 });
   $self->sessions->default_expiration(60 * 60 * 24);

   $self->helper(pg => sub {
      state $pg = Oracle::Pg->new($self->config('db'));
   });

   $self->helper(db => sub { $self->pg->db });

   $self->helper(user => sub ($c) {
      $c->stash->{__user} //= do {
         $c->session->{__user_id} //= $c->db->query(
            'insert into users (temp) values (?) returning id', 1)->hash->{id};

         $c->db->query('select * from users where id = ?', $c->session->{__user_id})->hash;
      };
   });
}

1;

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
      if (exists $c->session->{__user_id}) {
         return $c->stash->{__user} //=
            $c->db->query(
               'select * from users where id = ?',
               $c->session->{__user_id})->hash;
      }
      return undef;
   });

   $self->helper(paramo => sub ($c, $key) {
      return $c->param($key) // '';
   });

   $self->hook(before_dispatch => sub ($c) {
      $c->stash->{format} = 'json';
   })
}

1;

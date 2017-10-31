package Oracle::Controller::List;
use Oracle::Base 'Mojolicious::Controller';

use Mojo::File;
use Mojo::JSON qw/decode_json/;

my $ROLES = decode_json(Mojo::File->new('src/roles.json')->slurp);

sub me ($c) {
   state $select = q{
      select role, hero, note from rankings
      where user_id = ?
      order by role, rank
   };

   $c->app->log->debug($c->user->{id});

   $c->db->query($select, $c->user->{id}, sub {
      my ($db, $err, $results) = @_;

      my $rows = $results->hashes;
      my @ret = map {
         my $pos = $_->{pos};
         my %ret = (
            %$_,
            heroes => $rows->grep(sub { $_->{role} == $pos; })->to_array
         );
         \%ret;
      } @$ROLES;

      $c->render(json => \@ret);
   });
}

sub set ($c) {
   state $delete = q{
      delete from rankings where user_id = ? and role = ?
   };
   state $insert = q{
      insert into rankings (user_id, role, hero, rank, note)
      values (?, ?, ?, ?, ?)
   };

   my $role = $c->paramo('role');
   die "No role\n" unless scalar grep { $role eq $_->{pos} } @$ROLES;

   my $heroes = decode_json $c->paramo('heroes');
   die "No heroes\n" unless ref $heroes eq 'ARRAY';

   $c->db->query($delete, $c->user->{id}, $role, sub {
      my ($db, $err) = @_;

      my $i = 0;
      for my $row (@$heroes) {
         $row->{rank} = ++$i;
         $db->query($insert, $c->user->{id}, $role, $row->{hero}, $i, $row->{note} // '');
      }

      $c->render(json => { heroes => $heroes });
   });
}

1;

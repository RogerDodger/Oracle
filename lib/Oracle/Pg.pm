package Oracle::Pg;

use File::Find;
use Oracle::Base -strict;
use Mojo::Pg;

my $schema = '';

find sub {
   return unless -f;
   open my $fh, '<', $_;
   $schema .= do { local $/ = <$fh> };
   close $fh;
}, 'lib/schema';

sub new ($self, $conf) {
   my $pg = Mojo::Pg->new;

   $pg->dsn("dbi:Pg:db=$conf->{name};host=$conf->{host};port=$conf->{port}")
      ->username($conf->{username})
      ->password($conf->{password});

   $pg->migrations->from_string($schema);

   $pg;
}

1;

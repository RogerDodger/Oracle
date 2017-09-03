package Mojolicious::Command::migrate;

use Oracle::Base 'Mojolicious::Command';

my $fmt = "Migrate (%d -> %d)\n";

sub run ($self, $version=undef) {
   my $mig = $self->app->pg->migrations;

   if (defined $version && $version =~ /(\d+)/) {
      $version = int $1;

      # Special case -- reload the current version
      if ($version == $mig->active) {
         printf $fmt, $mig->active, $mig->active - 1;
         $mig->migrate($mig->active - 1);
         printf $fmt, $mig->active, $mig->active + 1;
         $mig->migrate($mig->active + 1);
      }
      elsif ($version <= $mig->latest) {
         printf $fmt, $mig->active, $version;
         $mig->migrate($version);
      }
      else {
         printf "No such version -- latest is %d\n", $mig->latest;
      }
   }
   else {
      # No version specified -- just migrate to latest one
      if ($mig->active == $mig->latest) {
         say "Already at latest version";
      }
      else {
         printf $fmt, $mig->active, $mig->latest;
         $mig->migrate;
      }
   }
}

1;

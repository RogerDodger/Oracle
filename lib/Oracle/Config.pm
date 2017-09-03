package Oracle::Config;

use Oracle::Base 'Mojolicious::Plugin';
use YAML;

# Configuration variables not changeable in deployment
our %CONSTANTS = (
   cfn => 'site/config.yml',
);

# Configuration variables set by default but changeable in deployment
our %DEFAULTS = (
   db => {
      name => 'oracle',
      host => 'localhost',
      port => 5432,
      username => $ENV{USERNAME},
   },
   secrets => [ 'insecure' ],
);

sub register ($self, $app, $conf) {
   my $site = {};
   if (-e $CONSTANTS{cfn}) {
      $site = YAML::LoadFile($CONSTANTS{cfn});
      if (ref $site ne 'HASH') {
         $site = {};
      }
   }

   $app->config(%DEFAULTS, %$site, %CONSTANTS);
   $app->secrets($app->config('secrets'));
}

1;

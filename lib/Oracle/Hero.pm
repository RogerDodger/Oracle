package Oracle::Hero;
use Oracle::Base 'Exporter';
use Mojo::JSON;

our @EXPORT_OK = qw/%heroes @heroes/;

my @heroes;
my %heroes;
BEGIN {
    open my $fh, '<', 'src/heroes.json';
    @heroes = decode_json do { local $/ = <$fh> };
    close $fh;

    for my $hero {
        $heroes{$hero->{name}} = $hero;
    }
}

1;

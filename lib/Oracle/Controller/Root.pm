package Oracle::Controller::Root;
use Oracle::Base 'Mojolicious::Controller';

# This action will render a template
sub welcome ($c) {
  $c->render(json => { status => 'Okay' });
}

1;

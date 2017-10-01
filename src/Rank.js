import React, { Component } from 'react';
import heroList from './heroes.json';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import './Rank.css';

function heroImgUrl (name) {
  return `https://cdn.steamstatic.com/apps/dota2/images/heroes/${name}_full.png`;
};

class HeroAdd extends Component {
  state = { value: '' };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleClick = (e) => {
    if (e.target.localName === 'select' || e.target.localName === 'option') {
      return;
    }

    if (this.state.value !== '') {
      this.props.appendHero(this.state.value);
      this.setState({ value: '' });
    }
  };

  render() {
    let selected = {};
    this.props.heroes.forEach((e) => selected[e.id] = true);
    const unselected =
      heroList
        .filter((e) => !selected[e.id])
        .sort((a, b) => a.localized_name.localeCompare(b.localized_name));

    let style = {};
    if (this.state.value !== '') {
      style['backgroundImage'] = 'url(' + heroImgUrl(this.state.value) + ')';
    }

    return (
      <div className="Hero-add">
        <div className="Hero-add-container" style={style} onClick={this.handleClick}>
          <select className="Hero-add-field"
                  value={this.state.value} 
                  onChange={this.handleChange}>
            <option value=""/>
            { unselected.map((e, i) => (
              <option value={e.name} key={e.id}>{e.localized_name}</option>
            )) }
          </select>
          <div className="Hero-add-plus">+</div>
        </div>
      </div>
    )
  }
}

const Hero = SortableElement((props) => {
  const h = props.hero;
  const s = { backgroundImage : 'url(' + heroImgUrl(h.name) + ')' };

  return (
    <div className="Hero" style={s} title={h.localized_name}>
      <textarea className="Hero-note">{h.note}</textarea>
    </div>
  );
});

const HeroList = SortableContainer((props) => {
  return (
    <div className="Hero-list">
      { props.heroes.map((e, i) => (
        <Hero hero={e} index={i} key={e.id} />
      )) }
      <HeroAdd heroes={props.heroes} appendHero={props.appendHero} />
    </div>
  )
});

class HeroSortContainer extends Component {
  state = { heroes : heroList.slice(0, 10) };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      heroes: arrayMove(this.state.heroes, oldIndex, newIndex),
    });
  };

  appendHero = (name) => {
    this.setState({
      heroes: this.state.heroes.concat(heroList.find((e) => e.name === name))
    });
  };

  render() {
    return (
      <div className="Hero-list-list">
        <HeroList
          heroes={this.state.heroes}
          onSortEnd={this.onSortEnd}
          appendHero={this.appendHero}
          lockAxis='y'/>
      </div>
    )
  }
}

export { HeroSortContainer };

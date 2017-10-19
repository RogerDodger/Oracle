import React, { Component } from 'react';
import heroList from './heroes.json';
import roleList from './roles.json';
import { toast } from './Toast.js';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './Rank.css';

function heroImgUrl (code) {
   return `https://cdn.steamstatic.com/apps/dota2/images/heroes/${code}_full.png`;
};

class HeroAdd extends Component {
   state = { value: '' };

   handleChange = (e) => {
      this.setState({ value: e ? e.value : '' });
   };

   handleClick = (e) => {
      if (e.target.className === 'Hero-add-plus' || e.target.className === 'Hero-add-container') {
         if (this.state.value !== '') {
            this.props.appendHero(this.state.value);
            this.setState({ value: '' });
         }
      }
   };

   render() {
      let selected = {};
      this.props.heroes.forEach((e) => selected[e.id] = true);
      let options = heroList
            .filter((e) => !selected[e.id])
            .sort((a, b) => a.localized_name.localeCompare(b.localized_name))
            .map((e) => { return { value: e.codename, label: e.localized_name }; });

      let style = {};
      if (this.state.value !== '') {
         style['backgroundImage'] = 'url(' + heroImgUrl(this.state.value) + ')';
      }

      return (
         <div className="Hero-add">
            <div className="Hero-add-container" style={style} onClick={this.handleClick}>
               <Select
                  className="Hero-add-field"
                  value={this.state.value}
                  onChange={this.handleChange}
                  options={options}
               />
               <div className="Hero-add-plus">+</div>
            </div>
         </div>
      )
   }
}


class Hero extends Component {
   startDelete = () => {
      this.props.deleteHero(this.props.hero);
   }

   updateNote = (e) => {
      this.props.updateNote(this.props.hero, e.target.value);
   }

   render() {
      const h = this.props.hero;
      const s = { backgroundImage : 'url(' + heroImgUrl(h.codename) + ')' };

      return (
         <div className="Hero" style={s} title={h.localized_name}>
            <div className="Hero-controls">
               <textarea
                  className="Hero-note"
                  value={h.note}
                  onChange={this.updateNote} />
               <div className="Hero-delete" onClick={this.startDelete}>
                  &times;
               </div>
            </div>
         </div>
      );
   }
}

const SortableHero = SortableElement(Hero);

const HeroList = SortableContainer((props) => {
   return (
      <div className="Hero-list">
         { props.heroes.map((e, i) => (
            <SortableHero
               hero={e} index={i} key={e.id}
               deleteHero={props.deleteHero}
               updateNote={props.updateNote} />
         )) }
      </div>
   )
});

class Role extends Component {
   state = {
      heroes: heroList.slice(0, 10).map((e) => Object.assign({}, e))
   };

   onSortEnd = ({oldIndex, newIndex}) => {
      this.setState({
         heroes: arrayMove(this.state.heroes, oldIndex, newIndex),
      });
   };

   appendHero = (code) => {
      this.setState({
         heroes: this.state.heroes.concat(heroList.find((e) => e.codename === code))
      });
   };

   deleteHero = (hero) => {
      const oldIndex = this.state.heroes.indexOf(hero);

      this.setState({
         heroes: this.state.heroes.filter((e) => e !== hero)
      });

      toast.send(
         `${hero.localized_name} removed`,
         () => { this.undoDeleteHero(hero, oldIndex); },
      )
   };

   undoDeleteHero = (hero, index) => {
      console.log(hero, index);
      let heroes = this.state.heroes.slice();
      heroes.splice(index, 0, hero);
      this.setState({ heroes: heroes });
   };

   updateNote = (hero, note) => {
      this.setState({
         heroes: this.state.heroes.map((e) => {
            if (e === hero) {
               return Object.assign(e, { note: note });
            }
            return e;
         })
      })
   }

   render() {
      return (
         <div className="Role">
            <div className="Role-name">
               {this.props.role.name}
            </div>
            <HeroList
               heroes={this.state.heroes}
               onSortEnd={this.onSortEnd}
               deleteHero={this.deleteHero}
               updateNote={this.updateNote}
               distance={2}
               lockAxis='y'
               lockToContainerEdges={true}
               lockOffset={0}
            />
            <HeroAdd heroes={this.state.heroes} appendHero={this.appendHero} />
         </div>
      )
   }
}

class Rank extends Component {
   render() {
      return (
         <div className="Rank">
            <div className="Roles">
               { roleList.map((e, i) =>
                  <Role role={e} key={e.pos} />
               )}
            </div>
         </div>
      )
   }
}

export { Rank };

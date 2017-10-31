import React, { Component } from 'react';
import heroList from './heroes.json';
import roleList from './roles.json';
import { toast } from './Toast.js';
import { fetchapi } from './helpers.js';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './Rank.css';

function heroImgUrl (name) {
   return `/images/${name}.png`;
};

class HeroAdd extends Component {
   state = { value: '' };

   handleChange = (e) => {
      this.setState({ value: e ? e.value : '' });
   };

   handleClick = (e) => {
      if (e.target.classList.contains('Hero-add-plus') || e.target.className === 'Hero-add-container') {
         e.preventDefault();
         if (this.state.value !== '') {
            this.props.appendHero(this.state.value);
            this.setState({ value: '' });
         }
      }
   };

   render() {
      let selected = {};
      this.props.heroes.forEach((e) => selected[e.hero] = true);
      let options = heroList
            .filter((e) => !selected[e.name])
            .sort((a, b) => a.localized_name.localeCompare(b.localized_name))
            .map((e) => { return { value: e.name, label: e.localized_name }; });

      let style = {};
      if (this.state.value !== '') {
         style['backgroundImage'] = 'url(' + heroImgUrl(this.state.value) + ')';
      }

      return (
         <div className="Hero-add">
            <form className="Hero-add-container" style={style} onClick={this.handleClick}>
               <Select
                  className="Hero-add-field"
                  value={this.state.value}
                  onChange={this.handleChange}
                  options={options}
               />
               <button type="submit" className="Hero-add-plus Button-reset">+</button>
            </form>
         </div>
      )
   }
}


class Hero extends Component {
   deleteHero = () => {
      this.props.deleteHero(this.props.el);
   }

   updateNote = (e) => {
      this.props.updateNote(this.props.el, e.target.value);
   }

   render() {
      const el = this.props.el;
      const s = { backgroundImage : 'url(' + heroImgUrl(el.hero) + ')' };

      return (
         <div className="Hero" title={el.hero}>
            <div className="Hero-fallback">
               <div className="Hero-name">{el.hero}</div>
            </div>
            <div className="Hero-image" style={s}>
               <div className="Hero-controls">
                  <textarea
                     className="Hero-note"
                     value={el.note}
                     onChange={this.updateNote} />
                  <div className="Hero-delete" onClick={this.deleteHero}>
                     &times;
                  </div>
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
               el={e} index={i} key={e.hero}
               deleteHero={props.deleteHero}
               updateNote={props.updateNote} />
         )) }
      </div>
   )
});

class Role extends Component {
   state = {
      heroes: []
   };

   syncHeroes = () => {
      let form = new FormData();
      form.set('role', this.props.role.pos);
      form.set('heroes', JSON.stringify(this.state.heroes));
      fetchapi('/list/set', {
         method: 'post',
         body: form,
      });
   };

   setHeroes = (heroes) => {
      this.setState({ heroes: heroes });

      clearTimeout(this._timeout);
      this._timeout = setTimeout(this.syncHeroes, 1000);
   };

   onSortEnd = ({oldIndex, newIndex}) => {
      this.setHeroes(
         arrayMove(this.state.heroes, oldIndex, newIndex),
      );
   };

   appendHero = (name) => {
      this.setHeroes(
         this.state.heroes.concat({ hero: name, note: '' })
      );
   };

   deleteHero = (el) => {
      const oldIndex = this.state.heroes.indexOf(el);

      this.setHeroes(
         this.state.heroes.filter((e) => e !== el)
      );

      toast.send(
         `${el.hero} removed`,
         () => { this.undoDeleteHero(el, oldIndex); },
      )
   };

   undoDeleteHero = (hero, index) => {
      console.log(hero, index);
      let heroes = this.state.heroes.slice();
      heroes.splice(index, 0, hero);
      this.setHeroes(heroes);
   };

   updateNote = (hero, note) => {
      this.setHeroes(
         this.state.heroes.map((e) => {
            if (e === hero) {
               return Object.assign(e, { note: note });
            }
            return e;
         })
      )
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
   roles = [];

   componentDidMount = async () => {
      let res = await fetchapi("/list/me");
      let json = await res.json();
      console.log(json);
      if (Array.isArray(json)) {
         json.filter((e) => e.pos in this.roles).forEach((e) => {
            this.roles[e.pos].setState({ heroes: e.heroes });
         });
      }
   };

   render() {
      return (
         <div className="Rank">
            <div className="Roles">
               { roleList.map((e, i) =>
                  <Role role={e} key={e.pos} ref={(o) => this.roles[e.pos] = o } />
               )}
            </div>
         </div>
      )
   }
}

export { Rank };

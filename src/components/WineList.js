import React, { PropTypes } from 'react';
import { Loader } from '.';
import * as WinesService from '../services/Wines';

export const WineList = React.createClass({
  onSelectWine(e, wineId) {
    e.preventDefault();
    this.props.onSelectWine(wineId);
  },
  render() {
    if (this.props.region === null) {
      return null;
    }
    return (
      <div className="col s12 m6 l4 offset-m3 offset-l4">
        <h2 className="center-align">Wines</h2>
        <div className="collection">
          {this.props.wines.map(wine =>
            <a key={wine.id}
              href="#!"
              onClick={e => this.onSelectWine(e, wine.id)}
              className={['collection-item', wine.id === this.props.wine.id ? 'active' : ''].join(' ')}>
                {wine.name}
            </a>
          )}
        </div>
      </div>
    );
  }
});

export const WineListPage = React.createClass({
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState() {
    return {
      loading: false,
      wines: []
    };
  },
  componentDidMount() {
    const region = this.props.params.regionId;
    this.setState({ loading: true }, () => {
      WinesService.fetchWinesFrom(region).then(wines => {
        this.setState({
          loading: false,
          wines
        });
      });
    });
  },
  onSelectWine(id) {
    const root = window.location.hostname === 'react-bootcamp.github.io'
      ? '/react-wines-102/'
      : '/';
    const region = this.props.params.regionId;
    this.context.router.push({
      pathname: `${root}regions/${region}/wines/${id}`
    });
  },
  render() {
    if (this.state.loading) {
      return <div className="center-align"><Loader /></div>
    }
    return (
      <WineList
        onSelectWine={this.onSelectWine}
        wines={this.state.wines}
        wine={{}} />
    );
  }
});

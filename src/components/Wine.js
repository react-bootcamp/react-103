import React, { PropTypes } from 'react';
import { Loader } from '.';
import * as WinesService from '../services/Wines';
import { LikeButton, CommentButton, CommentList, CommentModal } from '.';

export const Wine = React.createClass({
  render() {
    if (this.props.wine === null) {
      return null;
    }
    return (
      <div className="col s12 m12 l6 offset-l3">
        <h2 className="center-align">Wine details</h2>
        <div className="card horizontal">
          <div className="card-image">
            <img className="responsive-img wine-detail-image" alt="Wine bottle pic" src={`${this.props.host}/api/wines/${this.props.wine.id}/image`} />
          </div>
          <div className="card-stacked">
            <div className="card-content">
              <h3>{this.props.wine.name}</h3>
              <br/>
              <p><b>Appellation:</b> {this.props.wine.appellation.name}</p>
              <p><b>Region:</b> {this.props.wine.appellation.region}</p>
              <p><b>Color:</b> {this.props.wine.type}</p>
              <p><b>Grapes:</b> {this.props.wine.grapes.join(', ')}</p>
              <CommentList wine={this.props.wine} />
            </div>
            <div className="card-action">
              <LikeButton wine={this.props.wine} />
              <CommentButton openCommentModal={this.props.openCommentModal} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const WinePage = React.createClass({
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState() {
    return {
      loading: false,
      selectedWine: null,
      commentModalOpen: false,
    };
  },
  componentDidMount() {
    const id = this.props.params.wineId;
    this.setState({ loading: true }, () => {
      WinesService.fetchWine(id).then(wine => {
        this.setState({
          loading: false,
          selectedWine: wine
        });
      });
    });
  },
  closeCommentModal() {
    this.setState({ commentModalOpen: false });
  },
  openCommentModal() {
    this.setState({ commentModalOpen: true });
  },
  render() {
    if (this.state.loading) {
      return <div className="center-align"><Loader /></div>
    }
    return (
      <div>
        <Wine
          host={WinesService.host}
          wine={this.state.selectedWine}
          openCommentModal={this.openCommentModal} />
        <CommentModal
          wine={this.state.selectedWine}
          isOpen={this.state.commentModalOpen} 
          closeCommentModal={this.closeCommentModal} />
      </div>
    );
  }
});

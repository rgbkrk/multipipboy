import React from 'react';

export default function withStore(playerModel) {
  return Child => class StoreContainer extends React.Component {
    static displayName = 'PlayerStore'
    constructor(props) {
      super(props);

      this.playerModel = playerModel;

      this.state = {
        players: null,
        playerGrid: null,
      };
    }

    componentWillMount() {
      this.sub = this.playerModel.subscribe(next => {
        this.setState({
          players: next.players,
          playerGrid: next.playerGrid,
        });
      }, err => {
        throw err;
      });
    }

    componentWillUnmount() {
      this.sub.dispose();
    }

    render() {
      if (this.state.players === null) {
        return null;
      }

      const props = {};
      props.players = this.state.players;
      props.playerGrid = this.state.playerGrid;
      return <Child {...Object.assign({}, this.props, props)}/>;
    }
  };
}

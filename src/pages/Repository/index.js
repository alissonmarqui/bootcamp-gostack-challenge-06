import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import { LoadingContainer, Loading } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repository: {},
    loading: true,
  };

  componentDidMount() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    this.setState({ repository });
  }

  hideLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    const { repository, loading } = this.state;

    return (
      <>
        <WebView
          source={{ uri: repository.html_url }}
          style={{ flex: 1 }}
          onLoad={this.hideLoading}
        />
        {loading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
      </>
    );
  }
}

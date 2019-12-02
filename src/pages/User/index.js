import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Autor,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    user: {},
    stars: [],
    loading: true,
    page: 1,
    scrollLoading: false,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ user, stars: response.data, loading: false });
  }

  refreshList = async () => {
    this.setState({ refreshing: true });

    const { user } = this.state;

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, refreshing: false });
  };

  loadMore = async () => {
    const { user, stars, page, scrollLoading } = this.state;

    if (scrollLoading) return;

    this.setState({ scrollLoading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: page + 1,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
      scrollLoading: false,
    });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  renderFooter = () => {
    const { scrollLoading } = this.state;

    if (!scrollLoading) return null;

    return <Loading />;
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => this.handleNavigate(item)}
              >
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Autor>{item.owner.login}</Autor>
                  </Info>
                </Starred>
              </TouchableWithoutFeedback>
            )}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </Container>
    );
  }
}

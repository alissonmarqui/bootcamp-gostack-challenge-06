import styled from 'styled-components/native';

export const Container = styled.View``;

export const LoadingContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

export const Loading = styled.ActivityIndicator.attrs({
  size: 'large',
  color: '#7159c1',
})``;

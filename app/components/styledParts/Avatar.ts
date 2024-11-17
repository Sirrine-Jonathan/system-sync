import styled from "@emotion/styled";

export const Avatar = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  & img {
    width: 50px;
    aspect-ratio: 1;
    border: 3px solid white;
    border-radius: 100px;
  }
`;

const AvatarDiv = Avatar.withComponent("div");

export const DesktopAvatar = styled(AvatarDiv)`
  cursor: default;
`;

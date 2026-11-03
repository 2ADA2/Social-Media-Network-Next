import styled from 'styled-components';
import { Button } from "@/shared/ui/button";
import { Avatar } from "@/shared/ui/avatar";

export const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  border-width: 2px 0;
  font-family: var(--font-family-secondary);
  padding: 12px;
  width: 100%;
  color: var(--color-primary);
  margin-top: 16px;

  @media (min-width: 768px) {
    width: 700px;
    margin: 16px auto 0 auto;
    border-width: 2px;
    height: 88px;
  }
`;

export const Text = styled.span`
  font-size: 14px;
  font-weight: 400;
  flex-grow: 1;
`;

export const StyledButton = styled(Button)`
  width: 140px;
  height: 36px;

  @media (min-width: 768px) {
    height: 44px;
    width: 188px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  @media (min-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

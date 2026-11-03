import styled from 'styled-components';
import { TextArea } from '@/shared/ui/text-area';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .input-label input {
    max-width: 100%;
  }
`;

export const StyledTitle = styled.span`
  margin-bottom: 16px;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

export const StyledTextArea = styled(TextArea)<{ $filled: boolean }>`
  width: 100%;
  margin-bottom: ${({ $filled }) => ($filled ? '16px' : 0)};
`;

export const StyledInput = styled(Input)`
  max-width: 100%;
`;

export const StyledButton = styled(Button)`
  align-self: flex-end;
  margin-top: 12px;
  font-family: var(--font-family-secondary);
`;

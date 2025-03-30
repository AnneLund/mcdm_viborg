import { useState } from "react";
import styled from "styled-components";
import { baseUrl } from "../../../apiUrl";

const InviteLink = ({ guest }) => {
  const [copied, setCopied] = useState(false);

  if (!guest?.token) return null;

  const inviteLink = `${baseUrl}/invitation/${guest.token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopiering fejlede:", err);
    }
  };

  return (
    <LinkWrapper>
      <strong>Invitation:</strong>
      <LinkBox>{inviteLink}</LinkBox>
      <CopyButton onClick={handleCopy}>Kopiér link</CopyButton>
      {copied && <CopiedText>Kopieret ✅</CopiedText>}
    </LinkWrapper>
  );
};

export default InviteLink;

const LinkWrapper = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const LinkBox = styled.p`
  font-family: monospace;
  font-size: 0.95rem;
  word-break: break-word;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CopyButton = styled.button`
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #45a047;
  }
`;

const CopiedText = styled.span`
  margin-left: 1rem;
  color: green;
  font-weight: bold;
`;

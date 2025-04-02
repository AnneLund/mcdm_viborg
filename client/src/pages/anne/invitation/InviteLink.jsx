import { useState } from "react";
import styled from "styled-components";
import { apiUrl, baseUrl } from "../../../apiUrl";

const InviteLink = ({ guest }) => {
  const [copied, setCopied] = useState(false);

  if (!guest?.token) return null;

  // Brug den nye route til Messenger-venligt link med preview
  const inviteLink = `${baseUrl}/invitation/guest/${guest.token}`;

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
    <LinkBox>
      <CopyButton onClick={handleCopy}>Kopiér invitations-link</CopyButton>
      {copied && <CopiedText>Kopieret ✅</CopiedText>}
    </LinkBox>
  );
};

export default InviteLink;

const LinkBox = styled.h3`
  font-family: monospace;
  font-size: 0.95rem;
  word-break: break-word;
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
  margin: 10px 0;

  &:hover {
    background-color: #45a047;
  }
`;

const CopiedText = styled.span`
  margin-left: 1rem;
  color: green;
  font-weight: bold;
`;

import styled from "styled-components";

export const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 16px;
`;

export const DateText = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: bold;
`;

export const CommentText = styled.p`
  font-size: 16px;
  color: #222;
  margin-top: 12px;
  padding: 10px;
  background: #f1f1f1;
  border-radius: 8px;
  font-style: normal;

  span {
    display: block;
    font-style: italic;
    border-bottom: 2px solid #2535456e;
    margin: 10px;
    text-align: left;
  }
`;

export const ProjectTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 2px solid #25354584;
  padding-bottom: 4px;
`;

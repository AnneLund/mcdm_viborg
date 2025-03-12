import styled from "styled-components";

export const Article = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 20px auto;
  padding: 20px 0;
  position: relative;

  .studentImg {
    width: 50px;
    margin: 10px;
  }
`;

export const Section = styled.div`
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;

  header {
    text-align: center;
  }

  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  .studentImg {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    border: 3px solid #ddd;
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }

  strong {
    color: #222;
  }

  h3 {
    font-size: 25px;
    margin-top: 20px;
    text-align: center;
  }
  h4 {
    font-size: 18px;
    margin: 20px;
    text-align: left;
    width: 100%;
    border-bottom: 2px solid #ddd;
  }

  svg {
    cursor: pointer;
  }

  button {
    margin-left: 20px;
  }

  @media (max-width: 600px) {
    max-width: 90%;
    padding: 15px;

    h1 {
      font-size: 20px;
    }

    p {
      font-size: 14px;
    }

    .studentImg {
      width: 60px;
      height: 60px;
    }
  }
`;

export const Container = styled.section`
  width: 100%;
  margin: auto;
  padding: 20px 40px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  svg {
    cursor: pointer;
  }
`;

export const ColumnContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background: #4ca2af16;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 20px;
    font-size: 20px;
    color: #333;
  }

  h4 {
    font-size: 20px;
    color: #555;
    margin-bottom: 15px;
  }

  ul {
    text-align: left;
    padding: 0;

    li {
      list-style-type: none;
      padding: 8px 0;
      font-size: 16px;
      border-bottom: 1px solid #eee;
    }
  }
`;

export const FeedbackContainer = styled.div`
  width: 100%;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .visibility {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px auto;

    span {
      display: block;
    }
  }
`;

export const BackofficeContainer = styled.article`
  width: 100%;
  margin: auto;
  padding: 20px 0;

  h2 {
    text-align: center;
  }
`;

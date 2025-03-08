import styled from "styled-components";

export const Article = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  .studentImg {
    width: 50px;
    margin: 10px;
  }
`;

export const Section = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  h4 {
    font-size: 18px;
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

  img {
    width: 50px;
  }
`;

export const Container = styled.section`
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  h4 {
    font-size: 18px;
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
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  border-left: 5px solid #253545ee;
  max-width: 600px;
`;

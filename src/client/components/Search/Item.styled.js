import styled from 'styled-components'

export const $Wrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1004;
  align-items: center;
  /* border: 1px solid black; */
  /* border-radius: 5px; */
  background-color: #fff;
  color: var(--secondary-font-color);
  width: 100%;

  .searchLink {
    text-decoration: solid;
    color: var(--font-color);
    display: flex;
    cursor: pointer;
    padding: 0.4em 1em;
    width: 100%;
    border-top: 1px solid #eee;

    &:hover {
      background-color: #eee;
    }
  }

  .pic {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .title {
    font-size: 16px;
  }
`

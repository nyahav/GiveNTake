import styled from 'styled-components'

export const $Wrapper = styled.div`
  width: fit-content;
  input {
    width: 20em;
    border: 2px #ccc solid;
  }
  .searchWrap {
    position: relative;
    cursor: pointer;
  }
  .overlay {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    height: calc(100% - 80px);
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
    display: none;

    &.visible {
      display: block;
    }
  }
`

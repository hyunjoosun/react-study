import { useState } from "react";
// import TodoList from '../index';

export function useTodoList() {
  //인풋창에 투두리스트 입력 + 추가 버튼 누르면 텍스트 노출
  const [inputValue,setInputValue] = useState('');
  const [inputBtn,setInputBtn] = useState('');

  const handleChange = (e:any) => {
    setInputValue(e.target.value);
  };

  const handleBtn = () => {
    setInputBtn(inputValue);
    setInputValue('');
  };

  //할 일 목록에 추가
  // const [toList,setToList] = useState('');

  //전체선택
  // const [selectAll,setSelectAll] = useState('');

  //완료/미완료, 전체보기 필터링
  // const [filter,setFilter] = useState('all');

  //선택 삭제
  //전체 삭제

  return {
    inputValue,
    inputBtn,
    handleChange,
    handleBtn
  };
}

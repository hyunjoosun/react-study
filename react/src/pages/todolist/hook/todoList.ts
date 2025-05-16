import { useState } from "react";

type todoItem = {
  text : string;
  done : boolean;
  delete : boolean;
}

export function useTodoList() {
  //인풋창에 투두리스트 입력 + 추가 버튼 누르면 텍스트 노출
  const [inputValue,setInputValue] = useState('');
  const [todoList,setTodoList] = useState<todoItem[]>([]);  

  const handleChange = (e:any) => {
    setInputValue(e.target.value);
  };

  const handleBtn = () => {
    if (inputValue === '') {
      return;
    };

    const newItem: todoItem = {
      text : inputValue,
      done : false,
      delete : false,
    }
    
    setTodoList([...todoList, newItem]);
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

  //아이템박스 수정, 완료, 삭제
  const handleComplete = (index:number) => {
    const newList = [...todoList];
    newList[index].done = !newList[index].done;
    setTodoList(newList);
  };

  const handleDelete = (index:number) => {
    const newList = todoList.filter(( _,i ) => i !== index);
    setTodoList(newList);
  };

  return {
    inputValue,
    handleChange,
    handleBtn,
    todoList,
    handleComplete,
    handleDelete,
  };
}

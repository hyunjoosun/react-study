import { useState } from "react";

export function useTodoList() {
  //인풋창에 투두리스트 입력 + 추가 버튼 누르면 텍스트 노출
  const [inputValue,setInputValue] = useState('');
  const [todoList,setTodoList] = useState<{ text: string; done: boolean; checked: boolean }[]>([]);
  const [filter, setFilter] = useState<'all' | 'done' | 'undone'>('all');

  const handleChange = (e:any) => {
    setInputValue(e.target.value);
  };

  const handleBtn = () => {
    if (inputValue === '') return;
    const newList = [...todoList, { text: inputValue, done: false, checked: false }];
    setTodoList(newList);
    setInputValue('');
  };
  
  const handleChecked = (index: number, checked: boolean) => {
    const newList = [...todoList];
    newList[index].checked = checked;
    setTodoList(newList);
  };

  //전체선택
  const handleSelectAll = (isChecked: boolean) => {
    const newList = todoList.map(item => ({
      ...item,
      checked: isChecked
    }));
    setTodoList(newList);
  };

  //완료/미완료, 전체보기 필터링
  const handleFilter = (type : 'all' | 'done' | 'undone') => {
    setFilter(type);
  };

  //선택 삭제
  const handleSelectDelete = () => {
    const newList = todoList.filter(item => !item.checked);
    setTodoList(newList);
  };

  //전체 삭제
  const handleAllDelete = () => {
    setTodoList([]);
  };

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

  const handleModify = (index : number, newText: string) => {
    const newList = [...todoList];
    newList[index].text = newText;
    setTodoList(newList);
  };


  return {
    inputValue,
    handleChange,
    handleBtn,
    todoList,
    handleComplete,
    handleDelete,
    handleModify,
    handleSelectAll,
    handleFilter,
    handleSelectDelete,
    handleAllDelete,
    filter,
    setFilter,
    handleChecked
  };
}

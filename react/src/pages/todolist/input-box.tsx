import "./todolist.scss";

type InputProps = {
  inputValue : string;
  handleChange : (e:any) => void;
  handleBtn : () => void;
}

function InputForm({inputValue, handleChange, handleBtn} : InputProps) {
  return (
    <div className="form_box">
      <input type="text" className="input" placeholder="내용을 작성해주세요." value={inputValue} onChange={handleChange} />
      <button className="add_btn" onClick={handleBtn}>추가</button>
    </div>
  );
}

export default InputForm;

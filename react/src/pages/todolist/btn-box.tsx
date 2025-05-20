import "./todolist.scss";

function BtnBox({
  handleSelectAll,
  handleFilter,
  handleSelectDelete,
  handleAllDelete,
}: any) {
  return (
    <div className="top_box">
      <div className="check_box">
        <input
          type="checkbox"
          className="check"
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </div>
      <div className="btn_box">
        <button className="btn" onClick={() => handleFilter("done")}>
          완료보기
        </button>
        <button className="btn" onClick={() => handleFilter("undone")}>
          미완료보기
        </button>
        <button className="btn" onClick={() => handleFilter("all")}>
          전체보기
        </button>
        <button className="btn" onClick={handleSelectDelete}>
          선택삭제
        </button>
        <button className="btn" onClick={handleAllDelete}>
          전체삭제
        </button>
      </div>
    </div>
  );
}

export default BtnBox;

"use client";

import { useBoardWrite } from "../../hook/boardWrite";
import BoardForm from "../components/board-form";

export default function WritePage() {
  const { control, handleSubmit, onSubmit, errors, loading } = useBoardWrite();

  return (
    <BoardForm
      control={control}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      mode="write"
    />
  );
}
